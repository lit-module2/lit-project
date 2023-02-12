const express = require("express")
const router = require('express').Router();
const Question = require('../models/Question');
const User = require('../models/User');
const UserAnswer = require('../models/UserAnswer');
const routeProtect = require('../middleware/index');

// @desc    Shows random questions
// @route   GET /question
// @access  User with user role only
router.get('/', routeProtect.isUserLoggedIn, async (req, res, next) => {
  try {
    const questions = await Question.find({});
    const randomQuestion = questions[Math.floor(Math.random() * questions.length )];

    const users = await User.find({});
    const shuffle = users.sort(() => 0.5 - Math.random()) //shuffles list in random order

    const randomUsers = shuffle.slice(0,4);
    res.render('question', { randomQuestion, randomUsers });
  } catch (error) {
    next (error)
  }
});

// @desc    Registers user answers in the DB
// @route   POST /question/:questionId
// @access  User with user role only
router.post('/:questionId', routeProtect.isUserLoggedIn, async (req, res, next) => {
  const userAsked = req.session.currentUser._id;
  const questionId = req.params.questionId;
  const { possibleAnswers, userAnswered } = req.body;
  try {
    await UserAnswer.create({ questionId, userAsked, userAnswered, possibleAnswers });
    res.redirect('/question');
  } catch (error) {
    next(error)
  }
});

module.exports = router;