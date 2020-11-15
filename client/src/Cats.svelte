<script context="module">
  import gql from 'graphql-tag'
  import { client } from './apollo'

  const CATS_LIST = gql`
    query cat {
      cats {
        id
        name
      }
    }
  `
</script>

<script>
  import { restore, query } from 'svelte-apollo'
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