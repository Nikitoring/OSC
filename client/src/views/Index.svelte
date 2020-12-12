<script>
  // import { beforeUpdate } from 'svelte'
  import ME from '../graphql/me.js'
  import { meData } from '../stores/meStore.js'
  import { mutation, query } from 'svelte-apollo'
  import { Navigate } from 'svelte-router-spa'
  import Cookies from 'js-cookie'
  let title = `Open Street Cats`

  // beforeUpdate(() => {
  //   const meQuery = query(ME)
  //   if (meQuery && meQuery.data && meQuery.data.me) {
  //     console.log('ME', me.data.me)
  //     meData.update((val) => (val = me.data.me))
  //   }
  // })
</script>

<style lang="scss">
  @import '../styles/theme.scss';

  .intro {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding-left: 3rem;
    flex-shrink: 0;
  }
  .content {
    width: calc(100vw - 3rem);
    display: flex;
    justify-content: space-between;
    @media (min-width: 769px) {
      flex-direction: row;
    }
    @media (max-width: 768px) and (min-width: 562px) {
      flex-wrap: wrap;
      flex-direction: row-reverse;
    }
    @media (max-width: 561px) {
      flex-direction: column;
      flex-wrap: wrap;
      // flex-direction: row-reverse;
    }
  }

  .desctiption-site {
    margin: 18rem auto 2rem;
    font-family: 'Rubik Mono One';
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    width: 100vw;
    .front-title {
      color: $primary;
      @media (min-width: 769px) {
        font-size: 5rem;
      }
      @media (max-width: 768px) and (min-width: 562px) {
        font-size: 4rem;
      }
    }
    .front-sub-title {
      color: $secondary;
      @media (min-width: 769px) {
        font-size: $font-size-xl;
      }
      @media (max-width: 768px) and (min-width: 562px) {
        font-size: $font-size-base;
      }
    }
  }
  .cat {
    opacity: 1;
    width: 100vw;
    height: 100%;
  }
  .button-container {
    margin-top: 5rem;
    color: white;
    border: none;
    outline: none;
    font-size: 24px;
    font-weight: 200;
    overflow: hidden;
    position: relative;
    border-radius: 8px;
    letter-spacing: 1px;
    box-shadow: $shadow1;
    background-color: $success;
    @include transition(all 0.2s ease-in);
    &:after {
      top: -50%;
      z-index: 1;
      content: '';
      width: 150%;
      height: 200%;
      position: absolute;
      left: calc(-150% - 40px);
      background-color: rgba(255, 255, 255, 0.2);
      @include transform(skewX(-40deg));
      @include transition(all 0.2s ease-out);
    }

    &:hover {
      cursor: pointer;
      box-shadow: $shadow2;

      &:after {
        @include transform(translateX(100%) skewX(-30deg));
      }
    }
  }
  .button {
    z-index: 2;
    display: block;
    padding: 10px 20px;
    position: relative;
    color: white;
    background: none;
    border: none;
    margin: none;
    width: 100%;
    &:hover {
      cursor: pointer;
    }
  }
</style>

<!-- {#if $meQuery.loading}
  LOading...
{:else if $meQuery.error}
  ERROR {$meQuery.error.message}
{:else} -->
  <div class="intro" tabindex="-1">
    <div class="content">
      <div class="desctiption-site">
        <h1 class="front-title fadeIn">Open Street Cats</h1>
        <div class="front-sub-title fadeIn">
          if you found a cat in the street
          <br />
          add this cat to catmaps
        </div>
        <Navigate to="/catmaps">
          <div class="button-container">
            <div class="button">Go to catmaps</div>
          </div>
        </Navigate>

      </div>
      <div class="cat">
        <img src="./assets/cat.png" alt="cat" />
      </div>
    </div>
  </div>
<!-- {/if} -->
