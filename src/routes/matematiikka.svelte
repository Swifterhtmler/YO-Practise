<script>
	import { editorTextStore } from './stores.js';

   let currentText = "";

	// $: currentText;
	// editorTextStore.subscribe(value => {
	// 	currentText = value;
	// });


   $: currentText = $editorTextStore;

</script>

<p>Editor says: {currentText}</p>
