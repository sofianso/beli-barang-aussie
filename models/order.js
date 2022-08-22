const mongoose = require("mongoose");
// mongoose.Schema is a constructor function
const Schema = mongoose.Schema;

// You want to match the schema in MongoDB to be the same as the
const orderSchema = new Schema({
    orderNumber: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
    },
    orderTotal: {
        type: Number,
        required: true,
    },
    dateOrdered: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Order", orderSchema);