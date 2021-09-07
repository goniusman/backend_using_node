const router = require("express").Router();
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require('../middlewares/validation/user');

const { isAuth } = require('../middlewares/auth');

const {
  login,
  register,
  allUser,
  imageUpload,
  logOut,
} = require("../controllers/userController");

const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};

const uploads = multer({ storage, fileFilter });

// Registration Route
router.post("/register", validateUserSignUp, userVlidation, register);
// Login Route
router.post("/login", validateUserSignIn, userVlidation, login);
// all user route
router.get("/all", allUser);
// upload images
router.post("/profile-picture", uploads.single('profile'), isAuth,  imageUpload);
// logout
router.post("/logout", isAuth, logOut);

module.exports = router;
