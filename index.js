require("dotenv").config();

const express = require("express");
const connect = require("./src/utils/db/connect.js");
const cors = require("cors");
const createError = require("./src/utils/errors/create-error.js");
const passport = require("passport");
const userRouter = require("./src/routes/user.js");
const productRoutes = require("./src/routes/product.js");
const orderRoutes = require("./src/routes/order.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const DB_URL = process.env.MONGODB_URI;

connect();

const PORT = process.env.PORT || 3000;
const server = express();

// Setea la variable a nivel de nuestra aplicación, haciéndola recuperable desde la request
// - Clave
// - Valor
server.set("secretKey", process.env.JWT_SECRET_KEY);

server.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true);
    },
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Inicializar y configurar passport
// Ejecuta el archivo de passport
require("./src/utils/authentication/passport.js");

// Creamos gestión de sesiones
// Recibe config de la sesión
server.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DB_URL,
    }),
  })
);

// Inicializa passport
server.use(passport.initialize());
// Utilizamos la sesión con passport
server.use(passport.session());

// Rutas
server.use("/api/user", userRouter);
server.use("/api/product", productRoutes);
server.use("/api/order", orderRoutes);

// * --> Cualquier ruta que no haya sido identificada en los anteriores server use entrará por aquí
server.use("*", (req, res, next) => {
  next(createError("Esta ruta no existe", 404));
});

// Manejo de errores
// Además de los típicos req, res y next se añade un parámetro error
// - Error: error emitido desde el paso previo del servidor
server.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || "Unexpected error");
});

server.listen(PORT, () => {
  console.log(`El servidor está escuchando en http://localhost:${PORT}`);
});
