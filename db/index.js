const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose
  .connect(process.env.MONGO_URL)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

