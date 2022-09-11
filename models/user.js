const mongoose = require("mongoose");
// mongoose.Schema is a constructor function
const Schema = mongoose.Schema;

// You want to match the schema in MongoDB to be the same as the
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    // A user can have many orders
    // ref is an internal function that mongoose uses to reference the model
    order: { type: Schema.Types.ObjectId, ref: "Order" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);