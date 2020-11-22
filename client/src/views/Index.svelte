<script>
  import { onMount } from "svelte";
  import { strGeneral, updateGeneral } from "../stores/general.js";
  let title = `Open Street Cats`;

  onMount(() => {
    setTimeout(() => {
      updateGeneral({ isCatAnimated: true });
    }, 2000);
  });
  let cats = [
    {
      id: 1,
      name: "Thao",
      place: "Sounth Africa, Marokko",
    },
    {
      id: 2,
      name: "Ginger",
      place: "USA, Detroit",
    },
    {
      id: 3,
      name: "Barsik",
      place: "Russia, Novosibirsk",
    },
  ];
</script>

<style lang="scss">

  @import "../styles/theme.scss";

  .intro {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding-left: 3rem;
    flex-shrink: 0;
    background: url('../assets/map.svg');
    // background-size: 300% 100%;
    // background-repeat: repeat;
  }
  .content {
    width: calc(100vw - 10rem);
  }

  .desctiption-site {
    margin: 2rem auto 2rem;
    position: absolute;
    top: 12rem;
    font-family: 'Rubik Mono One';
    z-index: 3;
    .front-title {
      color: $primary;
      margin: 0 auto;
      @media (min-width: 769px) {
        font-size: 90px;
      }
      @media (max-width: 768px) and (min-width: 562px) {
        font-size: 50px;
      }
      &-char {
        opacity: 0;
        animation: laserOn 500ms steps(8) forwards;
      }
    }
    .front-sub-title {
      color: $secondary;
      margin: 0 auto;
      @media (min-width: 769px) {
        font-size: 22px;
      }
      @media (max-width: 768px) and (min-width: 562px) {
        font-size: 14px;
      }
    }
  }
  .cat {
    opacity: 0;
    position: absolute;
    left: 0;
    width: 100vw;
    height: 100%;
    top: 30%;
    &.isActive {
      opacity: 1;
    }
      &-chip {
        opacity: 0;
        animation: fade-in-cats 0.8s linear forwards;;

        /* 3 - $cats */
        @for $i from 1 to 3 {
          $catTempo: 2500ms;
          $widthContainer: 10vh;
          &:nth-of-type(#{$i}) {
              position: relative;
              @if $i < 2 {
                left: calc(30vw + #{$i}*4rem);
              } @else {
                left: calc(#{$i}*4rem);
              }

              top: calc(#{$widthContainer} *(#{$i}*2));
              animation-delay: calc((#{$catTempo} * 2) + 250ms * (#{$i}));
          }
        }
      }
    }
</style>

<div class="intro" tabindex="-1">
  <div class="content">
    <div class="desctiption-site">
      <div class="front-sub-title fadeIn">
        if you found a cat in the street add this cat to catmaps
      </div>
      <h1 class="front-title fadeIn">
        {#each title.split('') as char}
          <span class="front-title-char">{char}</span>
        {/each}
      </h1>

    </div>
    <!-- <div class="cat" class:isActive={$strGeneral.isReady}>
      {#each cats as cat}
        <div class="cat-chip">
          <CatIcon {cat} />
        </div>
      {/each}
    </div> -->
  </div>
</div>
