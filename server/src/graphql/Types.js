import { gql } from 'apollo-server-express' // GraphQL: TypeDefs

const TYPEDEFS = gql`
  type Cat {
    id: ID!
    name: String!
    description: String
    # location: Location
    #
  }
  type User {
    id: ID!,
    username: String!,
    password: String!,
    email: String!,
    token: String,
    creatAt: String
  }
  type Query {
    cats: [Cat!]!,
    cat(catId:ID!): Cat!,
    users: [User]!,
    me: User
  }

  input RegistrationInput{
      username: String!,
      password: String!,
      confirmPassword: String!,
      email: String!
  }
  type Mutation {
    createCat(
      name: String!,
      description: String,
      # location: Location,
      # user; String
      ): Cat!,
    editCat(
      id:ID!,
      name: String!,
      description: String
    ): Cat!
    deleteCat(
      catId:ID!
    ): String!
    # USERS
    login(username: String!, password:String!): User
    logout: User
    registration(registrationInput: RegistrationInput): User
  }
`
export default TYPEDEFS
