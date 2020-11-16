
<script>
  import ApolloClient from 'apollo-client'
  import { client } from './apollo'
  import { setClient } from 'svelte-apollo'

	import Cats from './Cats.svelte'
	setClient(client)

</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello!</h1>
<Cats />
