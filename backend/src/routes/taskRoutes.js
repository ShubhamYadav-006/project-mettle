const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getTaskHistory,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes are protected
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.get('/history', getTaskHistory);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.post('/:id/complete', completeTask);

module.exports = router;
