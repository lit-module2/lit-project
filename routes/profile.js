const express = require ("express");
const async = require("hbs/lib/async");
const router = express.Router();
const User = require ("../models/User")


router.get("/", (req, res, next) => {
    const user = req.session.currentUser;
    res.render("profile", user);
})

// GET Edit


router.get("/edit", (req, res, next) => {
    const user = req.session.currentUser;
    res.render("profile-edit", user);
})


// router.post ("/edit", async (req, res, next) => {
//     //const {username} = req.body;
//     const user = req.session.currentUser;
//     const {password} = req.body;
//     console.log(user)
//     try {
//         const userInDB = await User.findByIdAndUpdate( user._id, {password}, {new:true});
//         req.session.currentUser = userInDB;
//         res.redirect("/profile");
//     } catch (error){
//         next(error)
//     }
// })


router.post("/edit", async (req, res, next) => {
    const user = req.session.currentUser;
    if (user) {
        const {password} = req.body;
        console.log(user)
        try {
            const userInDB = await User.findByIdAndUpdate( user._id, {password}, {new:true})
            req.session.currentUser = userInDB;
            res.redirect ("/profile");
        } catch (error) {
            next (error)
        }
    } else {
        res.redirect("/")
    }
})

module.exports = router;