const express = require('express');
const router = express.Router();
const {
  getCatalog,
  getInventory,
  buyReward,
  equipReward,
  getTransactions,
} = require('../controllers/rewardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCatalog);
router.get('/inventory', getInventory);
router.get('/transactions', getTransactions);
router.post('/buy', buyReward);
router.post('/equip', equipReward);

module.exports = router;
