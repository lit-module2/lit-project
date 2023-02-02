const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', async (req, res, next) => {
  res.render('auth/signup');
})


// Post signup

router.post("/signup", async function (req, res, next) {
  const {username, email, password} = req.body;
  if(!username || !email || !password) {
    res.render("auth/signup", {error: "Todos los campos son requeridos"});
    console.log(hashedPassword)
    return;
  }
  
  // No he metido la parte de Regex, se queda en cuadrar con Victor.
  try {

    // Usamos el username para encontrar los usuarios.
    const userInDB = await User.findOne ({username: username});
    if(userInDB) {
      res.render("auth/signup", {error: `Ya hay un usuario con el nombre ${username}`});
      return
    } else {
      const salt = await bcrypt.genSalt(saltRounds)
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create ({username, email, hashedPassword});
      res.render("auth/homepage", user)
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

router.post ("/register", async (req, res, next) => {
  const { username, email, password, repeatedPassword } = req.body;
  try {
    const userInDB = await User.findOne({ email: email });
    if (userInDB) {
      res.render('auth/signup', { error: `There already is a user with email ${email}` });
      return;
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ username, email, hashedPassword });
      res.render('auth/profile', user);
    }
  } catch (error) {
    next(error)
  }
});

// Profile test Marina.


router.get ("/profile", (req, res, next) => {
  res.render("auth/profile")
}) 

router.post ("profile", (req, res, next) => {
  const {username} = req.body;
  const {email} = req.body;
  const {hashedPassword} = req.body;

  const user = req.session.currentUser;

});



// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', async (req, res, next) => {
  res.render('auth/login');
})

// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public

// Esto estaba dado por Ale pero lo comento para dejar el de arriba.

// router.post('/signup', async (req, res, next) => {
//   const { email, password, username } = req.body;
//   // ⚠️ Add validations!
//   try {
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const user = await User.create({ username, email, hashedPassword });
//     res.render('auth/profile', user)
//   } catch (error) {
//     next(error)
//   }
// });

// @desc    Sends user auth data to database to authenticate user
// @route   POST /auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  // ⚠️ Add validations!
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.render('auth/login', { error: "User not found" });
      return;
    } else {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        // Remember to assign user to session cookie:
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', { error: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
})

// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  Private 
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/auth/login');
    }
  });
})

module.exports = router;
