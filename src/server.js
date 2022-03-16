const app = require("./app");
const { liveData, localData, localUri, liveUri } = require("./Config/DatabaseConfig");
const { errorLogger, infoLogger } = require("./logger");
const { CronJobs } = require("./cron")

// console.log(app)
const PORT = process.env.PORT || 5000;

app.get("/api", (req, res) => { 
  // console.log(hello)
  infoLogger()
  res.status(200).json({ message: "Server is running" + PORT  });
});

app.get('*', function(req, res){
  res.status(404).send('what???');
});
   
app.listen(PORT, () => {
  console.log(process.env.NODE_ENV) 
  
  if(process.env.NODE_ENV !== "production"){
    localData();
  }else{
    liveData(); 
  }
  // console.log(test.uri)
  if ( process.env.NODE_ENV !== "production" ) {
    app.use(errorLogger(localUri)); 
  }else{
    app.use(errorLogger(liveUri)); 
  }
  
  // CronJobs()
  // console.log()
  infoLogger()
  console.log("app is running on port ", PORT);
});
 
 

// console.log(app)
