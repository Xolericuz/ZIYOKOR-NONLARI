# ZIYOKOR NONLARI — P2P Decentralized Marketplace

> Peer-to-peer bread marketplace. Zero central server. Offline-first.

## Architecture: P2P Mesh Network

```
┌─────────────────────────────────────────────────────┐
│              ZIYOKOR NONLARI P2P NETWORK             │
│                                                     │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐    │
│   │ NONVOY 1 │◄───►│ RELAY    │◄───►│ XARIDOR 1│    │
│   │ (seller) │     │ (peer    │     │(customer)│    │
│   └──────────┘     │ discovery│     └──────────┘    │
│        ▲           └──────────┘          ▲           │
│        │                                 │           │
│        ▼                                 ▼           │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐    │
│   │ NONVOY 2 │◄───►│ XARIDOR 2│◄───►│ XARIDOR 3│    │
│   │ (seller) │     │(customer)│     │(customer)│    │
│   └──────────┘     └──────────┘     └──────────┘    │
│                                                     │
│   WebRTC / WebSocket P2P (Gun.js graph)             │
└─────────────────────────────────────────────────────┘
```

## Key Principles

| Principle | Description |
|-----------|-------------|
| **No Central Server** | Every device is a peer. No master database. |
| **Offline-first** | Data stored in IndexedDB. Syncs when online. |
| **P2P Data Sync** | Gun.js graph database syncs across peers. |
| **GPS-based Discovery** | Bakeries found by GPS proximity. |
| **Privacy** | Data stays on your device. |

## Tech Stack

```
Frontend:       HTML/CSS/JS + Gun.js
Database:       Gun.js RAD + IndexedDB (local)
P2P Network:    Gun.js graph (WebSocket/WebRTC)
Relay Peer:     Node.js (optional, for peer discovery)
GPS:            Geolocation API
Security:       Gun.js SEA (default)
```

## How It Works

### Seller (Nonvoy)
1. Opens app → publishes bakery data to Gun.js graph
2. GPS location broadcast to network
3. Products published as graph nodes
4. Listens for incoming orders via Gun.js `.on()` subscription
5. Updates order status → auto-syncs to customer

### Customer (Xaridor)
1. Opens app → subscribes to nearby bakeries via Gun.js
2. GPS used to sort bakeries by distance
3. Browses products synced from seller's device
4. Places order → written to Gun.js graph → P2P sent to seller
5. Receives real-time status updates

## Files

```
p2p/
├── index.html          # Full P2P marketplace app
├── peer-relay.js       # Optional WebSocket relay for peer discovery
├── package.json        # Dependencies (gun, ws)
└── README.md
```

## Run Locally

```bash
# Install dependencies
cd p2p && npm install

# Start relay peer (helps devices find each other)
node peer-relay.js

# Open index.html in browser (or serve it)
npx serve . -p 3000

# Open in 2+ browsers/devices:
# - One as seller (nonvoy)
# - Another as customer (xaridor)
```

## Why P2P?

| **Server-based** | **P2P (this)** |
|-----------------|----------------|
| Needs backend infrastructure | Zero server cost |
| Data on central DB | Data on your device |
| Single point of failure | No central failure |
| Needs scaling | Scales naturally |
| High hosting costs | Free to run |
| Privacy concerns | Data stays local |
