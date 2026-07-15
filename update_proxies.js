const fs = require('fs');
const path = require('path');
const https = require('https');
const net = require('net');

const PROXY_DIR = path.join(__dirname, 'proxy');

const SOURCES = [
    'https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=socks5&proxy_format=ipport&format=text',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt',
    'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/officialputuid/Socks5-Proxy-List/master/socks5.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt'
];

function fetchText(url) {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(data));
        }).on('error', (err) => {
            console.error(`Failed to fetch from ${url}:`, err.message);
            resolve('');
        });
    });
}

function checkSocks5(host, port, timeout = 3000) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        let state = 0;
        let resolved = false;

        const cleanup = (result) => {
            if (resolved) return;
            resolved = true;
            socket.destroy();
            resolve(result);
        };

        socket.setTimeout(timeout);
        
        socket.connect(port, host, () => {
            state = 1;
            socket.write(Buffer.from([0x05, 0x01, 0x00]));
        });

        socket.on('data', (data) => {
            if (state === 1) {
                if (data.length >= 2 && data[0] === 0x05 && data[1] === 0x00) {
                    state = 2;
                    socket.write(Buffer.from([0x05, 0x01, 0x00, 0x01, 1, 1, 1, 1, 0, 80]));
                } else {
                    cleanup(false);
                }
            } else if (state === 2) {
                if (data.length >= 2 && data[0] === 0x05 && data[1] === 0x00) {
                    cleanup(true);
                } else {
                    cleanup(false);
                }
            }
        });

        socket.on('timeout', () => cleanup(false));
        socket.on('error', () => cleanup(false));
        socket.on('close', () => cleanup(false));
    });
}

async function limitConcurrency(tasks, limit) {
    const results = [];
    const executing = new Set();
    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        executing.add(p);
        const clean = () => executing.delete(p);
        p.then(clean, clean);
        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }
    return Promise.all(results);
}

function batchGeoLookup(ips) {
    return new Promise((resolve) => {
        if (ips.length === 0) return resolve([]);
        
        const postData = JSON.stringify(ips);
        const req = https.request({
            hostname: 'ip-api.com',
            path: '/batch?fields=query,countryCode',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve([]);
                }
            });
        });
        
        req.on('error', () => resolve([]));
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('Fetching SOCKS5 proxy lists from sources...');
    const allProxies = new Set();
    
    for (const url of SOURCES) {
        const text = await fetchText(url);
        const matches = text.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+\b/g);
        if (matches) {
            matches.forEach(p => allProxies.add(p));
        }
    }
    
    const uniqueProxies = Array.from(allProxies);
    console.log(`Fetched ${uniqueProxies.length} unique SOCKS5 proxies. Testing them concurrently (limit: 150)...`);
    
    // We'll limit checking to 2000 random proxies if the count is extremely large, to keep it within sensible resource usage.
    const shuffled = uniqueProxies.sort(() => 0.5 - Math.random());
    const candidates = shuffled.slice(0, 2000);
    
    const tasks = candidates.map(proxy => async () => {
        const [host, portStr] = proxy.split(':');
        const port = parseInt(portStr);
        const ok = await checkSocks5(host, port, 3000);
        return { proxy, host, ok };
    });
    
    const testResults = await limitConcurrency(tasks, 150);
    const workingProxies = testResults.filter(r => r.ok);
    console.log(`Found ${workingProxies.length} working SOCKS5 proxies.`);
    
    if (workingProxies.length === 0) {
        console.log('No working proxies found. Exiting.');
        return;
    }
    
    console.log('Performing geolocation lookup on working proxies...');
    const workingIps = workingProxies.map(r => r.host);
    const geoData = [];
    
    // ip-api.com batch accepts max 100 queries per request
    for (let i = 0; i < workingIps.length; i += 100) {
        const batch = workingIps.slice(i, i + 100);
        const res = await batchGeoLookup(batch);
        geoData.push(...res);
        // Wait 1.5 seconds to avoid exceeding ip-api.com rate limits (max 15 batch requests per minute)
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    const geoMap = new Map();
    geoData.forEach(item => {
        if (item && item.query && item.countryCode) {
            geoMap.set(item.query, item.countryCode.toUpperCase());
        }
    });
    
    // Group proxies by country
    const countryGroups = {};
    workingProxies.forEach(item => {
        const country = geoMap.get(item.host) || 'ALL';
        if (!countryGroups[country]) {
            countryGroups[country] = [];
        }
        countryGroups[country].push(item.proxy);
    });
    
    console.log('Updating files in proxy directory...');
    if (!fs.existsSync(PROXY_DIR)) {
        fs.mkdirSync(PROXY_DIR);
    }
    
    // Overwrite existing country text files with the new working proxies
    const files = fs.readdirSync(PROXY_DIR);
    const countryFiles = files.filter(f => f.endsWith('.txt'));
    
    // Map existing countries so we clear them if we have no new working proxies for them
    const existingCountries = new Set(countryFiles.map(f => f.replace('.txt', '').toUpperCase()));
    
    // Write new working proxies to country files
    for (const [country, proxies] of Object.entries(countryGroups)) {
        const filename = `${country}.txt`;
        const filepath = path.join(PROXY_DIR, filename);
        fs.writeFileSync(filepath, proxies.join('\n') + '\n', 'utf8');
        console.log(`Updated ${filename} with ${proxies.length} proxies.`);
        existingCountries.delete(country);
    }
    
    // Clear files for countries that no longer have any working proxies
    for (const country of existingCountries) {
        const filename = `${country}.txt`;
        const filepath = path.join(PROXY_DIR, filename);
        // We write an empty string to clear the file rather than deleting it
        fs.writeFileSync(filepath, '', 'utf8');
        console.log(`Cleared ${filename} (no working proxies found).`);
    }
    
    console.log('Proxy update complete!');
}

main().catch(err => {
    console.error('Error during execution:', err);
});
