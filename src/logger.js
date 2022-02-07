const winston = require("winston");
const expressWinston = require( "express-winston");
const winstonMongo = require("winston-mongodb");
const { ElasticsearchTransport } = require( "winston-elasticsearch");
const DailyRotateFile = require('winston-daily-rotate-file');
 

const getMessage = (req, res) => {
  let obj = {
      correlationId: req.headers['x-correlation-id'],
      requestBody: req.body
  };
 
  return JSON.stringify(obj);
}


// const mongoErrorTransport = (uri) => new winston.transports.MongoDB({
//   db: uri,
//   metaKey: 'meta',
//   collection: 'logs' 
// });


// const HOST = process.env.ELASTICSEARCH_HOST || "localhost";
// const elasticsearchOptions = {
//     level: 'info',
//     clientOpts: { node: `http://${HOST}:9220` },
//     indexPrefix: 'log-BackendNode'
// };
// const esTransport = new (ElasticsearchTransport)(elasticsearchOptions);
<<<<<<< HEAD
=======

>>>>>>> bb27d22e8326cc0653531fd4f1c39cbd9ffa25fa


const infoTransport = new (winston.transports.DailyRotateFile)(
    {
    filename: 'logs/info/log-%DATE%.log', 
    datePattern: 'yyyy-MM-DD'
    // datePattern: 'yyyy-MM-DD-HH'
  }
)

const errTransport = new (winston.transports.DailyRotateFile)(
    {
      filename: 'logs/err/log-%DATE%.log', 
      datePattern: 'yyyy-MM-DD',
      name: 'file',
      colorize: true, 
      json: true,
      maxsize: 50 * 1024 * 1024,
      maxFiles: 10,
      zippedArchive: true
  }
)

module.exports.infoLogger = () => expressWinston.logger({
  transports: [
      // new winston.transports.Console(),
      infoTransport,
<<<<<<< HEAD
      // esTransport,
    //   new winston.transports.Console({
    //     json: true,
    //     colorize: true
    // })
=======
      // esTransport 
>>>>>>> bb27d22e8326cc0653531fd4f1c39cbd9ffa25fa
  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true, 
  msg: getMessage 
});


module.exports.errorLogger = (uri) => expressWinston.errorLogger({
  transports: [
      // new winston.transports.Console(),
<<<<<<< HEAD
      mongoErrorTransport(uri),
      errTransport,
      new winston.transports.Console({
        json: true,
        colorize: true
      })
=======
      // mongoErrorTransport(uri),
      errTransport,
      // esTransport
>>>>>>> bb27d22e8326cc0653531fd4f1c39cbd9ffa25fa
  ],
  ignoreRoute: function(req, res) {
    return true;
  },
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true,
<<<<<<< HEAD
  msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error": "{{err}}" }'
=======
  msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error": "error here from logger js file" }'
>>>>>>> bb27d22e8326cc0653531fd4f1c39cbd9ffa25fa
});






