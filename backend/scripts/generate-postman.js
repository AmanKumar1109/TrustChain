/**
 * TrustChain Postman Collection & OpenAPI Specification Generator
 * Generates production-ready:
 * 1. backend/postman_collection.json (v2.1.0 format with auto-auth test scripts)
 * 2. backend/openapi.json (OpenAPI 3.0.3 specification)
 */

const fs = require('fs');
const path = require('path');

const postmanCollection = {
  info: {
    _postman_id: "trustchain-platform-suite-v1",
    name: "TrustChain Web3 Provenance & Anti-Counterfeit Platform API",
    description: "Production API Collection for TrustChain: Web3 Merkle-tree serialization, anti-counterfeit scanning, warranty claims, partner custody transfers, loyalty rewards, manufacturer billing, and admin system health.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:5000/api/v1", type: "string" },
    { key: "adminToken", value: "", type: "string" },
    { key: "mfgToken", value: "", type: "string" },
    { key: "distToken", value: "", type: "string" },
    { key: "retailerToken", value: "", type: "string" },
    { key: "consumerToken", value: "", type: "string" },
    { key: "createdBatchId", value: "BATCH-2026-DEL99", type: "string" },
    { key: "createdUnitCode", value: "TC-8924-GENUINE", type: "string" },
    { key: "createdTransferId", value: "", type: "string" },
  ],
  item: [
    // 1. AUTH
    {
      name: "1. Authentication & Identity",
      item: [
        {
          name: "Register User (Consumer / Partner)",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/auth/register", host: ["{{baseUrl}}"], path: ["auth", "register"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Rahul Sharma",
                email: "rahul.demo@example.com",
                password: "Password123!",
                phone: "+919876543299",
                role: "consumer",
              }, null, 2),
            },
          },
        },
        {
          name: "Login as Admin (Auto-saves adminToken)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.data && res.data.token) {",
                  "  pm.collectionVariables.set('adminToken', res.data.token);",
                  "  console.log('Saved adminToken!');",
                  "}"
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/auth/login", host: ["{{baseUrl}}"], path: ["auth", "login"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "admin@trustchain.com", password: "Password123!" }, null, 2),
            },
          },
        },
        {
          name: "Login as Manufacturer (Auto-saves mfgToken)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.data && res.data.token) {",
                  "  pm.collectionVariables.set('mfgToken', res.data.token);",
                  "  console.log('Saved mfgToken!');",
                  "}"
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/auth/login", host: ["{{baseUrl}}"], path: ["auth", "login"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "mfg@cipla.com", password: "Password123!" }, null, 2),
            },
          },
        },
        {
          name: "Login as Distributor (Auto-saves distToken)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.data && res.data.token) {",
                  "  pm.collectionVariables.set('distToken', res.data.token);",
                  "  console.log('Saved distToken!');",
                  "}"
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/auth/login", host: ["{{baseUrl}}"], path: ["auth", "login"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "distributor@apexlogistics.com", password: "Password123!" }, null, 2),
            },
          },
        },
        {
          name: "Login as Retailer (Auto-saves retailerToken)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.data && res.data.token) {",
                  "  pm.collectionVariables.set('retailerToken', res.data.token);",
                  "  console.log('Saved retailerToken!');",
                  "}"
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/auth/login", host: ["{{baseUrl}}"], path: ["auth", "login"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "retailer@metrolife.com", password: "Password123!" }, null, 2),
            },
          },
        },
        {
          name: "Login as Consumer (Auto-saves consumerToken)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "const res = pm.response.json();",
                  "if (res.data && res.data.token) {",
                  "  pm.collectionVariables.set('consumerToken', res.data.token);",
                  "  console.log('Saved consumerToken!');",
                  "}"
                ],
                type: "text/javascript",
              },
            },
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/auth/login", host: ["{{baseUrl}}"], path: ["auth", "login"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "consumer@gmail.com", password: "Password123!" }, null, 2),
            },
          },
        },
        {
          name: "Get Current Logged-in User Profile (/auth/me)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/auth/me", host: ["{{baseUrl}}"], path: ["auth", "me"] },
          },
        },
        {
          name: "Logout (/auth/logout)",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/auth/logout", host: ["{{baseUrl}}"], path: ["auth", "logout"] },
          },
        },
      ],
    },

    // 2. BRAND KYB
    {
      name: "2. Brand Registration & KYB Compliance",
      item: [
        {
          name: "Submit Brand Registration (KYB)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/brands/register", host: ["{{baseUrl}}"], path: ["brands", "register"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Sun Pharma Laboratories",
                legalBusinessName: "Sun Pharmaceutical Industries Ltd",
                cin: "L24230GJ1993PLC019050",
                gstin: "24AAACS1234D1Z2",
                officialEmail: "contact@sunpharma.com",
                phone: "+919876500099",
                website: "https://sunpharma.com",
                categories: ["Pharmaceuticals", "Dermatology"],
              }, null, 2),
            },
          },
        },
        {
          name: "Get Brand Profile",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/brands/profile", host: ["{{baseUrl}}"], path: ["brands", "profile"] },
          },
        },
      ],
    },

    // 3. PRODUCT CATALOG
    {
      name: "3. Product Catalog",
      item: [
        {
          name: "Create Product",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/products", host: ["{{baseUrl}}"], path: ["products"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Cipla Budecort Inhaler 200mcg",
                sku: "CIP-BUD-200",
                category: "Pharmaceuticals",
                description: "Budesonide inhalation powder corticosteroid.",
                mrp: 320.0,
                protectionLevelDefault: "Standard",
                warrantyPeriodMonths: 24,
              }, null, 2),
            },
          },
        },
        {
          name: "List Products",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/products", host: ["{{baseUrl}}"], path: ["products"] },
          },
        },
        {
          name: "Get Product Categories",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/products/categories", host: ["{{baseUrl}}"], path: ["products", "categories"] },
          },
        },
      ],
    },

    // 4. BATCHES & SERIALIZATION
    {
      name: "4. Batches, Serialization & Recalls",
      item: [
        {
          name: "Create Batch (Merkle Tree & On-Chain Registration)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/batches", host: ["{{baseUrl}}"], path: ["batches"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                batchNumber: "BATCH-2026-MUM77",
                productId: "REPLACE_WITH_PRODUCT_ID",
                quantity: 10,
                mfgDate: "2026-02-01",
                expiryDate: "2028-02-01",
                protectionLevel: "Standard",
              }, null, 2),
            },
          },
        },
        {
          name: "List Manufacturer Batches",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/batches", host: ["{{baseUrl}}"], path: ["batches"] },
          },
        },
        {
          name: "Get Batch Details & Merkle Root",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/batches/BATCH-2026-DEL99", host: ["{{baseUrl}}"], path: ["batches", "BATCH-2026-DEL99"] },
          },
        },
        {
          name: "Download High-Res QR ZIP Archive",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/batches/BATCH-2026-DEL99/qr-zip", host: ["{{baseUrl}}"], path: ["batches", "BATCH-2026-DEL99", "qr-zip"] },
          },
        },
        {
          name: "Emergency Product Recall",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/batches/BATCH-2026-DEL99/recall", host: ["{{baseUrl}}"], path: ["batches", "BATCH-2026-DEL99", "recall"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ reason: "Packaging integrity failure detected during secondary warehouse quality audit." }, null, 2),
            },
          },
        },
        {
          name: "List Recalled Batches",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/batches/recalls", host: ["{{baseUrl}}"], path: ["batches", "recalls"] },
          },
        },
      ],
    },

    // 5. PARTNER NETWORK
    {
      name: "5. Supply Chain Partner Onboarding & Network",
      item: [
        {
          name: "Invite Supply Chain Partner (Manufacturer/Distributor)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/partners/invite", host: ["{{baseUrl}}"], path: ["partners", "invite"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                businessName: "National Cold Chain Ltd",
                email: "contact@nationalcoldchain.com",
                role: "distributor",
                contactPerson: "Vikram Malhotra",
                phone: "+919876500088",
                location: { city: "Bengaluru", state: "Karnataka" },
              }, null, 2),
            },
          },
        },
        {
          name: "Join Partner Network via Invite Token",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/partners/join-invite", host: ["{{baseUrl}}"], path: ["partners", "join-invite"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                token: "INVITE_TOKEN_FROM_STEP_ABOVE",
                password: "Password123!",
                gst: "29AAACN0123M1Z5",
                pan: "AAACN0123M",
                location: { address: "Plot 10, Peenya Industrial Area", city: "Bengaluru", state: "Karnataka", pincode: "560058" },
              }, null, 2),
            },
          },
        },
        {
          name: "Partner Self-Apply Directly",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            url: { raw: "{{baseUrl}}/partners/self-apply", host: ["{{baseUrl}}"], path: ["partners", "self-apply"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                businessName: "City Meds Retailers",
                email: "info@citymeds.com",
                password: "Password123!",
                role: "retailer",
                gst: "07AAACN5541M1Z2",
                contactPerson: "Anita Roy",
                phone: "+919876500055",
                location: { address: "Connaught Place", city: "Delhi", state: "Delhi", pincode: "110001" },
              }, null, 2),
            },
          },
        },
        {
          name: "List Network Partners",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/partners?role=distributor&status=approved", host: ["{{baseUrl}}"], path: ["partners"], query: [{ key: "role", value: "distributor" }, { key: "status", value: "approved" }] },
          },
        },
        {
          name: "Get Partner Reputation Score",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{distToken}}" }],
            url: { raw: "{{baseUrl}}/partners/reputation", host: ["{{baseUrl}}"], path: ["partners", "reputation"] },
          },
        },
      ],
    },

    // 6. CUSTODY TRANSFERS & INVENTORY
    {
      name: "6. Custody Transfers & Partner Inventory",
      item: [
        {
          name: "Initiate Custody Transfer",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/transfers", host: ["{{baseUrl}}"], path: ["transfers"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                toUser: "REPLACE_WITH_DISTRIBUTOR_USER_ID",
                batchNumber: "BATCH-2026-DEL99",
                quantity: 20,
              }, null, 2),
            },
          },
        },
        {
          name: "Accept Custody Transfer",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{distToken}}" }],
            url: { raw: "{{baseUrl}}/transfers/TRANSFER_ID/accept", host: ["{{baseUrl}}"], path: ["transfers", "TRANSFER_ID", "accept"] },
          },
        },
        {
          name: "Reject Custody Transfer",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{distToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/transfers/TRANSFER_ID/reject", host: ["{{baseUrl}}"], path: ["transfers", "TRANSFER_ID", "reject"] },
            body: { mode: "raw", raw: JSON.stringify({ reason: "Damaged secondary boxes on arrival." }, null, 2) },
          },
        },
        {
          name: "Get Partner Inventory",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{distToken}}" }],
            url: { raw: "{{baseUrl}}/inventory", host: ["{{baseUrl}}"], path: ["inventory"] },
          },
        },
      ],
    },

    // 7. RETAIL SALES & CLAIM TOKENS
    {
      name: "7. Retail Sales & Claim Tokens",
      item: [
        {
          name: "Record Retail Sale (/units/sell)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{retailerToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/units/sell", host: ["{{baseUrl}}"], path: ["units", "sell"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                unitCode: "TC-8924-GENUINE",
                customerPhone: "+919876543210",
                customerName: "Rahul Sharma",
                salePrice: 185.0,
                invoiceNumber: "INV-RET-2026-9081",
              }, null, 2),
            },
          },
        },
        {
          name: "Get Retailer Sales History",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{retailerToken}}" }],
            url: { raw: "{{baseUrl}}/units/sales", host: ["{{baseUrl}}"], path: ["units", "sales"] },
          },
        },
      ],
    },

    // 8. VERIFICATION & MERKLE SCAN
    {
      name: "8. Public QR Verification & Clone Detection",
      item: [
        {
          name: "Verify Genuine Unit QR (/verify/:code)",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/verify/TC-8924-GENUINE?city=Delhi&lat=28.6139&lng=77.2090", host: ["{{baseUrl}}"], path: ["verify", "TC-8924-GENUINE"], query: [{ key: "city", value: "Delhi" }, { key: "lat", value: "28.6139" }, { key: "lng", value: "77.2090" }] },
          },
        },
        {
          name: "Verify Clone Anomaly Trigger (Same code in Mumbai)",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/verify/TC-CLONE-DELHI?city=Mumbai&lat=19.0760&lng=72.8777", host: ["{{baseUrl}}"], path: ["verify", "TC-CLONE-DELHI"], query: [{ key: "city", value: "Mumbai" }, { key: "lat", value: "19.0760" }, { key: "lng", value: "72.8777" }] },
          },
        },
        {
          name: "Verify Recalled Batch Unit",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/verify/TC-RECALL-99", host: ["{{baseUrl}}"], path: ["verify", "TC-RECALL-99"] },
          },
        },
      ],
    },

    // 9. CONSUMER WARRANTY & P2P RESALE
    {
      name: "9. Consumer Warranty & P2P Resale Transfer",
      item: [
        {
          name: "Claim Product Ownership & Warranty (with OTP)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{consumerToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/units/claim", host: ["{{baseUrl}}"], path: ["units", "claim"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                unitCode: "TC-SOLD-UNCLAIMED",
                claimToken: "CLM-TEST-TOK-123",
                otp: "123456",
              }, null, 2),
            },
          },
        },
        {
          name: "Get Consumer's Claimed Products (/units/my-products)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{consumerToken}}" }],
            url: { raw: "{{baseUrl}}/units/my-products", host: ["{{baseUrl}}"], path: ["units", "my-products"] },
          },
        },
        {
          name: "Initiate P2P Resale Transfer to Buyer Phone",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{consumerToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/units/transfer-resale", host: ["{{baseUrl}}"], path: ["units", "transfer-resale"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                unitCode: "TC-CLAIMED-UNIT",
                buyerPhone: "+919876500002",
                resalePrice: 120.0,
              }, null, 2),
            },
          },
        },
        {
          name: "Get User Scan History",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{consumerToken}}" }],
            url: { raw: "{{baseUrl}}/units/scan-history", host: ["{{baseUrl}}"], path: ["units", "scan-history"] },
          },
        },
      ],
    },

    // 10. REWARDS & WEB3 TOKENS
    {
      name: "10. Loyalty Rewards & TrustPoints Tokens",
      item: [
        {
          name: "Get Consumer Token Points Balance",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{consumerToken}}" }],
            url: { raw: "{{baseUrl}}/rewards/balance", host: ["{{baseUrl}}"], path: ["rewards", "balance"] },
          },
        },
        {
          name: "Get Scan Streak Progress",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{consumerToken}}" }],
            url: { raw: "{{baseUrl}}/rewards/streak", host: ["{{baseUrl}}"], path: ["rewards", "streak"] },
          },
        },
        {
          name: "Get Referral Code & Earnings",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{consumerToken}}" }],
            url: { raw: "{{baseUrl}}/rewards/referral", host: ["{{baseUrl}}"], path: ["rewards", "referral"] },
          },
        },
        {
          name: "List Rewards Store Catalog",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/rewards/offers", host: ["{{baseUrl}}"], path: ["rewards", "offers"] },
          },
        },
        {
          name: "Redeem Voucher with Points (Burn On-Chain)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{consumerToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/rewards/redeem", host: ["{{baseUrl}}"], path: ["rewards", "redeem"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({ offerId: "REPLACE_WITH_OFFER_ID" }, null, 2),
            },
          },
        },
      ],
    },

    // 11. COUNTERFEIT REPORTS & HOTSPOTS
    {
      name: "11. Crowdsourced Counterfeit Reports & Hotspot Maps",
      item: [
        {
          name: "Submit Counterfeit Report (Consumer / Guest)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{consumerToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/reports", host: ["{{baseUrl}}"], path: ["reports"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                code: "TC-8924-GENUINE",
                shopName: "City Corner Meds",
                comment: "Cap seal had adhesive residue, medicine color smelled off.",
                geo: { city: "Delhi", state: "Delhi", address: "Chandni Chowk", latitude: 28.6506, longitude: 77.2301 },
                photos: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"],
              }, null, 2),
            },
          },
        },
        {
          name: "Get Consumer's Submitted Reports",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{consumerToken}}" }],
            url: { raw: "{{baseUrl}}/reports/my-reports", host: ["{{baseUrl}}"], path: ["reports", "my-reports"] },
          },
        },
        {
          name: "Get Manufacturer Hotspot Heatmap & Risk Areas",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/reports/hotspots?days=30", host: ["{{baseUrl}}"], path: ["reports", "hotspots"], query: [{ key: "days", value: "30" }] },
          },
        },
      ],
    },

    // 12. MANUFACTURER ANALYTICS
    {
      name: "12. Manufacturer Analytics & Telemetry",
      item: [
        {
          name: "Overview KPI Stats",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/analytics/overview", host: ["{{baseUrl}}"], path: ["analytics", "overview"] },
          },
        },
        {
          name: "Scans Over Time (Timeseries)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/analytics/scans-over-time?days=30", host: ["{{baseUrl}}"], path: ["analytics", "scans-over-time"], query: [{ key: "days", value: "30" }] },
          },
        },
        {
          name: "City-Wise Scan Distribution",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/analytics/city-scans", host: ["{{baseUrl}}"], path: ["analytics", "city-scans"] },
          },
        },
        {
          name: "Scan Result Split (Genuine vs Suspicious vs Fake)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/analytics/scan-split", host: ["{{baseUrl}}"], path: ["analytics", "scan-split"] },
          },
        },
        {
          name: "Batch Performance Table",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/analytics/batch-performance", host: ["{{baseUrl}}"], path: ["analytics", "batch-performance"] },
          },
        },
      ],
    },

    // 13. BILLING & INVOICES
    {
      name: "13. Manufacturer Billing & Invoices",
      item: [
        {
          name: "Get Billing Overview & Credit Balance",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/billing/overview", host: ["{{baseUrl}}"], path: ["billing", "overview"] },
          },
        },
        {
          name: "Mock Top-Up Payment (UPI / Card)",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/billing/topup", host: ["{{baseUrl}}"], path: ["billing", "topup"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                credits: 5000,
                paymentMethod: "UPI",
                paymentDetails: { upiId: "cipla@okhdfcbank" },
              }, null, 2),
            },
          },
        },
        {
          name: "List Tax Invoices",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/billing/invoices", host: ["{{baseUrl}}"], path: ["billing", "invoices"] },
          },
        },
        {
          name: "Upgrade Subscription Plan",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/billing/plan", host: ["{{baseUrl}}"], path: ["billing", "plan"] },
            body: { mode: "raw", raw: JSON.stringify({ plan: "ENTERPRISE" }, null, 2) },
          },
        },
      ],
    },

    // 14. SETTINGS & TEAM
    {
      name: "14. Organization Settings & Team Management",
      item: [
        {
          name: "Get Company Profile",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/settings/company", host: ["{{baseUrl}}"], path: ["settings", "company"] },
          },
        },
        {
          name: "Update Company Profile",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/settings/company", host: ["{{baseUrl}}"], path: ["settings", "company"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                legalBusinessName: "Cipla Quality Pharmaceuticals Ltd",
                gstin: "27AAACC1206D1ZM",
                supportEmail: "support@cipla.com",
                supportPhone: "+912224826000",
              }, null, 2),
            },
          },
        },
        {
          name: "Get Team Members",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{mfgToken}}" }],
            url: { raw: "{{baseUrl}}/settings/team", host: ["{{baseUrl}}"], path: ["settings", "team"] },
          },
        },
        {
          name: "Invite Team Member",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/settings/team", host: ["{{baseUrl}}"], path: ["settings", "team"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Kavita Nair",
                email: "kavita.nair@cipla.com",
                role: "Compliance",
                phone: "9820099887",
              }, null, 2),
            },
          },
        },
        {
          name: "Update Notification Preferences",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{mfgToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/settings/notifications", host: ["{{baseUrl}}"], path: ["settings", "notifications"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                emailNotifications: true,
                lowCreditWarning: true,
                lowCreditThreshold: 1500,
                counterfeitAlerts: true,
              }, null, 2),
            },
          },
        },
      ],
    },

    // 15. ADMIN GOVERNANCE & HEALTH
    {
      name: "15. Super Admin Governance, System Health & Event Listener",
      item: [
        {
          name: "System Health & Network Gas Credits (/admin/health)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
            url: { raw: "{{baseUrl}}/admin/health", host: ["{{baseUrl}}"], path: ["admin", "health"] },
          },
        },
        {
          name: "Retry All Failed Blockchain Transactions (/admin/transactions/retry-all)",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
            url: { raw: "{{baseUrl}}/admin/transactions/retry-all", host: ["{{baseUrl}}"], path: ["admin", "transactions", "retry-all"] },
          },
        },
        {
          name: "Inspect Live Event Listener Telemetry (/admin/listener)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
            url: { raw: "{{baseUrl}}/admin/listener", host: ["{{baseUrl}}"], path: ["admin", "listener"] },
          },
        },
        {
          name: "Trigger Manual Reconciliation Sweep (/admin/listener/reconcile)",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
            url: { raw: "{{baseUrl}}/admin/listener/reconcile", host: ["{{baseUrl}}"], path: ["admin", "listener", "reconcile"] },
          },
        },
        {
          name: "Platform-Wide Analytics (/admin/analytics)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
            url: { raw: "{{baseUrl}}/admin/analytics", host: ["{{baseUrl}}"], path: ["admin", "analytics"] },
          },
        },
        {
          name: "Search Platform Users",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
            url: { raw: "{{baseUrl}}/admin/users?search=cipla", host: ["{{baseUrl}}"], path: ["admin", "users"], query: [{ key: "search", value: "cipla" }] },
          },
        },
        {
          name: "Suspend User Account",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{adminToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/admin/users/USER_ID/suspend", host: ["{{baseUrl}}"], path: ["admin", "users", "USER_ID", "suspend"] },
            body: { mode: "raw", raw: JSON.stringify({ reason: "Repeated counterfeit report violations" }, null, 2) },
          },
        },
        {
          name: "Activate User Account",
          request: {
            method: "PATCH",
            header: [{ key: "Authorization", value: "Bearer {{adminToken}}" }],
            url: { raw: "{{baseUrl}}/admin/users/USER_ID/activate", host: ["{{baseUrl}}"], path: ["admin", "users", "USER_ID", "activate"] },
          },
        },
        {
          name: "Review Counterfeit Report (Award Token Bounty)",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{adminToken}}" },
              { key: "Content-Type", value: "application/json" },
            ],
            url: { raw: "{{baseUrl}}/admin/reports/REPORT_ID/review", host: ["{{baseUrl}}"], path: ["admin", "reports", "REPORT_ID", "review"] },
            body: {
              mode: "raw",
              raw: JSON.stringify({
                status: "Valid",
                reviewNotes: "Field inspection confirmed counterfeit packaging.",
                pointsToAward: 100,
              }, null, 2),
            },
          },
        },
      ],
    },
  ],
};

