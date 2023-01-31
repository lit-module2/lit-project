const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const User = require('../models/User');
const Question = require('../models/Question');
const MONGO_URL = 'mongodb://localhost:27017/lit-projectDB';
const userSeed = require('../data/users');
const questionSeed = require('../data/questions');

console.log(userSeed, questionSeed);

mongoose.connect(MONGO_URL)
  .then(response => console.log(`Connected to the database ${response.connection.name}`))
  .then(() => User.deleteMany())
  .then(() => console.log("Emptied users collection"))
  .then(() => Question.deleteMany())
  .then(questions => console.log("Emptied questions collection"))
  .then(() => {
    return User.create(userSeed)
  })
  .then(seededUsers => console.log(`Inserted ${seededUsers.length} users in the database`))
  .then(() => {
    return Question.create(questionSeed)
  })
  .then(seededQuestions => console.log(`Inserted ${seededQuestions.length} questions in the database`))
  .then(() => mongoose.connection.close())
  .catch(err => console.error(err))