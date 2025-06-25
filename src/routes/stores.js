// // stores.js
// import { writable } from 'svelte/store';

// export const todoItems = writable([]);
// export const cards = writable([]);

// export const motivationval = writable([0,0]);

// export const editorDivStore = writable(null);
// export const editorTextStore = writable('');

// // // New store for handling two-sided cards
// // export const twoSidedCards = writable([]);

import { writable, get } from "svelte/store"

// Create the stores
export const todoItems = writable([])
export const cards = writable([])
export const motivationval = writable([0, 0])
export const editorTextStore = writable("<p></p>")
export const editorDivStore = writable(null)

let initialized = false

// Initialize stores immediately when module loads
if (typeof window !== "undefined" && window.electronAPI) {
  initializeStores()
}

async function initializeStores() {
  if (initialized) return

  try {
    const data = await window.electronAPI.loadFile()
    console.log("Loaded data:", data)

    if (data?.todoItems) todoItems.set(data.todoItems)
    if (data?.cards) cards.set(data.cards)
    if (data?.motivationval) motivationval.set(data.motivationval)
    if (data?.editorText) {
      console.log("Setting editor text:", data.editorText)
      editorTextStore.set(data.editorText)
    }

    initialized = true
    console.log("Stores initialized successfully")
  } catch (error) {
    console.error("Error initializing stores:", error)
    initialized = true
  }
}

// Save function
function saveAll() {
  if (!initialized || typeof window === "undefined" || !window.electronAPI) return

  const payload = {
    todoItems: get(todoItems),
    cards: get(cards),
    motivationval: get(motivationval),
    editorText: get(editorTextStore),
  }

  console.log("Saving payload:", payload)
  window.electronAPI.saveFile(payload)
}

// Debounce saves to prevent the infinite loop
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedSave = debounce(saveAll, 2000) // 2 second debounce

// Set up subscriptions with better control
let lastTodoItems = null
let lastCards = null
let lastMotivationval = null
let lastEditorText = null

todoItems.subscribe((value) => {
  if (initialized && JSON.stringify(value) !== JSON.stringify(lastTodoItems)) {
    lastTodoItems = value
    console.log("Todo items changed, saving...")
    debouncedSave()
  }
})

cards.subscribe((value) => {
  if (initialized && JSON.stringify(value) !== JSON.stringify(lastCards)) {
    lastCards = value
    console.log("Cards changed, saving...")
    debouncedSave()
  }
})

motivationval.subscribe((value) => {
  if (initialized && JSON.stringify(value) !== JSON.stringify(lastMotivationval)) {
    lastMotivationval = value
    console.log("Motivation val changed, saving...")
    debouncedSave()
  }
})

editorTextStore.subscribe((value) => {
  if (initialized && value !== lastEditorText) {
    lastEditorText = value
    console.log("Editor text changed, saving...", value?.substring(0, 50))
    debouncedSave()
  }
})
