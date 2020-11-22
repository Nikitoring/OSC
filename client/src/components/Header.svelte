<script>
  import { strGeneral, updateGeneral } from '../stores/general'
  import { Navigate } from 'svelte-router-spa'
  import Modal from './base/Modal.svelte'

  let isCalculated = false
  let isMenuOpen = false

  const openMenuButtonClick = () => {
    isMenuOpen = !isMenuOpen
  }
  let pageContainer = $strGeneral.pageContainer

  // Login form
  let component
  let props
  const openLoginForm = () => {
    component = Modal
    props = { modalTitle: 'SIGN IN', isShow: true, element: { name: 'Login' } }
  }
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
    align-items: center;
    width: 100%;
    &.isReady {
      opacity: 1;
    }
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
  .sign-in-button {
    opacity: 1;
    color: $primary;
    font-size: $font-size-lg;
    font-weight: 400;
    font-family: 'Rubik Mono One';
    text-transform: uppercase;
    &:hover {
      opacity: 0.5;
      cursor: pointer;
    }
  }
</style>

<nav class="nav" class:isReady={isCalculated}>
  <div class="menu" class:isOpen={isMenuOpen}>
    <button
      class="hamburger-button"
      aria-pressed={isMenuOpen}
      on:click={openMenuButtonClick}>
      <svg class="hamburgerSVG" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0"
          y="0"
          width="20"
          height="2"
          rx="1"
          class="hamburgerSvgTop" />
        <rect
          x="0"
          y="7"
          width="15"
          height="2"
          rx="1"
          class="hamburgerSvgMiddle" />
        <rect
          x="0"
          y="14"
          width="20"
          height="2"
          rx="1"
          class="hamburgerSvgBottom" />
      </svg>
    </button>
    <div class="drawer">
      <ul class="navigation">
        {#each pageContainer as page}
          <li class="nav-link">
            {#if page === 'intro'}
              <Navigate styles="nav-item" to="/">{page}</Navigate>
            {:else}
              <Navigate styles="nav-item" to={page}>{page}</Navigate>
            {/if}

          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="sign-in-button" on:click={openLoginForm}>Sign In</div>
</nav>

<svelte:component this={component} {...props} />
