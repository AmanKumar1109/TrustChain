/**
 * TrustChain Platform Master Database Seeder
 * Populates MongoDB with comprehensive, production-ready demo data:
 * - Admin, Approved Demo Brand with prepaid credits, Distributor, Retailer, and Consumer
 * - Product catalog & Batches with Merkle Trees
 * - Attempts live on-chain batch registration on local Hardhat node if running
 * - Partner Network Onboarding, Inventory holdings & Custody transfers
 * - Historical scans (genuine, suspicious, fake, clone velocity) across major Indian cities
 * - Counterfeit Reports across multiple Indian states for the Hotspot heatmap
 * - Billing Invoices, Team Members, and Loyalty Rewards catalog
 */

const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ethers } = require('ethers');
const config = require('../src/config/env');
const { ensureMongoServer } = require('../src/config/embeddedMongo');
const { MerkleTreeBuilder, leafHash } = require('../src/utils/merkle');
const walletService = require('../src/services/wallet.service');
const contractService = require('../src/services/contract.service');
const blockchainService = require('../src/services/blockchain.service');

// Import Models
const User = require('../src/models/User');
const Brand = require('../src/models/Brand');
const Product = require('../src/models/Product');
const Batch = require('../src/models/Batch');
const Unit = require('../src/models/Unit');
const Partner = require('../src/models/Partner');
const PartnerInventory = require('../src/models/PartnerInventory');
const Transfer = require('../src/models/Transfer');
const Sale = require('../src/models/Sale');
const Scan = require('../src/models/Scan');
const Report = require('../src/models/Report');
const RewardCampaign = require('../src/models/RewardCampaign');
const RewardOffer = require('../src/models/RewardOffer');
const RewardLedger = require('../src/models/RewardLedger');
const CreditLedger = require('../src/models/CreditLedger');
const Invoice = require('../src/models/Invoice');
const TeamMember = require('../src/models/TeamMember');
const Transaction = require('../src/models/Transaction');
const { ROLES } = require('../src/constants/roles');

/**
 * Fast non-blocking ping to test if local Hardhat RPC node is online
 */
function isNodeReachable(rpcUrl) {
  return new Promise((resolve) => {
    try {
      const url = new URL(rpcUrl);
      const req = http.request(
        {
          host: url.hostname,
          port: url.port || 8545,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          timeout: 1200,
        },
        (res) => {
          resolve(res.statusCode === 200);
        }
      );
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.write(JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }));
      req.end();
    } catch (err) {
      resolve(false);
    }
  });
}

