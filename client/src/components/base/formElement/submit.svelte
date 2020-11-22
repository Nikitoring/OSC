<script>
  export let label = ''
  export let classes = ''
  // export let handlerFunction = () => {}
</script>

<style lang="scss">
  @import "../../../styles/theme.scss";

  .button-submit {
    color: white;
    border: none;
    outline: none;
    font-size: 24px;
    font-weight: 200;
    overflow: hidden;
    position: relative;
    border-radius: 2px;
    letter-spacing: 2px;
    box-shadow: $shadow1;
    text-transform: uppercase;
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

    .btn-submit {
      z-index: 2;
      display: block;
      padding: 10px 20px;
      position: relative;
      color: white;
      background: none;
      border: none;
      margin: none;
      width:100%;
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>

<div class="button-submit" class:classes>
  <button type="submit" class="btn-submit">{label}</button>
</div>
