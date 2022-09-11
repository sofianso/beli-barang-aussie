const bcrypt = require("bcryptjs");
const Order = require("../../models/order");
const Product = require("../../models/product");
const User = require("../../models/user");

const transformOder = (order) => {
    return {
        ...order._doc,
        _id: order.id,
        creator: user.bind(this, order.creator),
    };
};

const orders = async(orderIds) => {
    try {
        const orders = await Order.find({ _id: { $in: orderIds } });
        return orders.map((order) => {
            return transformOder(order);
        });
    } catch (err) {
        throw err;
    }
};

const singleOrder = async(orderId) => {
    try {
        const order = await Order.findById(orderId);
        return {
            ...order._doc,
            _id: order.id,
            creator: user.bind(this, order.creator),
        };
    } catch (err) {
        throw err;
    }
};

const user = async(userId) => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdOrders: orders.bind(this, user._doc.createdOrders),
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    orders: async() => {
        try {
            // adding return tells the function to wait and return (async) the order that was saved to the database
            // Explanation for this resolver can be found REF[1] in README.md
            const orders = await Order.find();
            return orders.map((order) => {
                // The _id cannot be returned because it is an ObjectID and not a string.
                // Thus, the _id needs to be converted to a string and returned for it to work in GraphQL Playground.
                return {
                    ...order._doc,
                    _id: order.id,
                    orderNumber: order.orderNumber,
                    orderStatus: order.orderStatus,
                    orderTotal: order.orderTotal,
                    createdAt: new Date(order._doc.createdAt).toISOString(),
                    updatedAt: new Date(order._doc.updatedAt).toISOString(),
                    products: product.bind(this, order._doc.products),
                    creator: user.bind(this, order._doc.creator),
                };
            });
        } catch (err) {
            throw err;
        }
    },

    products: async() => {
        try {
            const products = await Product.find();
            return products.map((product) => {
                return {
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
            });
        } catch (err) {
            throw err;
        }
    },

    createUser: async(args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error("User exists already.");
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                firstName: args.userInput.firstName,
                lastName: args.userInput.lastName,
            });

            const result = await user.save();
            // this return statement is necessary to prevent password from being returned in GraphQL Playground
            return {...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },

    createOrder: async(args) => {
        // const fetchedProducts = await Product.find({
        //     _id: { $in: args.orderInput.products },
        // });
        const order = new Order({
            orderNumber: args.orderInput.orderNumber,
            orderStatus: "Received",
            orderTotal: 1000,
            // products: fetchedProducts,
            creator: "63038eb417239296eeb02cd5",
        });

        // order.save() is a mongoose method that saves the order to the database
        // adding return tells the function to wait and return (async) the order that was saved to the database
        const result = await order.save();
        return {
            ...result._doc,
            _id: result._doc._id.toString(),
            orderNumber: result.orderNumber,
            orderStatus: result.orderStatus,
            orderTotal: result.orderTotal,
            creator: user.bind(this, result._doc.creator),
        };
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
                productName: "iPhone 12",
                productDescription: "Apple iPhone 12",
                productPrice: 1000,
                productQuantity: 100,
                onSale: false,
                outOfStock: false,

                // productName: args.productInput.productName,
                // productDescription: args.productInput.productDescription,
                // productPrice: args.productInput.productPrice,
                // productQuantity: args.productInput.productQuantity,
                // onSale: args.productInput.onSale,
                // outOfStock: args.productInput.outOfStock,
            });
            const result = await product.save();
            return {
                ...result._doc,
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
        } catch (err) {
            throw err;
        }
    },

    deleteProduct: async(args) => {
        try {
            const product = await Product.findById(args.productId);
            await Product.deleteOne({ _id: args.productId });
            return {
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
        } catch (err) {
            throw err;
        }
    },

    cancelOrder: async(args) => {
        try {
            const order = await Order.findById(args.orderId).populate("order");
            const product = {
                ...order.product_doc,
                _id: order.product.id,
                creator: user.bind(this, order.product._doc.creator),
            };
            await Order.deleteOne({ _id: args.orderId });
            return product;
        } catch (err) {
            throw err;
        }
    },
};