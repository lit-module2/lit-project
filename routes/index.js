const express = require("express")
const router = require('express').Router();

// @desc    App home page
// @route   GET /
// @access  Anyone, public
router.get('/', (req, res, next) => {
  res.render('landing/landing', {layout: 'landing/landing-layout'});
});

module.exports = router;
