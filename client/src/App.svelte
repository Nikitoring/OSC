<script>
  import { Router } from 'svelte-router-spa'
  import { routes } from './routes.js'
  import '@fortawesome/fontawesome-free/css/all.css'

  export let currentRoute
  const params = {}
</script>

<svelte:head>
  <title>OSC</title>
</svelte:head>

<Router {routes} />

<style lang="scss" global>
  @import './styles/global.scss';
</style>