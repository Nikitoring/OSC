import gql from 'graphql-tag'

const REGISTRATION = gql`
mutation registration($username: String!, $password: String!, $email: String!,$confirmPassword: String!) {
  registration(registrationInput:{
    username:$username
    password: $password
    confirmPassword: $confirmPassword
    email:$email
  }) {
    username
    id
    token
  }
}
`

export default REGISTRATION