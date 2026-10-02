# 🏆 TrustChain — Master Manual Testing & Live Demo Presentation Guide
> **Audience**: Evaluators, Hackathon Judges, Investors, Technical Clients, and QA Testers.  
> **Pre-requisite**: Local Hardhat Node, Backend API, and Frontend Vite dev servers are running.

---

## 📋 Quick Setup & Pre-Flight Check

Before starting your demonstration, ensure all three services are active:
- ⛓️ **Blockchain Node**: `http://127.0.0.1:8545` (Running via `npx hardhat node`)
- 🛡️ **Backend API & Relayer**: `http://localhost:5000` (Status: `http://localhost:5000/health`)
- 💻 **Frontend Web App**: `http://localhost:5173`

*(Agar kabhi data reset karna ho, bas `cd backend && npm run seed` run karein — 10 seconds mein fresh demo data generate ho jayega).*

---

## 🔑 Demo Credentials Cheat-Sheet

| Role / Persona | Portal Route | Login Email / Phone | Password / OTP |
|---|---|---|---|
| **Super Admin** | [`/#admin`](http://localhost:5173/#admin) | `admin@trustchain.com` | `Password123!` |
| **Brand Manufacturer** | [`/#dashboard`](http://localhost:5173/#dashboard) | `mfg@cipla.com` | `Password123!` |
| **Logistics Distributor** | [`/#partner`](http://localhost:5173/#partner) | `distributor@apexlogistics.com` | `Password123!` |
| **Retail Chemist (POS)** | [`/#partner`](http://localhost:5173/#partner) | `retailer@metrolife.com` | `Password123!` |
| **End Consumer** | [`/#consumer`](http://localhost:5173/#consumer) | `consumer@gmail.com` | Phone: `+919876543210` / OTP: `123456` |
| **Public Guest** | [`/#verify`](http://localhost:5173/#verify) | *(No login required)* | Any camera / manual code input |

---

## 🎬 8-Stage Step-by-Step Manual Demo Flow

---

### STAGE 1: Super Admin — Brand Approval & Mission Control
> **Storyline**: *"A new pharmaceutical brand (Zydus / Cadila) has applied for onboarding. The Super Admin reviews legal credentials and executes on-chain authorization."*

1. Open browser and go to: **`http://localhost:5173/#admin`**
2. Login with:
   - **Email**: `admin@trustchain.com`
   - **Password**: `Password123!`
3. **Overview Screen**:
   - Observe the live platform KPIs: Total Registered Batches, Verified Scans, Counterfeits Prevented, and Relayer Gas Health.
4. **Brand Approvals Tab**:
   - Click on **"Brand Approvals"** in the sidebar.
   - Click on the pending brand **"Cadila Lifesciences"** or **"Zydus Healthcare"**.
   - Review legal compliance documents: GSTIN Certificate, CIN registration, and Drug Manufacturing License.
   - Click **"Approve Brand"**:
     - *Observe*: A success toast notification appears with an Ethereum Transaction Hash. The Relayer dispatches an on-chain transaction giving this brand the `MANUFACTURER_ROLE`.
5. **System Health Tab**:
   - Navigate to **"System Health"** in the sidebar.
   - Check the **Relayer Balance**, **Smart Contract Event Listener Status (Active)**, and **Transaction Safety Queue**.

---

### STAGE 2: Brand Manufacturer — Batch Creation, Merkle Tree & QR Download
> **Storyline**: *"Cipla manufactures 50 units of Asthalin Inhaler. The platform calculates a cryptographic Merkle tree, anchors the root on Ethereum, and generates printable QR codes."*

1. Open a new incognito window or log out and go to: **`http://localhost:5173/#dashboard`**
2. Login with:
   - **Email**: `mfg@cipla.com`
   - **Password**: `Password123!`
3. **Products Tab**:
   - View the active pharmaceutical catalog: *Cipla Asthalin Inhaler* and *Cipla Montair-LC Tablets*.
4. **Batches Tab -> Create New Batch**:
   - Click **"Batches"** -> **"Create Batch"** button.
   - Select Product: **Cipla Asthalin Inhaler 100mcg**.
   - Enter Batch ID: e.g., `BATCH-2026-LIVE-01`.
   - Enter Quantity: `20` units.
   - Select Protection Level: **Standard (Merkle Root)**.
   - Expiry Date: Select any future date (e.g., 2028).
   - Click **"Confirm & Register Batch"**:
     - *Observe*: The backend generates individual unit codes, computes sha256/keccak256 leaf hashes, builds the Merkle tree, and calls `TrustChainRegistry.registerBatch()` on-chain via the relayer!
5. **Export & Download QR Codes**:
   - On the newly created batch, click **"Download QR Codes"**.
   - Choose **"ZIP Archive"** (individual high-res QR files) or **"Printable PDF Sticker Sheet"**.
   - Show how factory printers use these exact QR codes for blister packaging.

---

### STAGE 3: Brand Manufacturer — Dispatch Custody to Distributor
> **Storyline**: *"The factory loads boxes onto a temperature-controlled truck and transfers digital custody to Apex Logistics."*

1. Still in Manufacturer Dashboard (**`/#dashboard`**), go to **"Supply Chain"** -> **"Transfers"**.
2. Click **"New Custody Transfer"**.
3. Fill details:
   - Select Batch: `BATCH-2026-DEL99` (or your newly created batch).
   - Quantity to Transfer: `10` units.
   - Receiving Carrier: Select **"Apex Logistics & Cold Chain Hub (Distributor)"**.
   - Vehicle / Shipping Bill: `DL-1AA-4092 / WAYBILL-9812`.
4. Click **"Dispatch Shipment"**:
   - *Observe*: Custody state moves to `Pending Acceptance` with an on-chain transfer ID.

---

### STAGE 4: Distributor — Accept Custody & Forward to Retail Pharmacy
> **Storyline**: *"The distributor verifies physical goods arrival at the warehouse, confirms custody on-chain, and delivers stock to Metro Life Chemist."*

1. Open **`http://localhost:5173/#partner`** in a new tab.
2. Login with:
   - **Email**: `distributor@apexlogistics.com`
   - **Password**: `Password123!`
3. **Incoming Shipments**:
   - View the incoming transfer from Cipla.
   - Click **"Accept Shipment"**:
     - *Observe*: Custody updates to `Accepted`. The 10 units are now part of Apex Logistics' inventory holding.
4. **Forward Stock to Retailer**:
   - Click **"Transfer Stock"**.
   - Select Batch: `BATCH-2026-DEL99`.
   - Destination: **"Metro Life Chemist (Retailer)"**.
   - Quantity: `5` units.
   - Click **"Dispatch to Retailer"**.

---

### STAGE 5: Retail Pharmacy — Scan & Sell (Point of Sale POS)
> **Storyline**: *"A customer walks into the pharmacy to buy the inhaler. The pharmacist scans the QR code and inputs the customer's phone number. An SMS invite link with OTP is generated."*

1. Log out or open incognito tab: **`http://localhost:5173/#partner`**
2. Login with:
   - **Email**: `retailer@metrolife.com`
   - **Password**: `Password123!`
3. **Accept Incoming Stock**:
   - Under **"Incoming Shipments"**, click **"Accept Shipment"** from Apex Logistics.
4. **Point of Sale (POS) Checkout**:
   - Go to **"Scan & Sell"** tab.
   - In Unit Code, enter: **`TC-8924-GENUINE`** (or scan camera QR).
   - Enter Customer Mobile: **`+91 98765 43210`**.
   - Click **"Complete Sale"**:
     - *Observe*: Smart contract marks this specific unit's state as `Sold`.
     - *SMS Simulation*: A simulated SMS appears with:
       - **Claim Token**: `CLM-TEST-TOK-123`
       - **Mock Verification OTP**: `123456`
       - **Direct Claim URL**: `http://localhost:5173/#consumer`

---

### STAGE 6: Consumer — Digital Ownership Claim & Warranty Activation
> **Storyline**: *"The consumer taps the SMS link, confirms their identity, and receives an immutable Digital Certificate of Authenticity and +50 TrustPoints."*

1. Go to: **`http://localhost:5173/#consumer`**
2. Login with:
   - **Email**: `consumer@gmail.com`
   - **Password**: `Password123!`
   *(Or click "Quick Phone Login" with `+919876543210` and OTP `123456`)*
3. **Claim Product**:
   - Click **"Claim Product Ownership"**.
   - Enter Claim Token or OTP: `123456`.
   - Click **"Activate Digital Warranty"**:
     - *Observe*:
       - Unit is now permanently bound to the consumer's custodial wallet.
       - A tamper-proof **Digital Certificate of Authenticity** appears in the **Vault**.
       - Loyalty Reward: **+50 TPTS (TrustPoints)** tokens minted to the user's ledger!
4. **Rewards Store**:
   - Click **"Rewards Store"** tab.
   - View brand coupons (Cipla ₹100 Off, Apollo Pharmacy 15% Discount).
   - Click **"Redeem"** to show instant unlock.

---

### STAGE 7: Public Verification — The 4 Security States (Zero-Login)
> **Storyline**: *"Demonstrating how any guest scanning a QR code instantly sees cryptographic truth without needing an app or login."*

Open each of the following URLs in separate tabs to show the 4 distinct UI security states:

#### 1. 🟢 Genuine Product (Green Badge + 4-Stage Custody Chain)
- **URL**: **`http://localhost:5173/verify/TC-8924-GENUINE`**
- **What to Observe**:
  - **Badge**: Vibrant Green **"GENUINE & AUTHENTIC"**.
  - **Product Info**: Cipla Asthalin Inhaler, MRP ₹185, Active Expiry Jan 2028.
  - **Full Custody Timeline**:
    1. *Factory Manufactured* (Cipla Plant)
    2. *Apex Logistics* (Cold Chain Transit)
    3. *Metro Life Chemist* (Retail Shelf)
    4. *Consumer Sold & Claimed*
  - **Technical Cryptographic Proof**: Toggle open to view Merkle Root hash, Leaf hash, and on-chain verification seal.

#### 2. 🟡 Clone Velocity Anomaly (Yellow Badge — Counterfeit Ring Alert)
- **URL**: **`http://localhost:5173/verify/TC-CLONE-DELHI`**
- **What to Observe**:
  - **Badge**: Warning Yellow **"SUSPICIOUS / POTENTIAL CLONE"**.
  - **Flag Reason**: *"Scanned in 2 different cities (Delhi & Mumbai) within 5 minutes"*.
  - **Explanation**: A single physical QR code cannot travel between Delhi and Mumbai in 5 minutes. The platform's clone velocity engine detected unauthorized photocopying!

#### 3. 🟠 Recalled Batch (Orange Advisory State)
- **URL**: **`http://localhost:5173/verify/TC-RECALL-99`**
- **What to Observe**:
  - **Badge**: Orange Warning **"RECALLED BATCH"**.
  - **Safety Advisory Notice**: *"Packaging seal integrity failure detected during secondary warehouse quality audit. DO NOT CONSUME OR SELL. Contact brand customer support for free replacement."*

#### 4. 🔴 Counterfeit / Unindexed Code (Red Warning State)
- **URL**: **`http://localhost:5173/verify/RANDOM-INVALID-XYZ`**
- **What to Observe**:
  - **Badge**: Red **"NOT FOUND / COUNTERFEIT ALERT"**.
  - **Notice**: *"This cryptographic code was never registered on the TrustChain blockchain registry."*
  - Prompts consumer to click **"Report Fake & Earn ₹500 Bounty"**.

---

### STAGE 8: Consumer Counterfeit Bounty & Manufacturer Hotspot Map
> **Storyline**: *"A consumer reports a fake medicine. The Super Admin reviews the photo evidence and awards a 500-point community bounty. The manufacturer's risk heatmap updates in real-time."*

1. **Consumer Reports Counterfeit**:
   - Go to **`http://localhost:5173/#consumer`**.
   - Click **"Report Counterfeit"**.
   - Fill details:
     - Suspect Product: *Cipla Asthalin Inhaler*
     - Shop Name: *Shree Ganesh Chemist, Chandni Chowk, Delhi*
     - Description: *Blurry packaging print, missing hologram seal.*
   - Click **"Submit Incident Report"**.
2. **Admin Adjudication & Bounty Payout**:
   - Open **`http://localhost:5173/#admin`**.
   - Go to **"Fake Reports"** tab.
   - Click on the new report submitted for *Chandni Chowk, Delhi*.
   - Inspect the evidence details and click **"Mark as Valid & Disburse Bounty"**:
     - *Observe*: Relayer calls `TrustPoints.mint(consumer, 500)` on-chain!
3. **Consumer Balance Verification**:
   - Switch back to Consumer tab: Consumer balance immediately reflects **+500 TPTS Bounty Reward**!
4. **Manufacturer Hotspot Heatmap**:
   - Switch back to Manufacturer tab (**`/#dashboard`**).
   - Go to **"Hotspot Map"** tab:
     - *Observe*: Delhi cluster risk rating updates dynamically, pinpointing the flagged counterfeit cluster for law enforcement investigation!

---

## 🎯 Key Presentation Takeaways

When explaining this project to an evaluator, emphasize these 4 pillars:
1. **Gasless Zero-Friction Web3**: Consumers and retailers don't need crypto wallets, seed phrases, or gas fees. The Relayer handles everything silently in the background.
2. **O(log N) Scalability via Merkle Trees**: Instead of writing 10,000 unit hashes to Ethereum (costing thousands in gas), a single 32-byte Merkle root anchors millions of units.
3. **Physics-Based Clone Detection**: QR codes can be photocopied, but physical items cannot teleport. Velocity tracking detects counterfeit clones immediately.
4. **Community Incentivization**: Turning consumers into an active anti-counterfeit taskforce through blockchain-verified bounties and brand loyalty rewards.
