// stores.js
import { writable } from 'svelte/store';

export const todoItems = writable([]);
export const cards = writable([]);

export const motivationval = writable([0,10]);

// // New store for handling two-sided cards
// export const twoSidedCards = writable([]);