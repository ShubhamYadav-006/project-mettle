const rewardService = require('../services/rewardService');

const getCatalog = async (req, res, next) => {
  try {
    const catalog = await rewardService.getRewardsCatalog(req.user.id);
    res.status(200).json({ success: true, count: catalog.length, data: catalog });
  } catch (error) {
    next(error);
  }
};

const getInventory = async (req, res, next) => {
  try {
    const inventory = await rewardService.getUserInventory(req.user.id);
    res.status(200).json({ success: true, count: inventory.length, data: inventory });
  } catch (error) {
    next(error);
  }
};

const buyReward = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Item ID is required.' });
    }

    const result = await rewardService.purchaseReward(req.user.id, itemId);
    res.status(200).json({ success: true, message: result.message, data: result });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const equipReward = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Item ID is required.' });
    }

    const result = await rewardService.equipItem(req.user.id, itemId);
    res.status(200).json({ success: true, message: result.message, data: result });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await rewardService.getTransactionHistory(req.user.id);
    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCatalog,
  getInventory,
  buyReward,
  equipReward,
  getTransactions,
};
