<script>
  import { Route } from 'svelte-router-spa'
  import Header from '../components/Header.svelte'
  export let currentRoute
  const params = {}

  import { onMount, beforeUpdate, afterUpdate } from 'svelte'


import { matchBrkp, initResponsive } from '../stores/responsive.js'
import {
  strGeneral,
  updateGeneral,
  afterGeneralUpdate,
} from '../stores/general.js'
let scrollY = 0
let scrollSpeed = 0
let horizonSpace = '100vh'
let hasScrolled = false
const scrollPage = 'scrollingOn'

onMount(async () => {
  initResponsive()
  if ($matchBrkp.lg) {
    await loadValueHorizontal()
  } else {
    updateGeneral({ isValuesLoaded: true })
  }
})

function loadValueHorizontal() {
  // window.addEventListener('scroll', handleIndexScroll)
  updateGeneral({ isValuesLoaded: true })
}
</script>


<svelte:window bind:scrollY />

<div class="app">
  <Header />

  <div
  class="page-wrapper"
  style="--scrollY:{scrollY}px;--scrollSpeed:{scrollSpeed}">
  <div class="horizont-wrapper">
    <Route {currentRoute} {params} />
  </div>
</div>
<div class="horizontal-spacer" style="--marginTop:{horizonSpace}" />

</div>

<style lang="scss" global>
  @import '../styles/global.scss';
  .page-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    display: grid;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  .horizontal-spacer {
    height: 1px;
    position: relative;
    margin-top: var(--marginTop, 100vh);
  }
  .horizont-wrapper {
    display: flex;
    transform: translateX(calc(var(--scrollY) * -1));
  }
  .container {
    display: flex;
    justify-content: center;
  }
  main {
    padding-top: 1px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
  .scrollingOn {
    overflow: scroll;
  }
</style>