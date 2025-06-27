
<script>
  import { cards } from "./stores.js";
  export let subject = "kemia"; // Pass this from parent, e.g. <Flashcards subject="kemia" />

  // Use derived value for this subject's cards
  $: subjectCards = $cards[subject] ?? [];

  let cardText = "";
  let cardTextBack = "";
  let currentIndex = -1;
  let isFlipped = false;
  let isEditing = false;
  let showNavigation = false;

  $: number = subjectCards.length;

  function changeEditing() {
    isEditing = true;
  }

  function flipCard() {
    isFlipped = !isFlipped;
  }

  function addCard(event) {
    if (event) event.preventDefault();
    if (cardText.trim() === "" || cardTextBack.trim() === "") return;
    cards.update(all => {
      const updated = { ...all };
      updated[subject] = [...(updated[subject] ?? []), { front: cardText, back: cardTextBack }];
      return updated;
    });
    cardText = "";
    cardTextBack = "";
    currentIndex = subjectCards.length; // will be updated on next tick
    isFlipped = false;
    isEditing = false;
    showNavigation = false;
  }

  function removeCard() {
    if (currentIndex >= 0 && currentIndex < subjectCards.length) {
      cards.update(all => {
        const updated = { ...all };
        updated[subject] = updated[subject].slice();
        updated[subject].splice(currentIndex, 1);
        return updated;
      });
      if (currentIndex >= subjectCards.length - 1) {
        currentIndex = subjectCards.length - 2;
      }
      isFlipped = false;
      isEditing = false;
      cardText = "";
      cardTextBack = "";
      showNavigation = false;
    }
  }

  function nextCard() {
    if (currentIndex < subjectCards.length - 1) {
      currentIndex++;
      isEditing = false;
      isFlipped = false;
      cardText = "";
      cardTextBack = "";
      showNavigation = false;
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      currentIndex--;
      isEditing = false;
      isFlipped = false;
      cardText = "";
      cardTextBack = "";
      showNavigation = false;
    }
  }

  function toggleNavigation() {
    showNavigation = !showNavigation;
  }

  function newCardAdd(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCard(event);
      startAddingNew();
    }
  }

  function handleKeydown(event) {
    if (event.key === "ArrowRight") {
      nextCard();
    } else if (event.key === "ArrowLeft") {
      prevCard();
    }
  }

  function getCardContent() {
    if (subjectCards.length === 0 || (currentIndex === -1 && !isEditing)) {
      return isFlipped
        ? (cardTextBack || "Lisää teksti kortin takapuolelle")
        : (cardText || "Kirjoita jotain ja lisätäksesi kortin");
    }
    if (isEditing && currentIndex >= 0 && currentIndex < subjectCards.length) {
      return isFlipped
        ? (cardTextBack || subjectCards[currentIndex].back)
        : (cardText || subjectCards[currentIndex].front);
    }
    if (currentIndex >= 0 && currentIndex < subjectCards.length) {
      return isFlipped
        ? subjectCards[currentIndex].back
        : subjectCards[currentIndex].front;
    }
    return "Ei kortteja";
  }

  function handleKeypress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!isFlipped) {
        isFlipped = true;
      } else {
        addCard(event);
      }
    }
  }

  function handleKeypressFirstVersion(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      isFlipped = true;
    }
  }

  function startEditing() {
    if (currentIndex >= 0 && currentIndex < subjectCards.length) {
      isEditing = true;
      cardText = subjectCards[currentIndex].front;
      cardTextBack = subjectCards[currentIndex].back;
      isFlipped = false;
      showNavigation = false;
    }
  }

  function updateCard() {
    if (currentIndex >= 0 && currentIndex < subjectCards.length) {
      cards.update(all => {
        const updated = { ...all };
        updated[subject] = updated[subject].slice();
        updated[subject][currentIndex] = { front: cardText, back: cardTextBack };
        return updated;
      });
      isEditing = false;
      cardText = "";
      cardTextBack = "";
      isFlipped = false;
      showNavigation = false;
    }
  }

  function startAddingNew() {
    currentIndex = -1;
    isEditing = false;
    isFlipped = false;
    cardText = "";
    cardTextBack = "";
    showNavigation = false;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

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
          {getCardContent()}
        </div>
        <div class="card-back">
          {getCardContent()}
        </div>
      </div>

      <br>
      <h5>
        Muistikorttien lukumäärä: {number}
        {#if number > 0 && currentIndex >= 0}
          <span class="card-position">Nykyinen kortti: (Kortti {currentIndex + 1} / {number})</span>
        {/if}
      </h5>

      <br>

      {#if currentIndex === -1 || isEditing}
        <input
          bind:value={cardText}
          type="text"
          placeholder="Kirjoita etupuolen teksti"
          onkeypress={handleKeypressFirstVersion}
        >

        <br>

        <input
          bind:value={cardTextBack}
          type="text"
          placeholder="Kirjoita takapuolen teksti"
          onkeypress={newCardAdd}
        >
        
        <br>

        <div class="input-controls">
          {#if !isEditing}
            <button disabled={cardText.trim() === "" && cardTextBack.trim() === ""} onclick={addCard}>
              Lisää kortti
            </button>
          {:else}
            <button onclick={updateCard} disabled={cardText.trim() === "" && cardTextBack.trim() === ""}>
              Päivitä kortti
            </button>
          {/if}

          {#if number > 0}
            <button onclick={toggleNavigation}>
              {showNavigation ? 'Piilota valikko' : 'Näytä valikko'}
            </button>
          {/if}
        </div>
      {/if}

      {#if showNavigation || (currentIndex >= 0 && !isEditing && !(currentIndex === -1 || isEditing))}
        <div class="card-controls">
          <button onclick={flipCard}>Käännä kortti</button>

          {#if number > 0}
            {#if currentIndex >= 0 && !isEditing}
              <button onclick={startEditing}>Muokkaa korttia</button>
            {/if}

            {#if !isEditing}
              <button onclick={startAddingNew}>Lisää uusi kortti</button>
            {/if}

            {#if number <= 0}
              <button disabled onclick={removeCard}>Poista kortti</button>
            {:else if currentIndex >= 0}
              <button onclick={removeCard}>Poista kortti</button>
            {/if}
          {/if}
        </div>

        <div class="card-controls-version-new">  
          {#if number > 1}
            <div style="margin-top: 1rem;">
              <button
                disabled={currentIndex <= 0}
                onclick={prevCard}
              >
                &larr; Edellinen
              </button>
              <button
                disabled={currentIndex >= subjectCards.length - 1}
                onclick={nextCard}
              >
                Seuraava &rarr;
              </button>
            </div>

            <div class="keyboard-hint">
              💡 Käytä nuolinäppäimiä (← →) navigoidaksesi korttien välillä
              <br>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </section>
</div>

<style>
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