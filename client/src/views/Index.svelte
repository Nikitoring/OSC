<script lang="ts">
  import { navigateTo } from 'svelte-router-spa';
  import Cat from '../components/Cat.svelte';
  import Earth from '../components/Earth.svelte';
</script>

<div class="container">
  <div class="illustration">
    <Cat />
  </div>
  <div class="illustration">
    <Earth />
  </div>
  <div class="message">
    If you found a cat in the street, add this cat to CatMaps
  </div>

  <button class="primary-button" on:click={() => navigateTo('/cat-map')}>
    GO TO FIND CAT
  </button>
</div>

<style lang="scss">
  @import '../styles/theme.scss';
  @import '../styles/animations/cat.scss';
  @import '../styles/animations/earth.scss';

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: $light;
    min-height: 100vh;
    min-height: 100dvh; /* Для мобильных браузеров */
    box-sizing: border-box;
  }

  .illustration {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;

    /* Адаптивные размеры для иллюстраций */
    :global(.cat) {
      width: min(200px, 60vw);
      height: min(190px, 57vw);
    }

    :global(.earth) {
      width: min(350px, 80vw);
      height: min(350px, 80vw);
    }
  }

  .message {
    font-family: 'Rubik Mono One', monospace;
    font-size: clamp(1rem, 5vw, $font-size-xl);
    color: $secondary;
    text-align: center;
    margin-top: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0 1rem;
    line-height: 1.4;
    max-width: 90%;
  }

  /* Медиа-запросы для дополнительной адаптивности */
  @media (max-width: 480px) {
    .container {
      gap: 1rem;
      padding: 1rem;
    }

    .message {
      font-size: clamp(0.9rem, 4.5vw, 1.2rem);
      margin-top: 0.25rem;
    }

    .illustration {
      :global(.cat) {
        width: min(180px, 55vw);
        height: min(170px, 52vw);
      }

      :global(.earth) {
        width: min(300px, 75vw);
        height: min(300px, 75vw);
      }
    }
  }

  @media (max-width: 360px) {
    .container {
      gap: 0.75rem;
      padding: 0.75rem;
    }

    .message {
      font-size: clamp(0.8rem, 4vw, 1rem);
      padding: 0 0.5rem;
    }

    .primary-button {
      padding: 0.7rem 1.2rem;
      font-size: 1rem;
      min-width: 250px;
    }
  }

  /* Для ландшафтной ориентации на мобильных */
  @media (max-height: 500px) and (orientation: landscape) {
    .container {
      gap: 0.75rem;
      padding: 0.75rem;
      justify-content: flex-start;
      min-height: auto;
    }

    .illustration {
      :global(.cat),
      :global(.earth) {
        width: 120px;
        height: 120px;
      }
    }

    .message {
      font-size: 0.9rem;
      margin-top: 0;
    }

    .primary-button {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }

  /* Для очень высоких устройств */
  @media (min-height: 1000px) {
    .container {
      gap: 3rem;
      padding: 3rem;
    }

    .illustration {
      :global(.cat) {
        width: 250px;
        height: 240px;
      }

      :global(.earth) {
        width: 400px;
        height: 400px;
      }
    }
  }
</style>
