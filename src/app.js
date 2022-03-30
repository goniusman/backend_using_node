require("dotenv").config();
// NodeJs Module
const express = require("express");
const winston = require("winston");
const fs = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const path = require("path");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = require("./swagger.json");
const errorHandler = require("./errorHandler");
const { infoLogger, errorLogger} = require("./logger");
require("./passport")(passport);
const { liveData, localData, localUri } = require("./Config/DatabaseConfig");
const {handleRequest,handleError } = require("./Api/v1/utils/error")

// for dot env
const app = express(); 
// cross origin platform
app.use(cors());

//body parser when submited
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(handleRequest);

// // default morgan packages without winston.
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// app.use(morgan('common', { stream: accessLogStream }))

/// for loging information
// app.use(morgan('combined', { stream: winston.stream.write }));
// logger.info('some error occured');

// app.use(express.static(__dirname + '/public'));
// app.use(multer({ dest: './uploads/'}));

// router
const userRouter = require("./Api/v1/routers/userRouter");
const blogRouter = require("./Api/v1/routers/blogRouter");
const categoryRouter = require("./Api/v1/routers/categoryRouter");
const commentRouter = require("./Api/v1/routers/commentRouter");
const swaggerRouter = require("./Api/v1/routers/swagger");

if ( process.env.ENVIRONMENT != "TEST" )
      app.use(infoLogger());


app.use("/api/user/", userRouter);
app.use("/api/blog/", blogRouter);
app.use("/api/category/", categoryRouter);
app.use("/api/post/single-post/", commentRouter);
app.use("/api-docs", swaggerRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static('client/build'))
//     app.get('*', (req, res) =>  {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

// app.listen(PORT,  database.liveData() );
app.use(handleError)
app.use(handleRequest)

// global error handler
app.use(errorHandler);

module.exports = app;

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
