import pako from 'pako';
import { readFileSync } from 'fs';

const code = readFileSync('/tmp/pob_code.txt', 'utf8').trim();

console.log('Code length:', code.length);

// Convert URL-safe base64 to standard base64
const standardCode = code.replace(/-/g, '+').replace(/_/g, '/');

// Add padding if needed
let paddedCode = standardCode;
while (paddedCode.length % 4 !== 0) {
  paddedCode += '=';
}

// Decode base64
const binaryString = Buffer.from(paddedCode, 'base64');

// Decompress using pako
let decompressed;
try {
  const inflated = pako.inflate(binaryString);
  decompressed = new TextDecoder().decode(inflated);
  console.log('Decompression successful, length:', decompressed.length);
} catch (e) {
  console.error('Decompression error:', e);
  process.exit(1);
}

if (!decompressed) {
  console.error('Decompression returned undefined');
  process.exit(1);
}

// Search for bandit-related config
const lines = decompressed.split('\n');
let inConfig = false;
console.log('Searching for bandit config...\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('Config')) {
    console.log(`Line ${i}: ${line.substring(0, 200)}`);
  }

  if (line.includes('bandit') || line.includes('Bandit')) {
    console.log(`\n*** FOUND BANDIT at line ${i}: ***`);
    console.log(line);
    console.log('\nContext:');
    for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 2); j++) {
      console.log(`  ${j}: ${lines[j]}`);
    }
    console.log('');
  }
}

console.log('\n\nFirst 20 Config elements:');
let configCount = 0;
for (let i = 0; i < lines.length && configCount < 20; i++) {
  if (lines[i].includes('<Config ')) {
    console.log(lines[i]);
    configCount++;
  }
}
