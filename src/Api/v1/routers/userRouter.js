const router = require("express").Router();
<<<<<<< HEAD
const path = require("path");
=======
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
>>>>>>> a421d478fd261ae99178570cd2769481f0243193
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require('../middlewares/validation/user');

const { isAuth } = require('../middlewares/auth');
const { isResetTokenValid } = require('../middlewares/user');

const {
  login,
  register,
  allUser,
  imageUpload,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/userController");

const multer = require('multer');

const storage = multer.diskStorage({});

// const storage = multer.diskStorage({
  
//   destination: function (request, file, callback) {
//     // const dir =  "./uploads";
//     const root = path.resolve('./')
//     // return;
//       callback(null, `${root}/uploads/`);
//   },
//   filename: function (request, file, callback) {
//       console.log(file);
//       callback(null, file.originalname)
//   }
// });


const fileFilter = (req, file, cb) => {

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    // console.log(file)
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};



const upload = multer({ storage, fileFilter, limits: { fieldSize: 10 * 1024 * 1024 } });

// Registration Route
router.post("/register", validateUserSignUp, userVlidation, register);
// Login Route
router.post("/login", validateUserSignIn, userVlidation, login);
// all user route
router.get("/all", isAuth,   allUser);
router.post("/verify-email",  verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", isResetTokenValid, resetPassword);

// upload images
router.post("/profile-picture", isAuth,  upload.single('feturedimage'),  imageUpload);


// router.post('/profile-picture', upload.single('featuredImage') function (req, res) {

//   console.log(req.body) // form fields
//   console.log(req.file) // form files
//   res.status(204).end()
// })


// logout
router.post("/logout", isAuth, logOut);

module.exports = router;
