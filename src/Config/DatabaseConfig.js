const mongoose = require("mongoose");

// console.log('process.env.MONGODB_HOST - ', HOST);

// const log = (msg) => console.log(msg);
// const HOSTl = process.env.MONGODB_live || "localhost";

const LHOST = process.env.MONGODB_LIVE || "localhost";
const LPORT = process.env.MONGODB_PORT || 27017

const HOST = process.env.MONGODB_LOCAL || "localhost";
const PORT = process.env.MONGODB_LOCAL_PORT || 27017

module.exports = {

  // liveUri: `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`, 
  liveUri: `mongodb://${LHOST}:${LPORT}/blog`, 
  localUri: `mongodb://${HOST}:${PORT}/blog`, 
  liveData(){
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true,useCreateIndex: true };
    mongoose.connect(`mongodb://${LHOST}:${LPORT}/blog`, options, (err, db) => {
      if (err) {
        console.error(err);
      }else{
        console.log("database connection established on streamly");
      }
    });
    
  },

  localData(){

    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true,useCreateIndex: true };
    mongoose.connect(`mongodb://${HOST}:${PORT}/blog`, options, (err, db) => {
      if (err) {
          console.error(err);
      }else{ 
        console.log("database connection established on locally");
      }
    });
  
  }

}


