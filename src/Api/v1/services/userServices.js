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

// login controller
module.exports = {
  async allUser(res) {
    // console.log('test')
   
    await User.find()
      // .limit(2)
      .then(  (users) => {

        // let ars = users;
        // console.log(users);
        if (users.length === 0) {
          // return res.status(200).json({
          //   message: "No User Found",
          // });
          return res.json({ success: true, users: "No Users Founud" });
        } else {
          // delete posts.description;
          // const { description, image } = posts;

          // return res.status(200).json(posts);
          redisclient().setex("users", 600, JSON.stringify(users));

          return res.json({ success: true, users: users });
          // return users;
        }
      })
      .catch( (error) => serverError(res, error) );
  
  },

  async register({name, email, role, username, password, confirmPassword}, res) {
    
      await User.findOne({ email })
        .then(async (user) => {
          if (user) { 
            // console.log("Email Already Exist");
            return resourceError(res, "Email Already Exist");
          } else {
            let user = new User({
              name,
              email,
              username,
              role,
              // image: "",
              password,
            });

            var otp = generateOTP();

            const verificaatinToken = new VToken({
              owner: user._id,
              token: otp,
            });

            await verificaatinToken.save();

            mailTrap().sendMail({
              from: "goniusman@offenta.com",
              // from: 'goniusman400@gmail.com',
              to: user.email,
              subject: "Verify Your Email Account",
              html: generateHTMLTemplate(otp),
            });

            await user
              .save()
              .then((user) => {
                // console.log(user);
                return res.status(200).json({
                  success: true,
                  message: "User Created Successfully",
                  data: user,
                });
              })
              .catch((error) => serverError(res, error));
          }
        })
        .catch((error) => serverError(res, error));
    
  },

  async verifyEmail( res, userId, otp) {
 
    if ( await !isValidObjectId(userId)) return resourceError(res, "Invalid user id!");

    const user = await User.findById(userId);
    if (!user) return resourceError(res, "Sorry, user not found f!");

    if (user.verified) return resourceError(res, "this account is already verifyied!");

    const token = await VToken.findOne({ owner: user._id });
    // console.log(token)
    if (!token) return resourceError(res, "Sorry user token not Found!");
    // console.log(token)

    const isMatched = await token.compareToken(otp);
    console.log(isMatched)
    if (!isMatched) return resourceError(res, "please provide a valid token!");

    //// the exact error is here
    user.verified = true; 
    // await user.save()
    await User.findOneAndUpdate({ _id: userId }, { $set: user }, { new: true });

    mailTrap().sendMail({
      from: "goniusman@offenta.com",
      // from: 'goniusman400@gmail.com',
      to: user.email,
      subject: "Email Verified",
      html: plainEmailTemplate(
        "Email Verified Successfully",
        "Thanks for contacting with us"
      ),
    });

    await VToken.findByIdAndDelete(token._id);

    return res.json({ success: true, message: "Verified Email Account", user: user });

  },

  async forgotPassword(res, email) {
 
    const user = await User.findOne({ email });
    if (!user) return resourceError(res, "User not found");

    const token = await RToken.findOne({ owner: user._id });
    //  if(token) return resourceError(res, "Only after one hour you can request for another token")

    const randomBytes = await createRandomByte();
    const rtoken = new RToken({ owner: user._id, token: randomBytes });
    await rtoken.save();

    mailTrap().sendMail({
      from: "goniusman@offenta.com",
      // from: 'goniusman400@gmail.com',
      to: user.email,
      subject: "Forgot Password",
      html: generatePasswordResetTemplate(
        `http://localhost:5000/reset-password?token=${randomBytes}&id=${user._id}`
      ),
    });

    return res.json({ success: true, message: "Please check your email" });
  },

  async resetPassword(res, password, id) {

    const user = await User.findById(id);
    if (!user) return resourceError(res, "User not found");

    const isSamePassword = await user.comparePassword(password);
    if (isSamePassword)
      return resourceError(res, "new password must be defferent");

    if (password.trim().length < 6 || password.trim().length > 20)
      return resourceError(res, "password must be 6 to 20 characters");

    user.password = password.trim();
    await user.save();

    await RToken.findOneAndDelete({ owner: user._id });

    mailTrap().sendMail({
      from: "goniusman@offenta.com",
      // from: 'goniusman400@gmail.com',
      to: user.email,
      subject: "Password Reset Successfully",
      html: plainEmailTemplate(
        "Password Reset Successfully",
        "Now you can login with new password"
      ),
    });

   return res.json({ success: true, message: " Password reset sucessfully" });
  },

  async login( res, email, password) {
 

   await User.findOne({ email })
      .then((user) => {
        if (!user) return resourceError(res, "User Not Found");
        
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return serverError(res, err);

          if (!result) return resourceError(res, "Password Doesn't Match");

          let token = jwt.sign(
            {
              _id: user._id,
              name: user.name,
              email: user.email,
              username: user.username,
              role: user.role,
            },
            "SECRET",
            { expiresIn: "1d" }
          );

          let oldTokens = user.tokens || [];

          if (oldTokens.length) {
            oldTokens = oldTokens.filter((t) => {
              const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
              if (timeDiff < 86400) {
                return t;
              }
            });
          }

          User.findByIdAndUpdate(user._id, {
            tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
          })
            .then((result) => {
              // res.status(201).json({
              //   { success: true }
              // });
            })
            .catch((error) => serverError(res, error));
          delete user.password;
          return res.json({ success: true, user: user, token });
        
        });
      })
      .catch((error) => serverError(res, error));

    // Generate Token and Response Back
  },

  async forgotPasswordallUser(req, res) {
    await User.find()
      .then((users) => {
        console.log(users);
        if (!users) {
          resourceError(res, "There is no users");
        }
        return res.status(200).json(users);
      })
      .catch((error) => serverError(res, error));
  },

  async imageUpload(res, user, filePath) {

    // cloudinary uploader
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    // console.log(result);

    try {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { image: result.url },
        { new: true }
      );

      return res
        .status(201)
        .json({ success: true, message: "Your profile has updated!" });

    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "server error, try after some time", error });
    }

  },

  logOut( res, tokens) {

      const newTokens = tokens.filter((t) => t.token !== token);
      User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res.json({ success: true, message: "Sign out successfully!" });
    
  },

};
