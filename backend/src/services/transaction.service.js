const Transaction = require('../models/Transaction');
const contractService = require('./contract.service');

/**
 * Helper to safely serialize BigInt arguments for MongoDB storage
 */
function serializeArgs(args) {
  if (!args) return [];
  return JSON.parse(
    JSON.stringify(args, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
  );
}

/**
 * Transaction Service
 * Executes and tracks state-changing smart contract calls with persistence and retry policies.
 */
class TransactionService {
  /**
   * Executes a contract write function with retries and MongoDB persistence.
   *
   * @param {Object} params
   * @param {import('ethers').Contract} params.contract Ethers contract instance connected to Relayer
   * @param {string} params.contractName Contract identifier (e.g. 'TrustChainRegistry', 'TrustPoints')
   * @param {string} params.functionName Method name on contract
   * @param {Array} params.args Arguments to pass to contract function
   * @param {{ entityType: string, entityId: string }} params.relatedEntity Linked MongoDB document
   * @param {number} [params.maxAttempts=3] Max retry attempts
   * @returns {Promise<{ txHash: string, receipt: any, transactionDoc: any }>}
   */
  async executeTransaction({
    contract,
    contractName,
    functionName,
    args = [],
    relatedEntity,
    maxAttempts = 3,
  }) {
    if (!contract) {
      throw new Error(`Contract instance not provided for ${contractName}.${functionName}`);
    }
    if (!relatedEntity || !relatedEntity.entityType || !relatedEntity.entityId) {
      throw new Error('relatedEntity with entityType and entityId is required for transaction tracking');
    }

    const contractAddress = await contract.getAddress();
    const cleanArgs = serializeArgs(args);

    // 1. Create Pending Transaction Document
    let txDoc = null;
    try {
      txDoc = await Transaction.create({
        contractName,
        contractAddress,
        functionName,
        args: cleanArgs,
        relatedEntity,
        status: 'pending',
        attempts: 1,
        maxAttempts,
      });
    } catch (dbErr) {
      console.warn(`[TransactionService Warning] Could not persist pending transaction to MongoDB: ${dbErr.message}`);
    }

    let attempt = 0;
    let lastError = null;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        console.log(`[TransactionService] Executing ${contractName}.${functionName} (Attempt ${attempt}/${maxAttempts})...`);

        // 2. Broadcast transaction via Relayer
        const tx = await contract[functionName](...args);
        const txHash = tx.hash;
        console.log(`[TransactionService] Tx broadcasted: ${txHash}. Waiting for confirmation...`);

        // Update txHash in DB
        if (txDoc) {
          txDoc.txHash = txHash;
          txDoc.attempts = attempt;
          await txDoc.save().catch(() => {});
        }

        // 3. Await receipt
        const receipt = await tx.wait();
        console.log(`[TransactionService] Tx confirmed in block ${receipt.blockNumber} (Gas used: ${receipt.gasUsed.toString()})`);

        // Update status to confirmed
        if (txDoc) {
          txDoc.status = 'confirmed';
          txDoc.blockNumber = receipt.blockNumber;
          txDoc.gasUsed = receipt.gasUsed.toString();
          txDoc.error = null;
          await txDoc.save().catch(() => {});
        }

        return {
          txHash,
          receipt,
          transactionDoc: txDoc,
        };
      } catch (err) {
        lastError = err;
        console.warn(`[TransactionService Warning] Attempt ${attempt} failed: ${err.message}`);

        if (txDoc) {
          txDoc.attempts = attempt;
          txDoc.error = err.message;
          await txDoc.save().catch(() => {});
        }

        // If retries remaining, wait with backoff
        if (attempt < maxAttempts) {
          const delayMs = attempt * 1000;
          console.log(`[TransactionService] Retrying in ${delayMs}ms...`);
          await new Promise(res => setTimeout(res, delayMs));
        }
      }
    }

    // 4. If all retries exhausted, mark as failed
    if (txDoc) {
      txDoc.status = 'failed';
      txDoc.error = lastError ? lastError.message : 'Unknown execution failure';
      await txDoc.save().catch(() => {});
    }

    const executionError = new Error(
      `Transaction ${contractName}.${functionName} failed after ${maxAttempts} attempts: ${lastError ? lastError.message : 'Unknown error'}`
    );
    executionError.code = 'TRANSACTION_EXECUTION_FAILED';
    executionError.txDoc = txDoc;
    throw executionError;
  }

  /**
   * Scans and retries all failed transactions that have not exceeded maxAttempts.
   * @returns {Promise<{ retried: number, succeeded: number, failed: number, details: Array }>}
   */
  async retryFailedTransactions() {
    let failedList = [];
    try {
      failedList = await Transaction.find({ status: 'failed', attempts: { $lt: 5 } });
    } catch (err) {
      console.warn(`[TransactionService] Cannot fetch failed transactions: ${err.message}`);
      return { retried: 0, succeeded: 0, failed: 0, details: [] };
    }

    const results = {
      retried: failedList.length,
      succeeded: 0,
      failed: 0,
      details: [],
    };

    console.log(`[TransactionService] Found ${failedList.length} failed transactions to retry.`);

    for (const doc of failedList) {
      const contract = contractService.getContract(doc.contractName);
      if (!contract) {
        console.warn(`[TransactionService] Cannot retry: contract ${doc.contractName} not found.`);
        results.failed++;
        results.details.push({ id: doc._id, status: 'failed', error: 'Contract not loaded' });
        continue;
      }

      try {
        doc.status = 'pending';
        doc.attempts += 1;
        await doc.save().catch(() => {});

        console.log(`[TransactionService] Re-trying transaction ${doc._id} (${doc.contractName}.${doc.functionName})...`);
        const tx = await contract[doc.functionName](...doc.args);
        const receipt = await tx.wait();

        doc.txHash = tx.hash;
        doc.status = 'confirmed';
        doc.blockNumber = receipt.blockNumber;
        doc.gasUsed = receipt.gasUsed.toString();
        doc.error = null;
        await doc.save().catch(() => {});

        results.succeeded++;
        results.details.push({ id: doc._id, status: 'confirmed', txHash: tx.hash });
      } catch (err) {
        doc.status = 'failed';
        doc.error = err.message;
        await doc.save().catch(() => {});

        results.failed++;
        results.details.push({ id: doc._id, status: 'failed', error: err.message });
      }
    }

    return results;
  }

  /**
   * Retry a specific failed transaction by its MongoDB ID
   * @param {string} id Transaction document ID
   * @returns {Promise<{ success: boolean, txHash: string, transactionDoc: any }>}
   */
  async retryTransactionById(id) {
    const doc = await Transaction.findById(id);
    if (!doc) {
      throw new Error(`Transaction with ID "${id}" was not found.`);
    }

    const contract = contractService.getContract(doc.contractName);
    if (!contract) {
      throw new Error(`Contract "${doc.contractName}" is not available or initialized.`);
    }

    doc.status = 'pending';
    doc.attempts += 1;
    await doc.save();

    try {
      console.log(`[TransactionService] Manually retrying transaction ${doc._id} (${doc.contractName}.${doc.functionName})...`);
      const tx = await contract[doc.functionName](...doc.args);
      const receipt = await tx.wait();

      doc.txHash = tx.hash;
      doc.status = 'confirmed';
      doc.blockNumber = receipt.blockNumber;
      doc.gasUsed = receipt.gasUsed.toString();
      doc.error = null;
      await doc.save();

      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        transactionDoc: doc,
      };
    } catch (err) {
      doc.status = 'failed';
      doc.error = err.message;
      await doc.save();
      throw err;
    }
  }
}

module.exports = new TransactionService();
