/**
 * ZIYOKOR NONLARI — P2P Relay Peer
 * 
 * Minimal Gun.js relay server for peer discovery.
 * This is the ONLY server component — it does NOT store any data.
 * It just helps peers find each other over WebSocket.
 * 
 * No database. No storage. No authentication.
 * Pure WebSocket relay for P2P connectivity.
 */

const http = require('http');
const Gun = require('gun');

const PORT = 8765;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', peers: Gun.peers || 0 }));
    return;
  }

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>ZIYOKOR NONLARI P2P Relay</h1>
      <p>Peers connected: <span id="count">0</span></p>
      <p>This relay does NOT store data. It only helps peers discover each other.</p>
      <p>Port: ${PORT}</p>
      <script>
        const ws = new WebSocket('ws://'+location.host);
        ws.onopen = () => ws.send(JSON.stringify({type:'ping'}));
        setInterval(() => {
          fetch('/health').then(r=>r.json()).then(d => document.getElementById('count').textContent = d.peers || '?');
        }, 2000);
      </script>
    `);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const gun = Gun({
  web: server,
  peers: [],
  multicast: false,
  localStorage: false,
  radisk: false,
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🔄 ZIYOKOR NONLARI P2P Relay`);
  console.log(`  ─────────────────────────────`);
  console.log(`  Relay Peer : ws://0.0.0.0:${PORT}/gun`);
  console.log(`  Health     : http://0.0.0.0:${PORT}/health`);
  console.log(`  Port       : ${PORT}`);
  console.log(`  ─────────────────────────────`);
  console.log(`  ℹ️  This relay does NOT store marketplace data.`);
  console.log(`  ℹ️  It only helps peers discover each other via WebSocket.\n`);
});

// Track connected peers
gun.on('hi', peer => {
  const count = Object.keys(Gun.peers || {}).length + 1;
  console.log(`  📡 Peer connected  (total: ${count})`);
});

gun.on('bye', peer => {
  const count = Object.keys(Gun.peers || {}).length;
  console.log(`  📡 Peer disconnected (total: ${count})`);
});

process.on('SIGINT', () => {
  console.log('\n  Relay shutting down...');
  process.exit(0);
});
