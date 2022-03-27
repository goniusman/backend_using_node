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
  metaKey: 'meta',
  collection: 'logs' 
});


const HOST = process.env.ELASTICSEARCH_HOST || "localhost";
const elasticsearchOptions = {
    level: 'info',
    clientOpts: { node: `https://${HOST}:9200` },
    indexPrefix: 'log-BackendNode'
};
const esTransport = new (ElasticsearchTransport)(elasticsearchOptions);


const infoTransport = new (winston.transports.DailyRotateFile)(
    {
    filename: 'logs/info/log-%DATE%.log', 
    datePattern: 'yyyy-MM-DD', 
    // datePattern: 'yyyy-MM-DD-HH'
    // name: 'file',
    colorize: true,  
    json: true,
    maxsize: 50 * 1024 * 1024,
    maxFiles: 10,
    zippedArchive: true

  }
)

const errTransport = new (winston.transports.DailyRotateFile)(
    {
      filename: 'logs/err/log-%DATE%.log', 
      datePattern: 'yyyy-MM-DD',
      // name: 'file',
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
      esTransport,
    //   new winston.transports.Console({
    //     json: true,
    //     colorize: true
    // })
  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true, 
  msg: getMessage 
});


module.exports.errorLogger = (uri) => expressWinston.errorLogger({
  transports: [
      // new winston.transports.Console(),
      mongoErrorTransport(uri),
      errTransport,
      esTransport,
      // new winston.transports.Console({
      //   json: true,
      //   colorize: true 
      // })
  ],
  ignoreRoute: function(req, res) {
    return true;
  },
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true,
  msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error": "{{err}}" }'
});






