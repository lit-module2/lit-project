const express = require ("express");
const async = require("hbs/lib/async");
const router = express.Router();
const User = require ("../models/User")


router.get("/", async (req, res, next) => {
    const user = req.session.currentUser;
    res.render("profile", user);
})

// GET Edit


router.get("/edit", async(req, res, next) => {
    const user = req.session.currentUser;
    res.render("profile", user);
})



router.post ("/edit", async (req, res, next) => {
    const {username} = req.body;
    const user = req.session.currentUser;
    try {
        const userInDB = await User.findByIdAndUpdate( user._id, {username}, {new:true});
        req.session.currentUser = userInDB;
        res.redirect("/profile");
    } catch (error){
        next(error)
    }
})

module.exports = router;