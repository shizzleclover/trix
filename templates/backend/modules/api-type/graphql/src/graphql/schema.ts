export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
    createdAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    hello: String!
  }

  type Mutation {
    createUser(email: String!, name: String): User!
    updateUser(id: ID!, name: String): User
    deleteUser(id: ID!): Boolean!
  }
`;
