# 🛡️ TrustChain Backend API & Relayer Service

TrustChain backend is an enterprise-grade REST API and Blockchain Relayer built with **Node.js, Express, MongoDB (Mongoose), ethers v6, JWT, and Zod**.

---

## 🏛️ Core Principles & Architecture

1. **Invisible Blockchain Layer**:
   - End-users (manufacturers, partners, consumers) never interact directly with MetaMask, sign raw transactions, or hold cryptocurrency.
   - The backend relayer wallet (`RELAYER_ROLE`) signs all on-chain transactions and sponsors the gas.
   - Internal deterministic wallet addresses are automatically assigned to users for transparent provenance tracking.

2. **Prepaid INR-Based Credits (Never Crypto)**:
   - Manufacturers purchase or top up credits denominated in INR (₹1 INR = 1 Credit).
   - Registering a product batch deducts INR credits from the manufacturer's prepaid ledger.

3. **Data Separation**:
   - **Blockchain**: Stores immutable trust anchors — Merkle roots, batch quantities, expiry timestamps, emergency recalls, transfer custody holdings, and ERC-20 TrustPoints (TPTS).
   - **MongoDB**: Stores rich off-chain operational data — user profiles, product descriptions, images, individual unit codes, Merkle proofs, scan audit logs, and INR transaction ledgers.

4. **Standards**:
   - Base Route Prefix: `/api/v1`
   - Consistent JSON envelope:
     ```json
     { "success": true, "data": { ... } }
     // OR
     { "success": false, "error": { "message": "...", "code": "..." } }
     ```
   - Role-Based Access Control (RBAC): `consumer`, `manufacturer`, `distributor`, `retailer`, `admin`.
   - Mocked OTP (`123456`) and SMS printed to console via service interface.

---

## ⚙️ Environment Variables Reference

Create or inspect `.env` in the `/backend` folder:

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | HTTP port for Express API server |
| `NODE_ENV` | `development` | Environment mode (`development` or `production`) |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/trustchain` | MongoDB connection URI (or MongoDB Atlas connection string) |
| `JWT_SECRET` | `trustchain_jwt_secret_dev_2026_secure_key` | Secret key used for signing JSON Web Tokens |
| `JWT_EXPIRES_IN` | `7d` | Access token lifespan |
| `ENCRYPTION_KEY` | `0123456789abcdef...` | 32-byte hex key for encrypting custodial wallet private keys |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin for frontend client requests |
| `RPC_URL` | `http://127.0.0.1:8545` | Ethereum EVM JSON-RPC provider (Local Hardhat Node) |
| `RELAYER_PRIVATE_KEY` | `0x59c6995e998f...` | Hardhat Account #1 with `RELAYER_ROLE` permissions |
| `DEPLOYMENTS_FILE_PATH`| `../contracts-project/deployments/localhost.json` | Path to deployed smart contract addresses |
| `ABI_DIR_PATH` | `../contracts-project/abi` | Directory containing contract ABI JSON artifacts |
| `INR_COST_PER_UNIT` | `1` | Base prepaid credits deducted per serialized unit |
| `INR_COST_PER_UNIT_STANDARD` | `1` | Prepaid INR credits deducted for Standard tier units |
| `INR_COST_PER_UNIT_HIGH_VALUE`| `2` | Prepaid INR credits deducted for HighValue anti-tamper units |
| `POINTS_PER_CLAIM` | `50` | Default TrustPoints (TPTS) rewarded upon warranty claim |
| `MOCK_OTP_CODE` | `123456` | Static OTP bypass for demo and automated testing |
| `CLONE_SCAN_THRESHOLD`| `50` | Scan count limit before auto-flagging duplicate QR code |
| `CLONE_WINDOW_MINUTES`| `5` | Time window for rapid multi-city anomaly velocity detection |

---

## 🚀 Complete Step-by-Step Setup Guide

Follow these steps to run the complete TrustChain ecosystem from scratch:

### Step 1: Run MongoDB
Ensure MongoDB is running locally or connect to a free MongoDB Atlas cloud instance:
- **Local MongoDB**: Start your local MongoDB server:
  ```bash
  # Windows (Command Prompt / PowerShell as Administrator):
  net start MongoDB
  # OR run directly:
  mongod --dbpath "C:\data\db"
  ```
- **MongoDB Atlas**: If using Atlas, simply update `MONGO_URI` in `backend/.env`:
  ```ini
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/trustchain?retryWrites=true&w=majority
  ```

---

### Step 2: Start the Hardhat Blockchain Node
Open a dedicated terminal and start the local EVM node:
```bash
cd contracts-project
npm install
npx hardhat node
```
*Output:* Starts a JSON-RPC node at `http://127.0.0.1:8545` with 20 pre-funded test accounts containing 10,000 ETH each. Keep this terminal running.

---

### Step 3: Deploy Smart Contracts to Local Node
Open a second terminal to deploy contracts and configure role-based access control:
```bash
cd contracts-project
npx hardhat run scripts/deploy.js --network localhost
```
*Output:* Deploys `TrustPoints`, `TrustChainRegistry`, and `TrustChain`, grants `RELAYER_ROLE` to Hardhat Account #1 (`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`), and writes deployment addresses to `contracts-project/deployments/localhost.json`.

---

### Step 4: Seed MongoDB & Register Demo Batches On-Chain
Open a third terminal and run the master seeder:
```bash
cd backend
npm install
npm run seed
```
*What `npm run seed` does:*
1. **Platform Actors**: Creates System Admin, Approved Brand with 10,000 INR credits & Growth plan, Distributor, Retailer, and Demo Consumer.
2. **Product Catalog**: Adds Cipla Asthalin Inhaler and Montair-LC Tablets.
3. **Live On-Chain Batch**: Computes Merkle Tree, authorizes the manufacturer on-chain, and executes `registerBatch` on the `TrustChainRegistry` contract via the relayer wallet!
4. **Supply Chain Partners**: Onboards distributor and retailer with authorized smart contract roles and verified inventory.
5. **Historical Scans**: Seeds 35+ scans across 8 Indian cities (Delhi, Mumbai, Bengaluru, Kolkata, Hyderabad, Ahmedabad, Pune, Jaipur) showcasing genuine scans, clone velocity anomalies, and suspicious attempts.
6. **Crowdsourced Reports**: Seeds counterfeit reports with GPS coordinates, photos, and review statuses across multiple Indian states.
7. **Invoices & Rewards**: Creates tax invoices with 18% GST and initializes the loyalty rewards catalog.

---

### Step 5: Start the Backend API Server
```bash
cd backend
npm run dev
```
*Output:* Starts Express API server on `http://localhost:5000/api/v1` and initializes the live smart contract safety-net event listener.

---

### Step 6: Start Frontend Client (Optional)
```bash
cd frontend
npm install
npm run dev
```
*Output:* Accessible at `http://localhost:5173`.

---

## 📬 Postman Collection & OpenAPI 3.0 Specification

We have included pre-built, production-ready API specifications covering all 23 modules and 68 endpoints:

- **Postman Collection (v2.1.0)**: [`backend/postman_collection.json`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/backend/postman_collection.json)
  - Features automated test scripts that dynamically capture and save `adminToken`, `mfgToken`, `distToken`, `retailerToken`, and `consumerToken` collection variables upon login.
  - Organized into 15 logical folders with pre-configured headers, query parameters, and sample JSON payloads.
  - Directly importable into **Postman**, **Insomnia**, or **VS Code Thunder Client**.
