<script>
  import Registration from '../Registration.svelte'
  import Login from '../Login.svelte'
  export let tabs = []
</script>

<style lang="scss">
  @import "../../styles/theme.scss";
  button:focus,
  input:focus,
  textarea:focus,
  select:focus {
  outline: none; }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    overflow: hidden;
  }
  .tabs [class^='tab'] label,
  .tabs [class*=' tab'] label {
    color:$light;
    cursor: pointer;
    display: block;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1em;
    padding: 2rem 0;
    text-align: center;
  }
  .tabs [class^='tab'] [type='radio'],
  .tabs [class*=' tab'] [type='radio'] {
    border-bottom: 1px solid $light;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
  .tabs [class^='tab'] [type='radio']:hover,
  .tabs [class^='tab'] [type='radio']:focus,
  .tabs [class*=' tab'] [type='radio']:hover,
  .tabs [class*=' tab'] [type='radio']:focus {
    border-bottom: 1px solid $secondary;
  }
  .tabs [class^='tab'] [type='radio']:checked,
  .tabs [class*=' tab'] [type='radio']:checked {
    border-bottom: 2px solid $secondary;
  }
  .tabs [class^='tab'] [type='radio']:checked + div,
  .tabs [class*=' tab'] [type='radio']:checked + div {
    opacity: 1;
  }
  .tabs [class^='tab'] [type='radio'] + div,
  .tabs [class*=' tab'] [type='radio'] + div {
    display: block;
    opacity: 0;
    padding: 2rem 0;
    width: 90%;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
  .tabs .tab {
    width: 50%;
  }
  .tabs .tab [type='radio'] + div {
    width: 200%;
    margin-left: 200%;
  }
  .tabs .tab [type='radio']:checked + div {
    margin-left: 0;
  }
  .tabs .tab:last-child [type='radio'] + div {
    margin-left: 100%;
  }
  .tabs .tab:last-child [type='radio']:checked + div {
    margin-left: -100%;
  }
</style>

<div class="tabs">
  {#each tabs as tab, index}
    <div class="tab">
      <label for="tab-{index}">{tab.label}</label>
      <input
        id="tab-{index}"
        name="tab-{tab.label}"
        type="radio"
        checked={tab.default} />
      <div>
          <svelte:component this={tab.content}/>
      </div>
    </div>
  {/each}
</div>
