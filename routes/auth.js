const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// @desc    Displays login view
// @route   GET /auth/login
// @access  Public
router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

// @desc    Logs user into the app
// @route   POST /auth/login
// @access  Public
router.post("/login", async function (req, res, next) {
  const {username, password} = req.body;
  if(!username ||!password) {
    res.render("auth/login", {error: "Todos los campos son requeridos"});
    return;
  }
  // No he metido la parte de Regex, se queda en cuadrar con Victor.
  try {
    // Usamos el username para encontrar los usuarios.
    const userInDB = await User.findOne({username: username});
    console.log(userInDB);
    if(!userInDB) {
      res.render ("auth/homepage", {error:`no hay nadie en la base de datos bajo el nombre ${username}`})
      return  
    } else {
      const passwordMatch = await bcrypt.compare(password, userInDB.hashedPassword)
      console.log(passwordMatch);
      if(passwordMatch) {
        req.session.currentUser = userInDB;
        res.redirect('/question')
      } else {
        res.render("auth/login", {error: "Imposible verificar al usuario"})
      }

    }
  } catch (error) {
    next (error)
  }

})

// GET Profile 

router.get("/profile", (req, res, next) => {
  res.render("auth/profile")
})


// @desc    Displays the register page and form
// @route   GET /auth/signup
// @access  Public
router.get ("/register", (req, res, next) => {
  res.render("auth/register")
})

// @desc    Creates a new user in DB
// @route   POST /auth/register
// @access  Public
router.post ("/register", async (req, res, next) => {
  const { username, email, password, repeatedPassword } = req.body;
  try {
    const userInDB = await User.findOne({ username: username });
    if (userInDB) {
      res.render('auth/login', { error: `There already is a user with email ${email}` });
      return;
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ username, email, hashedPassword });
      res.render('profile', user);
    }
  } catch (error) {
    next(error)
  }
});

// @desc    Destroy user session and logs out
// @route   POST /auth/logout
// @access  Public 



router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/auth/login');
    }
  });
})


module.exports = router;
