const passport = require("passport");
const { localUri, liveUri } = require("./Config/DatabaseConfig");
const { errorLogger, customErrLogger } = require("./logger");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    let correlationId = req.headers['x-correlation-id'];
    if (err) {
      customErrLogger.error(`Authenticate not working. correlation id is - ${correlationId}`)
      console.log(info);
      console.log(err);
      return next(err);
    }

    if (!user) {
     
      customErrLogger.error(`User not found. correlation id is - ${correlationId}`)
      return res.status(401).json({
        success: false,
        message: "Authentication Failed",
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
};
