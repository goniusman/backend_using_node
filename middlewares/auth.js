const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuth = async (req, res, next) => {
  // console.log(req.headers.authorization)
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
// console.log(token)
    try {
      const decode = jwt.verify(token, 'SECRET');
      // console.log(decode)
      const user = await User.findById(decode._id);
      if (!user) {
        return res.json({ success: false, message: 'unauthorized access!' });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.json({ success: false, message: 'unauthorized access!' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.json({
          success: false,
          message: 'sesson expired try sign in!',
        });
      }

      res.res.json({ success: false, message: 'Internal server error!' });
    }
  } else {
    res.json({ success: false, message: 'unauthorized access!' });
  }
};
