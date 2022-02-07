





const User = require("../models/User");


const registerValidator = require("../validator/registerValidator");
const loginValidator = require("../validator/loginValidator");

const redisclient = require("../utils/cache");
const { serverError, resourceError } = require("../utils/error");
const { createRandomByte } = require("../utils/helper");
const {
  generateOTP,
  mailTrap,
  generateHTMLTemplate,
  plainEmailTemplate,
  generatePasswordResetTemplate,
} = require("../utils/mail");


const {
  login,
  register,
  allUser,
  imageUpload,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../services/userServices");


// login controller
module.exports = {
  async allUser(req, res) {
    // console.log('test')
    // winston.info('I am here this is your point post file\n')
    redisclient().get("users", async (err, users) => {
      if (err) throw err;

      if (users) {
        // res.status(200).send({
        //   jobs: JSON.parse(users),
        //   message: "data retrieved from the cache",
        // });

        let data = JSON.parse(users);

        return res.json({ success: true, users: data });
      } else {

        let users =  allUser(res);

        return users;

      }
    });

  },

  async register(req, res) {
    let { name, email, role, username, password, confirmPassword } = req.body;
    // console.log(req.body);
    let validate = registerValidator({
      email,
      username,
      password,
      confirmPassword,
    });

    if (!validate.isValid) {
      // console.log(validate.error);
      return res.status(400).json({
        success: false,
        message: "Empty Value",
        data: validate.error,
      });
    } else {

      return await register({ name, email, role, username, password, confirmPassword }, res)

    }

  },

  async verifyEmail(req, res) {
    const { userId, otp } = req.body;

    if (!userId || !otp.trim())
      return resourceError(res, "Invalid request, missing parameters!");

      return await verifyEmail(res, userId, otp); 

  },

  async forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) return resourceError(res, "Please Provide a valid email");

    return await forgotPassword(res, email)
  },

  async resetPassword(req, res) {
    const { password } = req.body;
    if (!password) return resourceError(res, "Please Provide a Correct Password");
    if (password.trim().length < 6 || password.trim().length > 20) return resourceError(res, "password must be 6 to 20 characters");
    const id = req.user._id
    return await resetPassword(res, password, id)
  },

  async login(req, res) {
    let { email, password } = req.body;

    let validate = loginValidator({ email, password });

    if (!validate.isValid) return res.status(400).json({success: false, message: "Empty Value", data: validate.error});
    
    return await login(res, email, password)

  },


  async imageUpload(req, res) {
    const { user } = req;
    if (!user) return res.status(401).json({ success: false, message: "unauthorized access!" });
    // if (typeof req.file.path  == "undefined") {
    //     return res.status(400).json({success: "false", file: "No file uploaded" });
    // }
    const filePath = req.file.path
    return await imageUpload(res, user, filePath)
  },

  async logOut(req, res) {
    const token = req.headers && req.headers.authorization.split(' ')[1] 
    const tokens = req.user.tokens;
    const id = req.user._id
    return await logOut(res, tokens, id, token);
    
  },

};
