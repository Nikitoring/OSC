<script>
  import Form from './base/Form.svelte'
  import { mutation } from 'svelte-apollo';
  import REGISTRATION from '../graphql/registration.js'
  import { createEventDispatcher } from 'svelte'
  import {setToken} from '../utils/auth.js'
  import { meData } from '../stores/meStore.js'

  const dispatch = createEventDispatcher()

  let email = ''
  let password = ''
  let confirmPassword = ''
  let username = ''
  let err = ''
  let isClose = false
  const registerMutation = mutation(REGISTRATION)
  const registrationFunction =  async (event) => {
    try {
      const registrationResult = await registerMutation({
        variables: {
          ...event.detail
        },
      })
      if (registrationResult && registrationResult.data) {
        setToken(registrationResult.data.register.token)
        meData.update({...registrationResult.data})
        isClose = true
        dispatch('close', isClose)
      }

    } catch (error) {
      err = error
    }
  }
</script>

<style>
  /* your styles go here */
</style>

<Form formType='registration' on:data={registrationFunction}/>
