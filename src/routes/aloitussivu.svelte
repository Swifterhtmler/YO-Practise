<script>
  import { writable } from "svelte/store";
  import { todoItems } from './stores.js';
  // import { cards } from "./stores.js"; 
  // import { cards } from "./stores.js";
  import Flashcards from "./flashcards.svelte";
	import Matematiikka from "./matematiikka.svelte";
  import { cards } from "./stores.js";
  import Linechart from "./linechart.svelte";
  import Editor from "./editor.svelte";
  import Fysiikka from "./fysiikka.svelte";
  import Arcchart from "./arcchart.svelte";
  import Arcchartto from "./arcchartto.svelte";





  import { onMount } from 'svelte';

  import { editorDivStore } from './stores.js';

  import { Chart, Svg, Axis, Bars } from 'layerchart';

  import { editorTextStore } from "./stores.js";

  import SvelteCalenderDisplay from "./svelteCalenderDisplay.svelte";




  import SimpleEditor from "./simpleEditor.svelte";


  let editorDiv;



  let todoText = "";

   
  onMount(() => {
		editorDiv = document.querySelector('.tiptap.ProseMirror');

		if (!editorDiv) return;

		// Store the reference once
		editorDivStore.set(editorDiv);

		// Update text store live
		editorTextStore.set(editorDiv.textContent); // initial content

		editorDiv.addEventListener('input', () => {
			editorTextStore.set(editorDiv.textContent); // live update
			console.log("Live content:", editorDiv.textContent);
		});
	});


  function markDoneTask() {
     removeItem();
  }

  function handleKeyDownList(event) {
      if (event.key === "Enter") {
        AddItem();
        console.log($todoItems)
      }
  }


  function AddItem() {
     $todoItems = [...$todoItems, todoText];
     todoText = ""
  }

  function removeItem() {
    $todoItems.pop()
    $todoItems = [...$todoItems]
  }



</script>

<div id="charts-container">

<Arcchart usecase={"Muistikortit"} />



<Arcchartto usecase={"Tehtävien määrä"} />


<Linechart />



<!-- <SvelteCalenderDisplay /> -->

</div>





<!--Now add the library LayerChart tailwdin installed "!important for over ridind styles."-->

<div class="usecase-container">
<div class="container">  
 
<Flashcards UseCaseCards={"Yleiset muistikortit"} />


<div id="to-do">
<section class="content-block">
<h2>Tehtävälista</h2>
{#if $todoItems.length == 0}
<div class="results">
<div class="live-preview-hint">(Lisää tehtäviä listalle esim. luettavat luvut) </div>
</div>
{:else}
<div class="results">
<ul>
  {#each $todoItems as item}     
     <li><button class="element" type="button" on:click={markDoneTask}>{item}</button></li>
  {/each}
</ul>
</div>
{/if}

  <br>
{#if $todoItems.length >= 10}
    <input 
      bind:value={todoText} 
      type="text" 
      placeholder="kirjoita jotain lisäteksesi tehtävän"
      on:keypress={handleKeyDownList}
      disabled
    >
{:else}
 <input 
      bind:value={todoText} 
      type="text" 
      placeholder="kirjoita jotain lisäteksesi tehtävän"
      on:keypress={handleKeyDownList}
    >
 {/if}

 <br>

<div class="rowButtons">
{#if $todoItems.length >= 10 || todoText.length >= 40}
<button class="taskButton" disabled on:click={AddItem}>Lyhennä tekstiä</button>  
{:else}
<button class="taskButton" on:click={AddItem}>Lisää tehtävä</button>  
{/if}
<br>
<button on:click={removeItem}>Poista tehtävä</button>
</div>
 


</section>
</div>

<Editor />




</div>
</div>

<style>
  
  .content-block {
    background-color: #ffffffcc;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    max-width: 500px;
    height: 600px;
    margin: 0 auto;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }

  h2 {
    margin: 0;
    font-size: 2.8rem;
    color: #003366;
    text-align: center;
  }


  input {
    width: 300px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }



  .live-preview-hint {
    font-size: 0.8rem;
    color: #666;
    margin-top: 8px;
    font-style: italic;
  }


  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
    justify-content: center;
    /* gap: 2rem; */
    max-width: 95%;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    align-items: start;
    margin-left: 50px;
  }

  /* #to-do {
    margin-top: 20px;
    width: 100%;
    
  } */



  button {
    padding: 8px 16px;
    margin: 4px;
    border: none;
    border-radius: 4px;
    background-color: #0277bd;
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }

  button:hover:not(:disabled) {
    background-color: #0288d1;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  /* #add {
    background-color: #1873d4;
  } */




  .rowButtons {
    display: flex;
    flex-direction: row;
    align-items: center;
  }


  #charts-container {
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 40px;
    background-color: #e5ecf0;
    padding: 26px;
    border-radius: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .usecase-container {
    margin-top: 30px;
    background-color: #e5ecf0;
    border-radius: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  width: 65%;
  border: rgb(0, 0, 0) 1px solid;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  box-shadow: 2px 1px 2px rgb(123, 121, 121);
}

.element {
background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
}
</style>
