const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");

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
            orderNumber: String
            orderStatus: String
        }
        input OrderInput{
            orderNumber: String
            orderStatus: String
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
                return orders;
            },
            createOrder: (args) => {
                const order = {
                    _id: Math.random().toString(),
                    // you have to add orderInput since it is nested
                    orderNumber: args.orderInput.orderNumber,
                    orderStatus: args.orderInput.orderStatus,
                };
                console.log(order);
                orders.push(order);
                return order;
            },
        },
        graphiql: true,
    })
);

app.listen(4000);