- **OpenAPI 3.0 Specification**: [`backend/openapi.json`](file:///c:/Users/ghosh/OneDrive/Desktop/obsidian/backend/openapi.json)
  - Standard OpenAPI 3.0 schema importable into **Swagger UI**, **Redoc**, or API gateway tools.
- **Re-generate Specifications**:
  ```bash
  cd backend
  node scripts/generate-postman.js
  ```

---

## 🎯 Step-by-Step Golden Path Demo Flow

| Step # | Action / Capability | Role / Credential | Endpoint | Expected Outcome |
|:---:|---|---|---|---|
| **1** | **Check System Health & Gas Relayer** | Admin (`admin@trustchain.com`) | `GET /api/v1/admin/health` | Returns `systemStatus: HEALTHY`, relayer wallet balance in **Network Gas Credits** (e.g. `9,984,200 Credits`), DB ping, RPC block height, and active listener telemetry. |
| **2** | **View Approved Brand & Prepaid Credits** | Manufacturer (`mfg@cipla.com`) | `GET /api/v1/billing/overview` | Shows `creditBalance: 10,000`, active `GROWTH` plan, and past tax invoices. |
| **3** | **Create New Batch On-Chain** | Manufacturer (`mfg@cipla.com`) | `POST /api/v1/batches` | Generates SHA-256 Merkle tree, stores Merkle root on Ethereum, creates serialized unit QR codes, and deducts INR credits from prepaid ledger. |
| **4** | **Download High-Res QR Archive** | Manufacturer (`mfg@cipla.com`) | `GET /api/v1/batches/BATCH-2026-DEL99/qr-zip` | Streams a ready-to-print ZIP containing PNG QR codes for factory packaging. |
| **5** | **Custody Transfer to Distributor** | Manufacturer (`mfg@cipla.com`) | `POST /api/v1/transfers` | Transfers 20 units to distributor. Distributor reviews and accepts with `POST /transfers/:id/accept` (+2 Partner Reputation score). |
| **6** | **Retail Point-of-Sale Sale** | Retailer (`retailer@metrolife.com`) | `POST /api/v1/units/sell` | Marks unit sold to consumer phone `+919876543210`, records sale on-chain, and issues claim token `CLM-TEST-TOK-123`. |
| **7** | **Consumer Public QR Verification** | Anyone / Consumer (Public) | `GET /api/v1/verify/TC-8924-GENUINE` | Verifies cryptographic Merkle proof on-chain; returns product image, manufacturer details, and 100% Genuine status. |
| **8** | **Clone Velocity Anomaly Trigger** | Attacker / Scanner | `GET /api/v1/verify/TC-CLONE-DELHI?city=Mumbai` | Triggers clone anomaly engine (same code scanned in Delhi and Mumbai within 2 minutes) -> flags scan as `suspicious`. |
| **9** | **Claim Product Warranty & Loyalty** | Consumer (`consumer@gmail.com`) | `POST /api/v1/units/claim` | Enters OTP `123456` and claim token -> registers warranty and mints 10 TrustPoints ERC-20 tokens directly to consumer wallet. |
| **10**| **Submit Fake Report & Earn Bounty** | Consumer (`consumer@gmail.com`) | `POST /api/v1/reports` | Uploads shop name, geo coordinates, and counterfeit photo. Admin validates via `PATCH /admin/reports/:id/review`, awarding 100 points bounty. |
| **11**| **View Hotspot Heatmap & Analytics** | Manufacturer (`mfg@cipla.com`) | `GET /api/v1/reports/hotspots` | Returns multi-city coordinates, counterfeit frequency clusters, and top risk retail zones across India. |
| **12**| **Emergency Product Recall** | Manufacturer (`mfg@cipla.com`) | `POST /api/v1/batches/BATCH-2026-DEL99/recall` | Invokes `recallBatch` on Ethereum; instantly updates MongoDB and marks all units recalled. Subsequent QR scans warn: "CRITICAL RECALL ALERT". |

---

## 🧪 Testing with cURL Examples

### 1. Health Check
```bash
curl http://localhost:5000/api/v1/health
```

---

### 2. Consumer Authentication (Phone + Mock OTP: 123456)
Rate-limited to max 20 requests per 15 minutes.

```bash
# Step A: Request OTP
curl -X POST http://localhost:5000/api/v1/auth/consumer/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'

# Step B: Consumer Signup with OTP
curl -X POST http://localhost:5000/api/v1/auth/consumer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aman Consumer",
    "phone": "9876543210",
    "otp": "123456"
  }'

# Step C: Consumer Login with OTP
curl -X POST http://localhost:5000/api/v1/auth/consumer/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "otp": "123456"
  }'
```

---

### 3. Business Authentication (Manufacturer, Partner, Admin - Email + Password)
Uses `bcryptjs` password hashing and JWT.

```bash
# Step A: Business Signup (Manufacturer, Distributor, Retailer, or Admin)
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cipla Pharma Admin",
    "email": "admin@cipla.com",
    "password": "Password123!",
    "role": "manufacturer",
    "companyName": "Cipla Pharmaceuticals Ltd.",
    "phone": "9988776655"
  }'

# Step B: Business Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cipla.com",
    "password": "Password123!"
  }'
```

---

### 4. User Profile, Logout & Password Reset Stub

```bash
# Get Profile (/auth/me)
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <TOKEN>"

# Logout
curl -X POST http://localhost:5000/api/v1/auth/logout

# Forgot Password Stub (Logs mock reset link to console)
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cipla.com"}'
```

---

### 5. Brand KYB Onboarding & Document Upload

Manufacturers start in `pending` state and are blocked from registering product batches until approved.

```bash
# A. Get My Brand Profile (/brands/me)
curl http://localhost:5000/api/v1/brands/me \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# B. Upload KYB Documents (PDF/PNG/JPG via Multer multipart/form-data)
curl -X POST http://localhost:5000/api/v1/brands/me/documents \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -F "documentType=INC_CERTIFICATE" \
  -F "documents=@sample_gst_certificate.pdf"

# C. Update Brand KYB Info (GST, CIN, Company Name)
curl -X PUT http://localhost:5000/api/v1/brands/me \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Cipla Pharmaceuticals Ltd.",
    "gst": "22AAAAA0000A1Z5",
    "cin": "L24239MH1935PLC002380"
  }'
```

---

### 6. Admin Brand KYB Review & On-Chain Approval

```bash
# A. List Pending Brands
curl http://localhost:5000/api/v1/admin/brands?status=pending \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# B. Get Brand Detail
curl http://localhost:5000/api/v1/admin/brands/<BRAND_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# C. Approve Brand (Executes authorizeManufacturer on-chain via Relayer)
curl -X POST http://localhost:5000/api/v1/admin/brands/<BRAND_ID>/approve \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# D. Request More Info from Manufacturer
curl -X POST http://localhost:5000/api/v1/admin/brands/<BRAND_ID>/request-info \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"details": "Please upload a clearer copy of your GST registration certificate."}'

# E. Reject Brand
curl -X POST http://localhost:5000/api/v1/admin/brands/<BRAND_ID>/reject \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Company CIN does not match MCA database registry."}'
```

---

### 7. Manufacturer Product Catalog & Management (Isolated per Manufacturer)

Approved manufacturers can create, view, search, update, and delete their products with image uploads.

```bash
# A. Create Product (Multipart Form-Data with up to 5 images)
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -F "name=Asthalin Inhaler 100mcg" \
  -F "category=Pharmaceuticals" \
  -F "description=Salbutamol 100mcg CFC-free pressurised inhalation canister." \
  -F "sku=AST-INH-100" \
  -F "price=185.50" \
  -F "images=@sample_product_front.png" \
  -F "images=@sample_product_back.png"

# B. List Products (Scoped to logged-in manufacturer; supports search, category, isActive, pagination)
# Search & filter:
curl "http://localhost:5000/api/v1/products?search=Asthalin&category=Pharmaceuticals&page=1&limit=10" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# C. Get Single Product Details (Only allowed if manufacturer owns product or if Admin)
curl http://localhost:5000/api/v1/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# D. Update Product (Fields and/or append new images)
curl -X PUT http://localhost:5000/api/v1/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -F "price=195.00" \
  -F "description=Updated formulation notes." \
  -F "images=@additional_image.jpg"

# E. Delete Product
curl -X DELETE http://localhost:5000/api/v1/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

### 8. Supply Chain Partner Onboarding (Distributor & Retailer Network)

Onboards distributors and retailers into a manufacturer's authorized supply chain.
- **Invite Flow**: Manufacturer or distributor creates an invite link. Partner signs up, instantly generating their custodial wallet, calling `authorizePartner` on-chain, and activating the partner.
- **Self-Apply Flow**: Partner applies with business details, GST, and shop address. Application begins in `pending` status until approved by the upstream partner or admin.
- **On Approval**: Custodial wallet is created, `authorizePartner` is called on-chain via the Relayer wallet, and status becomes `approved`.

```bash
# A. Create Partner Invite Link (Manufacturer or Distributor)
curl -X POST http://localhost:5000/api/v1/partners/invite \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@medlogistics.in",
    "role": "distributor",
    "businessName": "MedLogistics Supply Corp",
    "name": "Rajesh Kumar",
    "phone": "9876543210"
  }'

