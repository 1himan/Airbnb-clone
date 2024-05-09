const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  signup,
  renderSignupForm,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/users.js");

//* Get and Post req to render and submit signup form respectively
router.route("/signup").get(renderSignupForm).post(wrapAsync(signup));

//* Get and Post req to render and submit login form respectively
router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  );

//* req to logout
router.get("/logout", logout);

module.exports = router;
