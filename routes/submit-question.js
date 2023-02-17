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
    let effect;
    let safe;
    let errors = [];
    if (effectCheck === 'on') {
        effect = true;
    }
    else {
        effect = false;
    }
    if (safeCheck === 'on') {
        safe = true;
    }
    else {
        effect = false
    }
    const regexEmoji = /\p{Extended_Pictographic}/ug;
    if (!regexEmoji.test(emoji)) {
        errors.push('Only emojis are accepted in the emoji field');
    }
    const currentUser = req.session.currentUser._id;
    try {
        const repeatedQuestion = await Question.findOne({question: question});
        if (repeatedQuestion) {
            errors.push('That question already exists!');
        }
        if (errors.length === 0) {
            const newQuestion = await Question.create({ emoji: emoji, question: question, category: category, effect: effect, safe: safe, _author: currentUser});
            res.render('submit-question', { success: true });
        }
        else {
            res.render('submit-question', { error: errors });
            return;
        }
      } catch (error) {
        next (error)
      }
})

module.exports = router;