// Write Postman Collection file
const postmanPath = path.join(__dirname, '..', 'postman_collection.json');
fs.writeFileSync(postmanPath, JSON.stringify(postmanCollection, null, 2), 'utf8');
console.log(`✅ Postman Collection generated at: ${postmanPath}`);

// Generate OpenAPI 3.0 file
const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "TrustChain Web3 Supply Chain & Anti-Counterfeit Platform API",
    version: "1.0.0",
    description: "Production REST API for TrustChain Web3 supply chain verification, Merkle serialization, consumer warranty claims, loyalty tokens, and manufacturer billing.",
  },
  servers: [
    { url: "http://localhost:5000/api/v1", description: "Local Development Server" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register new user account",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, password: { type: "string" }, role: { type: "string" } } } } },
        },
        responses: { 201: { description: "User registered" } },
      },
    },
    "/auth/login": {
      post: {
        summary: "Authenticate user and receive JWT token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } } } } },
        },
        responses: { 200: { description: "Login successful with JWT" } },
      },
    },
    "/auth/me": {
      get: {
        summary: "Get current authenticated profile",
        tags: ["Auth"],
        responses: { 200: { description: "Profile data" } },
      },
    },
    "/verify/{code}": {
      get: {
        summary: "Public verification of QR code with Merkle proof & clone detection",
        tags: ["Verification"],
        parameters: [{ name: "code", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Verification outcome" } },
      },
    },
    "/batches": {
      get: { summary: "List manufacturer batches", tags: ["Batches"], responses: { 200: { description: "Batch list" } } },
      post: { summary: "Create serialized batch with Merkle root", tags: ["Batches"], responses: { 201: { description: "Batch created" } } },
    },
    "/batches/{id}/recall": {
      post: { summary: "Emergency recall of product batch", tags: ["Batches"], responses: { 200: { description: "Batch recalled" } } },
    },
    "/units/sell": {
      post: { summary: "Retailer point-of-sale transfer & claim token issue", tags: ["Retail Sales"], responses: { 200: { description: "Sale recorded" } } },
    },
    "/units/claim": {
      post: { summary: "Consumer warranty claim with OTP & claim token", tags: ["Consumer"], responses: { 200: { description: "Ownership claimed" } } },
    },
    "/units/my-products": {
      get: { summary: "Consumer claimed products list", tags: ["Consumer"], responses: { 200: { description: "List of products" } } },
    },
    "/rewards/balance": {
      get: { summary: "Consumer TrustPoints token balance", tags: ["Rewards"], responses: { 200: { description: "Token balance" } } },
    },
    "/reports": {
      post: { summary: "Submit crowdsourced counterfeit report", tags: ["Reports"], responses: { 201: { description: "Report created" } } },
    },
    "/reports/hotspots": {
      get: { summary: "Manufacturer counterfeit risk heatmap & top areas", tags: ["Reports"], responses: { 200: { description: "Hotspot geospatial data" } } },
    },
    "/analytics/overview": {
      get: { summary: "Manufacturer KPI overview stats", tags: ["Analytics"], responses: { 200: { description: "Analytics KPIs" } } },
    },
    "/billing/overview": {
      get: { summary: "Prepaid serialization credits balance & plan", tags: ["Billing"], responses: { 200: { description: "Billing overview" } } },
    },
    "/billing/topup": {
      post: { summary: "Mock top-up payment with auto-generated tax invoice", tags: ["Billing"], responses: { 201: { description: "Credits added & invoice generated" } } },
    },
    "/admin/health": {
      get: { summary: "System health, relayer gas credits & transaction queue", tags: ["Admin"], responses: { 200: { description: "System health telemetry" } } },
    },
    "/admin/transactions/retry-all": {
      post: { summary: "Bulk retry all failed on-chain transactions", tags: ["Admin"], responses: { 200: { description: "Retry sweep results" } } },
    },
    "/admin/listener": {
      get: { summary: "Smart contract event listener status & telemetry", tags: ["Admin"], responses: { 200: { description: "Listener telemetry" } } },
    },
    "/admin/listener/reconcile": {
      post: { summary: "Trigger manual reconciliation sweep", tags: ["Admin"], responses: { 200: { description: "Reconciliation sweep completed" } } },
    },
  },
};

const openApiPath = path.join(__dirname, '..', 'openapi.json');
fs.writeFileSync(openApiPath, JSON.stringify(openApiSpec, null, 2), 'utf8');
console.log(`✅ OpenAPI 3.0 specification generated at: ${openApiPath}`);
