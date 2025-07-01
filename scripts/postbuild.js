// scripts/postbuild.js
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Revert to 'build'
const indexPath = resolve(process.cwd(), 'build', 'index.html');

try {
    let html = readFileSync(indexPath, 'utf-8');

    html = html.replace(/\/(_app\/immutable\/[^"]+)/g, './$1');
    html = html.replace(/\/favicon\.png/g, './favicon.png');

    writeFileSync(indexPath, html);
    console.log('✅ Successfully updated paths in build/index.html for Electron.');
} catch (error) {
    console.error('❌ Error during post-build script:', error);
    process.exit(1);
}