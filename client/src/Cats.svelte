<script>
  import { client } from './apollo'
  import { restore, query } from 'svelte-apollo'
  import CATS_LIST from './graphql/allCatsgrapql.js'
  const cats = query(client, { query: CATS_LIST })
</script>

<ul>
  {#await $cats}
    <li>Loading...</li>
  {:then result}
    {#each result.data.cats as cat (cat.id)}
      <li>{cat.name}</li>
    {:else}
      <li>No articles found</li>
    {/each}
  {:catch error}
    <li>Error loading articles: {error}</li>
  {/await}
</ul>