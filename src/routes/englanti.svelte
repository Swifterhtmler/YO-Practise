<!-- <script>
	import { onMount } from 'svelte';

	let expression = 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}';
	let el;

	onMount(async () => {
		const katex = await import('katex');
		katex.render(expression, el, {
			throwOnError: false,
			displayMode: true,
		});
	});
</script>

<div bind:this={el}></div>

<style>
	@import "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css";

	div {
		font-size: 1.4em;
		margin: 1rem 0;
	}
</style> -->

<script lang="ts">
  import type { Content, Editor } from '@tiptap/core';
  import { EdraEditor, EdraToolBar, EdraBubbleMenu } from '../lib/components/edra/headless';
  import WorkingEditorVersion from './workingEditorVersion.svelte';

  let content: Content | undefined = undefined;
  let editor: Editor | undefined = undefined;

  function onUpdate() {
    content = editor?.getJSON();
  }
</script>

<!-- <EdraEditor /> -->
<WorkingEditorVersion />

