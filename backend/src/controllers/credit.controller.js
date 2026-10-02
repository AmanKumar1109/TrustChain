const creditService = require('../services/credit.service');
const { successResponse } = require('../utils/response');

const getBalance = async (req, res, next) => {
  try {
    const balance = await creditService.getBalance(req.user._id);
    return successResponse(res, {
      manufacturerId: req.user._id,
      manufacturerName: req.user.name,
      creditBalanceINR: balance,
      currency: 'INR',
      rate: '1 Credit = 1 INR',
    });
  } catch (err) {
    next(err);
  }
};

const topupCredits = async (req, res, next) => {
  try {
    const { amountINR, referenceId } = req.body;
    const result = await creditService.topupCredits(req.user._id, amountINR, referenceId);

    return successResponse(
      res,
      {
        creditedINR: amountINR,
        newBalanceINR: result.balance,
        transaction: result.transaction,
        message: `Successfully topped up ₹${amountINR} credits.`,
      },
      200
    );
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await creditService.getHistory(req.user._id);
    return successResponse(res, {
      count: history.length,
      transactions: history,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBalance,
  topupCredits,
  getHistory,
};
