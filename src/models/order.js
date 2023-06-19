const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    items: {
      type: JSON,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

const order = mongoose.model("orders", orderSchema);
module.exports = order;
