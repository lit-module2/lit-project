const express = require("express")
const router = require('express').Router();
const Question = require('../models/Question')
const User = require('../models/User');
const UserAnswer = require('../models/UserAnswer');

// @desc    Shows main leaderboard view
// @route   GET /leaderboard
// @access  User with user role only
router.get('/', async (req, res, next) => {
    res.render('leaderboard');
})

// @desc    Shows leaderboard for a given category
// @route   GET /leaderboard/:category
// @access  User with user role only
router.get('/:category', async (req, res, next) => {
    const category = req.params;
    const questionsByCategory = await Question.find({category: category});
    const actions = await UserAnswer.find({question: { $in: questionsByCategory}});
    const users = await User.find({});
    users.forEach((user) => {
        const userActions = actions.filter(action => action.userAnswered)
    })
})

