const express = require("express")
const router = require('express').Router();
const Question = require('../models/Question');
const User = require('../models/User');
const UserAnswer = require('../models/UserAnswer');


// @desc    Shows random questions
// @route   GET /
// @access  User with user role only
router.get('/', async (req, res, next) => {
  try {
    const questions = await Question.find({});
    const randomQuestion = questions[Math.floor(Math.random() * questions.length )];
    const users = await User.find({});
    const randomUsers = [];
    for (let i = 0; i<4; i++) {
        const randomNumber = Math.floor(Math.random() * users.length);
        randomUsers.push(users.splice(randomNumber));
    }
    const user1 = randomUsers[0];
    res.render('question', { randomQuestion, user1 });
  } catch (error) {
    next (error)
  }
});

// @desc    App home page, user answers question
// @route   Post /questionId
// @access  User with user role only
router.post('/:questionId', async function (req, res, next) {
  try {
    const userAsked = req.session.currentUser;
    const { questionId } = req.params;
    const { userAnswered,  usersIgnored} = req.body;
    await UserAnswer.create({ questionId, userAsked, userAnswered, usersIgnored });
  } catch (error) {
    next(error)
  }
});


module.exports = router;