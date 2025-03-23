import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Fake DB
let tweets = [
  {
    id: "1",
    text: "first one",
  },
  {
    id: "2",
    text: "second one",
  },
];

let users = [
  {
    id: "1",
    firstName: "vero",
    lastName: "beach",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];

const typeDefs = `#graphql
  type User{
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation{
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean! 
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(_, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    // 1. allUsers()가 호출됨. Query Type에 따르면 allUsers는 User Type의 리스트를 반환해야 함.
    allUsers() {
      console.log("all users called!");
      return users; // 2. users를 반환하려고 보니 fullName이 없음. User Resolver가 있는지 찾아봄.
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  // 3. User Resolver가 있으므로 실행
  User: {
    // fullName(root) {
    //  console.log(root); // root는 Resolver Function의 첫번째 인자로 들어옴
    fullName({ firstName, lastName }) {
      console.log("fullname called!");
      return `${firstName} ${lastName}`; // 4. fullName 값을 생성하여 항상 존재하게 되므로 에러를 발생시키지 않게 됨
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀Server is running on: ${url}`);
