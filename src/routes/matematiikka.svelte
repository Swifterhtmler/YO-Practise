<script lang="ts">
  import { Tipex, defaultExtensions } from '@friendofsvelte/tipex';
  import Mathematics from '@aarkue/tiptap-math-extension'; 
  import "@friendofsvelte/tipex/styles/Tipex.css";
  import "@friendofsvelte/tipex/styles/ProseMirror.css";
  import "@friendofsvelte/tipex/styles/Controls.css";
  import "@friendofsvelte/tipex/styles/EditLink.css";
  import "@friendofsvelte/tipex/styles/CodeBlock.css";

  import 'katex/dist/katex.min.css';

  let body = `<p></p>`;
  const extensions = [...defaultExtensions, Mathematics];
</script>

<div class="editor-wrapper">
  <Tipex
    {body}
    {extensions}
    controls
    floating
    focal
    class="custom-tipex"
  />
</div>

<style>
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