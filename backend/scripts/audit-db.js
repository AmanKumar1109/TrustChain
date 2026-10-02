const mongoose = require('mongoose');
const User = require('../src/models/User');
const Brand = require('../src/models/Brand');
const Product = require('../src/models/Product');
const Batch = require('../src/models/Batch');
const Unit = require('../src/models/Unit');
const Partner = require('../src/models/Partner');
const Transfer = require('../src/models/Transfer');
const Scan = require('../src/models/Scan');
const Report = require('../src/models/Report');
const RewardOffer = require('../src/models/RewardOffer');
const Invoice = require('../src/models/Invoice');

async function audit() {
  await mongoose.connect('mongodb://127.0.0.1:27017/trustchain');
  console.log('====================================');
  console.log('📊 DATABASE LIVE DATA AUDIT');
  console.log('====================================');
  console.log('Users Count:              ', await User.countDocuments());
  console.log('Brands Count:             ', await Brand.countDocuments());
  console.log('Products Count:           ', await Product.countDocuments());
  console.log('Batches Count:            ', await Batch.countDocuments());
  console.log('Serialized Units Count:   ', await Unit.countDocuments());
  console.log('Supply Chain Partners:    ', await Partner.countDocuments());
  console.log('Custody Transfers:        ', await Transfer.countDocuments());
  console.log('Historical QR Scans:      ', await Scan.countDocuments());
  console.log('Counterfeit Reports:      ', await Report.countDocuments());
  console.log('Store Reward Offers:      ', await RewardOffer.countDocuments());
  console.log('Billing Invoices:         ', await Invoice.countDocuments());

  console.log('\n--- BRANDS ---');
  const brands = await Brand.find({}, 'name companyName status gst');
  console.log(brands);

  console.log('\n--- PRODUCTS ---');
  const prods = await Product.find({}, 'name sku price category');
  console.log(prods);

  console.log('\n--- BATCHES ---');
  const batches = await Batch.find({}, 'batchNumber productName quantity status isRecalled');
  console.log(batches);

  console.log('\n--- SAMPLE UNITS ---');
  const sampleUnits = await Unit.find({}, 'unitCode status batchNumber').limit(5);
  console.log(sampleUnits);

  console.log('\n--- COUNTERFEIT REPORTS BY CITY ---');
  const reports = await Report.find({}, 'reportId city suspectProduct status bountyAwarded');
  console.log(reports);

  console.log('\n--- REWARD OFFERS ---');
  const offers = await RewardOffer.find({}, 'title partnerName pointsCost');
  console.log(offers);

  process.exit(0);
}

audit().catch(e => {
  console.error(e);
  process.exit(1);
});
