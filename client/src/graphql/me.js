import { gql } from 'apollo-boost';

const ME = gql`
query me {
  me {
    id
    username
    email
  }
}
`

export default ME
