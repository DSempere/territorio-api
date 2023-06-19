const express = require("express");
const orderSchema = require("../models/order");
const isAuthPassport = require("../utils/middlewares/auth-passport.middleware.js");

const router = express.Router();

//get order
router.post("/new", [isAuthPassport], (req, res) => {
  const order = orderSchema({ ...req.body, date: new Date(), userId: req.user.id });
  console.log(order)
  order
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//get all
router.get("/all", [isAuthPassport], (req, res) => {
  orderSchema
    .find({ userId: req.user.id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//get order by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  orderSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// delete order
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  orderSchema
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
