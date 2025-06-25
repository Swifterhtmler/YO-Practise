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
let isInitialized = $state(false);
let isUpdatingFromStore = $state(false);
let tipexInstance;

const extensions = [
  ...defaultExtensions,
  Mathematics,
  TextStyle,
  Color.configure({
    types: ['textStyle'],
  })
];

// Load initial content
onMount(() => {
  // Wait for stores to be initialized
  const checkAndLoad = () => {
    const storeContent = $editorTextStore;
    console.log('Checking store content:', storeContent);
    
    if (storeContent && storeContent.trim() !== '' && storeContent !== '<p></p>') {
      console.log('Loading content into editor:', storeContent);
      isUpdatingFromStore = true; // Prevent save during load
      editorContent = storeContent;
      
      setTimeout(() => {
        isUpdatingFromStore = false;
        isInitialized = true;
        console.log('Editor initialized with content');
      }, 100);
    } else {
      isInitialized = true;
      console.log('Editor initialized without content');
    }
  };

  setTimeout(checkAndLoad, 400);
});

// Save to store with debouncing
let saveTimeout;
function saveToStore(content) {
  if (!isInitialized || isUpdatingFromStore) return;
  
  console.log('Saving to store:', content?.substring(0, 50));
  
  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(() => {
    editorTextStore.set(content);
    console.log('Content saved to store');
  }, 1000);
}

// Watch for editor content changes (user typing)
$effect(() => {
  if (isInitialized && !isUpdatingFromStore && editorContent) {
    saveToStore(editorContent);
  }
});

// Listen for external store changes (but don't create a loop)
let lastStoreContent = '';
$effect(() => {
  const storeContent = $editorTextStore;
  
  // Only update if content is different and we're not currently updating from store
  if (isInitialized && !isUpdatingFromStore && storeContent !== lastStoreContent && storeContent !== editorContent) {
    console.log('External store change detected, updating editor');
    isUpdatingFromStore = true;
    editorContent = storeContent;
    lastStoreContent = storeContent;
    
    setTimeout(() => {
      isUpdatingFromStore = false;
    }, 100);
  } else {
    lastStoreContent = storeContent;
  }
});
</script>

<div class="editor-wrapper">
  <Tipex
    bind:this={tipexInstance}
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

  :global(.custom-tipex) {
    color: black !important;
  }

  :global(.custom-tipex *) {
    color: inherit !important;
  }

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

  .custom-tipex {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :global(.custom-tipex),
  :global(.custom-tipex > div),
  :global(.custom-tipex .ProseMirror) {
    height: 100% !important;
    min-height: 0 !important;
    max-height: none !important;
    flex: 1 1 auto !important;
  }

  :global(.custom-tipex .ProseMirror) {
    overflow: auto;
  }
</style>