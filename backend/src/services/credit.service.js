const User = require('../models/User');
const CreditTransaction = require('../models/CreditTransaction');
const config = require('../config/env');

class CreditService {
  /**
   * Get the current INR credit balance of a manufacturer
   */
  async getBalance(manufacturerId) {
    const user = await User.findById(manufacturerId);
    if (!user) {
      throw new Error('Manufacturer account not found.');
    }
    return user.creditBalance || 0;
  }

  /**
   * Top up INR credits for a manufacturer (Never crypto!)
   * 1 INR = 1 Credit
   */
  async topupCredits(manufacturerId, amountINR, referenceId = null) {
    if (!amountINR || amountINR <= 0) {
      throw new Error('Top-up amount must be greater than 0 INR.');
    }

    const user = await User.findById(manufacturerId);
    if (!user) {
      throw new Error('Manufacturer account not found.');
    }

    const creditsToAdd = Number(amountINR);
    user.creditBalance = (user.creditBalance || 0) + creditsToAdd;
    await user.save();

    const transaction = await CreditTransaction.create({
      manufacturer: manufacturerId,
      type: 'TOPUP',
      amountINR: Number(amountINR),
      credits: creditsToAdd,
      balanceAfter: user.creditBalance,
      description: `Prepaid INR credit top-up of ₹${amountINR}`,
      referenceId: referenceId || `PAY-${Date.now()}`,
    });

    console.log(`[INR Credits] Manufacturer ${user.name} topped up ₹${amountINR}. New Balance: ₹${user.creditBalance}`);

    return {
      balance: user.creditBalance,
      transaction,
    };
  }

  /**
   * Determine rate per unit based on protection level (HighValue costs more)
   */
  getRate(protectionLevel = 'Standard') {
    if (protectionLevel === 'HighValue' || protectionLevel === 1) {
      return config.inrCostHighValue || 2;
    }
    return config.inrCostStandard || config.inrCostPerUnit || 1;
  }

  /**
   * Deduct INR credits for registering product units
   * HighValue costs more than Standard.
   */
  async deductCreditsForBatch(arg1, arg2, arg3, arg4) {
    let manufacturerId, quantity, batchId, protectionLevel;

    if (typeof arg1 === 'object' && arg1 !== null) {
      ({ manufacturerId, quantity, batchId, protectionLevel = 'Standard' } = arg1);
    } else {
      manufacturerId = arg1;
      quantity = arg2;
      batchId = arg3;
      protectionLevel = arg4 || 'Standard';
    }

    const levelStr = protectionLevel === 1 || protectionLevel === 'HighValue' ? 'HighValue' : 'Standard';
    const costPerUnit = this.getRate(levelStr);
    const totalCostINR = quantity * costPerUnit;

    const user = await User.findById(manufacturerId);
    if (!user) {
      throw new Error('Manufacturer account not found.');
    }

    if ((user.creditBalance || 0) < totalCostINR) {
      const needed = totalCostINR - (user.creditBalance || 0);
      const error = new Error(
        `Insufficient INR credits. Required: ₹${totalCostINR} (${quantity} units @ ₹${costPerUnit}/unit for ${levelStr} protection), Available: ₹${user.creditBalance || 0}. Please top up ₹${needed} to proceed.`
      );
      error.code = 'INSUFFICIENT_CREDITS';
      error.statusCode = 402;
      throw error;
    }

    user.creditBalance -= totalCostINR;
    await user.save();

    const transaction = await CreditTransaction.create({
      manufacturer: manufacturerId,
      type: 'DEDUCTION',
      amountINR: totalCostINR,
      credits: totalCostINR,
      balanceAfter: user.creditBalance,
      description: `Batch registration cost for ${quantity} units [${levelStr}] (Batch: ${batchId}) @ ₹${costPerUnit}/unit`,
      referenceId: batchId,
    });

    console.log(
      `[INR Credits] Deducted ₹${totalCostINR} from manufacturer ${user.name} (${quantity} @ ₹${costPerUnit} [${levelStr}]). Remaining: ₹${user.creditBalance}`
    );

    return {
      costINR: totalCostINR,
      costPerUnit,
      remainingBalance: user.creditBalance,
      transaction,
    };
  }

  /**
   * Fetch credit transaction history for a manufacturer
   */
  async getHistory(manufacturerId, limit = 50) {
    return CreditTransaction.find({ manufacturer: manufacturerId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = new CreditService();
