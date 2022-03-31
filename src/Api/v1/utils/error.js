const { localUri } = require("../../../Config/DatabaseConfig");
const { errorLogger } = require("../../../logger");


module.exports = {
  serverError(res, error) {
    console.log(error);
    errorLogger(localUri, error)
     return res.json({
      "error": error.message,
      "message": "Server Error Occurred",
    });
  },

  resourceError(res, message) {
    // errorLogger(localUri, message)
     res.json({ "success": false, "message": message });
    // return res.status(400).json({
    //   message,
    // });
  },

  handleRequest(req, res, next) {
    let correlationId = req.headers['x-correlation-id'];
    if (!correlationId) {
        correlationId = Date.now().toString();
        req.headers['x-correlation-id'] = correlationId;
    }

    res.set('x-correlation-id', correlationId);

    return next();
  },

  handleError(err, req, res, next) {
    // let code = 500;
    // if (err instanceof GeneralError) {
    //     code = err.getCode();
    // }

    let correlationId = req.headers['x-correlation-id'];
    return res.status(500).json({
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


