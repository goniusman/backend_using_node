const router = require("express").Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
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

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, file.originalname);
  } else {
    cb('invalid image file!', false);
  }
};

// const storage = multer.diskStorage({
//   destination: function (request, file, callback) {
//       callback(null, './uploads');
//   },
//   filename: function (request, file, callback) {
//       callback(null, Date.now()+"-"+file.originalname)
//   }
// });



// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'some-folder-name',
//     format: async (req, file) => 'jpg', // supports promises as well
//     public_id: (req, file) => console.log(file),
//   },
// });




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
router.post("/profile-picture", isAuth,  upload.single('featuredImage'), imageUpload);


// router.post('/profile-picture', upload.single('featuredImage') function (req, res) {

//   console.log(req.body) // form fields
//   console.log(req.file) // form files
//   res.status(204).end()
// })


// logout
router.post("/logout", isAuth, logOut);

module.exports = router;
