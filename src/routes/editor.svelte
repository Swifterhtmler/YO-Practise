<script lang="ts">
  import { Tipex, defaultExtensions } from '@friendofsvelte/tipex';
  import Mathematics from '@aarkue/tiptap-math-extension'; 
  import TextStyle from '@tiptap/extension-text-style';
  import Color from '@tiptap/extension-color';
  import { editorTextStore } from './stores.js';
  import { onMount } from 'svelte';
  import "@friendofsvelte/tipex/styles/Tipex.css";
  import "@friendofsvelte/tipex/styles/ProseMirror.css";
  import "@friendofsvelte/tipex/styles/Controls.css";
  import "@friendofsvelte/tipex/styles/EditLink.css";
  import "@friendofsvelte/tipex/styles/CodeBlock.css";
  import 'katex/dist/katex.min.css';

  let editorContent = $state('<p></p>');
  let editorMounted = $state(false);
  let lastSavedContent = '';

  const extensions = [
    ...defaultExtensions,
    Mathematics,
    TextStyle,
    Color.configure({
      types: ['textStyle'],
    })
  ];

  // Load content after mount
  onMount(() => {
    setTimeout(() => {
      const storeContent = $editorTextStore;
      if (storeContent && storeContent !== '<p></p>') {
        console.log('Loading content into editor:', storeContent);
        editorContent = storeContent;
        lastSavedContent = storeContent;
      }
      editorMounted = true;
    }, 100);
  });

  // Fix the handleUpdate function - use the bound editorContent instead of event
  let saveTimeout;
  function handleUpdate() {
    if (!editorMounted) return;
    
    // Use the bound editorContent directly instead of trying to get it from event
    const newContent = editorContent;
    
    // Only save if content actually changed
    if (newContent && newContent !== lastSavedContent) {
      console.log('Editor content changed, will save:', newContent?.substring(0, 50));
      
      // Clear existing timeout
      if (saveTimeout) clearTimeout(saveTimeout);
      
      // Debounce the save
      saveTimeout = setTimeout(() => {
        editorTextStore.set(newContent);
        lastSavedContent = newContent;
        console.log('Content saved to store');
      }, 1000);
    }
  }

  // Watch for changes in editorContent and trigger save
  $effect(() => {
    if (editorMounted && editorContent !== lastSavedContent) {
      handleUpdate();
    }
  });
</script>

<div class="editor-wrapper">
  <Tipex
    bind:body={editorContent}
    {extensions}
    controls
    floating
    focal
    class="custom-tipex"
  />
</div>



<style>
:global(.ProseMirror) {
  color: black !important;
}

/* Or if that's too broad, target just your editor */
:global(.custom-tipex) {
  color: black !important;
}

:global(.custom-tipex *) {
  color: inherit !important;
}

  /* Outer wrapper size */
  /* .editor-wrapper {
    width: 500px;
    height: 630px;
    border: 1px solid #ccc;
    overflow: hidden;
    padding: 10px;
    border-radius: 10px;
    margin-top: 20px;
    margin-left: 30px;
  } */

  .editor-wrapper {
    width: 100%; 
    max-width: 500px; 
    height: 630px;
    border: 1px solid #ccc;
    overflow: hidden;
    padding: 10px;
    border-radius: 10px;
    margin: 20px auto 0; 
    background-color: #ffffffcc;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }




  /* Ensure Tipex root fills wrapper */
  .custom-tipex {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Global overrides for internal elements */
  :global(.custom-tipex),
  :global(.custom-tipex > div),
  :global(.custom-tipex .ProseMirror) {
    height: 100% !important;
    min-height: 0 !important;
    max-height: none !important;
    flex: 1 1 auto !important;
  }

  /* Optionally make the editor scrollable */
  :global(.custom-tipex .ProseMirror) {
    overflow: auto;
  }
</style>