const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Order{
    _id: ID!
    orderNumber: String!
    orderStatus: String!
    orderTotal: Float!
    creator: User!
}
type User{
    _id: ID!
    email: String!
    password: String
    firstName: String!
    lastName: String!
    createdOrders: [Order!]
}
input OrderInput{
    orderNumber: String
    orderStatus: String
    orderTotal: Float!
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
schema {
    query: RootQuery
    mutation: RootMutation
}
`);