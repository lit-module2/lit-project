const express = require("express")
const router = require('express').Router();
const app = express();

// @desc    App home page
// @route   GET /
// @access  Anyone, public
router.get('/', (req, res, next) => {
  res.render('landing')
});

module.exports = router;


// OAuth2 Google login

// app.get ("/", req, res => {
//   res.send('<a href="/auth/google">Authenticate with Google</a>')
// });

// app.get("/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] } )
// )
