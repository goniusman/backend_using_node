const router = require("express").Router();
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require("../middlewares/validation/user");

const { isAuth } = require("../middlewares/auth");
const { isResetTokenValid } = require("../middlewares/user");

const {
  login,
  register,
  allUser,
  imageUpload,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const upload = require("../utils/upload");
router.get("/all", allUser);
router.post("/register", validateUserSignUp, userVlidation, register);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token/:id", isResetTokenValid, resetPassword);
router.post("/login", validateUserSignIn, userVlidation, login);
router.post("/logout", isAuth, logOut);
router.post("/profile-picture", isAuth, upload.single("feturedimage"), imageUpload );


module.exports = router;
