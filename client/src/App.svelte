<script>
  import { Router } from 'svelte-router-spa';
  import { routes } from './routes.js';
  import Header from './components/global/Header.svelte';
</script>

<svelte:head>
  <title>OSC</title>
</svelte:head>
<Header></Header>
<Router {routes} />

<style lang="scss" global>
  @import './styles/global.scss';
</style>
