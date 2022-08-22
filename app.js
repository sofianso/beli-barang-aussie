const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Order = require("./models/order");
const User = require("./models/user");

const app = express();

app.use(bodyParser.json());

app.use(
    "/graphql",
    graphqlHTTP({
        schema: buildSchema(`
        type Order{
            _id: ID!
            orderNumber: String!
            orderStatus: String!
            orderTotal: Float!
            dateOrdered: String!
        }
        type User{
            _id: ID!
            email: String!
            password: String
            firstName: String!
            lastName: String!
        }
        input OrderInput{
            orderNumber: String
            orderStatus: String
            orderTotal: Float!
            dateOrdered: String!
        }
        input UserInput{
            email: String!
            password: String!
            firstName: String!
            lastName: String!
        }
        
        type RootQuery {
            orders: [Order!]!
        }
        type RootMutation {
            createOrder(orderInput: OrderInput): Order
            createUser(userInput: UserInput): User
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }`),
        rootValue: {
            orders: () => {
                // adding return tells the function to wait and return (async) the order that was saved to the database
                // Explanation for this resolver can be found REF[1] in README.md
                return Order.find()
                    .then((orders) => {
                        return orders.map((order) => {
                            // The _id cannot be returned because it is an ObjectID and not a string.
                            // Thus, the _id needs to be converted to a string and returned for it to work in GraphQL Playground.
                            return {...order._doc, _id: order.id };
                        });
                    })
                    .catch((err) => {
                        throw err;
                    });
            },
            createOrder: (args) => {
                const order = new Order({
                    orderNumber: args.orderInput.orderNumber,
                    orderStatus: args.orderInput.orderStatus,
                    orderTotal: args.orderInput.orderTotal,
                    dateOrdered: new Date(args.orderInput.dateOrdered),
                    user: "63038eb417239296eeb02cd5",
                });
                console.log(order);
                // order.save() is a mongoose method that saves the order to the database
                // adding return tells the function to wait and return (async) the order that was saved to the database
                let createdOrder;
                return order
                    .save()
                    .then((result) => {
                        createdOrder = {...result._doc, _id: result._doc._id.toString() };
                        // console.log(createdOrder);
                        return User.findById("63038eb417239296eeb02cd5");
                    })
                    .then((user) => {
                        if (!user) {
                            throw new Error("User not found");
                        }
                        user.createdOrders.push(order);
                        return user.save();
                    })
                    .then((result) => {
                        return createdOrder;
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            },
            createUser: (args) => {
                return User.findOne({ email: args.userInput.email })
                    .then((user) => {
                        if (user) {
                            throw new Error("User already exists");
                        }
                        return bcrypt.hash(args.userInput.password, 12);
                    })
                    .then((hashedPassword) => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword,
                            firstName: args.userInput.firstName,
                            lastName: args.userInput.lastName,
                        });
                        return user.save();
                    })
                    .then((result) => {
                        // By setting the password as null, it guarantees that no one can access the password
                        return {...result._doc, password: null, _id: result.id };
                    })
                    .catch((err) => {
                        throw err;
                    });
            },
        },
        graphiql: true,
    })
);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@beli-barang-aussie-clus.likuxby.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    // The above function is a promise that will resolve if the connection is successful or reject if it fails.
    .then(() => {
        app.listen(4000);
    })
    .catch((err) => {
        console.log(err);
    });