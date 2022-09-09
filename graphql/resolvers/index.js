const bcrypt = require("bcryptjs");
const Order = require("../../models/order");
const User = require("../../models/user");

const orders = async(orderIds) => {
    try {
        const orders = await Order.find({ _id: { $in: orderIds } });
        orders.map((order) => {
            return {
                ...order._doc,
                _id: order.id,
                creator: user.bind(this, order.creator),
            };
        });
        return orders;
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
                    creator: user.bind(this, order._doc.creator),
                };
            });
        } catch (err) {
            throw err;
        }
    },

    createOrder: async(args) => {
        const order = new Order({
            orderNumber: args.orderInput.orderNumber,
            orderStatus: args.orderInput.orderStatus,
            orderTotal: args.orderInput.orderTotal,
            creator: "63038eb417239296eeb02cd5",
        });
        // order.save() is a mongoose method that saves the order to the database
        // adding return tells the function to wait and return (async) the order that was saved to the database
        let createdOrder;
        try {
            const result = await order.save();
            createdOrder = {
                ...result._doc,
                _id: result._doc._id.toString(),
                orderNumber: result.orderNumber,
                orderStatus: result.orderStatus,
                orderTotal: result.orderTotal,
                creator: user.bind(this, result._doc.creator),
            };
            const creator = await User.findById("63038eb417239296eeb02cd5");

            if (!creator) {
                throw new Error("User not found");
            }
            console.log("created orders", creator.createdOrders);
            if (creator.createdOrders) {
                creator.createdOrders.push(order);
                await creator.save();
            }
            console.log("after created orders", creator.createdOrders);


            return createdOrder;
        } catch (err) {
            console.log(err);
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

            return {...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },
};