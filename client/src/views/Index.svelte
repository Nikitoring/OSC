<script lang="ts">
  import Cat from '../components/Cat.svelte';
  import Earth from '../components/Earth.svelte';
</script>

<div class="container">
  <!-- Анимированный кот -->
  <div class="illustration">
    <Cat className="cat cat-animation" />
  </div>

  <!-- Вращающаяся Земля -->
  <div class="illustration">
    <Earth className="earth earth-rotation" />
  </div>

  <!-- Текст и кнопка -->
  <div class="message">
    If you found a cat in the street, add this cat to CatMaps
  </div>

  <button class="primary-button"> GO TO FIND CAT </button>
</div>

<style lang="scss">
  @import '../styles/theme.scss';
  @import '../styles/animations/cat.scss';
  @import '../styles/animations/earth.scss';

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background: $light;
    min-height: 100vh;
  }

  .illustration {
    display: flex;
    justify-content: center;
    width: 100%;
    position: relative;
  }

  .message {
    font-family: 'Rubik Mono One', monospace;
    font-size: $font-size-xl;
    color: $secondary;
    text-align: center;
    margin-top: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0 1rem;
  }
</style>
