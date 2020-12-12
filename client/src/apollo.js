import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'
import Cookies from 'js-cookie'
import { connectUrl } from './utils/connection.js'
import { getToken } from './utils/auth.js'

const headers = { 'content-type': 'application/json' }
const getHeaders = () => {
  return headers
}

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: connectUrl,
  credentials: 'include',
  headers: getHeaders(),
})


const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('authorization')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// const link = split(
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query)
//     return kind === 'OperationDefinition' && operation === 'subscription'
//   },
//   authLink,
//   httpLink
// )

export const client = new ApolloClient({
  link:authLink.concat(httpLink),
  cache
})
