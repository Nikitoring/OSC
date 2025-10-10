<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore, user, isLoading } from '@stores/auth';

  const { initializeAuth } = authStore();
  onMount(() => {
    initializeAuth();
  });

  let userNameIcon = $derived(user.name ? user.name.charAt(0) : 'U');
</script>

<header>
  <div class="flex osc-justify-between">
    {#if $isLoading}
      <div class="skeleton-avatar"></div>
    {:else if !$user}
      <button class="secondary-button">Sign in</button>
    {:else if user}
      <div class="user-badge">{userNameIcon}</div>
    {/if}
  </div>
</header>

<style lang="scss">
  @import '../../styles/theme.scss';
  @import '../../styles/global.scss';
  .user-badge {
    width: 100px;
    height: 100px;
    background-color: $primary;
    border-radius: 50%;
  }
</style>
