<script lang="ts">
   import { browser } from '$app/environment';
   import type { Content, Editor } from '@tiptap/core';
   import type { Transaction } from '@tiptap/pm/state'; // Only needed if you explicitly use Transaction type within onUpdate's params, but we'll remove params.

   // **** IMPORTANT: Confirm this import path. Use EdraEditor, not Edra. ****
   // Based on primary documentation you provided:
   // import { EdraEditor, EdraToolBar, EdraBubbleMenu } from '$lib/edra/shadcn/index.js'; // Adjust path if necessary for your setup.
   import { EdraEditor, EdraToolBar, EdraBubbleMenu } from '../lib/components/edra/headless'; // Or your specific path
   import { editorTextStore, initializeStores } from './stores.js';
   import { onMount } from 'svelte';

   // --- Svelte State Variables ---
   let content: Content | undefined = $state(undefined); // Holds the Tiptap JSON document
   let editor: Editor | undefined = $state(undefined);   // Bound to the EdraEditor component
   let isEditorAndToolbarReady = $state(false); // Flag for rendering toolbar/editor itself
   let currentFilePath: string | undefined = $state(undefined); // For file operations UI

   // --- Editor Instance Ready Effect ---
   // This effect reacts to the 'editor' instance becoming available after EdraEditor mounts.
   $effect(() => {
     if (editor) {
       console.log('Editor instance is now bound.');
       isEditorAndToolbarReady = true;
     } else {
       isEditorAndToolbarReady = false;
       console.log('Editor instance is not yet bound or has been destroyed.');
     }
   });

   // --- Initial Content Loading ---
   onMount(async () => {
      console.log('Component mounted. Initializing stores...');
      await initializeStores(); // Ensures editorTextStore is populated

      const loadedText = $editorTextStore;
      console.log('Stores initialized. Loaded text from store:', loadedText);

      // Convert raw text to Tiptap JSON Content format for the 'content' prop
      if (loadedText && loadedText.trim() !== '') {
          content = {
             type: 'doc',
             content: [{ type: 'paragraph', content: [{ type: 'text', text: loadedText }] }]
          };
          console.log('Initial content prepared from store for EdraEditor prop:', content);
      } else {
          content = {
             type: 'doc',
             content: [{ type: 'paragraph' }]
          };
          console.log('Initial content prepared (empty doc) for EdraEditor prop:', content);
      }
   });

   // --- EdraEditor onUpdate Handler ---
   // This function is called by EdraEditor when its content changes.
   // It updates the 'content' $state variable and saves plain text to your store.
   function onUpdate() { // <--- Fix: No explicit 'props' argument type here to match EdraEditor's expected signature
       if (editor) { // Access the $state 'editor' directly
           content = editor.getJSON(); // Update the reactive 'content' variable with full JSON
           console.log('EdraEditor onUpdate fired. New content JSON:', content);
           editorTextStore.set(editor.getText()); // Save plain text to your external store
       } else {
           console.warn('onUpdate called but editor is not bound!');
       }
   }

   // --- Manual "Paste from Store" Function ---
   async function loadContentFromStoreIntoEditor() {
       if (!editor || editor.isDestroyed) {
           console.warn('Editor not ready to set content.');
           alert('Editor is not ready yet. Please wait for it to load.');
           return;
       }

       const textFromStore = $editorTextStore;
       console.log('Attempting to load and paste from store:', textFromStore);

       const contentToPaste: Content = {
           type: 'doc',
           content: [{ type: 'paragraph', content: [{ type: 'text', text: textFromStore || '' }] }]
       };

       editor.commands.setContent(contentToPaste); // Force content into editor
       console.log('Content from store sent to editor via setContent().');
   }

   // --- Electron File Operations (Ensure preload.js and main.js are configured) ---
   async function saveContentToFile() {
       if (!content) { console.warn('No content to save.'); return; }
       if (typeof window !== 'undefined' && window.electronAPI) { // <--- Fix: Check for window existence
           const result = await window.electronAPI.saveFile(content);
           if (result.success) { console.log('Content saved successfully to:', result.filePath); currentFilePath = result.filePath; }
           else { console.error('Failed to save content:', result.message); alert('Failed to save content: ' + result.message); }
       } else { console.warn('Electron API not available. Cannot save to file.'); alert('Electron desktop features not available (run via Electron).'); }
   }

   async function openContentFromFile() {
       if (typeof window !== 'undefined' && window.electronAPI) { // <--- Fix: Check for window existence
           const result = await window.electronAPI.openFile();
           if (result.success && result.content) {
               console.log('Content loaded successfully from:', result.filePath);
               currentFilePath = result.filePath;

               if (editor && !editor.isDestroyed) {
                   editor.commands.setContent(result.content);
                   console.log("Editor content set via commands.setContent() after file open.");
               } else {
                   content = result.content; // Fallback to prop if editor not ready
                   console.warn("Editor not yet bound for direct setContent after file open. Relying on 'content' prop.");
               }
           } else {
               console.warn('No file selected or failed to open:', result.message);
               alert('Failed to open content: ' + result.message);
           }
       } else { console.warn('Electron API not available. Cannot open file.'); alert('Electron desktop features not available (run via Electron).'); }
   }
</script>


<div class="flex justify-center items-start mt-0">
  <div class="bg-white shadow-lg rounded-xl border border-gray-200" style="width:500px;height:600px;display:flex;flex-direction:column;margin-top:20px">

    <div class="flex p-2 gap-2 border-b flex-wrap">
        <!-- <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm" onclick={saveContentToFile}>
            Save to File
        </button> -->
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm" onclick={openContentFromFile}>
            Avaa tiedosto
        </button>
        <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm" onclick={loadContentFromStoreIntoEditor}>
            Palauta editori
        </button>
        {#if currentFilePath}
            <span class="text-sm text-gray-600 truncate flex-1 mt-1 sm:mt-0">Current: {currentFilePath.split('/').pop()}</span>
        {/if}
    </div>

    {#if isEditorAndToolbarReady && editor && !editor.isDestroyed}
      <EdraToolBar
        class="bg-secondary/50 flex w-full items-center overflow-x-auto border-b border-dashed p-0.5 gap-2 "
        {editor}
      />
      <EdraBubbleMenu {editor} />
    {/if}

    <div style="flex:1;overflow:auto;">
      <EdraEditor
          bind:editor
          {content} class="h-full w-full pr-2 pl-6"
          {onUpdate}
      />
      {#if !isEditorAndToolbarReady}
        <div class="flex-1 flex justify-center items-center">Editori lataa...</div>
      {/if}
    </div>
  </div>
</div>