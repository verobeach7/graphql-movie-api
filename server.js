import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  
  type Query {
    allMovies: [Movie!]!
    movie(id: String!): Movie
    
  }
  type Movie {  
	id: Int!  
	url: String!  
	imdb_code: String!  
	title: String!  
	title_english: String!  
	title_long: String!  
	slug: String!  
	year: Int!  
	rating: Float!  
	runtime: Float!  
	genres: [String]!  
	summary: String  
	description_full: String!  
	synopsis: String  
	yt_trailer_code: String!  
	language: String!  
	background_image: String!  
	background_image_original: String!  
	small_cover_image: String!  
	medium_cover_image: String!  
	large_cover_image: String!  
}  
`;

const resolvers = {
  Query: {
    allMovies: async () => {
      const response = await fetch("https://yts.mx/api/v2/list_movies.json");
      const json = await response.json();
      return json.data.movies;
    },
    movie: async (_, { id }) => {
      const response = await fetch(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`
      );
      const json = await response.json();
      return json.data.movie;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀Server is running on: ${url}`);
