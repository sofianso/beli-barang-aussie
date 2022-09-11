const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Order{
    _id: ID!
    orderNumber: String!
    orderStatus: String!
    orderTotal: Float!
    creator: User!
    products: [Product!]!
}
type Product{
    _id: ID!
    productName: String!
    productDescription: String!
    productPrice: Float!
    productQuantity: Int!
    onSale: Boolean!
    outOfStock: Boolean!
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
input ProductInput{
    productName: String!
    productDescription: String!
    productPrice: Float!
    productQuantity: Int!
    onSale: Boolean!
    outOfStock: Boolean!
    createdAt: String
    updatedAt: String
}

input UserInput{
    email: String!
    password: String!
    firstName: String!
    lastName: String!
}

type RootQuery {
    orders: [Order!]!
    products: [Product!]!
}
type RootMutation {
    createUser(userInput: UserInput): User
    createOrder(orderInput: OrderInput): Order
    cancelOrder(orderId: ID!): Order
    createProduct(productInput: ProductInput): Product
    deleteProduct(productId: ID!): Product
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);