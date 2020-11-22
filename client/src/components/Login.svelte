<script>
  import Form from './base/Form.svelte'
  import ApolloClient from 'apollo-boost'
  import { client } from '../apollo'
  import { setClient, mutation } from 'svelte-apollo';
  import LOGIN from '../graphql/login.js'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  setClient(client)
  let email = ''
  let password = ''
  let err = ''
  let isClose = false
  const loginMutation = mutation(LOGIN)
  const loginFunction =  async (event) => {
    try {
      const loginResult = await loginMutation({
        variables: {
          ...event.detail
        },
      })
      console.log('loginResult', loginResult)
      isClose = true
      dispatch('close', isClose)
    } catch (error) {
      err = error
    }
  }
</script>

<style>
  /* your styles go here */
</style>

<Form formType='login' on:data={loginFunction}/>
