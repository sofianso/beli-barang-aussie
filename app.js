const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const schemas = require("./graphql/schemas/index");
const resolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schemas,
        rootValue: resolvers,
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