const app = require("./app");
const { liveData, localData, localUri } = require("./Config/DatabaseConfig");
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
  // infoLogger()
  // errorLogger(localUri)
  res.status(200).json({ message: "Server is running" +PORT  });
});

app.get('*', function(req, res){
  errorLogger(localUri)
  res.status(500).send('what???');
});
   
app.listen(PORT, () => {
  localData();
  // liveData();
  // console.log(test.uri)
  if (process.env.ENVIRONMENT != "TEST") app.use(errorLogger(localUri));

  console.log("app is running on port", PORT);
});

// console.log(app)
