import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// package.json에 "type": "module"을 추가하지 않으면 import 대신에 require()를 사용해줘야 함
// const { ApolloServer } = require("apollo-server")
// 위와 같이 사용하는 것보다 import를 사용하는 것이 좋음
const graphql = String.raw;

const typeDefs = `#graphql
  type Query {
    text: String
    hello: String
  }
`;

// Create an instance of ApolloServer
const server = new ApolloServer({ typeDefs });

// 서버 실행
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀Server is running on: ${url}`);
