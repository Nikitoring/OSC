<script>
  import { createEventDispatcher } from 'svelte'
  import {formData} from '../../utils/formData.js'
  export let formType = null
  const dispatch = createEventDispatcher()
  let data = {}
  const changeValueBinding = (event) => {
    data[event.detail.inputId] = event.detail.inputValue
  }
  const submit = (event)=> {
    dispatch('data', data)
  }
</script>

<style lang="scss">

</style>
<form class="content" on:submit|preventDefault={submit}>
{#if formType}
  {#each formData[formType] as element}
    <svelte:component this={element.component} {...element.props} on:value={changeValueBinding} />
  {/each}
{:else}ERROR: Don't formType{/if}
</form>

