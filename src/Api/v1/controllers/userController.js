const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const crypto = require("crypto");

const cloudinary = require("../helper/imageUpload");
const User = require("../models/User");
const VToken = require("../models/VToken");
const RToken = require("../models/RToken");
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
    if (!password) return resourceError(res, "Please Provide a Aerfect Password");
    const id = req.user._id
    return await resetPassword(res, password, id)
  },

  async login(req, res) {
    let { email, password } = req.body;

    let validate = loginValidator({ email, password });

    if (!validate.isValid) return res.json({success: false, message: "Empty Value", data: validate.error});
    
    return await login(res, email, password)

  },

  async forgotPasswordallUser(req, res) {
    await User.find()
      .then((users) => {
        if (!users) {
          resourceError(res, "There is no users");
        }
        return res.status(200).json(users);
      })
      .catch((error) => serverError(res, error));
  },

  async imageUpload(req, res) {
    const { user } = req;
    const filePath = req.file.path
    if (!user) return res.status(401).json({ success: false, message: "unauthorized access!" });

   return await imageUpload(res, user, filePath)
  },

  async logOut(req, res) {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) return res.status(401).json({ success: false,message: "Authorization fail! There is no Authorization token"});
      
      const tokens = req.user.tokens;

     return await logOut(res, tokens);
    }
  },

};
