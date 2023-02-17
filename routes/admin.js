const express = require("express")
const router = require('express').Router();
const Question = require('../models/Question');
const routeProtect = require('../middleware/index');

// @desc    Shows questions pending approval. Sorted by latest submission.
// @route   GET /admin
// @access  User with admin role
router.get('/', routeProtect.isAdminLoggedIn, async (req, res, next) => {
  try {
    const questions = await Question.find({_approved: false});
    questions.sort((a, b) => a.updatedAt - b.updatedAt);
    res.render('admin/admin', {layout: 'admin/admin-layout', data: questions});
  } catch (error) {
    next (error)
  }
});

// @desc    Modifies approval state of question
// @route   POST /admin/:questionId
// @access  User with admin role only
router.post('/:questionId', routeProtect.isAdminLoggedIn, async (req, res, next) => {
  const questionId = req.params.questionId;
  const { approval } = req.body;
  if (approval === 'true') {
    try {
        const approvalUpdate = await Question.findByIdAndUpdate(questionId, {_approved: true});
        res.redirect('/admin');
      } catch (error) {
        next(error)
      }
  }
  else {
    try {
        const approvalUpdate = await Question.findByIdAndDelete(questionId);
        res.redirect('/admin');
      } catch (error) {
        next(error)
      }
  }
});

module.exports = router;