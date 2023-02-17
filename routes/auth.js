const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const routeProtect = require('../middleware/index');

// @desc    Displays login view
// @route   GET /auth/
// @access  Non-users only
router.get('/', routeProtect.isNotLoggedIn, (req, res, next) => {
  res.render('auth/index');
})

// @desc    Displays login view
// @route   GET /auth/login
// @access  Non-users only
router.get('/login', routeProtect.isNotLoggedIn, (req, res, next) => {
  res.render('auth/login');
})

// @desc    Logs user into the app
// @route   POST /auth/login
// @access  Non-users only
router.post("/login", routeProtect.isNotLoggedIn, async function (req, res, next) {
  const {username, password} = req.body;
  errors = []
  if(!username ||!password) {
    errors.push("Please enter a username and a password!");
  }
  try {
    // Usamos el username para encontrar los usuarios.
    const userInDB = await User.findOne({username: username});
    if(!userInDB) {
      errors.push("That username doesn't exist!");
    } else {
      if(userInDB.deletedAccount) {
        errors.push("This account has been deleted!");
      }
      const passwordMatch = await bcrypt.compare(password, userInDB.hashedPassword)
      if(!passwordMatch) {
          errors.push('Incorrect username or password!');
      }
    }  
    if (errors.length === 0) {
      req.session.currentUser = userInDB;
      if (req.session.currentUser.role === 'user') {
        res.redirect('/question');
      }
      else {
        res.redirect('/admin');
      }
    } else {
      res.render("auth/login", {error: errors});
    }
  } catch (error) {
    next (error)
  }

})

// @desc    Displays the register page and form
// @route   GET /auth/signup
// @access  Non-users only
router.get ("/register", routeProtect.isNotLoggedIn, (req, res, next) => {
  res.render("auth/register")
})

// @desc    Creates a new user in DB
// @route   POST /auth/register
// @access  Non-users only
router.post ("/register", routeProtect.isNotLoggedIn, async (req, res, next) => {
  const { username, email, password, repeatedPassword } = req.body;
  const errors = [];
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(!regexEmail.test(email)) {
    errors.push('Please enter a valid email!')
  }
  const regexPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regexPassword.test(password)) {
    errors.push('Password needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.')
  }
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedFirstPassword = await bcrypt.hash(password, salt);
  const hashedSecondPassword = await bcrypt.hash(repeatedPassword, salt);
  if (hashedFirstPassword!=hashedSecondPassword) {
    errors.push("Password don't match!")
  }
  try {
    const userInDB = await User.exists({ username: username });
    if (userInDB != null) {
      errors.push('That username is already taken!')
    }
    if (errors.length === 0) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ username, email, hashedPassword });
      const registration = {registration: 'Registration successful!'};
      res.render('auth/login', registration);
    }
    else {
      res.render('auth/register', {error: errors});
    }
  } catch (error) {
    next(error)
  }
});

module.exports = router;