<script>
  import Form from './Form.svelte'
  import Login from '../Login.svelte'
  import Registration from '../Registration.svelte'
  import { onMount } from 'svelte'
  export let modalTitle = ''
  export let modalContent = []
  export let element = ''
  export let isShow = false

  const closeModal = (event) => {
    console.log(event)
    isShow = event.detail.isClose || false
  }
</script>

<style lang="scss">
  @import "../../styles/theme.scss";
  .modal {
    top: 0;
    left: 0;
    z-index: 7;
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color:$primary;
    transform-origin: center center;
    @include transform(scale(0.000001, 0.00001));
    @include transition(all 0.2s ease-in);
  }
  .show {
    @include transform(scale(1, 1));
  }
  .close-button {
    color:white;
    font-size: 2rem;
    top: 20px;
    right: 20px;
    position: absolute;
    @include transition(opacity 0.2s ease-in);

    &:hover {
      opacity: 0.5;
      cursor: pointer;
    }
  }
  .form-title {
    margin-bottom: 15px;
    font-size:2rem;
    font-family: 'Rubik Mono One';
    color:white;
  }
  .modal-content {
    font-family: 'IBM Plex Sans', sans-serif;
  }
</style>

<div class="modal" class:show={isShow}>
  <div class="close-button" on:click={closeModal}>X</div>
  <div class="form-title">{modalTitle}</div>
  <div class="modal-content">
    {#if element && element.name && element.name === 'Login'}
      <svelte:component this={Login} on:close={closeModal}/>
    {:else if element && element.name && element.name === 'Registration'}
      <svelte:component this={Registration}  on:close={closeModal}/>
    {:else}
      {modalContent}
    {/if}

  </div>
</div>
