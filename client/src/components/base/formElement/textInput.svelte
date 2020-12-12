<script>
  import { createFieldValidator } from '../../../stores/validation.js'
  import { createEventDispatcher } from 'svelte'
  export let inputId
  export let inputLabel
  export let value = ''
  export let rules = []
  export let type = "text"
  let isValue = false
  const dispatch = createEventDispatcher()
  const [validity, validate] = createFieldValidator(...rules)
  const checkInput = () => {
    if (value.length > 0) {
      isValue = true
    }
  }
  const changeInput = () => {
    dispatch('value', {
      inputValue: value,
      inputId: inputId,
    })
  }
  const handleInput = e => {
    // in here, you can switch on type and implement
    // whatever behaviour you need
    value = type.match(/^(number|range)$/)
      ? +e.target.value
      : e.target.value;
  }
</script>

<style lang="scss">
  @import '../../../styles/theme.scss';
  .input-group {
    width: 100%;
    font-size: 16px;
    max-width: 400px;
    padding-top: 20px;
    position: relative;
    margin-bottom: 15px;
    color: white;

    input {
      width: 100%;
      color: white;
      border: none;
      outline: none;
      padding: 5px 0;
      line-height: 1;
      font-size: 16px;
      font-family: 'Raleway';
      border-bottom: solid 1px white;
      background-color: transparent;
      @include transition(box-shadow 0.2s ease-in);

      + label {
        left: 0;
        top: 20px;
        position: absolute;
        pointer-events: none;
        @include transition(all 0.2s ease-in);
      }

      &:focus {
        box-shadow: 0 1px 0 0 white;
      }

      &:focus,
      &.active {
        + label {
          font-size: 12px;
          @include transform(translateY(-20px));
          &.label-danger {
            color: $danger;
          }
          &.label-success {
            color: $success;
          }
        }
        &.field-danger {
          border-bottom: solid 1px $danger;
        }
        &.field-success {
          border-bottom: solid 1px $success;
        }
      }
    }
  }
</style>

<div class="input-group">
  <input
    class:active={isValue}
    {type}
    {value}
    id={inputId}
    class:field-danger={!$validity.valid}
    class:field-success={$validity.valid}
    on:blur={checkInput}
    on:change={changeInput}
    use:validate={value}
    on:input={handleInput}
  />
  <label
    class:label-danger={!$validity.valid}
    class:label-success={$validity.valid}
    for={inputId}>
    {inputLabel}
  </label>
</div>
