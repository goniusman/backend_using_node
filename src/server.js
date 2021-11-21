const express = require("express");
const winston = require("winston");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
var passport = require("passport");
const path = require("path");
const multer = require('multer');
const logger = require('./Config/Logger.ts'); 


// // const { static } = require("express")

// for dot env 
require('dotenv').config();

const app = express();

/// for loging information 
// app.use(morgan("dev")); 
app.use(morgan('combined', { stream: winston.stream }));
logger.info('some error occured');


// cross origin platform
app.use(cors());

//boyd parser when submited
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require("./passport")(passport);

// app.use(fileUpload());

 
// app.use(express.static(__dirname + '/public'));
// app.use(multer({ dest: './uploads/'}));

// router
const userRouter = require("./Api/v1/routers/userRouter");
const postRouter = require("./Api/v1/routers/postRouter");
const categoryRouter = require("./Api/v1/routers/categoryRouter");
const commentRouter = require("./Api/v1/routers/commentRouter");

// app.use(express.static("data/uploads"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/user/", userRouter); 
app.use("/api/post/", postRouter);
app.use("/api/category/", categoryRouter);
app.use("/api/post/single-post/", commentRouter);
 

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static('client/build'))
//     app.get('*', (req, res) =>  {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  mongoose.connect(
    `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("database connected");
    }
  );
});


module.exports = app












// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' }),
//   ],
// });  

// // if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// // }

// logger.log('info', 'test message %s', 'my string');
