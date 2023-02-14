const express = require ("express");
const async = require("hbs/lib/async");
const router = express.Router();
const User = require ("../models/User")
const routeProtect = require("../middleware/index");
const bcrypt = require('bcrypt');
const saltRounds = 10;


// @desc    Shows user profile
// @route   GET /profile
// @access  User with user role only
router.get('/', routeProtect.isUserLoggedIn, (req, res, next) => {
    const user = req.session.currentUser;
    res.render('profile/profile', user);
})

// @desc    Shows user profile and lets him edit information
// @route   GET /profile/edit
// @access  User with user role only
router.get('/edit', routeProtect.isUserLoggedIn, (req, res, next) => {
    const user = req.session.currentUser;
    res.render('profile/profile-edit', user);
})

// @desc    Edits user information in DB
// @route   POST /profile/edit
// @access  User with user role only
router.post('/edit', routeProtect.isUserLoggedIn, async (req, res, next) => {
  let user = req.session.currentUser;
  const { newUsername, newPassword, newEmail, newPhone, newGender, newAge } = req.body;
  try {
    if (newUsername != undefined) {
      console.log('test')
      if (newUsername.length <= 13) {
        console.log('test')
        const userInDB = await User.findOne({ username: newUsername });
        if (userInDB) {
          res.render('profile/profile-edit', { error: `There already is a user with email ${newUsername}` });
          return;
        } else {
          const update = await User.findByIdAndUpdate(user._id, { username: newUsername});
        }
      }
    }
    if (newEmail != undefined) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!regexEmail.test(newEmail)) {
        res.render('profile/profile-edit', { error: `Please enter a valid email!` });
      }
      else {
        const update = await User.findByIdAndUpdate(user._id, { email: newEmail});
      }
    }

    if (newPassword != undefined) {
      const regexPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regexPassword.test(newPassword)) {
        res.render('profile/profile-edit', { error: 'Password needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.' });
      }
      else {
          const salt = await bcrypt.genSalt(saltRounds);
          const newHashedPassword = await bcrypt.hash(newPassword, salt);
          const update = await User.findByIdAndUpdate(user._id, { hashedPassword: newHashedPassword});
          res.render('profile/profile-edit', {error: error});
      }
    }

    if (newPhone != undefined) {
        const update = await User.findByIdAndUpdate(user._id, { phone: newPhone});
        console.log(update);
        const newUser = await User.findById({_id: user._id});
        console.log(newUser);
        req.session.currentUser = newUser;
    }
    if (newGender != undefined) {
        const update = await User.findByIdAndUpdate(user._id, { gender: newGender});
    }
    if (newAge != undefined) {
        const update = await User.findByIdAndUpdate(user._id, { age: newAge});
    }
    user = await User.findById({_id: user._id});
    console.log(user);
    req.session.currentUser = user;
    res.redirect('/profile');
  } catch (error) {
    next(error)
  }
})

// @desc    Destroy user session and logs out
// @route   POST /profile/logout
// @access  Private - user or admin
router.post('/logout', routeProtect.isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.render('landing/landing', {layout: 'landing/landing-layout'});
    }
  });
})
  
router.get('/logout', (req, res, next) => {
  res.redirect('landing/landing');
})

module.exports = router;