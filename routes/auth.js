var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/auth/google/callback",
      scope: ["profile","email"],
      // state: true,

    },
    function verify(issuer, profile, cb) {
      const prf = profile?._json

      return cb(null, profile);

    }
  )
);
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

var router = express.Router();

router.get("/login", function (req, res, next) {
  res.render("login");
  console.log({req})
});
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // console.log({ req });
    res.redirect('http://localhost:3000/');
  }
);
router.get("/login/federated/google", passport.authenticate("google"));

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
