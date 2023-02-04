const express = require("express")
const router = require('express').Router();
const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Shows question submit view and form
// @route   GET /submit-question
// @access  User with user role only
router.get('/', async (req, res, next) => {
    res.render('submit-question');
})

// @desc    Creates question in DB
// @route   POST /submit-question
// @access  User with user role only
router.post('/', async (req, res, next) => {
    try {
        const { question, category, effect, safe, author } = req.body;
        console.log(req.body);
        const currentUser = req.session.currentUser._id;
        const uniqueQuestion = await Question.findOne({question: question});
        console.log(uniqueQuestion);
        if (!uniqueQuestion) {
            const newQuestion = await Question.create({ question: question, category: category, effect: effect, safe: safe, _author: currentUser});
            console.log(newQuestion);
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

