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


const mongoErrorTransport = (uri) => new winston.transports.MongoDB({
  db: uri,
  metaKey: 'meta'
});


// const HOST = process.env.ELASTICSEARCH_HOST || "localhost";
// const elasticsearchOptions = {
//     level: 'info',
//     clientOpts: { node: `http://${HOST}:9200` },
//     indexPrefix: 'log-parcelkoi'
// };
// const esTransport = new (ElasticsearchTransport)(elasticsearchOptions);



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
    datePattern: 'yyyy-MM-DD'
    // datePattern: 'yyyy-MM-DD'
  }
)

module.exports.infoLogger = () => expressWinston.logger({
  transports: [
      // new winston.transports.Console(),
      // esTransport
      infoTransport
  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: false, 
  msg: getMessage 
});


module.exports.errorLogger = (uri) => expressWinston.errorLogger({
  transports: [
      // new winston.transports.Console(),
      mongoErrorTransport(uri),
      errTransport
  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true,
  msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error": "{{err.message}}" }'
});





