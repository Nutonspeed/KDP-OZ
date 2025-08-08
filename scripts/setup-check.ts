// Script to check environment readiness for mock-first build.
import fs from 'fs';
import path from 'path';

console.log('Checking project setup...');

// Check env example file
const envExample = path.join(process.cwd(), '.env.local.example');
if (!fs.existsSync(envExample)) {
  console.error('.env.local.example is missing');
  process.exit(1);
}

console.log('Environment example file exists.');

// Additional checks could be added here.
console.log('Setup check complete.');