<script>
    let cardText = "";
    let cards = []
    let number = 0
    let currentIndex = -1

    function addCard(event) {
        if (cardText.trim() === "") {
           event.preventDefault();          
           return;
       }
         cards = [...cards, cardText];
         cardText = ""; 
         number += 1
        console.log(cards)
        currentIndex = cards.length - 1;
    }
  
    function removeCard() {
      if (currentIndex >= 0 && currentIndex < cards.length) {
		   cards.splice(currentIndex, 1);
		   cards = [...cards]; 
		   number -= 1;

		
		   if (currentIndex >= cards.length) {
			   currentIndex = cards.length - 1;
		   }
     }
    } 

    function nextCard() {
		if (currentIndex < cards.length - 1) {
			currentIndex++;
		}
    }

    function prevCard() {
		if (currentIndex > 0) {
			currentIndex--;
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
        if (cards.length === 0) {
            return cardText || "Kirjoita jotain ja lisätäksesi ensimmäisen korttisi";
        } else if (currentIndex >= 0 && currentIndex < cards.length) {
            return cards[currentIndex];
        } else {
            return "Ei kortteja";
        }
    }
    function handleKeypress(event) {
        if (event.key === "Enter") {
            addCard(event);
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="container">  
  <section class="content-block">

      <h2>Yleiset muistikortit</h2>
      <br>

    <div id="card-Block">  
      <div class="card">
        {getCardContent()}
        {#if cards.length === 0 && cardText}
          <div class="live-preview-hint">(Paina Enter tai klikkaa Lisää kortti)</div>
        {/if}
      </div>

    <h5>
      Muistikorttien lukumäärä: {number}
      {#if number > 0}
        <span class="card-position">Nykyinen kortti: (Kortti {currentIndex + 1} / {number})</span>
      {/if}
    </h5>

    <br>
    <input 
      bind:value={cardText} 
      type="text" 
      placeholder="kirjoita jotain lisäteksesi kortin"
      on:keypress={handleKeypress}
    >
    
    <br>

    <button class="button" id="add" disabled={cardText.trim() === ""} on:click={addCard}>Lisää kortti</button>

    <br>
    <br>

    {#if number <= 0}
      <button disabled on:click={removeCard}>Poista kortti</button>
    {:else}
      <button on:click={removeCard}>Poista kortti</button>
    {/if}
    
    {#if number > 1}
      <div style="margin-top: 1rem;">
        <button 
          disabled={currentIndex <= 0} 
          on:click={prevCard}
        >
          &larr; Edellinen
        </button>
        <button 
          disabled={currentIndex >= cards.length - 1} 
          on:click={nextCard}
        >
          Seuraava &rarr;
        </button>
      </div>
    {/if}

    {#if number > 1}
      <div class="keyboard-hint">
        💡 Käytä nuolinäppäimiä (← →) navigoidaksesi korttien välillä
      </div>
    {/if}
   </div>
  </section>



<div id="to-do">
<section class="content-block">
<h2>Tehtävä Lista</h2>





</section>
</div>
</div>

<style>
  .content-block {
    background-color: #ffffffcc;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    width: 800px;
    max-width: 100%;
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
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: rgb(1, 0, 0) 2px solid;
    border-radius: 5px;
    height: 220px;
    width: 460px;
    margin-right: 10px;
    margin-left: 10px;
    font-size: 1.1rem;
    padding: 10px;
    position: relative;
  }

  .live-preview-hint {
    font-size: 0.8rem;
    color: #666;
    margin-top: 8px;
    font-style: italic;
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

  /* .container {
    /* width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    gap: 20px;
    justify-content: center; */
    /* margin-top: 20px; 
  } */

  #to-do {
    margin-top: 20px;
    width: 100%;
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

  /* #add {
    background-color: #1873d4;
  } */

  .button {
  min-width: 120px;

  position: relative;
  cursor: pointer;

  padding: 12px 17px;
  border: 0;
  border-radius: 7px;

  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  background: radial-gradient(
    ellipse at bottom,
    rgba(71, 81, 92, 1) 0%,
    rgba(11, 21, 30, 1) 45%
  );

  color: rgb(255, 255, 255, 0.66);

  transition: all 1s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.button::before {
  content: "";
  width: 70%;
  height: 1px;

  position: absolute;
  bottom: 0;
  left: 15%;

  background: rgb(255, 255, 255);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0.2;

  transition: all 1s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.button:hover {
  color: rgb(255, 255, 255, 1);
  transform: scale(1.1) translateY(-3px);
}

.button:hover::before {
  opacity: 1;
}


  #add:hover:not(:disabled) {
    background-color: #45a049;
  }
</style>