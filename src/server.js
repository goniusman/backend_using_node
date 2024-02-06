const app = require("./app");
const { DB, Dburl } = require("./Config/DatabaseConfig");
const Redis = require("./Api/v1/utils/cache")
const { errorLogger, infoLogger } = require("./logger");
const { CronJobs } = require("./cron");



const PORT = process.env.PORT || 5000;

app.get("/api", (req, res) => { 
    // console.log(nice)
  res.status(200).json({ message: "Server is running " + PORT  });
});

app.get('*', function(req, res){
  res.status(404).send('please correct your endpoints???'); 
});
   

app.listen(PORT, () => {

  DB()
  app.use(errorLogger(Dburl()));
  Redis()



  // CronJobs()
  // console.log('this is testing');
  console.log("app is running on port ", PORT);
});
  
 
 

