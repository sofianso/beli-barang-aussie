const Product = require("../../models/order");
const { transformProduct } = require("./merge");

module.exports = {
    products: async() => {
        try {
            const products = await Product.find();
            return products.map((product) => {
                return transformProduct(product);
            });
        } catch (err) {
            throw err;
        }
    },

    createProduct: async(args) => {
        try {
            const existingProduct = await Product.findOne({
                productName: args.productInput.productName,
            });
            if (existingProduct) {
                throw new Error("Product exists already.");
            }
            const product = new Product({
                // productName: "iPhone 14",
                // productDescription: "Apple iPhone 12",
                // productPrice: 1000,
                // productQuantity: 100,
                // onSale: false,
                // outOfStock: false,
                productBrand: args.productInput.productBrand,
                productName: args.productInput.productName,
                productDescription: args.productInput.productDescription,
                productPrice: args.productInput.productPrice,
                productQuantity: args.productInput.productQuantity,
                onSale: args.productInput.onSale,
                outOfStock: args.productInput.outOfStock,
                createdAt: new Date(args.productInput.createdAt),
                updatedAt: new Date(args.productInput.updatedAt),
            });
            const result = await product.save();
            console.log(result);
            return transformProduct(product);
        } catch (err) {
            throw err;
        }
    },

    deleteProduct: async(args) => {
        try {
            // const id = "631d9bb5026fa5d3b31b4b3d";
            const existingProductId = await Product.findById(args.productId);
            console.log(existingProductId);
            if (!existingProductId) {
                throw new Error("Product ID doesn't exist.");
            }
            const product = {
                ...product._doc,
                _id: product.id,
                productName: product.productName,
                productDescription: product.productDescription,
                productPrice: product.productPrice,
                productQuantity: product.productQuantity,
                onSale: product.onSale,
                outOfStock: product.outOfStock,
                createdAt: new Date(product._doc.createdAt).toISOString(),
                updatedAt: new Date(product._doc.updatedAt).toISOString(),
            };
            await Product.deleteOne({ _id: args.productId });
            return product;
        } catch (err) {
            throw err;
        }
    },
};