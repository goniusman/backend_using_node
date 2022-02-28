const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuth = async (req, res, next) => {

  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    
    try {

      // for removing string from a token
      // function stripquotes(a) {
      //     if (a.charAt(0) === '"' && a.charAt(a.length-1) === '"') {
      //         return a.substr(1, a.length-2);
      //     }
      //     return a;
      // }

      const decode = jwt.verify(JSON.parse(token), 'SECRET');

      const user = await User.findById(decode._id);
  

      if (!user) {
        return res.json({ success: false, message: 'unauthorized access!' });
      }
      const {password, ...newuser} = user._doc
      req.user = newuser;
      next();
    } catch (error) {
      console.log(error)
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ success: false, message: 'unauthorized access!' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: 'sesson expired try sign in!',
        });
      }

     return res.status(400).json({ success: false, message: 'Internal server error!' });
    }
  } else {
    return res.status(400).json({ success: false, message: 'unauthorized access!' });
  }
};
