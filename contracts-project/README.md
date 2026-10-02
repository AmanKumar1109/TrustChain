# 🛡️ TrustChain Smart Contracts Platform

**TrustChain** ek decentralized product authentication, anti-counterfeit supply chain tracking, aur customer loyalty platform hai.
Yeh project **Hardhat**, **JavaScript**, **ethers v6**, **Solidity ^0.8.20**, aur **OpenZeppelin Contracts** par bana hai.

---

## 🏗️ Core Architectural Design Pattern (Backend Relayer Model)

Is project ka sabse important rule **Backend Relayer Architecture** hai:

1. **Gasless Experience for End Users**:
   - End-users (manufacturers, retailers, delivery partners, consumers) ko gas fees pay karne ya metamask popups bar-bar sign karne ki zaroorat nahi hoti.
   - Platform ka backend server ek dedicated relayer wallet (`RELAYER_ROLE`) ke through blockchain par transactions submit karta hai.

2. **Acting Addresses as Parameters**:
   - Kyunki transaction submit karne wala `msg.sender` hamesha **Relayer** hota hai, isliye saare state-changing functions user ki original identity (`actingUser`, `manufacturer`, `customer`, `retailer`, `from`, `to`) ko parameters ke roop mein lete hain.
   - On-chain ownership, inventory holdings, aur events in acting addresses ke basis par update hote hain.

---

## 📜 Smart Contracts Overview

### 1. `TrustChainRegistry.sol` (Supply Chain & Product Authentication)
Central registry contract jo products ki poori lifecycle track karta hai:

- **Roles & Permissions (`AccessControl`)**:
  - `DEFAULT_ADMIN_ROLE`: Platform administration, emergency pause, manufacturer authorize/revoke karna.
  - `MANUFACTURER_ROLE`: Approved brand/manufacturer jo products batch bana sakte hain.
  - `PARTNER_ROLE`: Supply chain intermediaries (distributors, logistics, retail stores).
  - `RELAYER_ROLE`: Backend wallet jo users ke behalf par operations execute karta hai.

- **Batch Registration (`registerBatch`)**:
  - Manufacturers naya batch register karte hain jisme `merkleRoot`, `quantity`, `protectionLevel` (Standard / HighValue), aur `expiryTimestamp` hota hai.
  - Initial inventory batch ke manufacturer ke address par record hoti hai (`holdings`).

- **Merkle Unit Verification (`verifyUnit`)**:
  - Individual product ko cryptographic Merkle proof ke through verify karta hai.
  - Leaf hash: `keccak256(abi.encodePacked(unitCode))`.
  - **HighValue Anti-Counterfeit**: Secret scratch code directly `unitCode` ke andar embed hota hai (e.g. `PROD-001#SECRET-998`). Isse extra on-chain storage ke bina cryptographic security milti hai.
  - Return details: `exists` (proof valid), `expired` (timestamp check), `recalled` (status), `recallReason` (wajah), `soldState` (Unsold, Sold, Claimed), aur `currentOwner`.

- **Supply Chain Custody Transfers (`initiateBatchTransfer` & `respondBatchTransfer`)**:
  - Manufacturer se Distributor ya Retailer tak batch stock transfer karna.
  - Two-step handshake: Sender initiate karta hai (`Pending`), Receiver accept ya reject karta hai.
  - Accept hone par `holdings` move hoti hain, reject hone par holdings wahi rehti hain.

- **Unit-Level Retail Sale & Ownership (`markUnitSold`, `claimUnit`, Resale)**:
  - `markUnitSold`: Retailer stock se unit customer ko sell hoti hai, holdings decrement hoti hain, aur state `Sold` ho jata hai.
  - `claimUnit`: Customer product khareedne ke baad claim karta hai (state `Sold` se `Claimed` ho jata hai).
  - **Secondary Market Resale** (`initiateUnitTransfer` & `respondUnitTransfer`): Customer kisi doosre buyer ko product transfer/sell kar sakta hai two-step handshake ke through.

- **Emergency Product Recall (`recallBatch`)**:
  - Agar kisi product batch mein defect/contamination milti hai, toh Relayer us batch ko recall kar deta hai.
  - Recalled batch downstream supply chain transfers (`initiateBatchTransfer`) aur retail sales (`markUnitSold`) ko turant block kar deta hai.
  - `verifyUnit` mein consumer ko `recalled = true` aur recall ka reason dikhta hai.

---

### 2. `TrustPoints.sol` (TPTS Loyalty Reward Token)
ERC-20 loyalty token platform ke consumers ke liye:

- **Roles**:
  - `DEFAULT_ADMIN_ROLE`: Platform admin.
  - `MINTER_ROLE`: Authorized service/relayer jo rewards mint karta hai.
  - `RELAYER_ROLE`: Authorized relayer jo redemptions execute karta hai.

