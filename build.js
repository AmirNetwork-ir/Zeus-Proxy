const fs = require('fs');
const path = require('path');

const dir = __dirname;
const sourcePath = path.join(dir, 'Source.js');
const zeusPath = path.join(dir, 'zeus.js');
const versionPath = path.join(dir, 'version.txt');

// Read current version
let version = '1.9.0';
if (fs.existsSync(versionPath)) {
    version = fs.readFileSync(versionPath, 'utf8').trim();
}

console.log('Reading Source.js...');
if (!fs.existsSync(sourcePath)) {
    console.error('Source.js not found!');
    process.exit(1);
}
const sourceContent = fs.readFileSync(sourcePath, 'utf8');

// Strip first line (import statement)
const sourceLines = sourceContent.split('\n');
let strippedSource = sourceLines.slice(1).join('\n');

// Replace export default { with const __WORKER_EXPORT__ = {
strippedSource = strippedSource.replace('export default {', 'const __WORKER_EXPORT__ = {');

const finalPayloadSource = (strippedSource.trim() + '\nreturn __WORKER_EXPORT__;').trim();

// XOR encryption with key 105
const key = 105;
const encoder = new TextEncoder();
const bytes = encoder.encode(finalPayloadSource);
const hexArray = [];
for (let i = 0; i < bytes.length; i++) {
    const xorByte = bytes[i] ^ key;
    const hex = xorByte.toString(16).padStart(2, '0');
    hexArray.push(hex);
}
const payloadHex = hexArray.join('');

// Construct zeus.js template
const template = `import { connect } from "cloudflare:sockets";
const CURRENT_VERSION = '${version}';
const UPDATE_FIX = "constsCURRENT_VERSION='d.d.d'";
const _0xPayload = "${payloadHex}";
const _0xKey = 105;
const _0xBytes = new Uint8Array((_0xPayload.match(/.{1,2}/g) || []).map(x => parseInt(x, 16) ^ _0xKey));
const _0xCode = new TextDecoder().decode(_0xBytes);
const _0xRuntime = new Function("connect", _0xCode)(connect);
export default _0xRuntime;
`;

fs.writeFileSync(zeusPath, template, 'utf8');
console.log(`Successfully compiled Source.js into zeus.js! (Version ${version})`);
