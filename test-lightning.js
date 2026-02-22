
try {
  console.log('Trying to require lightningcss-darwin-x64...');
  const mod = require('lightningcss-darwin-x64');
  console.log('Success:', mod);
} catch (e) {
  console.error('Failed to require lightningcss-darwin-x64:', e);
}

try {
  console.log('Trying to require lightningcss-darwin-arm64...');
  const mod = require('lightningcss-darwin-arm64');
  console.log('Success:', mod);
} catch (e) {
  console.error('Failed to require lightningcss-darwin-arm64:', e);
}

console.log('process.arch:', process.arch);
console.log('process.platform:', process.platform);
