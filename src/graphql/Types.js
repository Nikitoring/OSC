import { gql } from 'apollo-server-express' // GraphQL: TypeDefs

const TYPEDEFS = gql`
  type Query {
    test: String,
    cats: [Cat!]!,
    cat(id: ID!): Cat
  }

  type Cat {
    id: ID!
    name: String!
    description: String
    # location: Location
    # user; String
  }

  type Mutation {
    createCat(
      name: String!,
      description: String,
      # location: Location,
      # user; String
      ): Cat!,
    editCat(
      _id:ID!,
      name: String!,
      description: String,
      # location: Location,
      # user; String
    ): Cat!
  }
`
export default TYPEDEFS
