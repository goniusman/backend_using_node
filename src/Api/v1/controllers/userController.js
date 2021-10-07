const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cloudinary = require('../helper/imageUpload');
const User = require("../models/User");
const registerValidator = require("../validator/registerValidator");
const loginValidator = require("../validator/loginValidator");

const { serverError, resourceError } = require("../utils/error");

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
