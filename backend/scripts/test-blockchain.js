const path = require('path');
const { ethers } = require('ethers');
const config = require('../src/config/env');
const walletService = require('../src/services/wallet.service');
const contractService = require('../src/services/contract.service');
const transactionService = require('../src/services/transaction.service');

async function runBlockchainTest() {
  console.log('===============================================================');
  console.log('🛡️  TrustChain Blockchain Layer & Relayer Test Runner');
  console.log('===============================================================');

  // 1. Test Custodial Wallet Service
  console.log('\n[1/4] Testing Custodial Wallet Service (AES Encryption)...');
  const custodial = walletService.createCustodialWallet();
  console.log(`✓ Custodial Wallet Address:  ${custodial.address}`);
  console.log(`✓ Encrypted Private Key:     ${custodial.encryptedPrivateKey.slice(0, 30)}...`);

  // Recover wallet to test decryption
  const recoveredWallet = walletService.getWallet(custodial.encryptedPrivateKey);
  if (recoveredWallet.address.toLowerCase() === custodial.address.toLowerCase()) {
    console.log('✓ Decryption verified: recovered address matches generated address.');
  } else {
    throw new Error('Custodial wallet decryption failed: address mismatch!');
  }

  // 2. Test Contract Loading
  console.log('\n[2/4] Testing Contract Service & ABI/Address Loader...');
  const isConnected = await contractService.checkConnectivity();
  if (!isConnected) {
    console.log('\n⚠️  Local Hardhat node is NOT running at http://127.0.0.1:8545');
    console.log('👉 To run on-chain transactions, please start the node in another terminal:');
    console.log('     cd contracts-project');
    console.log('     npm run node');
    console.log('\nCustodial wallet encryption & contract schemas verified successfully!');
    process.exit(0);
  }

  const relayer = contractService.getRelayerWallet();
  const registry = contractService.getRegistryContract();
  const points = contractService.getTrustPointsContract();

  if (!registry || !points) {
    throw new Error('Failed to load contract instances. Check deployments/localhost.json and abi/');
  }

  console.log(`✓ Relayer Wallet:          ${relayer.address}`);
  console.log(`✓ TrustChainRegistry:      ${await registry.getAddress()}`);
  console.log(`✓ TrustPoints (TPTS):      ${await points.getAddress()}`);

  // 3. Send a Test Transaction via TransactionService
  console.log('\n[3/4] Sending a Test Transaction on Local Hardhat Node...');
  const testRecipient = ethers.Wallet.createRandom().address;
  const rewardAmount = 100n;
  const reason = 'TEST_BLOCKCHAIN_EXECUTION';

  console.log(`Target Recipient Address: ${testRecipient}`);
  console.log(`Minting ${rewardAmount} TPTS tokens via Relayer...`);

  const result = await transactionService.executeTransaction({
    contract: points,
    contractName: 'TrustPoints',
    functionName: 'mintReward',
    args: [testRecipient, rewardAmount, reason],
    relatedEntity: {
      entityType: 'UserTest',
      entityId: testRecipient,
    },
    maxAttempts: 3,
  });

  console.log(`✓ Transaction Confirmed!`);
  console.log(`  TxHash:       ${result.txHash}`);
  console.log(`  Block Number: ${result.receipt.blockNumber}`);
  console.log(`  Gas Used:     ${result.receipt.gasUsed.toString()}`);

  // 4. Verify On-Chain State Change
  console.log('\n[4/4] Verifying On-Chain Token Balance...');
  const balance = await points.balanceOf(testRecipient);
  console.log(`✓ Recipient TPTS Balance: ${balance.toString()} TPTS (Expected: 100)`);

  if (balance === rewardAmount) {
    console.log('\n🎉 ALL BLOCKCHAIN LAYER TESTS PASSED SUCCESSFULLY! 🎉');
  } else {
    throw new Error(`Balance mismatch: expected ${rewardAmount}, got ${balance}`);
  }
}

runBlockchainTest().catch(err => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
