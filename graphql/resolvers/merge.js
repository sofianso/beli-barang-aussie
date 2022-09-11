const Order = require("../../models/order");
const Product = require("../../models/product");
const { dateToString } = require("../../helpers/date");

const transformOrder = (order) => {
    return {
        ...order._doc,
        _id: order.id,
        product: singleProduct.bind(this, order._doc.product),
        createdAt: dateToString(order._doc.createdAt),
        updatedAt: dateToString(order._doc.updatedAt),
        creator: user.bind(this, order.creator),
    };
};

const transformProduct = (product) => {
    // The _id cannot be returned because it is an ObjectID and not a string.
    // Thus, the _id needs to be converted to a string and returned for it to work in GraphQL Playground.
    return {
        ...product._doc,
        _id: product.id,
        productBrand: product.productBrand,
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        productQuantity: product.productQuantity,
        onSale: product.onSale,
        outOfStock: product.outOfStock,
        createdAt: dateToString(product._doc.createdAt),
        updatedAt: dateToString(product._doc.updatedAt),
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

const product = async(productId) => {
    try {
        const product = await Product.findById(productId);
        return {
            ...product._doc,
            _id: product.id,
            createdOrders: orders.bind(this, product._doc.createdOrders),
        };
    } catch (err) {
        throw err;
    }
};

exports.transformOrder = transformOrder;
exports.transformProduct = transformProduct;