# B. Join via Invite Link (Public - creates custodial wallet & on-chain authorization)
curl -X POST http://localhost:5000/api/v1/partners/join-invite \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<INVITE_TOKEN>",
    "name": "Rajesh Kumar",
    "password": "Password123!",
    "phone": "9876543210",
    "gst": "27AABCU9603R1ZM",
    "businessDetails": {
      "storeType": "Wholesale Pharma Depot",
      "tradeLicense": "DL-MH-2026-9912",
      "pan": "AABCU9603R"
    },
    "location": {
      "address": "Plot 45, MIDC Industrial Area",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400093"
    }
  }'

# C. Partner Self-Apply (Public - starts in pending status)
curl -X POST http://localhost:5000/api/v1/partners/self-apply \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apollomed@chemists.in",
    "password": "Password123!",
    "name": "Sunil Verma",
    "phone": "9988776655",
    "role": "retailer",
    "businessName": "Apollo Med Store",
    "gst": "27AABCU9603R1ZM",
    "businessDetails": {
      "storeType": "Retail Pharmacy",
      "tradeLicense": "RET-MH-8812"
    },
    "location": {
      "address": "Shop 12, Main Market, Andheri East",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400069"
    },
    "upstreamId": "<MANUFACTURER_USER_ID>"
  }'

# D. Upstream Partner or Admin Approves Partner (Creates wallet & authorizes on-chain)
curl -X POST http://localhost:5000/api/v1/partners/<PARTNER_ID>/approve \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# E. Upstream Partner or Admin Rejects Partner
curl -X POST http://localhost:5000/api/v1/partners/<PARTNER_ID>/reject \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Unable to verify state drug license registration."}'

# F. Manufacturer Lists Partners (Search, filter by role/status, pagination)
curl "http://localhost:5000/api/v1/partners?role=distributor&status=approved&page=1&limit=10" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# G. Manufacturer Views Partner Detail
curl http://localhost:5000/api/v1/partners/<PARTNER_ID> \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

---

### 9. Check & Top Up INR Credits (Manufacturer)
```bash
# Check credit balance
curl http://localhost:5000/api/v1/credits/balance \
  -H "Authorization: Bearer <TOKEN>"

# Top up ₹2,000 credits
curl -X POST http://localhost:5000/api/v1/credits/topup \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amountINR": 2000, "referenceId": "UPI-PAY-77821"}'
```

---

### 10. Batch Creation & Merkle Tree Registration (Standard & HighValue)

Registers a batch on-chain and off-chain.
- **Configurable Rates**: Standard (₹1/unit default) vs HighValue (₹2/unit default). HighValue costs more.
- **KYB Check**: Requires approved Brand.
- **Credit Check**: Validates and deducts prepaid INR credits, recording a `CreditLedger` entry.
- **Unique Unit Codes**: Auto-generates cryptographically unique unit serials. For HighValue units, generates a secret scratch code stored hashed with SHA-256 (`scratchCodeHash`).
- **Merkle Tree**: Built using `merkletreejs` with `keccak256(abi.encodePacked(unitCode))`, matching the smart contract.
- **Inventory Units**: Saved to MongoDB with initial status `inStock` and `soldState: 0`.

```bash
# A. Create Standard Protection Batch (₹1 / unit)
curl -X POST http://localhost:5000/api/v1/batches \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "product": "<PRODUCT_ID>",
    "batchNumber": "BATCH-2026-DEL99",
    "quantity": 10,
    "protectionLevel": "Standard",
    "mfgDate": "2026-10-01",
    "expiryDate": "2027-10-01"
  }'

# B. Create HighValue Protection Batch (₹2 / unit, includes hashed secret scratch codes)
curl -X POST http://localhost:5000/api/v1/batches \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "product": "<PRODUCT_ID>",
    "batchNumber": "BATCH-2026-HV101",
    "quantity": 5,
    "protectionLevel": "HighValue",
    "expiryDate": "2028-01-01"
  }'

# C. List Batches (Manufacturer sees only their own; supports search & filters)
curl "http://localhost:5000/api/v1/batches?search=DEL99&protectionLevel=Standard&page=1&limit=10" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# D. Get Batch Detail & Unit Inventory Statistics
curl http://localhost:5000/api/v1/batches/BATCH-2026-DEL99 \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# E. Download All Batch QR Codes as ZIP of PNGs (Streamed)
# Encodes: FRONTEND_URL/verify/<unitCode>
curl "http://localhost:5000/api/v1/batches/BATCH-2026-DEL99/qr/zip" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  --output BATCH-2026-DEL99-qr-codes.zip

# F. Download Printable Multi-Page A4 PDF Sheet (Streamed, 12 labels/page)
curl "http://localhost:5000/api/v1/batches/BATCH-2026-DEL99/qr/pdf" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  --output BATCH-2026-DEL99-qr-sheet.pdf
```

---

### 11. Public Product Verification & Clone Detection (`GET /verify/:code`)

No login required. Supports optional `Authorization: Bearer <TOKEN>` header to link scans to a consumer account and enable loyalty reward claims.

```bash
# A. Verify Product Unit (Standard Public Verification)
curl "http://localhost:5000/api/v1/verify/BATCH-2026-DEL99-U0001"

# (Also available at root alias)
curl "http://localhost:5000/verify/BATCH-2026-DEL99-U0001"

# B. Verify with Simulated Location (via query parameter or header)
curl "http://localhost:5000/api/v1/verify/BATCH-2026-DEL99-U0001?city=Mumbai"

# Or via custom demo header:
curl "http://localhost:5000/api/v1/verify/BATCH-2026-DEL99-U0001" \
  -H "x-simulate-city: Mumbai"

# C. Test Clone Detection (Multi-City Scan within 5 Minutes)
# Step 1: Scan from Mumbai
curl "http://localhost:5000/api/v1/verify/BATCH-2026-DEL99-U0001?city=Mumbai"
# Result: state = "genuine"

# Step 2: Scan same code within 5 minutes from Bengaluru
curl "http://localhost:5000/api/v1/verify/BATCH-2026-DEL99-U0001?city=Bengaluru"
# Result: state = "suspicious", reason = "Scanned in 2 different cities within 5 minutes"

# D. Verify with Optional Consumer Auth (Enables Loyalty & Warranty Rewards)
curl "http://localhost:5000/api/v1/verify/BATCH-2026-DEL99-U0001" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### Verification States Matrix:
- `genuine`: Authenticity confirmed cryptographically on-chain via Merkle proof.
- `soldAwaitingClaim`: Purchased at retail, awaiting customer warranty / reward claim.
- `suspicious`: Clone detected — high scan velocity (>50 scans) OR scanned in 2 different cities within 5 minutes.
- `recalled`: Batch flagged as recalled on-chain/DB; returns recall reason.
- `expired`: Current date is past batch expiry date.
- `fake`: Merkle proof validation failed against registered batch root.
- `notFound`: Code not registered in TrustChain system.


---

### 12. Retail Sale & Warranty Claim Flow (`/sell` and `/claim`)

#### A. Retail Sale (Retailer Only)
- Automatically finds or creates the consumer by phone number (with a deterministic custodial Ethereum wallet).
- Calls `markUnitSold` on-chain with the cryptographic Merkle proof.
- Marks unit as sold in DB with the retailer, customer, purchase date, and warranty duration (default 12 months).
- Creates a cryptographic claim token and claim link: `FRONTEND_URL/claim?token=...&code=...`.
- Sends a mock SMS notification printed to the console (with mock OTP `123456`).
- **Strictly blocks double sale** if unit has already been sold.

```bash
curl -X POST http://localhost:5000/api/v1/sell \
  -H "Authorization: Bearer <RETAILER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BATCH-2026-DEL99-U0001",
    "customerPhone": "9876543210",
    "warrantyMonths": 12,
    "price": 1499,
    "invoiceNumber": "INV-2026-0042"
  }'

