// src/global.d.ts or src/app.d.ts
// Ensure this file is picked up by your tsconfig.json (usually it is by default)

declare global {
    interface Window {
        electronAPI: {
            saveFile: (contentData: any) => Promise<any>;
            openFile: () => Promise<any>;
            loadFile: () => Promise<any>;
        };
    }
}
export {};
// You might also need to add /// <reference types="svelte" /> if this is your primary d.ts
// or ensure tsconfig.json includes "types": ["svelte", "...other types if any"]