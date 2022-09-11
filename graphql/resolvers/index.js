const orderResolver = require("./order");
const productResolver = require("./product");
const userResolver = require("./user");

const rootResolver = {
    ...orderResolver,
    ...productResolver,
    ...userResolver,
};

module.exports = rootResolver;