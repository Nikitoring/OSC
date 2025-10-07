<script lang="ts">
  import { Route } from 'svelte-router-spa';
  export let currentRoute: object = {};
  const params = {};
</script>

<div class="app">
  <div>
    <Route {currentRoute} {params} />
  </div>
</div>
