const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const createError = require("../utils/errors/create-error");
const bcrypt = require("bcrypt");
const getJWT = require("../utils/authentication/jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", (req, res, next) => {
  const done = (err, user) => {
    if (err) {
      return next(err);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json(user);
    });
  };

  passport.authenticate("register", done)(req);
});

userRouter.post("/login", (req, res, next) => {
  const done = (err, user) => {
    if (err) {
      return next(err);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json(user);
    });
  };

  passport.authenticate("login", done)(req);
});

userRouter.post("/logout", (req, res, next) => {
  if (req.user) {
    // Desloguea al usuario y destruye el objeto req.user
    // - Callback una vez se haya hecho logout
    req.logOut(() => {
      // Nos permite destruir la sesión
      // - Callback que se ejecuta una vez haya sido destruida la sesión
      req.session.destroy(() => {
        // Limpia la cookie con el id indicado al llegar a cliente
        res.clearCookie("connect.sid");
        return res.status(200).json("Hasta luego!");
      });
    });
  } else {
    return res.status(304).json("No hay un usuario logueado en este momento");
  }
});

module.exports = userRouter;
