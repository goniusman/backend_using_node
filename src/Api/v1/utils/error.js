const { localUri, liveUri } = require("../../../Config/DatabaseConfig");
const { errorLogger, customErrLogger } = require("../../../logger");

let correlationId ;

module.exports = {
  serverError(res, error) {
    // console.log(error);
    customErrLogger.error(`this is error that your request can't handle properly${ error.message} and correlation id is ${correlationId}`)
     return res.json({
      "error": error.message,
      "message": "Server Error Occurred",
    });
  },

  resourceError(res, message) {
    customErrLogger.error(`this is error that your request can't handle properly ${message} and correlation id is ${correlationId}`)
     res.json({ "success": false, "message": message });
    // return res.status(400).json({
    //   message,
    // });
  },

  handleRequest(req, res, next) {
    correlationId = req.headers['x-correlation-id'];
    if (!correlationId) {
        correlationId = Date.now().toString();
        req.headers['x-correlation-id'] = correlationId;
    }

    res.set('x-correlation-id', correlationId);

    return next();
  },

  handleError(err, req, res, next) {
    let code = 500;
    // if (err instanceof GeneralError) {
    //     code = err.getCode();
    // }

    correlationId = req.headers['x-correlation-id'];
    customErrLogger.error(`User not found. correlation id is - ${correlationId} and correlation id is ${correlationId}`)
    return res.status(code).json({
        correlationId: correlationId, 
        message: "internal server errro"
    });
    
  }
};





// export class GeneralError extends Error {
//   constructor(message) {
//       super();
//       this.message = message;
//   }

//   getCode() { return 400; }
// }

// export class BadRequest extends GeneralError {
//   constructor(message) {
//       super(message);
//       this.name = 'BadRequest';
//   }
//   getCode() { return 400; }
// }

// export class NotFound extends GeneralError {
//   constructor(message) {
//       super(message);
//       this.name = 'NotFound';
//   }

//   getCode() { return 404; }    
// }


