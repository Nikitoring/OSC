<script context="module">
  import { client } from './apollo.js'
  import { setClient } from 'svelte-apollo'
  import ME from './graphql/me.js'
  import { meData } from './stores/meStore.js'
  import { query } from 'svelte-apollo'

  export async function preload() {
    // const me = await client.query(ME)
    // console.log('ME', me);
    // meData.update(val=> val = me.data.me)
    return {
      me: await client.query(ME)
    }
  }
</script>

<script>
  import { restore } from 'svelte-apollo';
  import { Router } from 'svelte-router-spa'
  import { routes } from './routes.js'
    // setClient(client)
  export let currentRoute
  export let me
  const params = {}
</script>

<style lang="scss" global>
  @import './styles/global.scss';
</style>

<svelte:head>
  <title>OSC</title>
</svelte:head>
{me}
<Router {routes} />
