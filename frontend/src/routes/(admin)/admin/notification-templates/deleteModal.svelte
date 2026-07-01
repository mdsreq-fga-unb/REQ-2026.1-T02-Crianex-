<script lang="ts">
  export let isOpen = false;
  export let onClose: () => void;
  export let onConfirm: () => void;

  let dialogElement: HTMLDialogElement;

  $: if (dialogElement) {
    if (isOpen) {
      dialogElement.showModal();
    } else {
      dialogElement.close();
    }
  }
</script>

<dialog bind:this={dialogElement} on:close={onClose}>
  <div class="modal-wrapper">
    <div class="header-close">
      <button class="btn-close-top" aria-label="Fechar modal" on:click={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
          ></line></svg
        >
      </button>
    </div>

    <div class="txt">
      <div class="primary-txt">Remover template?</div>
      <p class="description-txt">
        O template deixa de ser usado em novos disparos imediatamente. Notificações já enviadas com
        este template não são afetadas. Esta ação não pode ser desfeita pela UI.
      </p>

      <div class="item-box">
        <span class="item-label">Template:</span>
        <span class="item-content"><slot /></span>
      </div>
    </div>

    <div class="btn-group">
      <button class="btn-cancel" on:click={onClose}>Cancelar</button>
      <button class="btn-delete" on:click={onConfirm}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="margin-right: 6px;"
          ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
          ></line></svg
        >
        Remover template
      </button>
    </div>
  </div>
</dialog>

<style>
  dialog {
    border: none;
    border-radius: 16px;
    padding: 0;
    margin: auto;
    width: calc(100% - 32px);
    max-width: 440px;
    background: #121214;
    color: #f4f4f5;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    font-family: 'Inter', system-ui, sans-serif;
    overflow: hidden;
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
  }

  .modal-wrapper {
    display: flex;
    flex-direction: column;
  }

  .header-close {
    padding: 24px 24px 0px 24px;
    display: flex;
    justify-content: flex-start;
  }

  .btn-close-top {
    background: rgba(228, 32, 132, 0.12);
    border: none;
    color: #f43f5e;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-close-top:hover {
    background: rgba(228, 32, 132, 0.2);
  }

  .txt {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .primary-txt {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    tracking-tight: -0.025em;
  }

  .description-txt {
    font-size: 13.5px;
    line-height: 1.5;
    color: #94a3b8;
    margin: 0;
  }

  .item-box {
    background-color: #161619;
    border-radius: 8px;
    border: 1px solid #27272a;
    padding: 12px 14px;
    margin-top: 4px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .item-label {
    font-family: monospace;
    font-size: 12px;
    color: #52525b;
  }

  .item-content {
    font-family: monospace;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
  }

  .btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 16px 24px 24px 24px;
    border-top: 1px solid #212124;
    background: #121214;
  }

  button {
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .btn-cancel {
    background: transparent;
    color: #ffffff;
    border: 1px solid #3f3f46;
    border-radius: 9999px;
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 500;
  }

  .btn-cancel:hover {
    background: #1c1c1f;
    border-color: #52525b;
  }

  .btn-delete {
    background-color: #e71f84;
    color: #ffffff;
    border: none;
    border-radius: 9999px;
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 500;
  }

  .btn-delete:hover {
    background-color: #be123c;
    shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
  }
</style>
