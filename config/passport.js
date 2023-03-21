const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  // local
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      (req, email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(
                null,
                false,
                req.flash("warning_msg", "That email is not registered!")
              );
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                return done(
                  null,
                  false,
                  req.flash("warning_msg", '"Email or Password incorrect."')
                );
              }
              return done(null, user);
            });
          })
          .catch((err) => done(err, false));
      }
    )
  );
  // facebook
  passport.use(
    new FacebookStrategy(
      {
        clientID: '162675526662899',
        clientSecret: '0721a307145e8245a1d582d63872d674',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ["email", "displayName"],
      },
      (accessToken, refreshToken, profile, done) => {
        // 利用 console.log(profile) 找 profile._json.email
        const { name, email } = profile._json;
        User.findOne({ email }).then((user) => {
          if (user) return done(null, user);
          // 隨機 0-1 轉換成 36進位的 a-z, 0-9 且只取後8位
          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt))
            .then((hash) =>
              User.create({
                name,
                email,
                password: hash,
              })
            )
            .then((user) => {
              done(null, user);
            })
            .catch((err) => {
              done(err, false);
            });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};