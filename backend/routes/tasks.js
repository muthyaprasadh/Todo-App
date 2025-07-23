const express = require('express');
const { body, query } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/tasks
// @desc    Get all tasks for current user
// @access  Private
router.get('/', [
    query('status').optional().isIn(['pending', 'completed']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('search').optional().isString()
], validate, async (req, res) => {
    try {
        const { status, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // Build filter object
        const filter = { userId: req.user._id };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const tasks = await Task.find(filter)
            .sort(sort)
            .populate('userId', 'name email');

        res.json({ tasks });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
    body('title')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Task title must be between 1 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high')
], validate, async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;

        const task = new Task({
            userId: req.user._id,
            title,
            description: description || '',
            dueDate: dueDate || null,
            priority: priority || 'medium'
        });

        await task.save();
        await task.populate('userId', 'name email');

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('userId', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ task });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Task title must be between 1 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('status')
        .optional()
        .isIn(['pending', 'completed'])
        .withMessage('Status must be pending or completed')
], validate, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                task[key] = req.body[key];
            }
        });

        await task.save();
        await task.populate('userId', 'name email');

        res.json({
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task status
// @access  Private
router.patch('/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = task.status === 'completed' ? 'pending' : 'completed';
        await task.save();
        await task.populate('userId', 'name email');

        res.json({
            message: 'Task status updated successfully',
            task
        });
    } catch (error) {
        console.error('Toggle task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 