
  import catsResolver from './resolvers/Cats.js'
  import userResolver from './resolvers/User.js'

  const RESOLVERS = {
    Query: {
      ...catsResolver.Query,
      ...userResolver.Query
    },
    Mutation: {
      ...catsResolver.Mutation,
      ...userResolver.Mutation
    }
}
export default RESOLVERS;