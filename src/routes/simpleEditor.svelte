<script>
  import { editorTextStore } from './stores.js';
  
  let text = $state('');
  
  // Load text when component mounts
  text = $editorTextStore || '';
  
  // Save text when it changes
  function saveText() {
    editorTextStore.set(text);
  }
</script>

<div class="container">
  <textarea 
    bind:value={text}
    oninput={saveText}
    placeholder="Start typing..."
    rows="25"
    cols="80"
  ></textarea>
</div>

<style>
  .container {
    padding: 20px;
  }
  
  textarea {
    width: 100%;
    font-size: 16px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
  }
</style>
