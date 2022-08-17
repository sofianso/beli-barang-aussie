const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Order = require("./models/orders");

const app = express();

app.use(bodyParser.json());

// the array stores the data in memory for testing purposes
const orders = [];

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
        input OrderInput{
            orderNumber: String
            orderStatus: String
            orderTotal: Float!
            dateOrdered: String!
        }
        
        type RootQuery {
            orders: [Order!]!
        }
        type RootMutation {
            createOrder(orderInput: OrderInput): Order
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
                });
                console.log(order);
                // order.save() is a mongoose method that saves the order to the database
                // adding return tells the function to wait and return (async) the order that was saved to the database
                return order
                    .save()
                    .then((result) => {
                        console.log(result);
                        return {...result._doc, _id: order.id };
                        // return {...result._doc, _id: order._doc._id.toString() };
                        // return result;
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
                return order;
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