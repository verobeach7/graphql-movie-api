import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// !: Non Nullable Fields
// !가 없으면 기본적으로 Nullable임. 즉, Null 값이 허용됨.
const typeDefs = `#graphql
  type User{
    id: ID!
    username: String!
    firstName: String!
    lastName: String # Nullable
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet # Nullable
  }
  type Mutation{
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean! 
  }
`;

const server = new ApolloServer({ typeDefs });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀Server is running on: ${url}`);
