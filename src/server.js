const app = require("./app");
const { liveData, localData, localUri, liveUri } = require("./Config/DatabaseConfig");
const { errorLogger, infoLogger } = require("./logger");
const { CronJobs } = require("./cron");



const PORT = process.env.PORT || 5000;

app.get("/api", (req, res) => { 
    // console.log(nice)
  res.status(200).json({ message: "Server is running " + PORT  });
});

app.get('*', function(req, res){
  res.status(404).send('what???'); 
});
   
app.listen(PORT, () => {

  if(process.env.NODE_ENV == undefined || process.env.NODE_ENV !== "production"){
    localData();
  }else{
    liveData(); 
  }

  if(process.env.NODE_ENV == undefined || process.env.NODE_ENV !== "production"){
    app.use(errorLogger(localUri));
  }else{
      app.use(errorLogger(liveUri));
  }

  // CronJobs()
  // console.log('this is testing');
  console.log("app is running on port ", PORT);
});
  
 
 

