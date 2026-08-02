import fs from 'fs';
import path from 'path';

const outputFile = 'codebase_dump.md';

const filesToInclude = [
  'index.html',
  'package.json',
  'vite.config.js',
  'README.md',
  'DEPLOYMENT.md',
  'INSTRUKCJA.md',
  'src/config.js',
  'src/main.js',
  'src/style.css',
  'src/services/supabaseClient.js',
  'src/services/eventConfigService.js',
  'src/services/guestsService.js',
  'src/services/checklistService.js',
  'src/store/eventStore.js',
  'src/components/eventInfo/eventInfoModule.js',
  'src/components/countdown/countdownModule.js',
  'src/components/map/mapModule.js',
  'src/components/arrival/arrivalModule.js',
  'src/components/rsvp/rsvpModule.js',
  'src/components/checklist/checklistModule.js',
  'src/components/ui/modal.js',
  'src/components/ui/toast.js',
  'src/components/ui/emberField.js',
  'src/components/ui/scrollReveal.js',
  'src/utils/dom.js',
  'src/utils/format.js',
  'src/utils/color.js',
  '.github/workflows/deploy.yml'
];

function getLanguage(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.html') return 'html';
  if (ext === '.css') return 'css';
  if (ext === '.js' || ext === '.mjs') return 'javascript';
  if (ext === '.json') return 'json';
  if (ext === '.yml' || ext === '.yaml') return 'yaml';
  if (ext === '.sql') return 'sql';
  if (ext === '.md') return 'markdown';
  return '';
}

let dumpContent = `# Project Codebase Dump - Wołkowyja Event Platform\n\n`;
dumpContent += `Generated at: ${new Date().toISOString()}\n\n`;
dumpContent += `---\n\n`;

let processedCount = 0;

for (const relativePath of filesToInclude) {
  const fullPath = path.resolve(relativePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lang = getLanguage(relativePath);
    
    dumpContent += `## File: \`${relativePath}\`\n\n`;
    dumpContent += `\`\`\`${lang}\n`;
    dumpContent += content;
    dumpContent += `\n\`\`\`\n\n---\n\n`;
    processedCount++;
  }
}

fs.writeFileSync(outputFile, dumpContent, 'utf-8');
console.log(`Successfully dumped ${processedCount} files to ${outputFile}`);
