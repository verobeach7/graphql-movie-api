import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

let tweets = [
  {
    id: "1",
    text: "first one",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
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
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]! # 3. Tweet Type의 리스트를 반환
    tweet(id: ID!): Tweet
  }
  type Mutation{
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else return false
    """
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
    allUsers() {
      console.log("all users called!");
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      try {
        const user = users.find((user) => user.id === userId);
        if (!user) throw new Error(`User ID ${userId} is not found.`);
        else {
          const newTweet = {
            id: tweets.length + 1,
            text,
            userId,
          };
          tweets.push(newTweet);
          return newTweet;
        }
      } catch (e) {
        console.log(e);
      }
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      console.log("fullname called!");
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀Server is running on: ${url}`);
