// Imports: GraphQL
import { ApolloServer } from 'apollo-server-express' // Imports: GraphQL TypeDefs & Resolvers
import TYPEDEFS from './Types.js'
import RESOLVERS from './Resolvers.js'
import { port } from '../../config.js'

// GraphQL: Schema
const SERVER = new ApolloServer({
  typeDefs: TYPEDEFS,
  resolvers: RESOLVERS,
  context: ({ req }) => ({ req }),
  playground: {
    endpoint: `http://localhost:${port}/graphql`,
    settings: {
      'editor.theme': 'dark',
    },
  },
})

export default SERVER
