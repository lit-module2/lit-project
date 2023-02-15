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
    const { emoji, question, category, effectCheck, safeCheck } = req.body;
    let effect = true;
    let safe = true;
    if (effectCheck === 'on') {
        effect = false;
    }
    if (safeCheck === 'on') {
        effect = false;
    }
    const currentUser = req.session.currentUser._id;
    try {
        const uniqueQuestion = await Question.findOne({question: question});
        if (!uniqueQuestion) {
            const newQuestion = await Question.create({ emoji: emoji, question: question, category: category, effect: effect, safe: safe, _author: currentUser});
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