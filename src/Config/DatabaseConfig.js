const mongoose = require("mongoose");

// console.log('process.env.MONGODB_HOST - ', HOST);

// const log = (msg) => console.log(msg);
// const HOSTl = process.env.MONGODB_live || "localhost";

const HOST = process.env.MONGODB_local || "localhost";
const PORT = process.env.MONGODB_PORT || 27017

module.exports = {

  // liveUri: `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`, 
  localUri: `mongodb://${HOST}:27017/blog`, 
  liveData(){
    // const uri = `${HOSTl}`;
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,useCreateIndex: true };
    mongoose.connect(`mongodb://${HOST}:${PORT}/blog`, options, (err, db) => {
      if (err) {
        console.error(err);
      }else{
        console.log("database connection established on cluster");
      }
    });
    
  },
  localData(){

    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,useCreateIndex: true };
    mongoose.connect(`mongodb://${HOST}:${PORT}/blog`, options, (err, db) => {
      if (err) {
          console.error(err);
      }else{
        console.log("database connection established on locally");
      }
    });
    mongoose.set('useUnifiedTopology', true);
  }

}


