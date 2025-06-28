<script lang="ts">
  import { cards } from "./stores.js"; // Re-introducing the store import

  export let subject = "kemia"; // Passed from parent, e.g., <Flashcards subject="kemia" />

  // Use the derived value from the 'cards' store for this subject
  $: subjectCards = $cards[subject] ?? [];

  let cardText = ""; // Binds to the front input field
  let cardTextBack = ""; // Binds to the back input field
  let isFlipped = false; // Controls card flip animation

  // Reactive declaration for number of cards (now derived from the store)
  $: number = subjectCards.length;

  function flipCard() {
    isFlipped = !isFlipped;
  }

  // --- REVISED ADD CARD LOGIC TO USE THE SVELTE STORE ---
  function addCard(event: Event) {
    if (event) event.preventDefault(); // Prevent form submission
    if (cardText.trim() === "" || cardTextBack.trim() === "") return; // Don't add empty cards

    // Update the 'cards' store using its update method
    cards.update(allSubjectsCards => {
      const updated = { ...allSubjectsCards }; // Create a shallow copy of the entire cards object
      // Add the new card to the specific subject's array
      updated[subject] = [...(updated[subject] ?? []), { front: cardText, back: cardTextBack }];
      return updated; // Return the updated object to the store
    });

    // After adding, clear inputs and reset flip state
    cardText = "";
    cardTextBack = "";
    isFlipped = false; // Reset flip for next new card

    console.log(`Card Added to ${subject}! Current cards for ${subject}:`, $cards[subject]);
  }

  // --- NEW: Function to remove the last card ---
  function removeLastCard() {
    if (subjectCards.length > 0) {
      cards.update(allSubjectsCards => {
        const updated = { ...allSubjectsCards };
        // Create a new array that excludes the last element
        updated[subject] = updated[subject].slice(0, -1);
        return updated;
      });
      isFlipped = false; // Reset flip state after removal
      console.log(`Last card removed from ${subject}! Current cards for ${subject}:`, $cards[subject]);
    }
  }

  // Input-related keydown handlers (kept as is)
  function handleFrontInputKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      isFlipped = true; // Automatically flip to back on Enter
      // (Focus management for input fields would go here if bind:this were used)
    }
  }

  function handleBackInputKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCard(event); // Call addCard directly
    }
  }
</script>

<div class="container">
  <section class="content-block">

    <h2>{subject}</h2>
    <br>

    <div id="card-Block" role="region">
      <div
        class="card"
        class:flipped={isFlipped}
        onclick={flipCard}
        onkeydown={(e) => e.key === 'Enter' && flipCard()}
        role="button"
        tabindex="0"
      >
        <div class="card-front">
          {cardText || "Kirjoita etupuolen teksti tähän..."}
        </div>
        <div class="card-back">
          {cardTextBack || "Kirjoita takapuolen teksti tähän..."}
        </div>
      </div>

      <br>
      <h5>
        Muistikorttien lukumäärä: {number}
      </h5>

      <br>

      <input
        bind:value={cardText}
        type="text"
        placeholder="Kirjoita etupuolen teksti"
        onkeydown={handleFrontInputKeydown}
      >

      <br>

      <input
        bind:value={cardTextBack}
        type="text"
        placeholder="Kirjoita takapuolen teksti"
        onkeydown={handleBackInputKeydown}
      >

      <br>

      <div class="input-controls">
        <button disabled={cardText.trim() === "" || cardTextBack.trim() === ""} onclick={addCard}>
          Lisää kortti
        </button>
        <button disabled={number === 0} onclick={removeLastCard}>
          Poista viimeisin kortti
        </button>
      </div>

      {#if number === 0}
        <p style="margin-top: 20px; text-align: center; color: #555;">
          Aloita lisäämällä uusi kortti yllä olevilla kentillä.
        </p>
      {/if}

      <hr style="width: 100%; margin-top: 20px;">
      <p>Debug: Kortit lisätty ({subject}): ({number} kpl)</p>
      <ul>
        {#each subjectCards as card, i (i)}
          <li>{i + 1}. Etu: "{card.front}" / Taka: "{card.back}"</li>
        {/each}
      </ul>

    </div>
  </section>
</div>

<style>
  /* All your existing styles are kept intact */
  .content-block {
    background-color: #ffffffcc;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    max-width: 500px;
    min-height: fit-content;
    height: 600px;
    margin: 0 auto;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
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

  #card-Block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .card {
    position: relative;
    width: 460px;
    height: 220px;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    cursor: pointer;
    margin: 0 auto;
  }

  .card.flipped {
    transform: rotateY(180deg);
  }

.card-controls-version-new {
    display: flex;
    gap: 2px;
    margin: 2px 0;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: rgb(247, 247, 247);
    border-radius: 5px;
    padding-bottom: 10px;
}

  .card-front,
  .card-back {
    position: absolute;
    width: 90%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid rgb(1, 0, 0);
    border-radius: 5px;
    padding: 10px;
    font-size: 1.1rem;
    background-color: white;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .card-position {
    font-size: 0.9rem;
    color: #666;
    margin-left: 10px;
  }

  .keyboard-hint {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
  }

  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(610px, 1fr));
    justify-content: center;
    max-width: 95%;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    align-items: start;
  }

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

  .card-controls {
    display: flex;
    gap: 2px;
    margin: 2px 0;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 11px;
    background-color: rgb(247, 247, 247);
    border-radius: 5px;
  }

  .input-controls {
    display: flex;
    gap: 8px;
    margin: 8px 0;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>