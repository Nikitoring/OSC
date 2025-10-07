<script module>
  import { client } from './apollo.js';
  import { setClient } from 'svelte-apollo';
  import ME from './graphql/me.js';
  import { query } from 'svelte-apollo';

  export async function preload() {
    return {
      me: await client.query(ME),
    };
  }
</script>

<script>
  import { restore } from 'svelte-apollo';
  import { Router } from 'svelte-router-spa';
  import { routes } from './routes.js';

  const params = {};
</script>

<svelte:head>
  <title>OSC</title>
</svelte:head>
<Router {routes} />

<style lang="scss" global>
  @import './styles/global.scss';
</style>
