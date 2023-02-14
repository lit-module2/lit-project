const express = require ("express");
const async = require("hbs/lib/async");
const router = express.Router();
const User = require ("../models/User")
const UserAnswer = require ("../models/UserAnswer")
const routeProtect = require("../middleware/index");


// @desc    Shows user notifications
// @route   GET /notifications
// @access  User with user role only
router.get('/', routeProtect.isUserLoggedIn, async (req, res, next) => {
    const user = req.session.currentUser;
    const last24Hours = new Date((Date.now() - 24*60*60*1000));
    try {
        const actions = await UserAnswer.find({userAnswered: user._id, userAsked: { $ne: user._id }, createdAt: { $lte: last24Hours}}).populate('userAsked').populate('questionId');
        console.log(actions);
        const notificationData = actions.map(elem => {
            return {
                questionCategory: elem.questionId.category,
                emoji: elem.questionId.emoji,
                userAsked: elem.userAsked.username
            }
        })
        console.log(notificationData);
        res.render('notifications', {data: notificationData});
    }
    catch (error) {
        next(error)
    }
})

module.exports = router;