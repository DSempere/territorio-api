const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../../models/user");

const saltRounds = 10;

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
          const error = new Error("El nombre de usuario ya existe");
          return done(error);
        }

        const pwdHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
          username: username,
          password: pwdHash,
        });

        const savedUser = await newUser.save();

        done(null, savedUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const loginUser = await User.findOne({ username: username });

        if (!loginUser) {
          const error = new Error("El usuario no existe");
          return done(error);
        }

        const isValidPassword = await bcrypt.compare(password, loginUser.password);

        if (!isValidPassword) {
          const error = new Error("El usuario o contraseña no es valido");
          return done(error);
        }

        loginUser.password = null;
        return done(null, loginUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const existingUser = await User.findById(userId);
    return done(null, existingUser);
  } catch (err) {
    return done(err);
  }
});
