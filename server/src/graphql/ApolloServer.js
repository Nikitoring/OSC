// Imports: GraphQL
import { ApolloServer } from 'apollo-server-express' // Imports: GraphQL TypeDefs & Resolvers
import TYPEDEFS from './Types.js'
import RESOLVERS from './Resolvers.js'
import { port } from '../../config.js'

// GraphQL: Schema
const apolloServer = new ApolloServer({
  typeDefs: TYPEDEFS,
  resolvers: RESOLVERS,
  context: ({ req, res, payload }) => ({ req,res, payload }),
  playground: {
    endpoint: `http://localhost:${port}/graphql`,
    settings: {
      'editor.theme': 'dark',
    },
  },
})

export default apolloServer
