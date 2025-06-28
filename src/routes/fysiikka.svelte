<script>
  import { get } from 'svelte/store';
  import { cards, todoItems, editorTextStore } from './stores.js';

  let userMessage = "";
  let assistantReply = "";
  let loading = false;

  async function askOpenAI() {
    loading = true;
    assistantReply = "";
    try {
      const allData = {
        cards: get(cards),
        todoItems: get(todoItems),
        editorText: get(editorTextStore),
      };

    const systemInstruction = `
You are an assistant that helps with study planning. 
Always use the provided user data to answer questions if it is relevant. 
If the answer cannot be found in the data, use your own knowledge to help the user, but do not mention that the data was missing or unavailable. 
You can use the user data to make quizzes and other challenges. 
You are a supportive study partner. 
Answer in Finnish, or in the language the user uses in their question. Do not suggest quizzes or other activities user does not ask just asnwer the question.
`.trim();

      const reply = await window.openaiAPI.chat([
      //   { role: "system", content: systemInstruction },
      //   { role: "user", content: userMessage },
        { role: "user", content: systemInstruction + "Here is my app data: " + JSON.stringify(allData) + userMessage }
      ]);

      assistantReply = reply;
    } catch (e) {
      assistantReply = "Virhe: " + e.message;
    }
    loading = false;
  }
</script>

<div class="container">
  <input
    type="text"
    bind:value={userMessage}
    placeholder="Kirjoita viesti tekoälylle"
    on:keydown={(e) => e.key === 'Enter' && askOpenAI()}
    style="width: 100%; max-width: 400px;"
  />
 
 <button class="btn" on:click={askOpenAI} disabled={loading || !userMessage}>
    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
   <span class="text">{loading ? "Kysytään..." : "Kysy"}</span>
  </button>
  <div style="margin-top: 1rem;">
    <strong>Vastaus:</strong>
    <div style="white-space: pre-wrap;">{assistantReply}</div>
  </div>
</div>

<style>
    .btn {
  border: none;
  width: 15em;
  height: 5em;
  border-radius: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: #1C1A1C;
  cursor: pointer;
  transition: all 450ms ease-in-out;
}

.sparkle {
  fill: #AAAAAA;
  transition: all 800ms ease;
}

.text {
  font-weight: 600;
  color: #AAAAAA;
  font-size: medium;
}

.btn:hover {
  background: linear-gradient(0deg,#A47CF3,#683FEA);
  box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
  inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
  0px 0px 0px 4px rgba(255, 255, 255, 0.2),
  0px 0px 180px 0px #9917FF;
  transform: translateY(-2px);
}

.btn:hover .text {
  color: white;
}

.btn:hover .sparkle {
  fill: white;
  transform: scale(1.2);
} 
</style>