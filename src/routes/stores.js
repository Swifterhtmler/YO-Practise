// // stores.js
// import { writable } from 'svelte/store';

// export const todoItems = writable([]);
// export const cards = writable([]);

// export const motivationval = writable([0,0]);

// export const editorDivStore = writable(null);
// export const editorTextStore = writable('');

// // // New store for handling two-sided cards
// // export const twoSidedCards = writable([]);

import { writable, get } from 'svelte/store';

function createPersistentStore(key, defaultValue) {
  const store = writable(defaultValue);
  let initialized = false;

  async function init(data) {
    if (data && key in data) {
      store.set(data[key]);
    }
    initialized = true;

    // Start listening only after data is set
    store.subscribe(value => {
      if (initialized && typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.saveFile({
          todoItems: get(todoItems),
          cards: get(cards),
          motivationval: get(motivationval),
          editorText: get(editorTextStore),
        });
      }
    });
  }

  return [store, init];
}

// Create the stores
export const [todoItems, initTodos] = createPersistentStore('todoItems', []);
export const [cards, initCards] = createPersistentStore('cards', []);
export const [motivationval, initMotivation] = createPersistentStore('motivationval', [0, 0]);
export const [editorTextStore, initEditorText] = createPersistentStore('editorText', '');
export const editorDivStore = writable(null); // not persistent

// Load saved data
export async function initializeStores() {
  if (typeof window === 'undefined' || !window.electronAPI) return;

  const data = await window.electronAPI.loadFile();
  console.log('Loaded data:', data);

  await Promise.all([
    initTodos(data),
    initCards(data),
    initMotivation(data),
    initEditorText(data)
  ]);
}
