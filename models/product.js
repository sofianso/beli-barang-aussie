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
    onSale: {
        type: Boolean,
        required: true,
    },
    outOfStock: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);