const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const crypto = require("crypto");


const cloudinary = require('../helper/imageUpload');
const User = require("../models/User");
const VToken = require("../models/VToken");
const RToken = require("../models/RToken");
const registerValidator = require("../validator/registerValidator");
const loginValidator = require("../validator/loginValidator");

const { serverError, resourceError } = require("../utils/error");
const { createRandomByte } = require("../utils/helper");
const { generateOTP, mailTrap, generateHTMLTemplate, plainEmailTemplate, generatePasswordResetTemplate } = require("../utils/mail");

// login controller
module.exports = {

  register(req, res) {
    let { name, email, role,username, password, confirmPassword } = req.body;
    console.log(req.body);
    let validate = registerValidator({
      name,
      email,
      username,
      password,
      confirmPassword,
    });

    if (!validate.isValid) {
      return res.json({ success: false,message: "Empty Value", data: validate.error });
    } else {
      User.findOne({ email })
        .then((user) => {
          if (user) {
            return resourceError(res, "Email Already Exist");
          }

          bcrypt.hash(password, 11, (err, hash) => {
            if (err) {
              return resourceError(res, "Server Error Occurred");
            }

            let user = new User({
              name,
              email,
              username,
              role,
              // image: "",
              password: hash,
            });


          

          var ot = generateOTP();
  
          const verificaatinToken = new VToken({
            owner: user._id,
            token: ot
          })

          verificaatinToken.save()
 
          mailTrap().sendMail({ 
            from: 'goniusman@offenta.com',
            // from: 'goniusman400@gmail.com',
            to: user.email,
            subject: "Verify Your Email Account",
            html: generateHTMLTemplate(ot)
          })

          user
            .save()
            .then((user) => {
              return res.json({ success: true,message: "User Created Successfully", data: user });
            })
            .catch((error) => serverError(res, error));
          });
        })
        .catch((error) => serverError(res, error));
    }
  }, 

  async verifyEmail(req,res){

    const {userId, otp} = req.body 

    if(!userId || !otp.trim() ) return resourceError(res, "Invalid request, missing parameters!")

    if(!isValidObjectId(userId)) return resourceError(res, "Invalid user id!")

    const user = await User.findById(userId)
    if(!user) return resourceError(res, "Sorry, user not found f!")

    if(user.verified) return resourceError(res, "this account is already verifyied!")
  
    const token = await VToken.findOne({owner: user._id})
    // console.log(token)
    if(!token) return resourceError(res, "Sorry user token not Found!")
    // console.log(token)

    const isMatched = await token.compareToken(otp)
    console.log(isMatched)
    if(!isMatched) return resourceError(res, "please provide a valid token!")

    user.verified = true;

    await user.save()

    mailTrap().sendMail({ 
      from: 'goniusman@offenta.com',
      // from: 'goniusman400@gmail.com',
      to: user.email,
      subject: "Email Account Verified",
      html: plainEmailTemplate("Email Verified Successfully", "Thanks for contacting with us")
    })

    await VToken.findByIdAndDelete(token._id)

    res.json({success: true, message: 'Verified Email Account', user: user})
    
  },

  async forgotPassword(req, res){
    const {email} = req.body
    if(!email) return resourceError(res, "Please Provide a valid email")

    const user = await User.findOne({email});
    if(!user) return resourceError(res, "User not found")

   const token = await RToken.findOne({owner: user._id});
   //  if(token) return resourceError(res, "Only after one hour you can request for another token")

   const randomBytes = await createRandomByte()
   const rtoken = new RToken({owner: user._id, token: randomBytes})
   await rtoken.save()

   mailTrap().sendMail({ 
    from: 'goniusman@offenta.com',
    // from: 'goniusman400@gmail.com',
    to: user.email,
    subject: "Reset Password",
    html: generatePasswordResetTemplate(`http://localhost:5000/reset-password?token=${randomBytes}&id=${user._id}`)
   })
   
   res.json({success: true, message: "sucessfully reset password"})

  },

  login(req, res) {
    let { email, password } = req.body;
    console.log(req.body);
    let validate = loginValidator({ email, password });

    if (!validate.isValid) {
      return res.json({ success: false,message: "Empty Value", data: validate.error });
    }

    User.findOne({ email })
      .then((user) => {
        if (!user) {
         
          resourceError(res, "User Not Found");
        }
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return serverError(res, err);
          }
          if (!result) {
            return resourceError(res, "Password Doesn't Match");
          }

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
            oldTokens = oldTokens.filter(t => {
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
          // return res.status(200).json({
          //   message: "Login Successful",
          //   token: `Bearer ${token}`,
          // });

        });
      })
      .catch((error) => serverError(res, error));

    // Generate Token and Response Back
  },

  allUser(req, res) {
    User.find()
      .then((users) => { 
        console.log(users) 
        if(!users){
          resourceError(res, 'There is no users');
        }
        return res.status(200).json(users);
      })
      .catch((error) => serverError(res, error));
  },

  async imageUpload(req, res) {

    const { user } = req;

    if(!user){
      return res
      .status(401)
      .json({ success: false, message: 'unauthorized access!' });
    }

    console.log(req.file)
    return res.json({ success: true, message: 'Access granted!' });
    // console.log(req.files)
    //  const result = await cloudinary.uploader.upload(req.files.path, {
    //       public_id: `${user._id}_profile`,
    //       width: 500,
    //       height: 500,
    //       crop: 'fill',
    //     });

      // result.then(re => console.log(re)).catch(err => console.log(err))

      // try { 

      //   const updatedUser = await User.findByIdAndUpdate(
      //     user._id,
      //     { image: result.url },
      //     { new: true }
      //   );

      //  return res
      //     .status(201)
      //     .json({ success: true, message: 'Your profile has updated!' });

      // } catch (error) {
      //   return res
      //     .status(500)
      //     .json({ success: false, message: 'server error, try after some time' });

      //   console.log('Error while uploading profile image', error);
      // }

  },

  logOut(req, res) {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: 'Authorization fail! There is no Authorization token' });
      }
  
      const tokens = req.user.tokens;
  
      const newTokens = tokens.filter(t => t.token !== token);
  
      User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res.json({ success: true, message: 'Sign out successfully!' });
    }
  }
  

};
