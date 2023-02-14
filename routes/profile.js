const express = require ("express");
const async = require("hbs/lib/async");
const router = express.Router();
const User = require ("../models/User")
const routeProtect = require("../middleware/index");
const auth = require ("./auth");


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
    const user = req.session.currentUser;
    if (user) {
        const {password} = req.body;
        console.log(user)
        try {
            const userInDB = await User.findByIdAndUpdate( user._id, {password}, {new:true})
            req.session.currentUser = userInDB;
            res.redirect ('/profile');
        } catch (error) {
            next (error)
        }
    } else {
        res.redirect("/")
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
        res.render('profile/logout');
      }
    });
  })
  
  router.get('/logout', (req, res, next) => {
    res.render('profile/logout');
  })

module.exports = router;