<template>
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <slot name="header">
            This is the default title!
          </slot>
          <button type="button" class="btn btn-close" @click="close" >
            <span class="material-icons">
                close
            </span>
          </button>
        </header>
  
        <section class="modal-body">
          <slot name="body">
            This is the default body!
          </slot>
         </section>
  
        <footer class="modal-footer">
          <slot name="footer">
           
          </slot>
        </footer>
      </div>
    </div>
  </template>
<script>
  export default {
    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>
<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px #313131;
    border-radius: 7px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    width: clamp(400px, 500px, 50%  );
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    align-items: center;
    font-size: 18px;
    position: relative;
    border-bottom: var(--border);
    color: var(--color-main);
    justify-content: space-between;
  }

  .modal-footer {
    border-top: var(--border);
    flex-direction: column;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    position: absolute;
    right: 5px;
    padding: 5px;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
    color: var(--color-main);
    background: transparent;
  }

  .btn-green {
    color: white;
    background: var(--color-main);

  }
</style>