async function seed() {
  console.log('\n========================================================================');
  console.log('🌱 Starting TrustChain Master Production & Demo Seeder...');
  console.log('========================================================================\n');

  try {
    try {
      await ensureMongoServer(config.mongoUri);
      await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ Connected to MongoDB: ${config.mongoUri}`);
    } catch (dbErr) {
      console.error('\n❌ Could not connect to MongoDB at:', config.mongoUri);
      console.error('👉 Please make sure MongoDB is running locally (e.g., MongoDB Community Server or Compass),');
      console.error('   OR set MONGO_URI=<your-mongodb-atlas-uri> in backend/.env');
      console.error(`   Error details: ${dbErr.message}\n`);
      process.exit(1);
    }

    // Clean slate: purge old collections
    const collections = [
      User, Brand, Product, Batch, Unit, Partner, PartnerInventory,
      Transfer, Sale, Scan, Report, RewardCampaign, RewardOffer,
      RewardLedger, CreditLedger, Invoice, TeamMember, Transaction
    ];
    for (const model of collections) {
      await model.deleteMany({});
    }
    console.log('🧹 Purged existing collections for fresh seed.\n');

    // 1. SEED USERS & WALLETS
    console.log('👤 Seeding core platform actors...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const mfgWallet = walletService.createCustodialWallet();
    const adminWallet = walletService.createCustodialWallet();
    const distWallet = walletService.createCustodialWallet();
    const retWallet = walletService.createCustodialWallet();
    const consumerWallet = walletService.createCustodialWallet();

    const admin = await User.create({
      name: 'TrustChain System Admin',
      email: 'admin@trustchain.com',
      password: hashedPassword,
      phone: '+919999900000',
      role: ROLES.ADMIN,
      status: 'VERIFIED',
      walletAddress: adminWallet.address,
      encryptedPrivateKey: adminWallet.encryptedPrivateKey,
    });

    const manufacturer = await User.create({
      name: 'Cipla India Compliance',
      email: 'mfg@cipla.com',
      password: hashedPassword,
      phone: '+919876500001',
      role: ROLES.MANUFACTURER,
      status: 'VERIFIED',
      creditBalance: 10000,
      walletAddress: mfgWallet.address,
      encryptedPrivateKey: mfgWallet.encryptedPrivateKey,
      brandStatus: 'approved',
      plan: { name: 'Growth', code: 'GROWTH' },
      companyProfile: {
        legalBusinessName: 'Cipla Limited India',
        gstin: '27AAACC1206D1ZM',
        cin: 'L24239MH1935PLC002380',
        supportEmail: 'support@cipla.com',
        supportPhone: '+912224826000',
      },
      notificationPreferences: {
        emailNotifications: true,
        lowCreditWarning: true,
        lowCreditThreshold: 1000,
        counterfeitAlerts: true,
        transferUpdates: true,
      },
    });

    const distributorUser = await User.create({
      name: 'Apex Pharma Logistics',
      email: 'distributor@apexlogistics.com',
      password: hashedPassword,
      phone: '+919876500002',
      role: ROLES.DISTRIBUTOR,
      status: 'VERIFIED',
      walletAddress: distWallet.address,
      encryptedPrivateKey: distWallet.encryptedPrivateKey,
    });

    const retailerUser = await User.create({
      name: 'Metro Life Chemist',
      email: 'retailer@metrolife.com',
      password: hashedPassword,
      phone: '+919876500003',
      role: ROLES.RETAILER,
      status: 'VERIFIED',
      walletAddress: retWallet.address,
      encryptedPrivateKey: retWallet.encryptedPrivateKey,
    });

    const consumer = await User.create({
      name: 'Rahul Sharma',
      email: 'consumer@gmail.com',
      password: hashedPassword,
      phone: '+919876543210',
      role: ROLES.CONSUMER,
      status: 'VERIFIED',
      pointsBalance: 240,
      referralCode: 'TC-RAHUL-77',
      scanStreak: {
        currentStreak: 4,
        longestStreak: 7,
        lastScanDate: new Date(),
        lastMilestoneRewarded: 0,
      },
      walletAddress: consumerWallet.address,
      encryptedPrivateKey: consumerWallet.encryptedPrivateKey,
    });

    console.log('   ✓ Admin:        admin@trustchain.com');
    console.log('   ✓ Manufacturer: mfg@cipla.com (Credits: 10,000)');
    console.log('   ✓ Distributor:  distributor@apexlogistics.com');
    console.log('   ✓ Retailer:     retailer@metrolife.com');
    console.log('   ✓ Consumer:     consumer@gmail.com (+919876543210)');

    // 2. SEED BRAND (APPROVED DEMO BRAND)
    console.log('\n🏢 Seeding Brand & KYB Onboarding...');
    const brand = await Brand.create({
      companyName: 'Cipla Pharmaceuticals Ltd',
      name: 'Cipla Pharmaceuticals Ltd',
      legalBusinessName: 'Cipla Limited India',
      cin: 'L24239MH1935PLC002380',
      gstin: '27AAACC1206D1ZM',
      gst: '27AAACC1206D1ZM',
      manufacturer: manufacturer._id,
      officialEmail: 'compliance@cipla.com',
      phone: '+919876500001',
      website: 'https://www.cipla.com',
      status: 'approved',
      categories: ['Pharmaceuticals', 'Healthcare', 'Respiratory Care'],
      approvedAt: new Date(),
      approvedBy: admin._id,
      reputationScore: 98,
    });
    console.log(`   ✓ Brand: ${brand.name} (Status: Approved)`);

    // 3. SEED PRODUCTS
    console.log('\n📦 Seeding Product Catalog...');
    const asthalinProduct = await Product.create({
      name: 'Cipla Asthalin Inhaler 100mcg',
      sku: 'CIP-ASTH-100',
      category: 'Pharmaceuticals',
      manufacturer: manufacturer._id,
      brand: brand._id,
      brandName: brand.name,
      description: 'Salbutamol inhalation aerosol for bronchial asthma and COPD relief.',
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'],
      mrp: 185.0,
      protectionLevelDefault: 'Standard',
      warrantyPeriodMonths: 24,
    });

    const montairProduct = await Product.create({
      name: 'Cipla Montair-LC Tablets',
      sku: 'CIP-MONT-10',
      category: 'Pharmaceuticals',
      manufacturer: manufacturer._id,
      brand: brand._id,
      brandName: brand.name,
      description: 'Montelukast and Levocetirizine dihydrochloride allergy tablets.',
      images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80'],
      mrp: 295.0,
      protectionLevelDefault: 'Standard',
      warrantyPeriodMonths: 36,
    });
    console.log(`   ✓ Products: ${asthalinProduct.name}, ${montairProduct.name}`);

    // 4. CHECK HARDHAT LOCAL NODE FOR ON-CHAIN REGISTRATION
    console.log('\n⛓️ Checking Local Blockchain Node (RPC: http://127.0.0.1:8545)...');
    const isOnline = await isNodeReachable(config.rpcUrl);
    let onChainBatchRegistered = false;
    let onChainTxHash = ethers.id(`tx-batch-1-${Date.now()}`);
    let onChainBlockNumber = 1984201;

    // Batch 1: Asthalin Active Batch
    const batch1Codes = [
      'TC-8924-GENUINE',
      'TC-CLONE-DELHI',
      'TC-SOLD-UNCLAIMED',
      'TC-CLAIMED-UNIT',
      ...Array.from({ length: 16 }, (_, i) => `TC-ASTH-B1-${String(i + 1).padStart(3, '0')}`)
    ];
    const tree1 = new MerkleTreeBuilder(batch1Codes);
    const root1 = tree1.getRoot();

    if (isOnline) {
      try {
        console.log('   🔗 Local Hardhat node detected! Attempting live smart contract registration...');
        await contractService.init();

        // Ensure manufacturer role is authorized
        await blockchainService.ensureManufacturerAuthorized(manufacturer.walletAddress);

        // Register batch on-chain
        const expiryTimestamp = Math.floor(new Date('2028-01-15').getTime() / 1000);
        const onChainResult = await blockchainService.registerBatchOnChain({
          batchId: 'BATCH-2026-DEL99',
          manufacturerWallet: manufacturer.walletAddress,
          merkleRoot: root1,
          quantity: batch1Codes.length,
          protectionLevel: 0,
          expiryTimestamp,
        });

        onChainTxHash = onChainResult.txHash;
        onChainBlockNumber = onChainResult.receipt?.blockNumber || 1;
        onChainBatchRegistered = true;
        console.log(`   ✅ Live On-Chain Registration SUCCESSFUL!`);
        console.log(`      Tx Hash: ${onChainTxHash}`);
        console.log(`      Block #: ${onChainBlockNumber}`);

        // Authorize distributor & retailer wallets on-chain
        await blockchainService.ensurePartnerAuthorized(distributorUser.walletAddress);
        await blockchainService.ensurePartnerAuthorized(retailerUser.walletAddress);
        console.log('   ✅ Supply chain partners authorized on TrustChainRegistry smart contract.');
      } catch (chainErr) {
        console.warn(`   ⚠️ Live on-chain registration skipped: ${chainErr.message}`);
      }
    } else {
      console.log('   ℹ️ Local Hardhat node offline or not responding.');
      console.log('      Stored deterministic cryptographic Merkle proof for local evaluation.');
      console.log('      (To run on-chain: start "npx hardhat node" in contracts-project, deploy contracts, and re-run seed).');
    }

    const batch1 = await Batch.create({
      batchNumber: 'BATCH-2026-DEL99',
      batchId: 'BATCH-2026-DEL99',
      product: asthalinProduct._id,
      productName: asthalinProduct.name,
      brand: brand._id,
      brandName: brand.name,
      manufacturer: manufacturer._id,
      quantity: batch1Codes.length,
      mfgDate: new Date('2026-01-15'),
      expiryDate: new Date('2028-01-15'),
      protectionLevel: 'Standard',
      protectionLevelCode: 0,
      merkleRoot: root1,
      status: 'Active',
      technicalProof: {
        txHash: onChainTxHash,
        blockNumber: onChainBlockNumber,
        contractAddress: contractService.addresses?.TrustChainRegistry || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      },
    });

    // Create Units for Batch 1
    const units1Docs = [];
    for (const code of batch1Codes) {
      let status = 'inStock';
      let soldDetails = {};

      if (code === 'TC-SOLD-UNCLAIMED') {
        status = 'soldAwaitingClaim';
        soldDetails = {
          retailer: retailerUser._id,
          customer: consumer._id,
          soldState: 1,
          soldAt: new Date(Date.now() - 3600000 * 5),
          claimToken: 'CLM-TEST-TOK-123',
          claimExpiresAt: new Date(Date.now() + 86400000 * 7),
        };
      } else if (code === 'TC-CLAIMED-UNIT') {
        status = 'claimed';
        soldDetails = {
          retailer: retailerUser._id,
          customer: consumer._id,
          claimedBy: consumer._id,
          currentOwnerWallet: consumerWallet.address,
          soldState: 2,
          soldAt: new Date(Date.now() - 86400000 * 20),
          claimedAt: new Date(Date.now() - 86400000 * 19),
          claimToken: 'CLM-CLAIMED-TOK',
          warrantyActive: true,
          warrantyExpiresAt: new Date('2028-01-15'),
        };
      }

      units1Docs.push({
        unitCode: code,
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        batchId: batch1.batchId,
        product: asthalinProduct._id,
        productName: asthalinProduct.name,
        brand: brand._id,
        brandName: brand.name,
        manufacturer: manufacturer._id,
        status,
        leafHash: leafHash(code),
        proof: tree1.getProof(code),
        merkleProof: tree1.getProof(code),
        ...soldDetails,
      });
    }
    await Unit.insertMany(units1Docs);

    // Seed Sales records for Consumer Vault & POS flow
    const soldUnitDoc = await Unit.findOne({ unitCode: 'TC-SOLD-UNCLAIMED' });
    const claimedUnitDoc = await Unit.findOne({ unitCode: 'TC-CLAIMED-UNIT' });
    if (soldUnitDoc) {
      await Sale.create({
        unit: soldUnitDoc._id,
        unitCode: soldUnitDoc.unitCode,
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        retailer: retailerUser._id,
        customer: consumer._id,
        customerPhone: consumer.phone,
        salePrice: asthalinProduct.price,
        claimToken: 'CLM-TEST-TOK-123',
        isClaimed: false,
        purchaseDate: new Date(Date.now() - 3600000 * 5),
      });
    }
    if (claimedUnitDoc) {
      await Sale.create({
        unit: claimedUnitDoc._id,
        unitCode: claimedUnitDoc.unitCode,
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        retailer: retailerUser._id,
        customer: consumer._id,
        customerPhone: consumer.phone,
        salePrice: asthalinProduct.price,
        claimToken: 'CLM-CLAIMED-TOK',
        isClaimed: true,
        claimedAt: new Date(Date.now() - 86400000 * 19),
        purchaseDate: new Date(Date.now() - 86400000 * 20),
      });
    }

    // Batch 2: Montair Recalled Batch
    const batch2Codes = [
      'TC-RECALL-99',
      ...Array.from({ length: 9 }, (_, i) => `TC-MONT-REC-${String(i + 1).padStart(2, '0')}`)
    ];
    const tree2 = new MerkleTreeBuilder(batch2Codes);
    const root2 = tree2.getRoot();

    const batch2 = await Batch.create({
      batchNumber: 'BATCH-2026-MUM14',
      batchId: 'BATCH-2026-MUM14',
      product: montairProduct._id,
      productName: montairProduct.name,
      brand: brand._id,
      brandName: brand.name,
      manufacturer: manufacturer._id,
      quantity: batch2Codes.length,
      mfgDate: new Date('2025-11-01'),
      expiryDate: new Date('2027-11-01'),
      protectionLevel: 'Standard',
      protectionLevelCode: 0,
      merkleRoot: root2,
      status: 'Recalled',
      recalled: true,
      recallReason: 'Packaging seal integrity failure detected during secondary warehouse quality audit.',
      recalledAt: new Date(),
      technicalProof: {
        txHash: ethers.id(`tx-batch-2-${Date.now()}`),
        blockNumber: 1984215,
        contractAddress: contractService.addresses?.TrustChainRegistry || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      },
    });

    const units2Docs = batch2Codes.map(code => ({
      unitCode: code,
      batch: batch2._id,
      batchNumber: batch2.batchNumber,
      batchId: batch2.batchId,
      product: montairProduct._id,
      productName: montairProduct.name,
      brand: brand._id,
      brandName: brand.name,
      manufacturer: manufacturer._id,
      status: 'recalled',
      leafHash: leafHash(code),
      proof: tree2.getProof(code),
      merkleProof: tree2.getProof(code),
    }));
    await Unit.insertMany(units2Docs);

    console.log(`   ✓ Active Batch:   ${batch1.batchNumber} (Root: ${root1.slice(0, 18)}...)`);
    console.log(`   ✓ Recalled Batch: ${batch2.batchNumber} (Reason: ${batch2.recallReason.slice(0, 35)}...)`);

    // 5. SEED SUPPLY CHAIN PARTNERS & CUSTODY TRANSFERS
    console.log('\n🤝 Seeding Supply Chain Partners, Inventory & Transfers...');
    const distributorPartner = await Partner.create({
      user: distributorUser._id,
      businessName: 'Apex Logistics & Cold Chain Hub',
      role: 'distributor',
      status: 'approved',
      gstNumber: '07AAACA1234F1Z8',
      location: {
        address: 'Plot 45, Okhla Industrial Area Phase III',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110020',
        coordinates: { lat: 28.5355, lng: 77.2732 },
      },
      invitedBy: manufacturer._id,
      approvedAt: new Date(),
      reputationScore: 94,
    });

    const retailerPartner = await Partner.create({
      user: retailerUser._id,
      businessName: 'Metro Life Chemist',
      role: 'retailer',
      status: 'approved',
      gstNumber: '07BBBCB5678F1Z9',
      location: {
        address: 'Shop 14, Karol Bagh Market',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110005',
        coordinates: { lat: 28.6517, lng: 77.1906 },
      },
      invitedBy: distributorUser._id,
      approvedAt: new Date(),
      reputationScore: 89,
    });

    await PartnerInventory.create([
      {
        partner: distributorUser._id,
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        productName: asthalinProduct.name,
        quantity: 50,
        receivedAt: new Date(),
      },
      {
        partner: retailerUser._id,
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        productName: asthalinProduct.name,
        quantity: 20,
        receivedAt: new Date(),
      },
    ]);

    await Transfer.create({
      transferId: `TRF-${Date.now().toString(36).toUpperCase()}-M1`,
      from: manufacturer._id,
      fromRole: 'manufacturer',
      to: distributorUser._id,
      toRole: 'distributor',
      batch: batch1._id,
      batchNumber: batch1.batchNumber,
      quantity: 50,
      status: 'Accepted',
      txHash: ethers.id(`tx-transfer-1-${Date.now()}`),
      timeline: [
        { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 3), actor: manufacturer._id },
        { status: 'Accepted', timestamp: new Date(Date.now() - 86400000 * 2), actor: distributorUser._id },
      ],
    });
    console.log('   ✓ Distributor & Retailer onboarded with verified inventory and custody history.');

    // 6. SEED HISTORICAL SCANS ACROSS INDIAN CITIES
    console.log('\n🔍 Seeding Historical Scans Across Major Indian Hubs...');
    const now = new Date();
    const cloneUnit = await Unit.findOne({ unitCode: 'TC-CLONE-DELHI' });
    const genuineUnit = await Unit.findOne({ unitCode: 'TC-8924-GENUINE' });

    // Multi-city geographic coordinates in India
    const cityCoords = {
      Delhi: { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
      Mumbai: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
      Bengaluru: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
      Kolkata: { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
      Hyderabad: { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
      Ahmedabad: { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
      Pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
      Jaipur: { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
    };

    const scanSeedList = [];

    // A. Genuine Scans over last 20 days
    const citiesGenuine = ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur'];
    for (let day = 1; day <= 20; day++) {
      const city = citiesGenuine[day % citiesGenuine.length];
      const coords = cityCoords[city];
      scanSeedList.push({
        code: 'TC-8924-GENUINE',
        userId: day % 2 === 0 ? consumer._id : null,
        unit: genuineUnit._id,
        batch: batch1._id,
        batchId: batch1.batchNumber,
        city,
        geo: { city, country: 'India', latitude: coords.lat, longitude: coords.lng },
        result: 'genuine',
        timestamp: new Date(now.getTime() - day * 24 * 3600000 + (day * 3600000)),
      });
    }

    // B. Clone Anomaly (Speed/Distance Violation: Scanned in Delhi, then Mumbai within 2 minutes)
    scanSeedList.push({
      code: 'TC-CLONE-DELHI',
      userId: null,
      unit: cloneUnit._id,
      batch: batch1._id,
      batchId: batch1.batchNumber,
      city: 'Delhi',
      geo: { city: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
      result: 'genuine',
      timestamp: new Date(now.getTime() - 120000),
    });

    scanSeedList.push({
      code: 'TC-CLONE-DELHI',
      userId: null,
      unit: cloneUnit._id,
      batch: batch1._id,
      batchId: batch1.batchNumber,
      city: 'Mumbai',
      geo: { city: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
      result: 'suspicious',
      reason: 'Scanned in 2 different cities (Delhi, Mumbai) within 2 minutes',
      timestamp: new Date(now.getTime() - 30000),
    });

    // C. Suspicious & Fake Scans for Hotspot Heatmap (Delhi, Mumbai, Bengaluru, Ahmedabad, Kolkata)
    const hotspotDistributions = [
      { city: 'Delhi', count: 5, result: 'suspicious', reason: 'High velocity repeated scans from same IP' },
      { city: 'Mumbai', count: 6, result: 'suspicious', reason: 'Unregistered batch serial format copy' },
      { city: 'Ahmedabad', count: 4, result: 'fake', reason: 'Unregistered counterfeit QR detected' },
      { city: 'Kolkata', count: 3, result: 'suspicious', reason: 'Mismatched cryptographic signature' },
      { city: 'Bengaluru', count: 2, result: 'suspicious', reason: 'Scan on expired warranty unit' },
    ];

    for (const h of hotspotDistributions) {
      const coords = cityCoords[h.city];
      for (let i = 0; i < h.count; i++) {
        scanSeedList.push({
          code: `TC-${h.result.toUpperCase()}-${h.city.toUpperCase()}-${i + 1}`,
          batch: batch1._id,
          batchId: batch1.batchNumber,
          city: h.city,
          geo: { city: h.city, country: 'India', latitude: coords.lat + (Math.random() - 0.5) * 0.05, longitude: coords.lng + (Math.random() - 0.5) * 0.05 },
          result: h.result,
          reason: h.reason,
          timestamp: new Date(now.getTime() - (i + 1) * 2 * 86400000),
        });
      }
    }

    await Scan.insertMany(scanSeedList);
    console.log(`   ✓ Inserted ${scanSeedList.length} historical scans across 8 Indian cities.`);

    // 7. SEED CROWDSOURCED COUNTERFEIT REPORTS ACROSS INDIAN HUBS
    console.log('\n🚨 Seeding Counterfeit Reports for Risk Hotspots...');
    const reportsToSeed = [
      {
        reportId: 'RPT-DEL-9021',
        user: consumer._id,
        isGuest: false,
        photos: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'],
        geo: { latitude: 28.6506, longitude: 77.2301, city: 'Delhi', state: 'Delhi', address: 'Bhagirath Palace Wholesale Market, Delhi' },
        shopName: 'Metro Life Chemist',
        comment: 'Packaging has blurred QR code, cap seal was previously broken, font color looks lighter than original.',
        code: 'TC-CLONE-DELHI',
        unit: cloneUnit._id,
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        productName: asthalinProduct.name,
        brand: brand._id,
        brandName: brand.name,
        manufacturer: manufacturer._id,
        status: 'Submitted',
        notifiedBrand: true,
      },
      {
        reportId: 'RPT-MUM-8982',
        user: null,
        isGuest: true,
        guestContact: { name: 'Pooja Verma', phone: '+919811223344' },
        photos: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80'],
        geo: { latitude: 19.0760, longitude: 72.8777, city: 'Mumbai', state: 'Maharashtra', address: 'Crawford Market Medical Zone, Mumbai' },
        shopName: 'Dadar Central Chemist',
        comment: 'Medicine dissolved irregularly in water, blister packaging lacked company manufacturing embossed stamp.',
        code: 'BATCH-2026-MUM14',
        batch: batch2._id,
        batchNumber: batch2.batchNumber,
        product: montairProduct._id,
        productName: montairProduct.name,
        brand: brand._id,
        brandName: brand.name,
        manufacturer: manufacturer._id,
        status: 'UnderReview',
        notifiedBrand: true,
      },
      {
        reportId: 'RPT-BLR-5541',
        user: consumer._id,
        isGuest: false,
        photos: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'],
        geo: { latitude: 12.9716, longitude: 77.5946, city: 'Bengaluru', state: 'Karnataka', address: 'SP Road Electronics & Pharmacy Stall, Bengaluru' },
        shopName: 'Sri Sai Medicals',
        comment: 'Reported fake batch in circulation. Verified duplicate serial sticker.',
        code: 'TC-8924-GENUINE',
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        productName: asthalinProduct.name,
        brand: brand._id,
        brandName: brand.name,
        manufacturer: manufacturer._id,
        status: 'Valid',
        adminReview: {
          reviewedBy: admin._id,
          reviewedAt: new Date(),
          reviewNotes: 'Investigated by compliance field team; confirmed counterfeit packaging.',
          pointsAwarded: 100,
          txHash: ethers.id(`tx-bounty-${Date.now()}`),
        },
        notifiedBrand: true,
      },
      {
        reportId: 'RPT-CCU-4210',
        user: null,
        isGuest: true,
        guestContact: { name: 'Subhash Sen', phone: '+919830112233' },
        photos: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'],
        geo: { latitude: 22.5726, longitude: 88.3639, city: 'Kolkata', state: 'West Bengal', address: 'Park Street Medical Arcade, Kolkata' },
        shopName: 'Bengal Pharmacy Traders',
        comment: 'Unsealed container with expired batch stickers pasted over manufacturing label.',
        code: 'TC-8924-GENUINE',
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        productName: asthalinProduct.name,
        brand: brand._id,
        brandName: brand.name,
        manufacturer: manufacturer._id,
        status: 'UnderReview',
        notifiedBrand: true,
      },
      {
        reportId: 'RPT-AMD-3109',
        user: consumer._id,
        isGuest: false,
        photos: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80'],
        geo: { latitude: 23.0225, longitude: 72.5714, city: 'Ahmedabad', state: 'Gujarat', address: 'Relief Road Wholesale Market, Ahmedabad' },
        shopName: 'Gujarat Pharma Mart',
        comment: 'Customer suspected dilution; verified authentic after lab batch testing.',
        code: 'TC-8924-GENUINE',
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        productName: asthalinProduct.name,
        brand: brand._id,
        brandName: brand.name,
        manufacturer: manufacturer._id,
        status: 'Invalid',
        adminReview: {
          reviewedBy: admin._id,
          reviewedAt: new Date(),
          reviewNotes: 'Sample inspected in regional drug testing lab; passes all purity metrics.',
          pointsAwarded: 0,
        },
        notifiedBrand: true,
      },
      {
        reportId: 'RPT-HYD-7123',
        user: consumer._id,
        isGuest: false,
        photos: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'],
        geo: { latitude: 17.3850, longitude: 78.4867, city: 'Hyderabad', state: 'Telangana', address: 'Koti Medical Market, Hyderabad' },
        shopName: 'Deccan Lifecare',
        comment: 'High risk replica found with altered barcode stickers.',
        code: 'TC-8924-GENUINE',
        batch: batch1._id,
        batchNumber: batch1.batchNumber,
        product: asthalinProduct._id,
        productName: asthalinProduct.name,
        brand: brand._id,
        brandName: brand.name,
        manufacturer: manufacturer._id,
        status: 'Valid',
        adminReview: {
          reviewedBy: admin._id,
          reviewedAt: new Date(),
          reviewNotes: 'Counterfeit stock seized by state drug administration.',
          pointsAwarded: 100,
          txHash: ethers.id(`tx-bounty-hyd-${Date.now()}`),
        },
        notifiedBrand: true,
      },
    ];

    await Report.insertMany(reportsToSeed);
    console.log(`   ✓ Seeded ${reportsToSeed.length} counterfeit reports across Delhi, Mumbai, Bengaluru, Kolkata, Ahmedabad, and Hyderabad.`);

    // 8. SEED LOYALTY REWARDS & CATALOGUE
    console.log('\n🎁 Seeding Loyalty Rewards, Campaign & Catalogue...');
    await RewardCampaign.create({
      manufacturer: manufacturer._id,
      pointsPerScan: 10,
      streakBonus: 25,
      streakDaysThreshold: 5,
      referralBonus: 50,
      fakeReportBonus: 100,
      dailyCap: 50,
      isActive: true,
    });

    const offers = [
      {
        title: '₹100 Amazon Gift Voucher',
        description: 'Instant ₹100 shopping voucher redeemable across all Amazon India orders.',
        category: 'Gift Cards',
        pointsRequired: 100,
        couponPrefix: 'AMZN',
        partner: 'Amazon',
        discountAmount: 100,
        stock: 50,
        terms: 'Valid on Amazon.in. Non-reloadable and cannot be refunded.',
      },
      {
        title: '₹250 Flipkart Voucher',
        description: 'Get ₹250 instant discount on electronics, fashion, and essentials on Flipkart.',
        category: 'Gift Cards',
        pointsRequired: 220,
        couponPrefix: 'FKRT',
        partner: 'Flipkart',
        discountAmount: 250,
        stock: 25,
        terms: 'Valid on Flipkart app and website. Minimum order value ₹500.',
      },
      {
        title: '20% Off Official Brand Store',
        description: 'Enjoy 20% discount on your next direct product purchase from certified manufacturers.',
        category: 'Discounts',
        pointsRequired: 75,
        couponPrefix: 'BRND20',
        partner: 'Cipla Direct',
        discountPercentage: 20,
        stock: 100,
        terms: 'Valid for 45 days on all partner brand webstores.',
      },
      {
        title: 'Free Express Shipping Voucher',
        description: 'Zero shipping charges on any cold-chain or standard logistics order.',
        category: 'Vouchers',
        pointsRequired: 40,
        couponPrefix: 'FREESHIP',
        partner: 'National Logistics',
        discountAmount: 60,
        stock: 200,
        terms: 'One-time use per customer. Valid on participating delivery partners.',
      },
    ];
    await RewardOffer.insertMany(offers);

    await RewardLedger.create({
      user: consumer._id,
      type: 'FIRST_SCAN_REWARD',
      points: 10,
      unitCode: 'TC-8924-GENUINE',
      description: 'First genuine scan reward for Cipla Asthalin Inhaler (TC-8924-GENUINE)',
      balanceAfter: 240,
    });
    console.log('   ✓ Reward campaign & 4 store offers seeded.');

    // 9. SEED BILLING INVOICES & TEAM MEMBERS FOR MANUFACTURER
    console.log('\n💳 Seeding Billing Invoices & Organization Team Members...');
    await Invoice.create([
      {
        invoiceNumber: 'INV-2026-00001',
        manufacturer: manufacturer._id,
        companyName: 'Cipla Quality Pharmaceuticals Ltd',
        gst: '27AAACC1206D1ZM',
        cin: 'L24239MH1935PLC002380',
        billingAddress: {
          street: 'Cipla House, Peninsula Business Park, Ganpatrao Kadam Marg',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400013',
          country: 'India',
        },
        items: [
          {
            description: 'TrustChain Prepaid Verification & Serialization Credits (5,000 units)',
            quantity: 5000,
            unitPrice: 1.0,
            amount: 5000,
          },
        ],
        creditsPurchased: 5000,
        subtotalINR: 5000,
        gstRate: 18,
        gstAmountINR: 900,
        totalAmountINR: 5900,
        currency: 'INR',
        paymentMethod: 'UPI',
        paymentReference: 'UPI-IN-984218-0912',
        paymentDetails: {
          upiId: 'cipla@okhdfcbank',
          mode: 'UPI_COLLECT',
        },
        status: 'PAID',
        paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        invoiceNumber: 'INV-2026-00002',
        manufacturer: manufacturer._id,
        companyName: 'Cipla Quality Pharmaceuticals Ltd',
        gst: '27AAACC1206D1ZM',
        cin: 'L24239MH1935PLC002380',
        billingAddress: {
          street: 'Cipla House, Peninsula Business Park, Ganpatrao Kadam Marg',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400013',
          country: 'India',
        },
        items: [
          {
            description: 'TrustChain Prepaid Verification & Serialization Credits (2,000 units)',
            quantity: 2000,
            unitPrice: 1.0,
            amount: 2000,
          },
        ],
        creditsPurchased: 2000,
        subtotalINR: 2000,
        gstRate: 18,
        gstAmountINR: 360,
        totalAmountINR: 2360,
        currency: 'INR',
        paymentMethod: 'CARD',
        paymentReference: 'CARD-AUTH-88412-5501',
        paymentDetails: {
          cardLast4: '4242',
          cardNetwork: 'Visa',
          bankName: 'HDFC Bank',
          mode: 'CARD_3DS',
        },
        status: 'PAID',
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ]);

    await TeamMember.create([
      {
        organization: manufacturer._id,
        name: 'Dr. Sunita Rao',
        email: 'sunita.rao@cipla.com',
        phone: '9820011223',
        role: 'Manager',
        status: 'Active',
        invitedBy: manufacturer._id,
        lastActiveAt: new Date(),
      },
      {
        organization: manufacturer._id,
        name: 'Amit Verma',
        email: 'amit.verma@cipla.com',
        phone: '9820044556',
        role: 'Operator',
        status: 'Active',
        invitedBy: manufacturer._id,
        lastActiveAt: new Date(),
      },
    ]);
    console.log('   ✓ Seeded 2 tax invoices (INR) and 2 organization team members.');

    console.log('\n========================================================================');
    console.log('🎉 SEEDING COMPLETE! Platform is ready for presentation and testing.');
    console.log('========================================================================');
    console.log('🔑 Credentials Cheat Sheet:');
    console.log('   • Admin:        admin@trustchain.com          | Password123!');
    console.log('   • Manufacturer: mfg@cipla.com                 | Password123!');
    console.log('   • Distributor:  distributor@apexlogistics.com   | Password123!');
    console.log('   • Retailer:     retailer@metrolife.com        | Password123!');
    console.log('   • Consumer:     consumer@gmail.com (+919876543210)');
    console.log('\n🔍 Live QR Verification Test Codes:');
    console.log('   • Genuine Unit:       http://localhost:5173/verify/TC-8924-GENUINE');
    console.log('   • Clone Anomaly:      http://localhost:5173/verify/TC-CLONE-DELHI');
    console.log('   • Sold & Awaiting:    http://localhost:5173/verify/TC-SOLD-UNCLAIMED');
    console.log('   • Claimed & Warranty: http://localhost:5173/verify/TC-CLAIMED-UNIT');
    console.log('   • Recalled Unit:      http://localhost:5173/verify/TC-RECALL-99');
    console.log('========================================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
