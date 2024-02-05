const router = require("express").Router();
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require("../middlewares/validation/user");

// const { isAuth } = require("../middlewares/auth");
const { isResetTokenValid } = require("../middlewares/user");
const authenticate = require("../../../authenticate");
const {
  login,
  register,
  allUser,
  getSingleUser,
  imageUpload,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resend,
  updateProfile,
  deleteUser
} = require("../controllers/userController");

const upload = require("../utils/upload");

router.get("/all", allUser);
router.get("/single", authenticate, getSingleUser);
router.post("/register", validateUserSignUp, userVlidation, register);
router.post("/login", validateUserSignIn, userVlidation, login);
router.post("/resend", authenticate, resend);
router.put("/verify-email", authenticate, verifyEmail);
router.put("/profile-picture", authenticate, upload.single("profile_picture"), imageUpload );
router.put("/update-profile", authenticate, updateProfile );
router.post("/forgot-password", authenticate, forgotPassword);
router.put("/reset-password/:token/:id", isResetTokenValid, resetPassword);
router.delete("/delete/:id", authenticate, deleteUser);
router.post("/logout", authenticate, logOut);
 
module.exports = router;