# (Also available at /api/v1/units/sell and /sell)
```

#### B. Consumer Warranty & Reward Claim (`POST /claim`)
- Consumer presents the `claimToken` (or unit code) and the `otp` received via SMS (`123456`).
- Calls `claimUnit` on-chain via the relayer wallet.
- Mints 50 ERC-20 TrustPoints (`TPTS`) loyalty reward tokens to the consumer's wallet.
- Marks the unit as claimed in MongoDB and updates the sale record warranty status to `Claimed`.
- **Strictly blocks double claim** if already claimed.

```bash
curl -X POST http://localhost:5000/api/v1/claim \
  -H "Authorization: Bearer <CONSUMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "claimToken": "<CLAIM_TOKEN_FROM_STEP_A>",
    "otp": "123456"
  }'

# (Also available at /api/v1/units/claim and /claim)
```

#### C. View Consumer's Claimed Products & Active Warranties
```bash
curl "http://localhost:5000/api/v1/units/my-products" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### D. View Retailer's Sales History
```bash
curl "http://localhost:5000/api/v1/units/sales" \
  -H "Authorization: Bearer <RETAILER_TOKEN>"
```


---

### 13. Emergency Product Recall (Manufacturer / Admin)
```bash
curl -X POST http://localhost:5000/api/v1/batches/BATCH-2026-DEL99/recall \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Packaging defect detected at distribution facility."}'
```

---

### 14. Partner Network Onboarding (Invite & Self-Apply Flows)

```bash
# A. Manufacturer/Distributor generates an Invite link for a partner
curl -X POST http://localhost:5000/api/v1/partners/invite \
  -H "Authorization: Bearer <MANUFACTURER_OR_DISTRIBUTOR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "National Logistics Ltd",
    "email": "contact@nationallogistics.com",
    "role": "distributor",
    "contactPerson": "Rajesh Kumar",
    "phone": "9876500001",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  }'

# B. Partner joins and sets password using the invite token
curl -X POST http://localhost:5000/api/v1/partners/join-invite \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<INVITE_TOKEN_FROM_STEP_A>",
    "password": "SecurePassword123!",
    "gst": "27AAACN0123M1Z5",
    "pan": "AAACN0123M",
    "location": {
      "address": "Warehouse 4, Bhiwandi",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "421302"
    }
  }'

# C. Partner self-applies directly without an invite
curl -X POST http://localhost:5000/api/v1/partners/self-apply \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Metro Pharmacy & Retail",
    "email": "metro.retail@example.com",
    "password": "SecurePassword123!",
    "role": "retailer",
    "gst": "07AAACN9876M1Z1",
    "contactPerson": "Pooja Sharma",
    "phone": "9876500002",
    "location": {
      "address": "Shop 12, Connaught Place",
      "city": "New Delhi",
      "state": "Delhi",
      "pincode": "110001"
    }
  }'

# D. Manufacturer or Admin approves partner application
# (Automatically provisions encrypted custodial wallet and authorizes on-chain)
curl -X POST http://localhost:5000/api/v1/partners/<PARTNER_ID>/approve \
  -H "Authorization: Bearer <MANUFACTURER_OR_ADMIN_TOKEN>"

# E. Reject partner application with reason
curl -X POST http://localhost:5000/api/v1/partners/<PARTNER_ID>/reject \
  -H "Authorization: Bearer <MANUFACTURER_OR_ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Invalid GST certificate provided."}'

# F. List approved and pending partners
curl "http://localhost:5000/api/v1/partners?role=distributor&status=approved" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

---

### 15. Batch Custody Transfers & Partner Inventory

```bash
# A. Initiate / Create Batch Custody Transfer (Manufacturer -> Distributor or Distributor -> Retailer)
# Broadcasts initiateBatchTransfer on-chain and logs initial timeline event
curl -X POST http://localhost:5000/api/v1/transfers \
  -H "Authorization: Bearer <MANUFACTURER_OR_DISTRIBUTOR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "BATCH-2026-DEL99",
    "toPartnerId": "<RECIPIENT_PARTNER_ID>",
    "quantity": 25,
    "notes": "Dispatch via Express Cold-Chain logistics"
  }'

# B. Get Incoming Shipments for Partner (Pending Acceptance)
curl "http://localhost:5000/api/v1/transfers/incoming" \
  -H "Authorization: Bearer <PARTNER_TOKEN>"

# C. List Transfers with Tab Counts (Pending, Accepted, Rejected, All)
curl "http://localhost:5000/api/v1/transfers?direction=incoming&status=Pending" \
  -H "Authorization: Bearer <PARTNER_TOKEN>"

# D. View Transfer Detail with Status History Timeline
curl "http://localhost:5000/api/v1/transfers/<TRANSFER_ID>" \
  -H "Authorization: Bearer <PARTNER_TOKEN>"

# E. Accept Incoming Transfer
# Broadcasts respondBatchTransfer on-chain, creates/updates PartnerInventory,
# and transfers unit custody to partner
curl -X POST http://localhost:5000/api/v1/transfers/<TRANSFER_ID>/respond \
  -H "Authorization: Bearer <PARTNER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "accept": true,
    "notes": "Physical seals verified and intact."
  }'

# F. Reject Incoming Transfer (Strictly Requires a Reason)
# Broadcasts respondBatchTransfer(transferId, false) on-chain
curl -X POST http://localhost:5000/api/v1/transfers/<TRANSFER_ID>/respond \
  -H "Authorization: Bearer <PARTNER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "accept": false,
    "reason": "Shipment carton was punctured during transit; seals damaged."
  }'

# G. Partner Inventory Grouped by Batch
# Returns current in-stock quantities, total received, total transferred out,
# expiry dates, and stock status ('In Stock', 'Low Stock', 'Out of Stock')
curl "http://localhost:5000/api/v1/transfers/inventory" \
  -H "Authorization: Bearer <PARTNER_TOKEN>"

# (Also available at alias: GET /api/v1/partners/inventory)
curl "http://localhost:5000/api/v1/partners/inventory" \
  -H "Authorization: Bearer <PARTNER_TOKEN>"
```

---

### 16. Consumer Product Management, Secondary Resale & Scan History

```bash
# A. Get Consumer Products List (shows status: 'Pending Claim' and 'Claimed')
curl "http://localhost:5000/api/v1/consumer/products" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"

# (Also available at /api/v1/units/my-products)
curl "http://localhost:5000/api/v1/units/my-products" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"

# B. Get Detailed Product View (with Warranty, Purchase Proof & Ownership Timeline)
curl "http://localhost:5000/api/v1/consumer/products/BATCH-2026-DEL99-U0001" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"

# C. Resale: Owner initiates unit transfer to a buyer phone number
# Calls initiateUnitTransfer on-chain and provisions buyer custodial wallet if new
curl -X POST http://localhost:5000/api/v1/consumer/resale/transfer \
  -H "Authorization: Bearer <CONSUMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BATCH-2026-DEL99-U0001",
    "buyerPhone": "9876500003",
    "price": 800,
    "notes": "Secondary sale in pristine condition."
  }'