- **Reward Minting (`mintReward`)**:
  - Jab koi consumer genuine product scan ya verify karta hai, toh backend relayer unke address par `TPTS` points mint karta hai. Reason event mein log hota hai.

- **Direct Token Redemption (`redeem`)**:
  - Jab consumer store par discount/coupon claim karta hai, toh backend relayer user ke points directly burn kar deta hai.
  - Isse consumer ko alag se ERC-20 `approve()` transaction karne ki jhanjhat nahi hoti.

---

### 3. `TrustChain.sol` (Base Platform Contract)
- AccessControl foundation, relayer verification (`isRelayer`), emergency circuit breaker (`pause()` / `unpause()`), aur relayed activity logging (`relayUserActivity`).

---

## 💻 Commands Guide (Compile se leke Deploy tak)

Sabhi commands run karne ke liye pehle `contracts-project` folder mein navigate karein:

```bash
cd h:\obsidian\contracts-project
```

### 1. Dependencies Install Karna
Agar pehli baar setup kar rahe hain:
```bash
npm install
```
> **Kya karta hai**: Hardhat, OpenZeppelin contracts, ethers v6, dotenv, aur testing libraries install karta hai.

---

### 2. Contracts Compile Karna
```bash
npm run compile
```
> **Kya karta hai**:
> - Saare Solidity files (`.sol`) ko compile karta hai.
> - Syntax aur type errors check karta hai.
> - `artifacts/` folder ke andar Smart Contract ka Bytecode aur **ABI** generate karta hai.

---

### 3. Test Suite Run Karna
```bash
npm test
```
> **Kya karta hai**:
> - Poore **72 automated tests** execute karta hai.
> - Roles, Merkle proof verification, Batch transfers, Unit ownership, Resale, Loyalty points, aur Recall mechanism ko thoroughly verify karta hai.

---

### 4. Local Blockchain Node Start Karna
```bash
npm run node
```
> **Kya karta hai**:
> - Aapke computer par ek local Ethereum blockchain node chalu karta hai (`http://127.0.0.1:8545`).
> - 20 test accounts generate karta hai jinke paas 10,000 free test ETH hote hain.
> - *Note*: Isko ek alag terminal window mein open rehne dein taaki local blockchain chalta rahe.

---

### 5. Local Blockchain Par Deploy Karna
Naye terminal mein run karein:
```bash
npm run deploy:local
```
> **Kya karta hai**:
> 1. `TrustPoints`, `TrustChainRegistry`, aur `TrustChain` contracts ko local node par deploy karta hai.
> 2. Relayer account (2nd Hardhat account `0x7099...`) ko saare zaroori roles (`RELAYER_ROLE` & `MINTER_ROLE`) automatically assign karta hai.
> 3. Contract addresses ko **`deployments/localhost.json`** file mein save karta hai.
> 4. Clean frontend/backend integration ke liye ABIs ko **`abi/`** folder mein export karta hai (`TrustChainRegistry.json`, `TrustPoints.json`, `TrustChain.json`).

---

### 6. Demo Actors Seed Karna (On-Chain Setup)
```bash
npm run seed:local
```
> **Kya karta hai**:
> - Deployed registry contract se connect karta hai.
> - 3rd test account ko **Demo Manufacturer** (`MANUFACTURER_ROLE`) authorize karta hai.
> - 4th aur 5th test accounts ko **Demo Supply Chain Partners** (`PARTNER_ROLE`) authorize karta hai.
> - Iske baad aap turant demo batches register aur transfer kar sakte hain.

---

## 📂 Project Directory Structure

```text
contracts-project/
├── contracts/                  # Solidity source code
│   ├── TrustChain.sol          # Base platform contract
│   ├── TrustChainRegistry.sol  # Registry, Merkle verification, transfers, ownership
│   └── TrustPoints.sol         # TPTS ERC-20 loyalty token
├── test/                       # Automated test suites (72 passing tests)
│   ├── TrustChain.test.js
│   ├── TrustChainRegistry.test.js
│   └── TrustPoints.test.js
├── scripts/                    # Automation scripts
│   ├── deploy.js               # Deployment & role configuration script
│   └── seed.js                 # Demo data initialization script
├── abi/                        # Exported contract ABIs for frontend & backend
│   ├── TrustChainRegistry.json
│   ├── TrustPoints.json
│   └── TrustChain.json
├── deployments/                # Deployed contract addresses per network
│   ├── hardhat.json
│   └── localhost.json
├── hardhat.config.js           # Hardhat config (Solidity 0.8.20, local & Amoy network)
├── package.json                # Project dependencies and npm scripts
├── .env.example                # RPC_URL & PRIVATE_KEY template for testnets
└── README.md                   # Complete documentation
```
