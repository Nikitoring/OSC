<script>
  import { Route } from 'svelte-router-spa'
  import Header from '../components/Header.svelte'

  export let currentRoute
  const params = {}

</script>

<div class="app">
  <Header />
  <div>
    <Route {currentRoute} {params} />
  </div>

</div>

<style lang="scss">
  @import '../styles/theme.scss';
  .container {
    display: flex;
    justify-content: center;
  }
  main {
    padding-top: 1px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>