# D. Resale: View incoming & outgoing resale transfers with status tabs
curl "http://localhost:5000/api/v1/consumer/resale/transfers?direction=incoming" \
  -H "Authorization: Bearer <BUYER_TOKEN>"

# E. Resale: Buyer accepts or rejects resale transfer
# Calls respondUnitTransfer on-chain and updates unit ownership in DB
curl -X POST http://localhost:5000/api/v1/consumer/resale/transfers/<TRANSFER_ID>/respond \
  -H "Authorization: Bearer <BUYER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "accept": true
  }'

# Or to reject:
curl -X POST http://localhost:5000/api/v1/consumer/resale/transfers/<TRANSFER_ID>/respond \
  -H "Authorization: Bearer <BUYER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "accept": false,
    "reason": "Price negotiation not settled."
  }'

# F. Get Scan History of the Logged-in User
curl "http://localhost:5000/api/v1/consumer/scans" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

---

### 17. Rewards System, Loyalty Streaks & Rewards Store

#### A. Manufacturer Campaign Settings (`POST /api/v1/rewards/campaign`)
Manufacturers define the point distribution rules: points per genuine scan, streak milestone bonuses, referral rewards, and daily caps.

```bash
curl -X POST http://localhost:5000/api/v1/rewards/campaign \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "pointsPerScan": 10,
    "streakBonus": 25,
    "streakDaysThreshold": 5,
    "referralBonus": 50,
    "fakeReportBonus": 100,
    "dailyCap": 50
  }'
```

#### B. First-Scan Reward Hooked into Verification Flow
When a logged-in consumer scans an authentic product, points are automatically minted to their wallet if it's the first time they scan that unit (capped by daily limit).

```bash
curl "http://localhost:5000/api/v1/verify/BATCH-2026-DEL99-U0001" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```
*Verification response automatically contains earned reward data:*
```json
{
  "success": true,
  "data": {
    "state": "genuine",
    "rewardsEarned": {
      "pointsAwarded": 10,
      "streakBonusAwarded": false,
      "currentStreak": 1,
      "totalPointsBalance": 60,
      "txHash": "0x5ab1..."
    }
  }
}
```

#### C. Consumer Points Balance & On-Chain Status
```bash
curl "http://localhost:5000/api/v1/rewards/balance" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### D. View Points Ledger History
```bash
curl "http://localhost:5000/api/v1/rewards/history?page=1&limit=10" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### E. View Daily Scan Streak & Milestone Progress
```bash
curl "http://localhost:5000/api/v1/rewards/streak" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### F. View Referral Code & Stats
```bash
curl "http://localhost:5000/api/v1/rewards/referral" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### G. Apply Friend's Referral Code (Earns Welcome Bonus)
```bash
curl -X POST http://localhost:5000/api/v1/rewards/referral/apply \
  -H "Authorization: Bearer <CONSUMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"code": "TC-A1B2C3"}'
```

#### H. Browse Rewards Store Catalogue
```bash
curl "http://localhost:5000/api/v1/rewards/store" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### I. Redeem Points for Voucher (Burns Tokens On-Chain & Generates Coupon Code)
```bash
curl -X POST http://localhost:5000/api/v1/rewards/redeem \
  -H "Authorization: Bearer <CONSUMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"offerId": "<REWARD_OFFER_ID>"}'
```
*Response JSON:*
```json
{
  "success": true,
  "data": {
    "redemptionId": "RDM-MN87K2-F1",
    "couponCode": "AMZN-3B9F-MN87K2",
    "pointsSpent": 100,
    "remainingBalance": 45,
    "txHash": "0x9812...",
    "message": "Successfully redeemed offer! Your coupon code is: AMZN-3B9F-MN87K2"
  }
}
```

#### J. View Consumer's Active Coupon Codes
```bash
curl "http://localhost:5000/api/v1/rewards/redemptions" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

---

### 18. 🚨 Counterfeit Reports, Compliance Review & Manufacturer Hotspots

A complete whistleblowing, anti-counterfeit intelligence, and geographical enforcement subsystem:
- **Guest & Consumer Submissions**: Anonymous guests can report counterfeits freely; authenticated consumers automatically qualify for bonus reward points upon validation.
- **Photo Uploads & Geolocation**: Supports up to 5 high-resolution evidence photos via Multer, GPS coordinates, shop name, and detailed observation notes.
- **Immediate Brand Alerts**: Dispatches real-time SMS alerts to the manufacturer's registered compliance mobile and prints formatted terminal banners.
- **Admin Review & On-Chain Rewards**: Marking a report as `Valid` automatically invokes `rewardTrustPoints` on-chain and writes an immutable `RewardLedger` entry with `FAKE_REPORT_BONUS`.
- **Manufacturer Hotspot Intelligence**: Aggregates counterfeit reports and clone/suspicious scans by geographical area with filters (product, batch, city, date range), returning heatmap-ready coordinates and sorted top-risk zones.

---

#### A. Submit Counterfeit Report as Guest (Unauthenticated)
```bash
curl -X POST http://localhost:5000/api/v1/reports \
  -F "shopName=Shree Krishna Medicals" \
  -F "comment=Packaging text blurry and QR code scratched off. Medicine looks substandard." \
  -F "city=Mumbai" \
  -F "latitude=19.0760" \
  -F "longitude=72.8777" \
  -F "guestName=Anonymous Buyer" \
  -F "guestPhone=+919876543210" \
  -F "photos=@/path/to/evidence1.jpg"
```
*Response JSON:*
```json
{
  "success": true,
  "data": {
    "reportId": "RPT-M7K2P9-AB12",
    "status": "Submitted",
    "isGuest": true,
    "shopName": "Shree Krishna Medicals",
    "city": "Mumbai",
    "photosCount": 1,
    "rewardsEligible": false,
    "message": "Counterfeit report submitted successfully. Thank you for protecting consumers!"
  }
}
```

#### B. Submit Counterfeit Report as Logged-In Consumer (Linked to Unit / Batch)
```bash
curl -X POST http://localhost:5000/api/v1/reports \
  -H "Authorization: Bearer <CONSUMER_TOKEN>" \
  -F "shopName=Metro Chemist & Druggists" \
  -F "comment=Bought this unit; seal was broken and hologram missing." \
  -F "code=TC-UNIT-981240" \
  -F "city=Delhi" \
  -F "address=Shop 14, Karol Bagh Market, Delhi" \
  -F "photos=@/path/to/fake_box.jpg"
```
*Response JSON:*
```json
{
  "success": true,
  "data": {
    "reportId": "RPT-M7K2Q4-E901",
    "status": "Submitted",
    "isGuest": false,
    "shopName": "Metro Chemist & Druggists",
    "city": "Delhi",
    "photosCount": 1,
    "rewardsEligible": true,
    "message": "Counterfeit report submitted successfully! If validated by compliance, you will receive reward bonus points."
  }
}
```

#### C. Consumer: View My Submitted Reports
```bash
curl "http://localhost:5000/api/v1/reports/my-reports" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### D. Get Single Report Detail
```bash
# Accessible by reporter, manufacturer of the brand, or admin
curl "http://localhost:5000/api/v1/reports/RPT-M7K2Q4-E901" \
  -H "Authorization: Bearer <CONSUMER_TOKEN>"
```

#### E. Admin: List All Reports with Filters & Status Tabs
```bash
# Filter by status (Submitted, UnderReview, Valid, Invalid), city, brand, or date range
curl "http://localhost:5000/api/v1/admin/reports?status=Submitted&city=Delhi&page=1&limit=20" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
*Response JSON:*
```json
{
  "success": true,
  "data": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "reports": [ ... ],
    "tabs": {
      "submitted": 5,
      "underReview": 3,
      "valid": 3,
      "invalid": 1,
      "all": 12
    }
  }
}
```

