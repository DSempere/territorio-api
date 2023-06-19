const express = require("express");
const productSchema = require("../models/product");

const router = express.Router();

router.get("/all", (req, res) => {
  productSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
