# 🛡️ TrustChain Platform

> [!TIP]
> 📖 **Pura System Samajhne Ke Liye Master Walkthrough Dekhein**: 👉 **[`PROJECT_WALKTHROUGH.md`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/PROJECT_WALKTHROUGH.md)** 👈 (Complete architecture, Mermaid flowcharts, smart contract design, clone velocity engine, gamification, and step-by-step lifecycle).

TrustChain is a product authentication, supply chain provenance, and customer loyalty platform.

- **Master System Walkthrough**: [`PROJECT_WALKTHROUGH.md`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/PROJECT_WALKTHROUGH.md)
- **Postman API Collection (68 Requests)**: [`backend/postman_collection.json`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/backend/postman_collection.json)
- **OpenAPI 3.0 Specification**: [`backend/openapi.json`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/backend/openapi.json)
- **Smart Contracts**: [`contracts-project/`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/contracts-project)
- **Backend API & Relayer**: [`backend/`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/backend)
- **Frontend Web App**: [`frontend/`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/frontend)

---

## ⚡ Complete Setup & Execution Guide (Step-by-Step)

### Step 1: Start MongoDB
- **Local MongoDB**: Run `net start MongoDB` or `mongod --dbpath "C:\data\db"`
- **MongoDB Atlas**: Or paste your free cloud MongoDB URI in `backend/.env` (`MONGO_URI=mongodb+srv://...`)

### Step 2: Start Local Hardhat Blockchain Node
```bash
# Terminal 1:
cd contracts-project
npm install
npx hardhat node
```
*Starts local Ethereum JSON-RPC node on `http://127.0.0.1:8545`.*

### Step 3: Deploy Smart Contracts
```bash
# Terminal 2:
cd contracts-project
npx hardhat run scripts/deploy.js --network localhost
```
*Deploys `TrustPoints`, `TrustChainRegistry`, and `TrustChain` contracts, authoring addresses to `deployments/localhost.json`.*

### Step 4: Seed Database & On-Chain Batch
```bash
# Terminal 3:
cd backend
npm install
npm run seed
```
*Seeds System Admin, Approved Brand with 10,000 INR credits, Product Catalog, Live On-Chain Batch with Merkle Root, Distributor, Retailer, Consumer, 35+ Scans across 8 Indian Cities, and Counterfeit Hotspots!*

### Step 5: Start Backend API & Relayer Server
```bash
# In Terminal 3 (or new terminal):
cd backend
npm run dev
```
*API active on `http://localhost:5000/api/v1` with live safety-net event listener.*

### Step 6: Start Frontend Application
```bash
# Terminal 4:
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

### 🔑 Demo Credentials:
- **Admin**: `admin@trustchain.com` | `Password123!`
- **Manufacturer**: `mfg@cipla.com` | `Password123!`
- **Distributor**: `distributor@apexlogistics.com` | `Password123!`
- **Retailer**: `retailer@metrolife.com` | `Password123!`
- **Consumer**: `consumer@gmail.com` (+919876543210, Mock OTP: `123456`)

---

## ⚡ 2. Frontend Web App Kaise Chalayein

Frontend React + Vite + Tailwind CSS par bana hai.

```bash
cd frontend
npm install
npm run dev
```

Browser mein `http://localhost:5173` kholein.

### Frontend Pages & Dashboards:
- **Landing Page**: `http://localhost:5173/`
- **Product Verification**: `http://localhost:5173/#verify` (ya test code verify karein)
- **Manufacturer Dashboard**: `http://localhost:5173/#dashboard` (batch registration, QR download, inventory & counterfeit hotspots)
- **Supply Chain Partner Dashboard**: `http://localhost:5173/#partner` (stock transfers & custody)
- **Consumer App**: `http://localhost:5173/#consumer` (product claim, resale & rewards)
- **Admin Dashboard**: `http://localhost:5173/#admin` (platform role management, brand approvals & fake report reviews)

### 🔍 Live Test Codes:
- **Genuine Product**: `http://localhost:5173/verify/TC-8924-GENUINE`
- **Clone Anomaly**: `http://localhost:5173/verify/TC-CLONE-DELHI`
- **Sold & Awaiting Claim**: `http://localhost:5173/verify/TC-SOLD-UNCLAIMED`
- **Claimed Unit & Active Warranty**: `http://localhost:5173/verify/TC-CLAIMED-UNIT`
- **Recalled Batch Unit**: `http://localhost:5173/verify/TC-RECALL-99`

---

## ⚡ 3. Smart Contracts Kaise Use Karein

Contracts folder mein navigate karein:
```bash
cd contracts-project
npm install
```

### Commands Cheat Sheet

| Command | Kya karta hai (Explanation) |
|---|---|
| `npm run compile` | Saare Solidity smart contracts compile karta hai aur ABI/bytecode build karta hai. |
| `npm test` | Poore **72 automated tests** run karta hai (Roles, Merkle proof, transfers, unit sale, recall, points). |
| `npm run node` | Local Ethereum blockchain node start karta hai (`http://127.0.0.1:8545`) 20 funded test accounts ke saath. |
| `npm run deploy:local` | Local node par contracts deploy karta hai, relayer ko roles assign karta hai, aur addresses/ABIs export karta hai. |
| `npm run seed:local` | Registry contract mein demo manufacturer aur 2 supply chain partners authorize karta hai. |

For detailed documentation, architectural rules, and contract breakdowns, see [`contracts-project/README.md`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/contracts-project/README.md).