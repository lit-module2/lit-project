const router = require('express').Router();
const Question = require('../models/Question');
const UserAnswer = require('../models/UserAnswer');


// @desc    App home page
// @route   GET /
// @access  User with user role only
router.get('/', async function (req, res, next) {
  try {
    const questions = await Question.find({});
    console.log("preguntas", questions);
    const randomQuestion = questions[Math.floor(Math.random() * questions.length )];
    res.render('index', { randomQuestion })
  } catch (error) {
    next (error)
  }
});

// @desc    App home page, user answers question
// @route   Post /questionId
// @access  User with user role only
router.post('/:questionId', async function (req, res, next) {
  try {
    const userAsked = req.session.currentUser;
    const { questionId } = req.params;
    const { userAnswered,  usersIgnored} = req.body;
    await UserAnswer.create({ questionId, userAsked, userAnswered, usersIgnored });
  } catch (error) {
    next(error)
  }
});

module.exports = router;
