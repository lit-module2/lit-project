const express = require("express")
const router = require('express').Router();
const Question = require('../models/Question')
const User = require('../models/User');
const UserAnswer = require('../models/UserAnswer');
const routeProtect = require('../middleware/index');

// @desc    Shows main leaderboard view
// @route   GET /leaderboard
// @access  User with user role only
router.get('/', routeProtect.isUserLoggedIn, async (req, res, next) => {
    res.render('leaderboard');
})

// @desc    Shows leaderboard for a given category
// @route   GET /leaderboard/:category
// @access  User with user role only
router.get('/category', routeProtect.isUserLoggedIn, async (req, res, next) => {
    // we query all user answers and then filter out the answers to questions that belong to the queried category
    const { category } = req.query;
    console.log(category);
    try {
        const actions = await UserAnswer.find({}).populate('questionId');
        const actionsByCategory = actions.filter(action => ((action.questionId.category === category)));
        const users = await User.find({role: "user"});
        // this part calculates the score for every user in a given category
        let scores = [];
        for (let user of users) {
            let userScore = 0;
            for (let action of actionsByCategory) {
                //convert to string because comparison between objectId's is absolute trash
                if (String(action.userAnswered) === String(user._id)) {
                    if (action.questionId.effect) {
                        userScore += 127;
                    }
                    else {
                        userScore -= 127;
                    }
                }
            }
        scores.push({user: user.username, score: userScore});
        }
        scores = scores.sort((a, b) => b.score - a.score);
        console.log(scores)
        res.render('leaderboard', {data: scores});
    }
    catch (error) {
        console.log(error);
        res.render('leaderboard');
    }
})

module.exports = router;