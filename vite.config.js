import tailwindcss from '@tailwindcss/vite'; // Assuming you use Tailwind CSS
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
   // This environment variable will be set in our 'npm run make' script
   const isElectronBuild = process.env.ELECTRON_BUILD === 'true';

   // For debugging purposes, these will show in your terminal when you run `npm run make`
   console.log('Vite mode:', mode);
   console.log('isElectronBuild:', isElectronBuild);
   console.log('Vite base path (calculated):', isElectronBuild ? './' : '/');

   return {
      plugins: [tailwindcss(), sveltekit()],
      // Set Vite's base path:
      // - './' for Electron builds (forces relative paths for assets)
      // - '/' for development/web builds (default for root-relative web paths)
      base: isElectronBuild ? './' : '/',
   };
});