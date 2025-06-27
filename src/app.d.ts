// src/global.d.ts or src/app.d.ts
// Ensure this file is picked up by your tsconfig.json (usually it is by default)

declare global {
    interface Window {
        electronAPI: {
            saveFile: (contentData: import("@tiptap/core").Content) => Promise<{ success: boolean; filePath?: string; message?: string }>;
            openFile: () => Promise<{ success: boolean; content?: import("@tiptap/core").Content; filePath?: string; message?: string }>;
        };
    }
}
// You might also need to add /// <reference types="svelte" /> if this is your primary d.ts
// or ensure tsconfig.json includes "types": ["svelte", "...other types if any"]