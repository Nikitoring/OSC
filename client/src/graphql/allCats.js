import { gql } from 'apollo-boost';

const CATS_LIST = gql`
query cats {
  cats {
    id
    name
    description
  }
}
`

export default CATS_LIST