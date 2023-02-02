const express = require("express")
const router = require('express').Router();
const User = require ("../models/User");

router.get("/register", (req, res, next) => {
  res.render("register")
}) 

router.post("/register", (req, res, next) => {
  res.render("/");
  const {username} = req.body;
  const {email} = req.body;
  const {hashedPassword} = req.body;

  const user = req.session.currentUser;

  });

  module.export = router