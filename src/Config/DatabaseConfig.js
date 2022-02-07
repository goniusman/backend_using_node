const mongoose = require("mongoose");

<<<<<<< HEAD
const mongo_local = process.env.MONGODB_LOCAL || "localhost";
=======
>>>>>>> bb27d22e8326cc0653531fd4f1c39cbd9ffa25fa
// console.log('process.env.MONGODB_HOST - ', HOST);

// const log = (msg) => console.log(msg);
const HOST = process.env.MONGODB_local || "localhost";
module.exports = {

  liveUri: `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`, 
<<<<<<< HEAD
  localUri: `mongodb://${mongo_local}:27017/blog`, 
  liveData(){
    const uri = `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`;
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true };
=======
  localUri: `mongodb://${HOST}:27017/blog`, 
  liveData(){
    const HOST = process.env.MONGODB_live || "localhost";
    const uri = `${HOST}`;
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,useCreateIndex: true };
>>>>>>> bb27d22e8326cc0653531fd4f1c39cbd9ffa25fa
    mongoose.connect(uri, options, (err, db) => {
      if (err) {
        console.error(err);
      }else{
        console.log("database connection established on cluster0");
      }
    });
  },
  localData(){
<<<<<<< HEAD
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    mongoose.connect(`mongodb://${mongo_local}:27017/blog`, options, (err, db) => {
=======
    const HOST = process.env.MONGODB_local || "localhost";
    const PORT = process.env.MONGODB_PORT || 27017
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,useCreateIndex: true };
    mongoose.connect(`mongodb://${HOST}:${PORT}/blog`, options, (err, db) => {
>>>>>>> bb27d22e8326cc0653531fd4f1c39cbd9ffa25fa
      if (err) {
          console.error(err);
      }else{
        console.log("database connection established on locally");
      }
    });
  }

}