#### F. Admin: Review Report & Award Bonus Points
```bash
# Valid status triggers on-chain minting of fake-report bonus points if filed by logged-in user
curl -X PATCH http://localhost:5000/api/v1/admin/reports/RPT-M7K2Q4-E901/review \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Valid",
    "notes": "Verified counterfeit batch in Karol Bagh market. Confirmed duplicate packaging."
  }'
```
*Response JSON:*
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "673f8a91c102...",
      "reportId": "RPT-M7K2Q4-E901",
      "status": "Valid",
      "adminReview": {
        "reviewedBy": "673f8a...",
        "reviewedAt": "2026-10-02T08:50:00.000Z",
        "reviewNotes": "Verified counterfeit batch...",
        "pointsAwarded": 100,
        "txHash": "0x4bc2..."
      }
    },
    "pointsAwarded": 100,
    "txHash": "0x4bc2...",
    "message": "Report validated and 100 bonus points awarded to reporter!"
  }
}
```

#### G. Manufacturer & Admin: Anti-Counterfeit Hotspot Intelligence
```bash
# Aggregates fake reports and suspicious/clone scans by geographical area
curl "http://localhost:5000/api/v1/reports/hotspots?city=Mumbai&product=Paracetamol" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# Also available at the shortcut route:
curl "http://localhost:5000/api/v1/hotspots" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```
*Response JSON:*
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncidents": 14,
      "totalReports": 8,
      "totalSuspiciousScans": 6,
      "highRiskCitiesCount": 2,
      "citiesMonitored": 5
    },
    "heatmapData": [
      {
        "lat": 19.076,
        "lng": 72.8777,
        "city": "Mumbai",
        "weight": 9,
        "intensity": 1.0,
        "reportsCount": 5,
        "suspiciousScansCount": 4
      },
      {
        "lat": 28.6139,
        "lng": 77.209,
        "city": "Delhi",
        "weight": 5,
        "intensity": 0.7,
        "reportsCount": 3,
        "suspiciousScansCount": 2
      }
    ],
    "topAreas": [
      {
        "city": "Mumbai",
        "state": "Maharashtra",
        "lat": 19.076,
        "lng": 72.8777,
        "totalIncidents": 9,
        "reportsCount": 5,
        "suspiciousScansCount": 4,
        "riskLevel": "HIGH",
        "topReportedShops": [
          "Shree Krishna Medicals",
          "Dadar Central Chemist"
        ],
        "recentReports": [ ... ]
      }
    ]
  }
}
```

---

### 19. Manufacturer Analytics, Batch Recalls & Partner Reputation

#### A. Comprehensive Manufacturer Analytics
Aggregates overview KPIs, daily scan timeseries, city-wise distribution, genuine/suspicious/fake split, and detailed per-batch performance with optional date and product filtering.
```bash
curl "http://localhost:5000/api/v1/analytics/manufacturer?startDate=2026-01-01&endDate=2026-12-31" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# Also available at the shortcut route:
curl "http://localhost:5000/api/v1/manufacturers/analytics" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "dateRange": {
      "startDate": "2026-01-01",
      "endDate": "2026-12-31"
    },
    "overview": {
      "totalProducts": 4,
      "totalBatches": 6,
      "activeBatches": 5,
      "recalledBatches": 1,
      "totalUnitsMinted": 1000,
      "totalScans": 342,
      "totalFakeReports": 8,
      "rewardsDistributed": 2450
    },
    "scansOverTime": [
      {
        "date": "2026-09-28",
        "totalScans": 45,
        "genuine": 40,
        "suspicious": 3,
        "fake": 2
      },
      {
        "date": "2026-09-29",
        "totalScans": 62,
        "genuine": 58,
        "suspicious": 2,
        "fake": 2
      }
    ],
    "cityWiseScans": [
      {
        "city": "Mumbai",
        "scansCount": 142,
        "genuineCount": 130,
        "suspiciousCount": 12,
        "percentage": "41.5%"
      },
      {
        "city": "Delhi",
        "scansCount": 98,
        "genuineCount": 90,
        "suspiciousCount": 8,
        "percentage": "28.7%"
      }
    ],
    "resultSplit": {
      "total": 342,
      "genuine": { "count": 290, "percentage": "84.8%" },
      "suspicious": { "count": 32, "percentage": "9.4%" },
      "fake": { "count": 14, "percentage": "4.1%" },
      "recalled": { "count": 4, "percentage": "1.2%" },
      "soldAwaitingClaim": { "count": 2, "percentage": "0.6%" },
      "other": { "count": 0, "percentage": "0.0%" }
    },
    "batchPerformance": [
      {
        "id": "673f8a91...",
        "batchNumber": "BATCH-2026-DEL99",
        "productName": "Paracetamol 500mg IP",
        "quantity": 500,
        "protectionLevel": "HighValue",
        "mfgDate": "2026-01-15T00:00:00.000Z",
        "expiryDate": "2028-01-15T00:00:00.000Z",
        "status": "Active",
        "totalScans": 215,
        "genuineScans": 204,
        "suspiciousScans": 11,
        "fakeReportsCount": 2,
        "verificationRate": "94.9%",
        "riskStatus": "ELEVATED"
      }
    ]
  }
}
```

#### B. Batch Recall with Reason (On-Chain + DB + Unit Status Update)
Recalls a batch on-chain via `recallBatch(batchNumber, reason)`, flags batch as recalled, updates all corresponding units to status `'recalled'`, and returns affected units count.
```bash
curl -X POST http://localhost:5000/api/v1/batches/BATCH-2026-DEL99/recall \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Quality check failure: Dissolution test did not meet pharmacopeial specifications."
  }'
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "batchNumber": "BATCH-2026-DEL99",
    "batchId": "BATCH-2026-DEL99",
    "productName": "Paracetamol 500mg IP",
    "isRecalled": true,
    "status": "Recalled",
    "recallReason": "Quality check failure: Dissolution test did not meet pharmacopeial specifications.",
    "recalledAt": "2026-10-02T11:45:00.000Z",
    "affectedUnitsCount": 500,
    "txHash": "0x7a8b9c...",
    "message": "Product batch \"BATCH-2026-DEL99\" and 500 units have been recalled successfully."
  }
}
```

#### C. Past Recalls History List
Returns all previously recalled batches with reasons, timestamps, affected units count, and on-chain recall transaction hash.
```bash
curl "http://localhost:5000/api/v1/batches/recalls?page=1&limit=10" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# Also available at the shortcut route:
curl "http://localhost:5000/api/v1/recalls" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "recalls": [
      {
        "id": "673f8a91...",
        "batchNumber": "BATCH-2026-DEL99",
        "batchId": "BATCH-2026-DEL99",
        "productName": "Paracetamol 500mg IP",
        "quantity": 500,
        "affectedUnits": 500,
        "recallReason": "Quality check failure: Dissolution test did not meet pharmacopeial specifications.",
        "recalledAt": "2026-10-02T11:45:00.000Z",
        "recallTxHash": "0x7a8b9c...",
        "status": "Recalled"
      }
    ]
  }
}
```

