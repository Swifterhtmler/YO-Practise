<script lang="ts">
   import { browser } from '$app/environment';
   import type { Content, Editor } from '@tiptap/core';
   import { onMount, onDestroy } from 'svelte'; // Removed afterUpdate from here as it's for the wrapper

   // **** IMPORTANT: Confirm this import path. ****
   // Based on your provided path. Ensure this is correct.
   import { EdraEditor, EdraToolBar, EdraBubbleMenu } from '../lib/components/edra/headless';
   import { editorTextStore, initializeStores } from './stores.js';


   // --- Svelte State Variables ---
   // '$state' is a Svelte 5+ run-time feature. Keep using it.
   let content: Content | undefined = $state(undefined); // Holds the Tiptap JSON document
   let editor: Editor | undefined = $state(undefined);   // Bound to the EdraEditor component
   let currentFilePath: string | undefined = $state(undefined); // For file operations UI


   // --- Editor Instance Ready Effect ---
   // This effect reacts to the 'editor' instance becoming available after EdraEditor mounts.
   // Using a dedicated $effect for this is clean.
   $effect(() => {
     if (editor && !editor.isDestroyed) {
       console.log('Editor instance is now bound and ready.');
       // Optional: If you want to force content load from store ONLY once editor is ready
       // and if it hasn't been set by the prop already (e.g., if initial 'content' prop was undefined)
       if (editor.isEmpty && $editorTextStore && $editorTextStore.trim() !== '') {
           console.log("Editor was empty, attempting to load content from store after ready.");
           loadContentFromStoreIntoEditor();
       }
     } else {
       console.log('Editor instance is not yet bound or has been destroyed.');
     }
   });


   // --- Initial Content Loading & Store Initialization ---
   onMount(async () => {
      console.log('Component mounted. Initializing stores...');
      await initializeStores(); // Ensures editorTextStore is populated

      const loadedText = $editorTextStore;
      console.log('Stores initialized. Loaded text from store for initial prop:', loadedText);

      // This 'content' variable is passed as a prop to EdraEditor.
      // It's primarily used for the *initial* content when the editor first mounts.
      // Dynamic updates should ideally go through editor.commands.setContent().
      if (loadedText && loadedText.trim() !== '') {
          content = {
             type: 'doc',
             content: [{ type: 'paragraph', content: [{ type: 'text', text: loadedText }] }]
          };
      } else {
          content = {
             type: 'doc',
             content: [{ type: 'paragraph' }]
          };
      }
      console.log('Initial content prepared for EdraEditor prop:', content);
   });

   // --- EdraEditor onUpdate Handler ---
   // This function is called by EdraEditor when its content changes internally.
   // It updates the 'content' $state variable with the full Tiptap JSON
   // and saves plain text to your external store.
   function onUpdate() {
       if (editor && !editor.isDestroyed) {
           content = editor.getJSON(); // Always update reactive 'content' with full JSON
           // console.log('EdraEditor onUpdate fired. New content JSON:', content); // Too verbose if uncommented
           editorTextStore.set(editor.getText()); // Save plain text to your external store
       } else {
           console.warn('onUpdate called but editor is not bound or destroyed!');
       }
   }

   // --- Manual "Restore Editor" Function (e.g., from store or last saved state) ---
   // This function explicitly uses editor.commands.setContent() for dynamic updates.
   async function loadContentFromStoreIntoEditor() {
       if (!editor || editor.isDestroyed) {
           console.warn('Editor not ready to set content. Is it initialized?');
           alert('Editor is not ready yet. Please wait for it to load or reload the app.');
           return;
       }

       const textFromStore = $editorTextStore;
       console.log('Attempting to load and paste from store into editor:', textFromStore);

       // Convert plain text from store into a Tiptap document structure.
       // Adjust this conversion if your store format is different (e.g., Tiptap JSON already).
       const contentToSet: Content = {
           type: 'doc',
           content: [{ type: 'paragraph', content: [{ type: 'text', text: textFromStore || '' }] }]
       };

       editor.commands.setContent(contentToSet, true); // `true` means it will emit an update event (trigger onUpdate)
       console.log('Content from store sent to editor via setContent().');
   }

   // --- Electron File Operations (Requires preload.js and main.js setup) ---
   // Ensure your Electron preload.js exposes `electronAPI.saveFile` and `electronAPI.openFile`
   // and that they handle content (Tiptap JSON for saving, and Tiptap JSON or plain text for loading).

   async function saveContentToFile() {
       if (!editor || editor.isDestroyed) {
           console.warn('Editor not ready. Cannot get content to save.');
           alert('Editor is not ready. Please wait before saving.');
           return;
       }
       // Get the latest content from the active editor instance
       const currentEditorContent = editor.getJSON();
       if (!currentEditorContent) { console.warn('No content to save (editor returned empty).'); return; }

       if (typeof window !== 'undefined' && window.electronAPI) {
           const result = await window.electronAPI.saveFile(currentEditorContent); // Pass Tiptap JSON
           if (result.success) {
               console.log('Content saved successfully to:', result.filePath);
               currentFilePath = result.filePath;
           } else {
               console.error('Failed to save content:', result.message);
               alert('Failed to save content: ' + result.message);
           }
       } else {
           console.warn('Electron API not available. Cannot save to file (run via Electron).');
           alert('Electron desktop features not available (run via Electron).');
       }
   }

   async function openContentFromFile() {
       if (typeof window !== 'undefined' && window.electronAPI) {
           const result = await window.electronAPI.openFile();
           if (result.success && result.content !== undefined) { // Check for undefined, allows empty string
               console.log('Content loaded successfully from:', result.filePath);
               currentFilePath = result.filePath;

               if (editor && !editor.isDestroyed) {
                   let loadedTiptapContent: Content;
                   // Assuming result.content can be a string (plain text) or a Tiptap JSON object
                   if (typeof result.content === 'string') {
                       // Basic conversion for plain text files. If your files can be HTML/Markdown,
                       // you'd need Tiptap's parser extensions here (e.g., from StarterKit)
                       loadedTiptapContent = {
                           type: 'doc',
                           content: [{ type: 'paragraph', content: [{ type: 'text', text: result.content }] }]
                       };
                   } else {
                       // Assuming it's already Tiptap JSON if not a string
                       loadedTiptapContent = result.content as Content;
                   }
                   editor.commands.setContent(loadedTiptapContent, true); // `true` to emit update event
                   console.log("Editor content set via commands.setContent() after file open.");
               } else {
                   // Fallback for initial load if editor isn't ready.
                   // The `content` prop (which 'EdraEditor' uses for initial load) gets updated here.
                   // This assumes 'EdraEditor' reacts to its 'content' prop on subsequent mounts
                   // or has an internal reactivity handler.
                   console.warn("Editor not yet bound for direct setContent after file open. Updating 'content' prop.");
                   content = result.content as Content; // Assuming result.content is Tiptap JSON for this path
               }
           } else if (!result.success) { // Handle explicit failure or user cancellation
               console.warn('Failed to open file or operation cancelled:', result.message);
               alert('Failed to open content: ' + (result.message || 'No file selected.'));
           } else {
               console.log('Open file operation cancelled by user or no content was returned.');
           }
       } else {
           console.warn('Electron API not available. Cannot open file.');
           alert('Electron desktop features not available (run via Electron).');
       }
   }

   // --- Cleanup on component destroy ---
   onDestroy(() => {
     console.log('+page.svelte destroyed. Destroying editor if still active.');
     if (editor && !editor.isDestroyed) {
       editor.destroy();
       editor = undefined; // Clear editor reference
     }
   });
