const express = require("express")
const router = require('express').Router();
const Question = require('../models/Question');
const User = require('../models/User');
const routeProtect = require('../middleware/index');

// @desc    Shows question submit view and form
// @route   GET /submit-question
// @access  User with user role only
router.get('/', routeProtect.isUserLoggedIn, async (req, res, next) => {
    res.render('submit-question');
})

// @desc    Creates question in DB
// @route   POST /submit-question
// @access  User with user role only
router.post('/', routeProtect.isUserLoggedIn, async (req, res, next) => {
    const { emoji, question, category, effect, safe } = req.body;
    const currentUser = req.session.currentUser._id;
    try {
        const uniqueQuestion = await Question.findOne({question: question});
        if (!uniqueQuestion) {
            const newQuestion = await Question.create({ emoji: emoji, question: question, category: category, effect: effect, safe: safe, _author: currentUser});
            console.log(newQuestion);
            res.redirect('submit-question');
        }
        else {
            res.render('submit-question', { error: `That question already exists!` });
            return;
        }
      } catch (error) {
        next (error)
      }
})

module.exports = router;