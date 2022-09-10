const mongoose = require("mongoose");
// mongoose.Schema is a constructor function
const Schema = mongoose.Schema;

// You want to match the schema in MongoDB to be the same as the
const productSchema = new Schema({
    productDescription: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productImage: {
        type: String,
    },
});

module.exports = mongoose.model("Products", productSchema);