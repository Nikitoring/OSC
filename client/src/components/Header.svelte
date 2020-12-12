<script>
  import { Navigate } from 'svelte-router-spa'
  import Modal from './base/Modal.svelte'
  import { meData } from '../stores/meStore.js'
  let isCalculated = false
  let isMenuOpen = false

  const openMenuButtonClick = () => {
    isMenuOpen = !isMenuOpen
  }

  // Login or Registration
  let component
  let props
  const openLoginForm = () => {
    component = Modal
    props = { modalTitle: 'Sign in', isShow: true, element: { name: 'Login' } }
  }
  const openRegisterForm = () => {
    component = Modal
    props = { modalTitle: 'Registration', isShow: true, element: { name: 'Registration' } }
  }
  // Logout
  const logout =() => {

  }
  const addCat = () => {}
</script>

<style lang="scss">
  @import '../styles/theme.scss';
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    opacity: 1;
    z-index: 5;
    padding: 1rem 2rem 0 1rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    width: 100%;
  }
  .menu {
    display: flex;
  }
  .hamburger-button {
    background: none;
    border: none;
    cursor: pointer;
    width: 4rem;
    height: 2rem;
    border-radius: 0.3rem;
    color: $primary;
    padding-top: 0.6rem;
    &:hover {
      color: $primary;
    }

    & svg {
      width: 3rem;
      height: 3rem;
      fill: currentColor;
      .isOpen & {
        &:hover {
          color: $primary;
        }
      }
      .hamburgerSvgTop,
      .hamburgerSvgMiddle,
      .hamburgerSvgBottom {
        transition: transform 250ms ease-in-out, opacity 250ms ease-in-out;
      }
    }
    &[aria-pressed='true'] {
      .hamburgerSvgMiddle {
        opacity: 0;
      }
      .hamburgerSvgTop {
        transform: rotate(-45deg) translate(-0.9rem, 1rem);
      }
      .hamburgerSvgBottom {
        transform: rotate(45deg) translate(0.1rem, -1.6rem);
      }
    }
  }
  .drawer {
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
  }
  .authorization {
    align-self: flex-end;
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    .sign-in-button:not(:first-child){
      margin-left: 1.5rem;
    }
  }
  .sign-in-button {
    opacity: 1;
    color: $primary;
    font-family: 'IBM Plex Sans', sans-serif;
    white-space: nowrap;
    // text-transform: uppercase;
    @media (min-width: 769px) {
        font-size:  $font-size-md;
      }
    @media (max-width: 768px) and (min-width: 562px) {
        font-size: $font-size-base;
      }
    &:hover {
      opacity: 0.5;
      cursor: pointer;
    }
  }

</style>

<nav class="nav" class:isReady={isCalculated}>
  {#if $meData && $meData.username}
  <div class="menu">
    <div class="sign-in-button" on:click={addCat}>Add Cat</div>
  </div>
    <div class="authorization">
    <div class="">{$meData.username}</div>
    <div class="sign-in-button" on:click={logout}>Logout</div>
    </div>
    {:else}
    <div class="menu">
      <!-- <div class="sign-in-button" on:click={addCat}>Add Cat</div> -->
    </div>
    <div class="authorization">
      <div class="sign-in-button" on:click={openLoginForm}>Sign In</div>
      <div class="sign-in-button" on:click={openRegisterForm}>Registration</div>
    </div>
  {/if}


</nav>

<svelte:component this={component} {...props} />
