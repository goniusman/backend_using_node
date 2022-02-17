const app = require("./app");
const { liveData, localData, localUri, liveUri } = require("./Config/DatabaseConfig");
const { errorLogger, infoLogger } = require("./logger");

// console.log(app)
const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   infoLogger()
//   // const t = 'this is me'
//   // logger.warn(`${t} hi there`)
//   res.status(200).json({ message: "Server is running" +PORT  });
// });

app.get("/", (req, res) => {
  console.log('nice for nginx')
  // infoLogger()
  // errorLogger(localUri)
  res.status(200).json({ message: "Server is running" + PORT  });
});

app.enable('trust proxy')
app.get('*', function(req, res){
  // errorLogger(liveUri)
  res.status(500).send('what???');
});
   
app.listen(PORT, () => {
  
  localData();
  // liveData();
  // console.log(test.uri)
  if ( process.env.ENVIRONMENT != "TEST" )app.use(errorLogger(localUri));

  infoLogger()
  console.log("app is running on port ", PORT);
});

// console.log(app)
