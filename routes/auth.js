const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const routeProtect = require('../middleware/index');
// const dotenv = require("dotenv");
// var passport = require('passport');
// var GoogleStrategy = require('passport-google-oauth20');
// const googleClientId = process.env.GOOGLE_CLIENT_ID;
// dotenv.config();

// // OAuth2 de google 

// const clientID = "199671931095-t936piuj8a0sjr03mfuut2bm1umm4om9.apps.googleusercontent.com";
// const clientSecret = "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";


// const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

// passport.use(new GoogleStrategy({
//     clientID:     GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/profile",
//     passReqToCallback : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null,user)
// });

// passport.deserializeUser(function(user, done) {
//   done(null,user)
// })



// @desc    Displays login view
// @route   GET /auth/login
// @access  Public
router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

// @desc    Logs user into the app
// @route   POST /auth/login
// @access  Public
router.post("/login", async function (req, res, next) {
  const {username, password} = req.body;
  if(!username ||!password) {
    res.render("auth/login", {error: "Todos los campos son requeridos"});
    return;
  }
  try {
    // Usamos el username para encontrar los usuarios.
    const userInDB = await User.findOne({username: username});
    if(!userInDB) {
      res.render ("auth/login", {error:`${username} doesn't exist!`})
      return  
    } else {
      const passwordMatch = await bcrypt.compare(password, userInDB.hashedPassword)
      if(passwordMatch) {
        req.session.currentUser = userInDB;
        res.redirect('/question')
      } else {
        res.render("auth/login", {error: "Imposible verificar al usuario"})
      }

    }
  } catch (error) {
    next (error)
  }

})


// @desc    Displays the register page and form
// @route   GET /auth/signup
// @access  Public
router.get ("/register", (req, res, next) => {
  res.render("auth/register")
})

// @desc    Creates a new user in DB
// @route   POST /auth/register
// @access  Public
router.post ("/register", async (req, res, next) => {
  const { username, email, password, repeatedPassword } = req.body;
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(!regexEmail.test(email)) {
    res.render('auth/register', { error: `Please enter a valid email!` });
  }
  const regexPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regexPassword.test(password)) {
    res.render('auth/register', { error: 'Password needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.' });
    return;
  }
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedFirstPassword = await bcrypt.hash(password, salt);
  const hashedSecondPassword = await bcrypt.hash(repeatedPassword, salt);
  if (hashedFirstPassword!=hashedSecondPassword) {
    res.render('auth/register', { error: `Passwords don't match!` });
  }
  try {
    const userInDB = await User.findOne({ username: username });
    if (userInDB) {
      res.render('auth/login', { error: `There already is a user with email ${email}` });
      return;
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ username, email, hashedPassword });
      res.render('profile/profile', user);
    }
  } catch (error) {
    next(error)
  }
});

module.exports = router;