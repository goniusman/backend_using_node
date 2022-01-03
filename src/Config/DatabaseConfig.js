const mongoose = require("mongoose");

// const HOST = process.env.MONGODB_HOST || "localhost";
// console.log('process.env.MONGODB_HOST - ', HOST);

// const log = (msg) => console.log(msg);

module.exports = {

  uri: `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`,
  liveData(){
    const uri = `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`;
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
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
    mongoose.connect(`mongodb://localhost:27017/blog`, options, (err, db) => {
      if (err) {
          console.error(err);
      }else{
        console.log("database connection established on locally");
      }
    });
  }

}


