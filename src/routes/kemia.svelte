<script>
    let cardText = "";
    let cards = []
    let number = 0


    function addCard(event) {
        if (cardText.trim() === "") {
           event.preventDefault();          
   

           return;
       }
         cards = [...cards, cardText];
         cardText = ""; 
         number += 1
        console.log(cards)
    }
  
    function removeCard() {
       cards.pop()
       cards = [...cards]
       number -= 1
       console.log(cards)
    } 

    



</script>

<div class="container">
 <br>
  <h2>Kemia Sivu</h2>
  <p>
   Tältä sivulta löydät kemian yo-tehtäviä, harjoituksia ja teorioita.
  </p>
  
  <section class="content-block">
    <h3>Muistikortit</h3>
      <br>

    <div id="card-Block">  
      <div class="card">{cardText}</div>
      
  <!-- {#each cards as card, index}
        <div id="card">{card}</div>
        {/each}
    -->

    <h5>Muistikorttien lukumäärä: {number}</h5>


       <br>
      <input bind:value={cardText} type="text" placeholder="kirjoita jotain lisäteksesi kortin">
      
      <br>

      <button id="add"  disabled={cardText.trim() === ""} on:click={addCard}>Lisää kortti</button>

      <br>

      <br>

      <button on:click={removeCard}>Poista kortti</button>



    </div>
  </section>
</div>

<style>
  /* Make container fill the viewport */
  
  .content-block {
    background-color: #ffffffcc;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    max-width: 800px;
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

  p {
    font-size: 1.25rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  input {
    width: 200px;
  }

  .content-block {
    background-color: #ffffffcc;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }

  h3 {
    margin-top: 0;
    color: #0277bd;
    font-weight: 600;
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
    justify-content: center;
    align-items: center;
    border: rgb(1, 0, 0) 2px solid;
    border-radius: 5px;
    height: 150px;
    width: 500px;
    margin-right: 10px;
    margin-left: 10px;
    font-size: 1.1rem;
    padding: 10px;
}


</style>
