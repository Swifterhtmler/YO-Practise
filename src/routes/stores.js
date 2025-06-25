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
export const editorTextStore = writable("")
export const editorDivStore = writable(null)

let initialized = false
let isLoading = false
let isSaving = false

// Initialize stores immediately when module loads
if (typeof window !== "undefined" && window.electronAPI) {
  initializeStores()
}

async function initializeStores() {
  if (initialized || isLoading) return
  
  isLoading = true
  console.log("Starting store initialization...")
  
  try {
    const data = await window.electronAPI.loadFile()
    console.log("Loaded data:", data)
    
    // Set initial values without triggering saves
    if (data?.todoItems) todoItems.set(data.todoItems)
    if (data?.cards) cards.set(data.cards)
    if (data?.motivationval) motivationval.set(data.motivationval)
    
    // Handle editor text specially
    if (data?.editorText && data.editorText.trim() !== '') {
      console.log("Setting editor text:", data.editorText)
      editorTextStore.set(data.editorText)
    } else {
      console.log("No editor text found, setting default")
      editorTextStore.set('')
    }
    
    // Set up last values after initialization
    setTimeout(() => {
      lastTodoItems = get(todoItems)
      lastCards = get(cards)
      lastMotivationval = get(motivationval)
      lastEditorText = get(editorTextStore)
      
      initialized = true
      isLoading = false
      console.log("Stores initialized successfully")
    }, 100)
    
  } catch (error) {
    console.error("Error initializing stores:", error)
    editorTextStore.set('')
    initialized = true
    isLoading = false
  }
}

// Save function
function saveAll() {
  if (!initialized || isLoading || isSaving || typeof window === "undefined" || !window.electronAPI) return
  
  isSaving = true
  
  const payload = {
    todoItems: get(todoItems),
    cards: get(cards),
    motivationval: get(motivationval),
    editorText: get(editorTextStore),
  }
  
  console.log("Saving payload:", payload)
  
  try {
    window.electronAPI.saveFile(payload)
  } catch (error) {
    console.error("Error saving:", error)
  } finally {
    // Reset saving flag after a short delay
    setTimeout(() => {
      isSaving = false
    }, 500)
  }
}

// Debounce saves
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

// Track last values to prevent unnecessary saves
let lastTodoItems = null
let lastCards = null
let lastMotivationval = null
let lastEditorText = null

// Set up subscriptions
todoItems.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastTodoItems)) {
    lastTodoItems = structuredClone(value)
    console.log("Todo items changed, saving...")
    debouncedSave()
  }
})

cards.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastCards)) {
    lastCards = structuredClone(value)
    console.log("Cards changed, saving...")
    debouncedSave()
  }
})

motivationval.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastMotivationval)) {
    lastMotivationval = structuredClone(value)
    console.log("Motivation val changed, saving...")
    debouncedSave()
  }
})

editorTextStore.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && value !== lastEditorText && value !== undefined) {
    lastEditorText = value
    console.log("Editor text changed, saving...", value?.substring(0, 50))
    debouncedSave()
  }
})

// Export initialization function
export { initializeStores }