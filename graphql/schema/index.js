const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String
    createdAt: String!
    updatedAt: String!
  }

  type UserInput {
    name: String!
    email: String!
    password: String!
  }
  type RootQuery {

  }

  type RootMutation {
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