#### D. Partner Reputation Score, Breakdown & Recent Audit Changes
Computes partner trust score (0–100) dynamically based on:
- **Base Score**: 100
- **Successful Custody Transfers**: +2 pts per accepted transfer (capped at +20)
- **Rejected Shipments**: -10 pts (outgoing rejection by recipient) or -5 pts (incoming rejection)
- **Valid Counterfeit Reports**: -25 pts penalty per confirmed fake report against the partner's store
- **Recent Changes**: Chronological audit trail of transfer acceptances, rejections, and counterfeit findings.
```bash
curl "http://localhost:5000/api/v1/partners/<PARTNER_ID>/reputation" \
  -H "Authorization: Bearer <MANUFACTURER_OR_ADMIN_TOKEN>"
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "partner": {
      "id": "673f8a...",
      "businessName": "National Logistics Ltd",
      "name": "Rajesh Kumar",
      "role": "distributor",
      "gst": "27AAACN0123M1Z5",
      "city": "Mumbai",
      "state": "Maharashtra",
      "walletAddress": "0x1234...",
      "status": "approved"
    },
    "score": 96,
    "tier": "Elite Partner",
    "tierBadge": "TIER_A_ELITE",
    "riskLevel": "VERY_LOW",
    "breakdown": {
      "baseScore": 100,
      "totalTransfers": 12,
      "acceptedTransfers": 11,
      "rejectedTransfers": 1,
      "pendingTransfers": 0,
      "transferSuccessRate": "91.7%",
      "validFakeReports": 0,
      "pendingFakeReports": 0,
      "totalFakeReports": 0,
      "transferBonus": "+20",
      "rejectionPenalty": "-10",
      "counterfeitPenalty": "-0"
    },
    "recentChanges": [
      {
        "id": "CHG-TRF-TRF-2026-004",
        "timestamp": "2026-10-01T14:30:00.000Z",
        "type": "TRANSFER_ACCEPTED",
        "delta": 2,
        "title": "Shipment Successfully Accepted",
        "description": "Batch BATCH-2026-DEL99 (50 units) custody transfer accepted cleanly.",
        "relatedId": "TRF-2026-004"
      },
      {
        "id": "CHG-TRF-TRF-2026-003",
        "timestamp": "2026-09-25T11:15:00.000Z",
        "type": "TRANSFER_REJECTED",
        "delta": -10,
        "title": "Outgoing Shipment Rejected by Recipient",
        "description": "Batch BATCH-2026-DEL98 rejected. Reason: \"Packaging seals were broken\"",
        "relatedId": "TRF-2026-003"
      }
    ]
  }
}
```

#### E. Partner Reputation Network Leaderboard
Lists all approved supply chain partners sorted descending by reputation score with tier distributions.
```bash
curl "http://localhost:5000/api/v1/partners/reputation?role=retailer&city=Mumbai" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "total": 5,
    "partners": [
      {
        "id": "673f8a...",
        "businessName": "Metro Pharmacy & Retail",
        "name": "Pooja Sharma",
        "role": "retailer",
        "gst": "07AAACN9876M1Z1",
        "city": "Mumbai",
        "state": "Maharashtra",
        "score": 98,
        "tier": "Elite Partner",
        "tierBadge": "TIER_A_ELITE",
        "riskLevel": "VERY_LOW",
        "totalTransfers": 8,
        "transferSuccessRate": "100.0%",
        "validFakeReports": 0
      }
    ],
    "tiersCount": {
      "elite": 3,
      "good": 1,
      "warning": 1,
      "critical": 0
    }
  }
}
```

---

### 20. Manufacturer Billing, Plans, Invoices & Mock Top-Up (INR)

#### A. Billing Overview & Prepaid Credit Balance
Returns current subscription plan, active credit balance (INR), lifetime credits topped up vs consumed, total spent, recent invoices, and recent credit ledger entries.
```bash
curl "http://localhost:5000/api/v1/billing/overview" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "creditBalance": 12500,
    "currency": "INR",
    "conversionRate": "1 Credit = ₹1 INR",
    "plan": {
      "code": "GROWTH",
      "name": "Growth Plan",
      "priceMonthlyINR": 4500,
      "includedCredits": 3500,
      "unitRateStandard": 1.0,
      "unitRateHighValue": 2.0,
      "billingCycle": "monthly",
      "status": "ACTIVE"
    },
    "stats": {
      "totalCreditsToppedUp": 20000,
      "totalCreditsDeducted": 7500,
      "totalSpentINR": 7500,
      "totalInvoices": 3
    },
    "recentInvoices": [ ... ],
    "recentUsage": [ ... ]
  }
}
```

#### B. Mock Credit Top-Up (Simulates UPI or Card Payment)
Simulates successful payment gateway authorization (UPI or Card), computes 18% GST in INR, credits prepaid balance immediately, creates a `CreditLedger` entry, and issues an official tax invoice.
```bash
curl -X POST http://localhost:5000/api/v1/billing/topup \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amountINR": 5000,
    "paymentMethod": "UPI",
    "upiId": "cipla@okhdfcbank"
  }'
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "message": "Successfully topped up ₹5000 credits via UPI!",
    "creditedINR": 5000,
    "newBalanceINR": 17500,
    "totalBilledINR": 5900,
    "invoice": {
      "id": "673f8a91...",
      "invoiceNumber": "INV-2026-00003",
      "creditsPurchased": 5000,
      "subtotalINR": 5000,
      "gstAmountINR": 900,
      "totalAmountINR": 5900,
      "paymentMethod": "UPI",
      "paymentReference": "UPI-IN-1727873100-849201",
      "status": "PAID",
      "paidAt": "2026-10-02T12:15:00.000Z"
    }
  }
}
```

#### C. Invoices List & Downloadable Receipt
```bash
# List all manufacturer invoices
curl "http://localhost:5000/api/v1/billing/invoices?page=1&limit=10" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# Get single invoice detail
curl "http://localhost:5000/api/v1/billing/invoices/<INVOICE_ID>" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

#### D. Credit Ledger Usage History
```bash
curl "http://localhost:5000/api/v1/billing/usage?page=1&limit=20&type=DEDUCTION" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

---

### 21. Settings: Company Profile, Team Members & Notification Preferences

#### A. Company Profile (Fetch & Update)
```bash
# Get company profile
curl "http://localhost:5000/api/v1/settings/company" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# Update company profile (syncs with Brand document)
curl -X PATCH http://localhost:5000/api/v1/settings/company \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Cipla Quality Pharmaceuticals Ltd",
    "legalName": "Cipla Limited India",
    "gst": "27AAACC1206D1ZM",
    "cin": "L24239MH1935PLC002380",
    "pan": "AAACC1206D",
    "website": "https://www.cipla.com",
    "supportEmail": "contact@cipla.com",
    "supportPhone": "+912224826000",
    "address": {
      "street": "Cipla House, Peninsula Business Park",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400013",
      "country": "India"
    },
    "description": "Leading global healthcare enterprise focused on agile and high-quality medicines."
  }'
```

#### B. Organization Team Members Management
```bash
# 1. List all team members with roles
curl "http://localhost:5000/api/v1/settings/team" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# 2. Add / Invite team member with role (Admin, Manager, Operator, Viewer, Compliance)
curl -X POST http://localhost:5000/api/v1/settings/team \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sunita Rao",
    "email": "sunita.rao@cipla.com",
    "phone": "9820011223",
    "role": "Manager"
  }'

# 3. Update team member role or status
curl -X PATCH http://localhost:5000/api/v1/settings/team/<MEMBER_ID> \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Compliance",
    "status": "Active"
  }'

# 4. Remove team member
curl -X DELETE http://localhost:5000/api/v1/settings/team/<MEMBER_ID> \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"
```

#### C. Notification & Alert Preferences
```bash
# Get notification preferences
curl "http://localhost:5000/api/v1/settings/notifications" \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>"

# Update alert settings
curl -X PATCH http://localhost:5000/api/v1/settings/notifications \
  -H "Authorization: Bearer <MANUFACTURER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "lowCreditWarning": true,
    "lowCreditThreshold": 1000,
    "counterfeitAlerts": true,
    "transferUpdates": true,
    "dailyDigest": true,
    "emailNotifications": true,
    "smsNotifications": true,
    "webhookUrl": "https://erp.cipla.com/webhooks/trustchain-alerts"
  }'
```

---

### 22. Admin Governance: Users/Brands Search & Suspension, Reward Offers CRUD & Platform Analytics

