<script>
  let {
    isShowModal = $bindable(false),
    modalState = $bindable({
      header: '',
      body: [],
      submit: null,
    }),
  } = $props();

  let dialog = $state(); // HTMLDialogElement

  $effect(() => {
    if (isShowModal && dialog) {
      dialog.showModal();
    } else if (dialog && dialog.open) {
      dialog.close();
    }
  });

  function handleClose() {
    isShowModal = false;
  }

  function handleBackdropClick(e) {
    if (e.target === dialog) {
      dialog.close();
    }
  }
</script>

<dialog bind:this={dialog} onclose={handleClose} onclick={handleBackdropClick}>
  <div class="modal-content">
    {#if modalState.header}
      <h4>{modalState.header}</h4>
    {/if}

    {#if modalState.body && modalState.body.length}
      {#each modalState.body as field}
        <div class="field">{field}</div>
      {/each}
    {/if}

    <div class="modal-actions">
      {#if modalState.submit && modalState.submit.action}
        <button class="primary-button" onclick={modalState.submit.action}>
          {modalState.submit.text || 'Submit'}
        </button>
      {/if}

      <button class="outline-button" onclick={() => dialog.close()}>
        Close
      </button>
    </div>
  </div>
</dialog>

<style>
  dialog {
    max-width: 32em;
    border-radius: 0.5em;
    border: none;
    padding: 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .modal-content {
    padding: 2em;
  }

  h4 {
    margin: 0 0 1em 0;
    font-size: 1.5em;
    color: #333;
  }

  .field {
    margin-bottom: 1em;
    padding: 0.5em;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .modal-actions {
    display: flex;
    gap: 1em;
    justify-content: flex-end;
    margin-top: 1.5em;
    flex-wrap: wrap;
  }

  .modal-actions button {
    min-width: 120px;
    margin: 0;
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Responsive */
  @media (max-width: 600px) {
    dialog {
      max-width: 90vw;
      margin: 1em;
    }

    .modal-content {
      padding: 1.5em;
    }

    .modal-actions {
      flex-direction: column;
    }

    .modal-actions button {
      width: 100%;
    }
  }
</style>
