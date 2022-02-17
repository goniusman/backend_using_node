const app = require("./app");
const { liveData, localData, localUri } = require("./Config/DatabaseConfig");
const { errorLogger, infoLogger } = require("./logger");

// console.log(app)
const PORT = process.env.PORT || 5000;

app.get("/api", (req, res) => { 
  console.log(hello)
  infoLogger()
  res.status(500).json({ message: "Server is running" + PORT  });
});

app.get('*', function(req, res){
  res.status(500).send('what???');
});
   
app.listen(PORT, () => {
  
  localData();
  // liveData();
  // console.log(test.uri)
  if ( process.env.ENVIRONMENT !== "test" ) 
        app.use(errorLogger(localUri)); 

  infoLogger()
  console.log("app is running on port ", PORT);
});

 

// console.log(app)
