import gql from 'graphql-tag'

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