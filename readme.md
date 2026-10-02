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

### Step 7: Run Automated Verification & Test Suites (Zero-Config)
```bash
# 1. Run all 72 Smart Contract Unit Tests (Roles, Merkle Proofs, Custody, Resale, Rewards):
cd contracts-project
npm test

# 2. Run the Full 14-Step Golden Path Automated Demo Flow:
cd backend
npm run test:demo
```

---

## 🎬 Full Interactive Demo Flow (Click-by-Click)

Follow this 14-stage journey through the live application:

| Step # | Stage | Persona & Screen | Action & What to Observe |
|---|---|---|---|
| **1** | **Brand Approval** | **Super Admin** (`#admin`) | Open **Brand Approvals** tab. Inspect Cadila / Zydus legal documents (GST, CIN, Drug License). Click **Approve Manufacturer** — on-chain authorization transaction is dispatched. |
| **2** | **Batch & QR Minting** | **Brand Manufacturer** (`#dashboard`) | Go to **Batches** -> **Create Batch**. Select product, enter 100 units, pick *Standard* protection. Click **Confirm & Register Batch**. Download the generated QR codes as **ZIP** or printable **PDF**. |
| **3** | **Factory Dispatch** | **Manufacturer** (`#dashboard`) | Go to **Supply Chain** -> **New Custody Transfer**. Select batch, set quantity to 50 units, target carrier: **Apex Logistics** (Distributor). |
| **4** | **Custody Acceptance & Forwarding** | **Distributor** (`#partner`) | Log in as `distributor@apexlogistics.com`. View **Incoming Shipments**, click **Accept Shipment**. Next, go to **Transfer Stock** and dispatch 25 units to **Metro Life Chemist** (Retailer). |
| **5** | **Point of Sale (POS)** | **Retailer** (`#partner`) | Log in as `retailer@metrolife.com`. Go to **Scan & Sell**. Camera/manual scan unit QR code, enter customer phone `+91 98765 43210`. Click **Complete Sale**. An SMS invite link with claim token & OTP `123456` is generated. |
| **6** | **SMS Claim & Warranty** | **Consumer** (`#consumer`) | Open the SMS claim link (or enter OTP `123456` in **Claim Product** modal). Digital Certificate of Authenticity is activated in the **Vault** and **+50 TrustPoints** are awarded. |
| **7** | **Public Genuine Scan** | **Guest / Consumer** (`/verify/TC-8924-GENUINE`) | Point camera or type code into public verification bar. Status shows **Genuine** (Green badge) with complete 4-stage custody timeline (Factory -> Distributor -> Pharmacy -> Owner). |
| **8** | **Clone Velocity Anomaly** | **Public Scanner** (`/verify/TC-CLONE-DELHI`) | Simulates the exact same code scanned from another city (e.g., Delhi vs. Bengaluru) within 2 minutes. Status flips to **Suspicious** (Yellow badge): *"Scanned in 2 different cities within 5 minutes"*. |
| **9** | **Counterfeit Photo Report** | **Consumer** (`#consumer`) | Click **Report Counterfeit**. Attach packaging photo, select retailer shop, and submit incident. Report enters admin audit queue with status *Submitted*. |
| **10** | **Admin Adjudication** | **Super Admin** (`#admin`) | Go to **Fake Reports**. Inspect evidence photo, shop address, and GPS coordinates. Click **Mark as Valid & Disburse Bounty**. |
| **11** | **Bounty Credit** | **Consumer** (`#consumer`) | Consumer's rewards ledger receives **+500 TrustPoints** bounty reward with notification. Points can be redeemed for brand vouchers in the **Rewards Store**. |
| **12** | **Hotspot Heatmap Update** | **Manufacturer** (`#dashboard`) | Go to **Analytics** -> **Hotspot Map**. Delhi risk rating updates dynamically to reflect the validated counterfeit alert. |
| **13** | **Recalled Batch Unit** | **Public Scanner** (`/verify/TC-RECALL-99`) | Verifying a recalled unit displays **Recalled** (Orange warning banner) with safety advisory notice: *"DO NOT CONSUME OR SELL. Contact brand customer support"*. |
| **14** | **Unknown Counterfeit Code** | **Public Scanner** (`/verify/RANDOM-INVALID-XYZ`) | Verifying an unindexed code displays **Not Found / Counterfeit** (Red warning banner) prompting consumer to file a bounty report. |

---

### 🔑 Demo Credentials:
- **Admin**: `admin@trustchain.com` | `Password123!`
- **Manufacturer**: `mfg@cipla.com` | `Password123!`
- **Distributor**: `distributor@apexlogistics.com` | `Password123!`
- **Retailer**: `retailer@metrolife.com` | `Password123!`
- **Consumer**: `consumer@gmail.com` (+919876543210, Mock OTP: `123456`)

---

## ⚡ 2. Frontend Web App Details

Frontend is powered by React 19 + Vite + Tailwind CSS with modern glassmorphism aesthetics.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Key Routes & Portals:
- **Landing Page**: `http://localhost:5173/`
- **Product Verification**: `http://localhost:5173/#verify`
- **Manufacturer Dashboard**: `http://localhost:5173/#dashboard` (Batch creation, Merkle roots, QR download as PDF/ZIP, supply chain transfers, partners, recalls, billing & hotspots)
- **Supply Chain Partner Dashboard**: `http://localhost:5173/#partner` (Incoming custody, accept/reject, inventory, transfer & POS retail sale)
- **Consumer App**: `http://localhost:5173/#consumer` (Digital vault, warranty certificates, P2P resale, rewards ledger, store coupon unlocking, fake reporting, and self-custodial wallet export)
- **Admin Dashboard**: `http://localhost:5173/#admin` (Mission control, brand KYC/KYB approvals, fake reports review with bounties, users/brands directory, reward partners, and system health relayer queue)

### 🔍 Live Test Codes:
- **Genuine Product**: `http://localhost:5173/verify/TC-8924-GENUINE`
- **Clone Anomaly**: `http://localhost:5173/verify/TC-CLONE-DELHI`
- **Sold & Awaiting Claim**: `http://localhost:5173/verify/TC-SOLD-UNCLAIMED`
- **Claimed Unit & Active Warranty**: `http://localhost:5173/verify/TC-CLAIMED-UNIT`
- **Recalled Batch Unit**: `http://localhost:5173/verify/TC-RECALL-99`
- **Unknown Fake Code**: `http://localhost:5173/verify/RANDOM-INVALID-XYZ`

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