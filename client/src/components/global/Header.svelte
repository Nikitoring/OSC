<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore, user, isLoading } from '@stores/auth';
  import ModalWrapper from './ModalWrapper.svelte';
  import { Button } from 'flowbite-svelte';
  const { initializeAuth } = authStore();
  onMount(() => {
    initializeAuth();
  });

  let userNameIcon = 'U';

  let isShowModal = $state(false);
  let modalState = $state<{ header?: string; body?: any[] }>({});
  const showRegisterModal = (type: 'signIn' | 'register') => {
    isShowModal = true;
    if (type === 'signIn') {
      modalState.header = 'SignIn';
    }
  };
</script>

<header>
  <div class="flex osc-justify-between">
    {#if $isLoading}
      <div class="skeleton-avatar"></div>
    {:else if !$user}
      <div class="flex">
        <Button
          color="primary"
          onclick={() => {
            showRegisterModal('signIn');
          }}>Sign in</Button
        >
        <a
          href="#"
          onclick={() => {
            showRegisterModal('register');
          }}
        >
          Register</a
        >
      </div>
    {:else if user}
      <div class="user-badge">{userNameIcon}</div>
    {/if}
  </div>
</header>
<ModalWrapper bind:isShowModal bind:modalState></ModalWrapper>

<style lang="scss">
  .user-badge {
    width: 100px;
    height: 100px;
    background-color: var(--color-tertiary-100);
    border-radius: 50%;
  }
</style>
