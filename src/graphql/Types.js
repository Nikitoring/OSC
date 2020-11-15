import { gql } from 'apollo-server-express' // GraphQL: TypeDefs

const TYPEDEFS = gql`
  type Query {
    test: String
    cats: [Cat!]!
  }

  type Cat {
    id: ID!
    name: String!
  }

  type Mutation {
    createCat(name: String!): Cat!
  }
`
export default TYPEDEFS
