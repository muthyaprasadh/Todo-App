const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { isAdmin } = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
    try {
        res.json({ user: req.user.toJSON() });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email')
], validate, async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if email is already taken by another user
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already taken' });
            }
        }

        // Update user fields
        if (name) req.user.name = name;
        if (email) req.user.email = email;

        await req.user.save();

        res.json({
            message: 'Profile updated successfully',
            user: req.user.toJSON()
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/users/profile
// @desc    Delete current user account
// @access  Private
router.delete('/profile', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/users/:id
// @desc    Admin delete user by ID (and their tasks)
// @access  Admin
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Admins cannot delete themselves.' });
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        await Task.deleteMany({ userId });
        res.json({ message: 'User and their tasks deleted successfully.' });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({ message: 'Server error deleting user.' });
    }
});

// @route   GET /api/users/statistics
// @desc    Get user statistics (admin only)
// @access  Admin
router.get('/statistics', isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const users = await User.find({}, '_id name email role');

        // Get task counts per user
        const tasksPerUser = await Task.aggregate([
            { $group: { _id: '$userId', taskCount: { $sum: 1 } } }
        ]);
        const taskCountMap = {};
        tasksPerUser.forEach(t => { taskCountMap[t._id.toString()] = t.taskCount; });

        const userStats = users.map(u => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            taskCount: taskCountMap[u._id.toString()] || 0
        }));

        res.json({
            totalUsers,
            totalAdmins,
            userStats
        });
    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ message: 'Server error fetching statistics' });
    }
});

module.exports = router; 