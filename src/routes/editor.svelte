<!-- <script lang="ts">
  import type { Content, Editor } from '@tiptap/core';
  import { EdraEditor, EdraToolBar, EdraBubbleMenu } from '../lib/components/edra/headless';

  let content: Content | undefined = undefined;
  let editor: Editor | undefined = undefined;

  function onUpdate() {
    content = editor?.getJSON();
  }
</script>

<EdraEditor />
 -->

 <script lang="ts">
   import type { Content, Editor } from '@tiptap/core';
   import { EdraEditor, EdraToolBar } from '../lib/components/edra/headless';
   import { editorTextStore, initializeStores } from './stores.js'; // Import initializeStores
   import { onMount, tick } from 'svelte'; // Import tick

   let editor: Editor | undefined = undefined;
   let contentLoaded = false; // New flag to track when content is truly ready

   onMount(async () => {
      // Ensure stores are initialized and data is loaded before proceeding
      await initializeStores();
      // After stores are initialized, the editorTextStore will have its value.
      // We can then signal that content is ready for the editor.
      contentLoaded = true;
      // Use tick to ensure the DOM is updated after contentLoaded changes
      // before potentially interacting with the editor
      await tick();
   });

   // initialContent will now react to contentLoaded being true,
   // ensuring editorTextStore has its final loaded value.
   $: initialContent = $editorTextStore && $editorTextStore.trim() !== ''
      ? {
         type: 'doc',
         content: [
           {
            type: 'paragraph',
            content: [{ type: 'text', text: $editorTextStore }]
           }
         ]
      }
      : {
         type: 'doc',
         content: [{ type: 'paragraph' }]
      };

   function onUpdate() {
      if (editor) {
         editorTextStore.set(editor.getText());
      }
   }
</script>

<div class="flex justify-center items-start mt-0">
  <div class="bg-white shadow-lg rounded-xl border border-gray-200" style="width:500px;height:600px;display:flex;flex-direction:column;">
    {#if editor && !editor.isDestroyed && contentLoaded}
      <EdraToolBar
        class="bg-secondary/50 flex w-full items-center overflow-x-auto border-b border-dashed p-0.5 gap-2"
        {editor}
      />
    {/if}
    <div style="flex:1;overflow:auto;">
      {#if contentLoaded}
        <EdraEditor
          bind:editor
          content={initialContent}
          class="h-full w-full pr-2 pl-6"
          {onUpdate}
        />
      {/if}
    </div>
  </div>
</div>