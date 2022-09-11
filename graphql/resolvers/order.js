const Order = require("../../models/order");
const { transformOrder } = require("./merge");

module.exports = {
    orders: async() => {
        try {
            // adding return tells the function to wait and return (async) the order that was saved to the database
            // Explanation for this resolver can be found REF[1] in README.md
            const orders = await Order.find();
            return orders.map((order) => {
                return transformOrder(order);
            });
        } catch (err) {
            throw err;
        }
    },

    createOrder: async(args) => {
        const order = new Order({
            orderNumber: args.orderInput.orderNumber,
            orderStatus: "Received",
            orderTotal: 1000,
            creator: "63038eb417239296eeb02cd5",
        });
        // order.save() is a mongoose method that saves the order to the database
        // adding return tells the function to wait and return (async) the order that was saved to the database
        const result = await order.save();
        return transformOrder(result);
    },

    cancelOrder: async(args) => {
        try {
            const order = await Order.findById(args.orderId).populate("product");
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