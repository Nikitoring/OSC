import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'

import { setContext } from 'apollo-link-context'
import { readable } from 'svelte-persistent-store/dist/local'
import { wsUrl, connectUrl } from './utils/connection.js'
const headers = { 'content-type': 'application/json' }
const getHeaders = () => {
  return headers
}

// const cache = new InMemoryCache();

const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
      return { headers: getHeaders() }
    },
  },
})

const httpLink = new HttpLink({
  uri: connectUrl,
  credentials: 'include',
  headers: getHeaders(),
})


const authLink = setContext((_, { headers }) => {
  const token = readable('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
  // authLink,
)

export const client = new ApolloClient({
  link,
  ssrMode: true,
  cache: new InMemoryCache(),
  fetchOptions: {
    mode: 'no-cors',
  },
})
