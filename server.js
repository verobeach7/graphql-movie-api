import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Fake DB
const tweets = [
  {
    id: "1",
    text: "first one",
  },
  {
    id: "2",
    text: "second one",
  },
];

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
    author: User
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet # Nullable
    ping: String! # Required
  }
  type Mutation{
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean! 
  }
`;

const resolvers = {
  Query: {
    // Query에 만들어 놓은 이름과 반드시 일치해야 함
    // 누군가 tweet Query를 호출한다면 Apollo Server는 tweet()함수를 실행시킴
    // tweet() {
    //   console.log("I'm called");
    //   return null;
    // },
    ping() {
      return "pong";
    },
    allTweets() {
      return tweets;
    },
    // GraphQL Specification에 해당하기 때문에 아래 조건은 무조건 따라야 함
    // resolvers가 실행되면 ApolloServer는 기본으로 root argument를 제공
    // 두번째 argument가 우리가 제공하는 인자에 해당. 쿼리에 넣어 보낸 인자를 자동으로 아폴로 서버가 처리!
    // tweet(root, args){
    // console.log(args);
    // return null;
    // }
    tweet(_, { id }) {
      // root argument를 사용하지 않을 경우 자리표시만 해도 됨. _, __, root 뭐든 상관없음.
      // args 내부의 id만 가져옴
      return tweets.find((tweet) => tweet.id === id);
    },
  },
};

// resolvers를 ApolloServer에 할당
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀Server is running on: ${url}`);
