const express = require ("express");
const async = require("hbs/lib/async");
const router = express.Router();
const User = require ("../models/User");
const UserAnswer = require ("../models/UserAnswer");
const Question = require ("../models/Question")
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
    res.render('profile/profile-edit', {user});
})

// @desc    Edits user information in DB
// @route   POST /profile/edit
// @access  User with user role only
router.post('/edit', routeProtect.isUserLoggedIn, async (req, res, next) => {
  let user = req.session.currentUser;
  let errors = [];
  const { newUsername, newPassword, newEmail, newPhone, newGender, newAge } = req.body;
  try {
    if (newUsername != '') {
      if (newUsername.length <= 13) {
        const userInDB = await User.findOne({ username: newUsername });
        if (userInDB) {
          errors.push(`There already is a user called ${newUsername}`);
        } else {
          const update = await User.findByIdAndUpdate(user._id, { username: newUsername});
        }
      }
    }
    if (newEmail != '') {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!regexEmail.test(newEmail)) {
        errors.push('Email must have valid format!');
      }
      else {
        const update = await User.findByIdAndUpdate(user._id, { email: newEmail});
      }
    }
    if (newPassword != '') {
      const regexPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regexPassword.test(newPassword)) {
        errors.push('Password needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.');
      }
      else {
        const salt = await bcrypt.genSalt(saltRounds);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        const update = await User.findByIdAndUpdate(user._id, { hashedPassword: newHashedPassword});
      }
    }
    if (newPhone != '') {
        const update = await User.findByIdAndUpdate(user._id, { phone: newPhone});
    }
    if (newGender != '') {
        const update = await User.findByIdAndUpdate(user._id, { gender: newGender});
    }
    if (newAge != '') {
        const update = await User.findByIdAndUpdate(user._id, { age: newAge});
    }
    user = await User.findById({_id: user._id});
    req.session.currentUser = user;
    if (errors.length===0) {
      const update = {update: true};
      res.render('profile/profile-edit', {user, update});
    }
    else {
      const error = {error: errors};
      res.render('profile/profile-edit', {user, error});
    }
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

router.post('/delete', routeProtect.isUserLoggedIn, async (req, res, next) => {
  user = req.session.currentUser;
  try {
    const update = await User.findByIdAndUpdate(user._id, { deletedAccount: true});
    req.session.destroy((err) => {
      if (err) {
        next(err)
      } else {
        res.render('landing/landing', {layout: 'landing/landing-layout'});
      }
    });
  } catch (error) {
    next(error);
  }
})

router.get('/approved-questions', routeProtect.isUserLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const answers = await UserAnswer.find({}).populate('questionId');
    const answersByQuestionAuthor = answers.filter(answer => ((String(answer.questionId._author) === String(user._id))));
    const questions = await Question.find({_author: user._id, _approved: true});
    let questionData = [];
    for (let question of questions) {
        let timesAnswered = 0;
        for (let answer of answersByQuestionAuthor) {            
            if (String(answer.questionId._id) === String(question._id)) {
              timesAnswered++;
            }
        }
        questionData.push({emoji: question.emoji, category: question.category, question: question.question, timesAnswered: timesAnswered});
    }
    questionData = questionData.sort((a, b) => b.timesAnswered - a.timesAnswered);
    res.render('profile/user-questions', {data: questionData});
}
catch (error) {
    next(error)
}
})
  
router.get('/logout', (req, res, next) => {
  res.redirect('landing/landing');
})

module.exports = router;