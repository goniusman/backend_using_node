const mongoose = require("mongoose");


module.exports = {
  liveData(){
    mongoose.connect(
      `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        console.log("database connected");
      }
    );
  },
  
  localData(){}
  
}
