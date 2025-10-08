<script>
  import { Router } from 'svelte-router-spa';
  import { routes } from './routes.js';
</script>

<svelte:head>
  <title>OSC</title>
</svelte:head>
<Router {routes} />

<style lang="scss" global>
  @import './styles/global.scss';
</style>
