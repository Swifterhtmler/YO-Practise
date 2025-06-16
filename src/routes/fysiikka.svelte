<div class="container">
  <h2>Fysiikka Sivu</h2>
  <p>
    Tervetuloa fysiikan sivulle! Tässä voit oppia fysiikan peruskäsitteitä, tutustua kaavoihin ja tehdä harjoituksia.
  </p>
  
  <section class="content-block">
    <h3>Perusperiaatteet</h3>
    <p>
      Fysiikka tutkii luonnonilmiöitä, kuten liikettä, voimia, energiaa ja sähköä.
      Se perustuu matemaattisiin malleihin ja kokeelliseen tutkimukseen.
    </p>
  </section>

  <section class="content-block">
    <h3>Newtonin lait</h3>
    <ul>
      <li>Ensimmäinen laki: Inertia</li>
      <li>Toinen laki: Voima on massan ja kiihtyvyyden tulo (F = ma)</li>
      <li>Kolmas laki: Voimat ovat aina vastakkaisia ja yhtä suuria</li>
    </ul>
  </section>

  <section class="content-block">
    <h3>Harjoitus</h3>
    <p>
      Laske kappaleen kiihtyvyys, kun siihen vaikuttaa 10 N voima ja massa on 2 kg.
    </p>
  </section>
</div>

<style>
  /* Make container fill the viewport */
  .container {
    min-height: 100vh;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
    color: #012a4a;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 2rem;
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

  ul {
    padding-left: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  li {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  /* Responsive: smaller padding on small screens */
  @media (max-width: 600px) {
    .container {
      padding: 2rem 1rem;
    }

    h2 {
      font-size: 2rem;
    }

    p, li {
      font-size: 1rem;
    }
  }
</style>
