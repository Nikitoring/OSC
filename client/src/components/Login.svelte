<script>
  import Form from './base/Form.svelte'
  import { mutation } from 'svelte-apollo'
  import LOGIN from '../graphql/login.js'
  import { meData } from '../stores/meStore.js'
  import { createEventDispatcher } from 'svelte'
  import { setToken } from '../utils/auth.js'

  const dispatch = createEventDispatcher()

  let email = ''
  let password = ''
  let err = ''
  let isClose = false
  const loginMutation = mutation(LOGIN)
  const loginFunction = async (event) => {
    try {
      const loginResult = await loginMutation({
        variables: {
          ...event.detail,
        },
      })
      if (loginResult && loginResult.data) {
        setToken(loginResult.data.login.token)
        meData.update({ ...loginResult.data })
      }
      isClose = true
      dispatch('close', isClose)
    } catch (error) {
      err = error
    }
  }
</script>

<style lang="scss">
  @import '../styles/theme.scss';
  .errors {
    margin: 2rem 0;
    display: flex;
    background-color: $danger;
    color: white;
    padding: 1.2rem;
  }
</style>

<Form formType="login" on:data={loginFunction} />
{#if err.length > 0}
  <div class="errors">{err}</div>
{/if}
