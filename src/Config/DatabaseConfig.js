const mongoose = require("mongoose");

// console.log('process.env.MONGODB_HOST - ', HOST);

// const log = (msg) => console.log(msg);
const HOST = process.env.MONGODB_local || "localhost";
module.exports = {

  liveUri: `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`, 
  localUri: `mongodb://${HOST}:27017/blog`, 
  liveData(){
    const HOST = process.env.MONGODB_live || "localhost";
    const uri = `${HOST}`;
    
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,useCreateIndex: true };
    mongoose.connect(uri, options, (err, db) => {
      if (err) {
        console.error(err);
      }else{
        console.log("database connection established on cluster0");
      }
    });
  },
  localData(){
    const HOST = process.env.MONGODB_local || "localhost";
    const PORT = process.env.MONGODB_PORT || 27017
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,useCreateIndex: true };
    mongoose.connect(`mongodb://${HOST}:${PORT}/blog`, options, (err, db) => {
      if (err) {
          console.error(err);
      }else{
        console.log("database connection established on locally");
      }
    });
  }

}