</script>


<div class="flex justify-center items-start mt-0">
  <div class="bg-white shadow-lg rounded-xl border border-gray-200" style="width:500px;height:600px;display:flex;flex-direction:column;margin-top:20px">

    <div class="flex p-2 gap-2 border-b flex-wrap">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm" onclick={saveContentToFile}>
            Tallenna tiedostoon
        </button>
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm" onclick={openContentFromFile}>
            Avaa tiedosto
        </button>
        <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm" onclick={loadContentFromStoreIntoEditor}>
            Palauta editori
        </button>
        {#if currentFilePath}
            <span class="text-sm text-gray-600 truncate flex-1 mt-1 sm:mt-0">Nykyinen: {currentFilePath.split('/').pop()}</span>
        {/if}
    </div>

    {#if editor && !editor.isDestroyed}
      <EdraToolBar
        class="bg-secondary/50 flex w-full items-center overflow-x-auto border-b border-dashed p-0.5 gap-2 "
        {editor}
      />
      <EdraBubbleMenu {editor} />
    {/if}

    <div style="flex:1;overflow:auto;">
      <EdraEditor
          bind:editor
          {content}
          class="h-full w-full pr-2 pl-6"
          {onUpdate}
      />
      {#if !editor}
        <div class="flex-1 flex justify-center items-center">Editori lataa...</div>
      {/if}
    </div>
  </div>
</div>