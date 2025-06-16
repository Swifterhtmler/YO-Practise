<script>
  import Fysiikka from "./fysiikka.svelte";
  import Kemia from "./kemia.svelte"
  import Aidinkieli from "./aidinkieli.svelte"
  import Matematiikka from "./matematiikka.svelte";
  import Englanti from "./englanti.svelte";
  import Aloitussivu from "./aloitussivu.svelte";
  import { writable } from "svelte/store";  
  let ainevalinta = "Aloitussivu";
  let options = ["Kemia", "Fysiikka", "Matematiikka"];
  import "./style.css";
</script>




<header class="header">
<div>
<h1><span>YO</span>-StudySuite</h1>
<p>Valittu sivu: {ainevalinta}</p>
</div>
<select bind:value={ainevalinta}>
  <option value="Aloitussivu">Aloitussivu</option>
  <option value="Fysiikka">Fysiikka</option>
  <option value="Kemia">Kemia</option>
  <option value="Matematiikka">Matematiikka</option>
  <option value="Englanti">Englanti</option>
  <option value="Äidinkieli">Äidinkieli</option>
</select>


</header>


<main>
   {#key ainevalinta}
  {#if ainevalinta === "Fysiikka"}
    <Fysiikka />
  {:else if ainevalinta === "Kemia"}
    <Kemia />
  {:else if ainevalinta === "Matematiikka"}
    <Matematiikka />
  {:else if ainevalinta === "Englanti"}
    <Englanti />
  {:else if ainevalinta === "Äidinkieli"}
    <Aidinkieli /> 
  {:else}
    <Aloitussivu />
  {/if}
  {/key}
</main>