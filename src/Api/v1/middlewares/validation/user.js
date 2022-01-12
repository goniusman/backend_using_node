const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
  check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required!')
    .isString()
    .withMessage('Must be a valid name!')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be within 3 to 20 character!'),
  check('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Username is required!')
    .isString()
    .withMessage('Must be a valid Username!')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be within 3 to 20 character!'),  
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email!'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is empty!')
    .isLength({ min: 5, max: 10 })
    .withMessage('Password must be 5 to 10 characters long!'),
  check('confirmPassword')
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Both password must be same!');
      }
      return true;
    }),
];

exports.userVlidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  return res.status(400).json({ success: false, message: error });
};

exports.validateUserSignIn = [
  check('email').trim().isEmail().withMessage('email / password is required!'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('email / password is required!'),
];
