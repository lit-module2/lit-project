const router = require('express').Router();
const Question = require('../models/Question');


// @desc    App home page
// @route   GET /
// @access  User with user role only
router.get('/', async function (req, res, next) {
  try {
    const questions = await Question.find({});
    const randomQuestion = questions[Math.floor(Math.random() * questions.length )];
    res.render('index', { randomQuestion })
  } catch (error) {
    next (error)
  }
});

// @desc    App home page, user answers question
// @route   Post /questionId
// @access  User with user role only
router.post('/:questionId', isUserLoggedIn, async function (req, res, next) {
  try {
    const user = req.session.currentUser;
    const { questionId } = req.params;
    const { userAnswered,  userIgnored} = req.body;
  } catch (error) {
    next(error)
  }
});

module.exports = router;