#### A. Users Management with Search, Role Filter, Suspend & Activate
```bash
# 1. Search users by name, email, phone, or company with role & status filters
curl "http://localhost:5000/api/v1/admin/users?search=cipla&role=manufacturer&status=ACTIVE&page=1&limit=10" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 2. Suspend a user account (blocks login & API access immediately)
curl -X PATCH http://localhost:5000/api/v1/admin/users/<USER_ID>/suspend \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Repeated non-compliance with drug serialization standards."
  }'

# 3. Reactivate a suspended user
curl -X PATCH http://localhost:5000/api/v1/admin/users/<USER_ID>/activate \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

#### B. Brands Management with Search, Suspend & Activate
```bash
# 1. List brands with multi-field search and status filter
curl "http://localhost:5000/api/v1/admin/brands?search=cipla&status=approved" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 2. Suspend a brand
curl -X PATCH http://localhost:5000/api/v1/admin/brands/<BRAND_ID>/suspend \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Investigation initiated into unauthorized manufacturing facility."
  }'

# 3. Reactivate a brand to approved status
curl -X PATCH http://localhost:5000/api/v1/admin/brands/<BRAND_ID>/activate \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

#### C. Reward Partners & Offers CRUD
```bash
# 1. List all reward offers (with search, category, active filters)
curl "http://localhost:5000/api/v1/admin/rewards/offers?category=Gift%20Cards" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 2. Create new reward offer
curl -X POST http://localhost:5000/api/v1/admin/rewards/offers \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "₹500 Croma Electronics Voucher",
    "description": "Instant ₹500 discount across all gadgets at Croma stores.",
    "category": "Gift Cards",
    "pointsRequired": 450,
    "couponPrefix": "CRMA500",
    "partner": "Croma Retail",
    "discountAmount": 500,
    "stock": 100,
    "terms": "Valid online and in-store on minimum spend of ₹2,000."
  }'

# 3. Update existing offer
curl -X PATCH http://localhost:5000/api/v1/admin/rewards/offers/<OFFER_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"pointsRequired": 400, "stock": 150}'

# 4. Toggle offer active status (Active <-> Inactive)
curl -X PATCH http://localhost:5000/api/v1/admin/rewards/offers/<OFFER_ID>/toggle \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 5. Delete offer
curl -X DELETE http://localhost:5000/api/v1/admin/rewards/offers/<OFFER_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 6. List distinct reward partners with active offers count
curl "http://localhost:5000/api/v1/admin/rewards/partners" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

#### D. Platform-Wide Comprehensive Analytics
Aggregates network-wide statistics across all users, brands, batches, scans, fake reports, revenue, credit consumption, and token rewards.
```bash
curl "http://localhost:5000/api/v1/admin/analytics" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 42,
      "active": 41,
      "suspended": 1,
      "breakdown": {
        "manufacturer": 5,
        "distributor": 8,
        "retailer": 12,
        "consumer": 16,
        "admin": 1
      }
    },
    "brands": {
      "total": 5,
      "breakdown": {
        "approved": 4,
        "pending": 0,
        "rejected": 0,
        "infoRequested": 0,
        "suspended": 1
      }
    },
    "productsAndBatches": {
      "totalProducts": 14,
      "totalBatches": 28,
      "activeBatches": 26,
      "recalledBatches": 2,
      "totalUnitsSerialized": 50000,
      "recallRate": "7.1%"
    },
    "scans": {
      "total": 1240,
      "breakdown": {
        "genuine": 1080,
        "suspicious": 92,
        "fake": 48,
        "recalled": 15,
        "soldawaitingclaim": 5
      },
      "cloneAnomalyRate": "11.3%"
    },
    "reports": {
      "total": 35,
      "breakdown": {
        "Submitted": 8,
        "UnderReview": 5,
        "Valid": 18,
        "Invalid": 4
      },
      "resolutionRate": "62.9%"
    },
    "financials": {
      "currency": "INR",
      "totalInvoices": 18,
      "totalRevenueINR": 145000,
      "totalSubtotalINR": 122881.36,
      "totalGSTCollectedINR": 22118.64,
      "totalCreditsPurchased": 122881,
      "totalCreditsConsumed": 50000,
      "activeManufacturerCreditsPool": 72881
    },
    "loyaltyAndRewards": {
      "totalPointsMinted": 12450,
      "totalRedemptions": 42,
      "totalRewardOffers": 6
    }
  }
}
```

---

### 23. Admin System Health, Gas Relayer Fuel & On-Chain Event Listener

Production infrastructure observability and self-healing subsystem:
1. **Network Credits Balance**: Relayer Ethereum wallet balance mapped directly to gas credits (1 ETH = 1,000,000 Network Credits), with proactive alerts when balance falls below `0.5 ETH`.
2. **Transaction Queue Recovery**: Live tracking of pending and failed on-chain transactions with automated and manual retry endpoints.
3. **Multi-Service Health**: Comprehensive status and ping latency for MongoDB, EVM RPC Node, and Smart Contract Event Listener.
4. **Idempotent Safety-Net Listener**: Background daemon listening to smart contract events (`BatchRecalled`, `BatchTransferAccepted`, `BatchTransferRejected`, `UnitSold`, `UnitClaimed`, `RewardMinted`, `OfferRedeemed`), ensuring MongoDB never drifts from blockchain truth while safely skipping mutations already performed by API services.

#### A. Get System Health & Network Credits Telemetry
```bash
curl "http://localhost:5000/api/v1/admin/health" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "systemStatus": "HEALTHY",
    "timestamp": "2026-10-02T12:30:00.000Z",
    "uptimeSeconds": 1420,
    "relayerWallet": {
      "address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "balanceETH": 9.9842,
      "networkCreditsBalance": 9984200,
      "formattedCredits": "9.9842 ETH (9,984,200 Network Gas Credits)",
      "isLowBalance": false,
      "lowBalanceThresholdETH": 0.5,
      "lowBalanceWarning": null
    },
    "services": {
      "database": {
        "name": "MongoDB",
        "status": "UP",
        "host": "127.0.0.1",
        "dbName": "trustchain",
        "pingMs": 2
      },
      "rpc": {
        "name": "Ethereum EVM Node",
        "status": "UP",
        "rpcUrl": "http://127.0.0.1:8545",
        "chainId": "31337",
        "blockNumber": 142,
        "latencyMs": 4
      },
      "listener": {
        "name": "Smart Contract Event Listener & Reconciler",
        "status": "ACTIVE",
        "isListening": true,
        "uptimeSeconds": 1420,
        "lastProcessedBlock": 142,
        "reconciledEventsCount": 18,
        "skippedAlreadyConsistentCount": 42
      }
    },
    "transactionsQueue": {
      "pendingCount": 0,
      "failedCount": 1,
      "confirmedCount": 124,
      "totalTracked": 125,
      "pending": [],
      "failed": [
        {
          "_id": "674000000000000000000099",
          "contractName": "TrustChainRegistry",
          "functionName": "recordUnitSold",
          "status": "failed",
          "attempts": 2,
          "error": "Nonce too low: expected 45, got 44",
          "createdAt": "2026-10-02T12:15:00.000Z"
        }
      ]
    }
  }
}
```

#### B. Retry a Specific Failed Transaction
```bash
curl -X POST http://localhost:5000/api/v1/admin/transactions/674000000000000000000099/retry \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

*Response JSON:*
```json
{
  "success": true,
  "data": {
    "message": "Transaction 674000000000000000000099 retried successfully on-chain!",
    "success": true,
    "txHash": "0x4b7c8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    "blockNumber": 143,
    "gasUsed": "48210"
  }
}
```

#### C. Retry All Failed Transactions in Bulk
```bash
curl -X POST http://localhost:5000/api/v1/admin/transactions/retry-all \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

#### D. Inspect Live Event Listener Telemetry
```bash
curl "http://localhost:5000/api/v1/admin/listener" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

#### E. Trigger Manual On-Demand Reconciliation Sweep
Forces an immediate catch-up scan across recent Ethereum blocks to reconcile missing events into MongoDB:
```bash
curl -X POST http://localhost:5000/api/v1/admin/listener/reconcile \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```






