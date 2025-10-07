<script lang="ts">
  import { Route } from 'svelte-router-spa';
  interface Props {
    currentRoute?: object;
  }

  let { currentRoute = {} }: Props = $props();
  const params = {};
</script>

<div class="app">
  <div>
    <Route {currentRoute} {params} />
  </div>
</div>
