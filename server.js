import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// package.json에 "type": "module"을 추가하지 않으면 import 대신에 require()를 사용해줘야 함
// const { ApolloServer } = require("apollo-server")
// 위와 같이 사용하는 것보다 import를 사용하는 것이 좋음
const graphql = String.raw;

const typeDefs = `#graphql
  type User{
    id: ID
    username: String
  }
  # allTweets를 위한 타입 생성
  type Tweet {
    id: ID
    text: String
    author: User
  }
  type Query {
    # allTweets에는 다양한 데이터가 들어가 있기 때문에 하나의 타입(Int, Float, String, ID 등)으로 설정 불가
    # 이럴 때는 Type을 생성해줘야 함
    allTweets: [Tweet]
    # 수많은 트윗 중 어떤 트윗인지 알기 위해서 argument를 제공
    tweet(id: ID): Tweet
  }
`;

// Create an instance of ApolloServer
const server = new ApolloServer({ typeDefs });

// 서버 실행
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀Server is running on: ${url}`);
