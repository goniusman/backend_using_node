const mongoose = require("mongoose");

module.exports = {

  Dburl: () => {
    let dburl = ""
    if(process.env.MONGODB_PORT){
      dburl = `${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}`
    }else{
      dburl = process.env.MONGODB_URL
    }
    return dburl
  },
  DB : () => {
    let dburl = ""
    if(process.env.MONGODB_PORT){
      dburl = `${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}`
    }else{
      dburl = process.env.MONGODB_URL
    }
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true,useCreateIndex: true };
    mongoose.connect(`${dburl}/blog`, options, (err, db) => {

      if (err) {
        console.error(err);
      }else{
        console.log("Database Connection Established");
      }
    });
    
  }

}


