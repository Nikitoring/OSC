import { gql } from 'apollo-boost';

const CREATE_CAT = gql`
mutation createCat($name:String!,$description:String) {
  createCat(name:$name, description: $description) {
    id
    name
    description
  }
}
`
export default CREATE_CAT
