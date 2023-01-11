const passport = require("passport");
const { localUri, liveUri } = require("./Config/DatabaseConfig");
const { errorLogger, customErrLogger } = require("./logger");

module.exports = (req, res, next) => {
  // console.log(req.headers);
  passport.authenticate("jwt", (err, user, info) => {
    // console.log('authenticate');
    let correlationId = req.headers['x-correlation-id'];
    // if (err || info) {
    //   customErrLogger.error(`Authenticate not working. correlation id is - ${correlationId}`)
    //   console.log(info);
    //   console.log(err);
    //   return next(err);
    // }
// console.log(err);
    if (!user) {
     
      customErrLogger.error(`User not found. correlation id is - ${correlationId}`)
      return res.status(401).json({
        success: false,
        message: info.message,
        error: info,
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
};
