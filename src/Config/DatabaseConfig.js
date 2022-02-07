const mongoose = require("mongoose");

const mongo_local = process.env.MONGODB_LOCAL || "localhost";
// console.log('process.env.MONGODB_HOST - ', HOST);

// const log = (msg) => console.log(msg);

module.exports = {

  liveUri: `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`, 
  localUri: `mongodb://${mongo_local}:27017/blog`, 
  liveData(){
    const uri = `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`;
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true };
    mongoose.connect(uri, options, (err, db) => {
      if (err) {
          console.error(err);
      }else{
        console.log("database connection established on cluster0");
      }
    });
  },
  localData(){
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    mongoose.connect(`mongodb://${mongo_local}:27017/blog`, options, (err, db) => {
      if (err) {
          console.error(err);
      }else{
        console.log("database connection established on locally");
      }
    });
  }

}


