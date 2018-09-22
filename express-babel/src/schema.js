import { gql } from "apollo-server-core";

// The GraphQL schema
export const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;

// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    hello: () => 'world'
  }
};