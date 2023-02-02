const express = require("express")
const router = require('express').Router();
const User = require ("../models/User");

// @desc    App home page
// @route   GET /
// @access  Public
router.get('/', (req, res, next) => {
  res.render('index');
});


module.exports = router;
