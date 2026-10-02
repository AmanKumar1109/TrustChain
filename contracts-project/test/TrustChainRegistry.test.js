const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustChainRegistry Contract", function () {
  let registry;
  let admin, relayer, manufacturer, partner, otherAccount;
  let DEFAULT_ADMIN_ROLE, MANUFACTURER_ROLE, PARTNER_ROLE, RELAYER_ROLE;

  // Sample batch data
  const sampleBatchId = ethers.keccak256(ethers.toUtf8Bytes("BATCH-2026-001"));
  const sampleMerkleRoot = ethers.keccak256(ethers.toUtf8Bytes("MERKLE-ROOT-100-ITEMS"));
  const sampleQuantity = 500n;
  const ProtectionLevel = { Standard: 0, HighValue: 1 };
  let futureExpiry;

  beforeEach(async function () {
    [admin, relayer, manufacturer, partner, otherAccount] = await ethers.getSigners();

    const currentBlock = await ethers.provider.getBlock("latest");
    futureExpiry = BigInt(currentBlock.timestamp + 365 * 24 * 60 * 60); // 1 year in future

    const RegistryFactory = await ethers.getContractFactory("TrustChainRegistry");
    registry = await RegistryFactory.deploy(admin.address, relayer.address);
    await registry.waitForDeployment();

    DEFAULT_ADMIN_ROLE = await registry.DEFAULT_ADMIN_ROLE();
    MANUFACTURER_ROLE = await registry.MANUFACTURER_ROLE();
    PARTNER_ROLE = await registry.PARTNER_ROLE();
    RELAYER_ROLE = await registry.RELAYER_ROLE();
  });

  describe("Deployment & Roles Initialization", function () {
    it("should configure admin and relayer roles properly", async function () {
      expect(await registry.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await registry.hasRole(RELAYER_ROLE, relayer.address)).to.be.true;

      expect(await registry.hasRole(DEFAULT_ADMIN_ROLE, relayer.address)).to.be.false;
      expect(await registry.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.false;
      expect(await registry.hasRole(PARTNER_ROLE, partner.address)).to.be.false;
    });

    it("should revert if initialized with zero addresses", async function () {
      const RegistryFactory = await ethers.getContractFactory("TrustChainRegistry");

      await expect(
        RegistryFactory.deploy(ethers.ZeroAddress, relayer.address)
      ).to.be.revertedWithCustomError(registry, "InvalidAddress");

      await expect(
        RegistryFactory.deploy(admin.address, ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(registry, "InvalidAddress");
    });
  });

  describe("Manufacturer Management", function () {
    it("should allow admin to authorize a manufacturer", async function () {
      const tx = await registry.connect(admin).authorizeManufacturer(manufacturer.address);

      await expect(tx)
        .to.emit(registry, "ManufacturerAuthorized")
        .withArgs(manufacturer.address);

      expect(await registry.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.true;
    });

    it("should allow admin to revoke a manufacturer", async function () {
      await registry.connect(admin).authorizeManufacturer(manufacturer.address);
      expect(await registry.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.true;

      const tx = await registry.connect(admin).revokeManufacturer(manufacturer.address);

      await expect(tx)
        .to.emit(registry, "ManufacturerRevoked")
        .withArgs(manufacturer.address);

      expect(await registry.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.false;
    });

    it("should prevent non-admin from authorizing or revoking manufacturer", async function () {
      await expect(
        registry.connect(relayer).authorizeManufacturer(manufacturer.address)
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");

      await expect(
        registry.connect(otherAccount).revokeManufacturer(manufacturer.address)
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });

    it("should revert when authorizing or revoking zero address", async function () {
      await expect(
        registry.connect(admin).authorizeManufacturer(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(registry, "InvalidAddress");

      await expect(
        registry.connect(admin).revokeManufacturer(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(registry, "InvalidAddress");
    });
  });

  describe("Partner Authorization", function () {
    it("should allow admin to authorize a partner", async function () {
      const tx = await registry.connect(admin).authorizePartner(partner.address);

      await expect(tx)
        .to.emit(registry, "PartnerAuthorized")
        .withArgs(partner.address);

      expect(await registry.hasRole(PARTNER_ROLE, partner.address)).to.be.true;
    });

    it("should allow relayer to authorize a partner", async function () {
      const tx = await registry.connect(relayer).authorizePartner(partner.address);

      await expect(tx)
        .to.emit(registry, "PartnerAuthorized")
        .withArgs(partner.address);

      expect(await registry.hasRole(PARTNER_ROLE, partner.address)).to.be.true;
    });

    it("should prevent unauthorized callers from authorizing partner", async function () {
      await expect(
        registry.connect(otherAccount).authorizePartner(partner.address)
      ).to.be.revertedWithCustomError(registry, "Unauthorized");
    });

    it("should revert if partner address is zero", async function () {
      await expect(
        registry.connect(relayer).authorizePartner(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(registry, "InvalidAddress");
    });
  });

  describe("Batch Registration (registerBatch)", function () {
    beforeEach(async function () {
      // Authorize manufacturer first
      await registry.connect(admin).authorizeManufacturer(manufacturer.address);
    });

    it("should allow relayer to register batch for authorized manufacturer and set initial holdings", async function () {
      const tx = await registry.connect(relayer).registerBatch(
        sampleBatchId,
        manufacturer.address,
        sampleMerkleRoot,
        sampleQuantity,
        ProtectionLevel.HighValue,
        futureExpiry
      );

      await expect(tx)
        .to.emit(registry, "BatchRegistered")
        .withArgs(
          sampleBatchId,
          manufacturer.address,
          sampleMerkleRoot,
          sampleQuantity,
          ProtectionLevel.HighValue,
          futureExpiry,
          (timestamp) => timestamp > 0
        );

      // Verify batch existence & data
      expect(await registry.batchExists(sampleBatchId)).to.be.true;
      const batch = await registry.getBatch(sampleBatchId);

      expect(batch.batchId).to.equal(sampleBatchId);
      expect(batch.manufacturer).to.equal(manufacturer.address);
      expect(batch.merkleRoot).to.equal(sampleMerkleRoot);
      expect(batch.quantity).to.equal(sampleQuantity);
      expect(batch.protectionLevel).to.equal(ProtectionLevel.HighValue);
      expect(batch.expiryTimestamp).to.equal(futureExpiry);
      expect(batch.recalled).to.be.false;
      expect(batch.recallReason).to.equal("");

      // Verify initial holdings assigned to manufacturer
      expect(await registry.getHoldings(sampleBatchId, manufacturer.address)).to.equal(sampleQuantity);
      expect(await registry.getHoldings(sampleBatchId, otherAccount.address)).to.equal(0n);
    });

    it("should revert if non-relayer calls registerBatch", async function () {
      await expect(
        registry.connect(manufacturer).registerBatch(
          sampleBatchId,
          manufacturer.address,
          sampleMerkleRoot,
          sampleQuantity,
          ProtectionLevel.Standard,
          futureExpiry
        )
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });

    it("should revert if manufacturer does not hold MANUFACTURER_ROLE", async function () {
      await expect(
        registry.connect(relayer).registerBatch(
          sampleBatchId,
          otherAccount.address, // unapproved manufacturer
          sampleMerkleRoot,
          sampleQuantity,
          ProtectionLevel.Standard,
          futureExpiry
        )
      ).to.be.revertedWithCustomError(registry, "NotManufacturer")
        .withArgs(otherAccount.address);
    });

    it("should prevent duplicate batchId registration", async function () {
      await registry.connect(relayer).registerBatch(
        sampleBatchId,
        manufacturer.address,
        sampleMerkleRoot,
        sampleQuantity,
        ProtectionLevel.Standard,
        futureExpiry
      );

      await expect(
        registry.connect(relayer).registerBatch(
          sampleBatchId,
          manufacturer.address,
          sampleMerkleRoot,
          sampleQuantity,
          ProtectionLevel.Standard,
          futureExpiry
        )
      ).to.be.revertedWithCustomError(registry, "BatchAlreadyExists")
        .withArgs(sampleBatchId);
    });

    it("should validate input parameters (batchId, manufacturer, merkleRoot, quantity, expiry)", async function () {
      // Zero batchId
      await expect(
        registry.connect(relayer).registerBatch(
          ethers.ZeroHash,
          manufacturer.address,
          sampleMerkleRoot,
          sampleQuantity,
          ProtectionLevel.Standard,
          futureExpiry
        )
      ).to.be.revertedWithCustomError(registry, "InvalidBatchId");

      // Zero manufacturer
      await expect(
        registry.connect(relayer).registerBatch(
          sampleBatchId,
          ethers.ZeroAddress,
          sampleMerkleRoot,
          sampleQuantity,
          ProtectionLevel.Standard,
          futureExpiry
        )
      ).to.be.revertedWithCustomError(registry, "InvalidAddress");

      // Zero merkleRoot
      await expect(
        registry.connect(relayer).registerBatch(
          sampleBatchId,
          manufacturer.address,
          ethers.ZeroHash,
          sampleQuantity,
          ProtectionLevel.Standard,
          futureExpiry
        )
      ).to.be.revertedWithCustomError(registry, "InvalidMerkleRoot");

      // Zero quantity
      await expect(
        registry.connect(relayer).registerBatch(
          sampleBatchId,
          manufacturer.address,
          sampleMerkleRoot,
          0n,
          ProtectionLevel.Standard,
          futureExpiry
        )
      ).to.be.revertedWithCustomError(registry, "InvalidQuantity");

      // Past or current expiry
      const currentBlock = await ethers.provider.getBlock("latest");
      await expect(
        registry.connect(relayer).registerBatch(
          sampleBatchId,
          manufacturer.address,
          sampleMerkleRoot,
          sampleQuantity,
          ProtectionLevel.Standard,
          BigInt(currentBlock.timestamp - 10)
        )
      ).to.be.revertedWithCustomError(registry, "InvalidExpiry");
    });
  });

  describe("Getters & View Methods", function () {
    it("should revert getBatch if batchId does not exist", async function () {
      const nonExistentBatchId = ethers.keccak256(ethers.toUtf8Bytes("NON-EXISTENT"));
      await expect(
        registry.getBatch(nonExistentBatchId)
      ).to.be.revertedWithCustomError(registry, "BatchNotFound")
        .withArgs(nonExistentBatchId);
    });

    it("should return false for batchExists when query is unregistered", async function () {
      expect(await registry.batchExists(ethers.ZeroHash)).to.be.false;
    });
  });

  describe("Pausable Behavior", function () {
    beforeEach(async function () {
      await registry.connect(admin).authorizeManufacturer(manufacturer.address);
    });

    it("should allow admin to pause and unpause", async function () {
      await registry.connect(admin).pause();
      expect(await registry.paused()).to.be.true;

      await registry.connect(admin).unpause();
      expect(await registry.paused()).to.be.false;
    });

    it("should prevent batch registration when paused", async function () {
      await registry.connect(admin).pause();

      await expect(
        registry.connect(relayer).registerBatch(
          sampleBatchId,
          manufacturer.address,
          sampleMerkleRoot,
          sampleQuantity,
          ProtectionLevel.Standard,
          futureExpiry
        )
      ).to.be.revertedWithCustomError(registry, "EnforcedPause");
    });
  });

  describe("Merkle-Based Unit Verification (verifyUnit)", function () {
    // Commutative pair hashing matching OpenZeppelin Hashes.commutativeKeccak256
    function hashPair(a, b) {
      return BigInt(a) < BigInt(b)
        ? ethers.keccak256(ethers.concat([a, b]))
        : ethers.keccak256(ethers.concat([b, a]));
    }

    function leafHash(unitCode) {
      return ethers.keccak256(ethers.toUtf8Bytes(unitCode));
    }

    const unitCode1 = "PROD-ITEM-001";
    const unitCode2 = "PROD-ITEM-002";
    const unitCodeHighValue = "HV-LUX-BAG#SCRATCH-87612"; // Embedded secret scratch code
    const unitCodeHighValue2 = "HV-LUX-BAG#SCRATCH-99124";

    let testBatchId;
    let merkleRoot;
    let proofUnit1;

    beforeEach(async function () {
      await registry.connect(admin).authorizeManufacturer(manufacturer.address);

      // Build Merkle tree for 2 units
      const leaf1 = leafHash(unitCode1);
      const leaf2 = leafHash(unitCode2);
      merkleRoot = hashPair(leaf1, leaf2);
      proofUnit1 = [leaf2];

      testBatchId = ethers.keccak256(ethers.toUtf8Bytes("MERKLE-TEST-BATCH-001"));
      await registry.connect(relayer).registerBatch(
        testBatchId,
        manufacturer.address,
        merkleRoot,
        2n,
        ProtectionLevel.Standard,
        futureExpiry
      );
    });

    it("should verify unit with valid proof and return default soldState and owner", async function () {
      const result = await registry.verifyUnit(testBatchId, unitCode1, proofUnit1);

      expect(result.exists).to.be.true;
      expect(result.expired).to.be.false;
      expect(result.recalled).to.be.false;
      expect(result.soldState).to.equal(0n); // SoldState.Unsold default
      expect(result.currentOwner).to.equal(ethers.ZeroAddress);
    });

    it("should return exists = false for invalid proof", async function () {
      const invalidProof = [ethers.ZeroHash];
      const result = await registry.verifyUnit(testBatchId, unitCode1, invalidProof);

      expect(result.exists).to.be.false;
    });

    it("should return exists = false for wrong batch", async function () {
      // 1. Existing different batch with different Merkle root
      const otherBatchId = ethers.keccak256(ethers.toUtf8Bytes("OTHER-BATCH-002"));
      const otherLeaf1 = leafHash("OTHER-ITEM-A");
      const otherLeaf2 = leafHash("OTHER-ITEM-B");
      const otherRoot = hashPair(otherLeaf1, otherLeaf2);

      await registry.connect(relayer).registerBatch(
        otherBatchId,
        manufacturer.address,
        otherRoot,
        2n,
        ProtectionLevel.Standard,
        futureExpiry
      );

      // Verifying unitCode1 against otherBatchId must return exists = false
      const resultWrongBatch = await registry.verifyUnit(otherBatchId, unitCode1, proofUnit1);
      expect(resultWrongBatch.exists).to.be.false;

      // 2. Completely unregistered batchId must return exists = false
      const unregisteredBatchId = ethers.keccak256(ethers.toUtf8Bytes("UNREGISTERED-BATCH"));
      const resultUnregistered = await registry.verifyUnit(unregisteredBatchId, unitCode1, proofUnit1);
      expect(resultUnregistered.exists).to.be.false;
    });

    it("should return expired = true for expired batch", async function () {
      const currentBlock = await ethers.provider.getBlock("latest");
      const shortExpiry = BigInt(currentBlock.timestamp + 100);
      const expiredBatchId = ethers.keccak256(ethers.toUtf8Bytes("EXPIRED-BATCH-001"));

      await registry.connect(relayer).registerBatch(
        expiredBatchId,
        manufacturer.address,
        merkleRoot,
        2n,
        ProtectionLevel.Standard,
        shortExpiry
      );

      // Fast-forward EVM time past expiry
      await ethers.provider.send("evm_increaseTime", [150]);
      await ethers.provider.send("evm_mine");

      const result = await registry.verifyUnit(expiredBatchId, unitCode1, proofUnit1);
      expect(result.exists).to.be.true;
      expect(result.expired).to.be.true;
    });

    it("should correctly verify HighValue units containing secret scratch codes", async function () {
      const hvLeaf1 = leafHash(unitCodeHighValue);
      const hvLeaf2 = leafHash(unitCodeHighValue2);
      const hvRoot = hashPair(hvLeaf1, hvLeaf2);
      const hvProof1 = [hvLeaf2];

      const hvBatchId = ethers.keccak256(ethers.toUtf8Bytes("HIGH-VALUE-BATCH-001"));
      await registry.connect(relayer).registerBatch(
        hvBatchId,
        manufacturer.address,
        hvRoot,
        2n,
        ProtectionLevel.HighValue,
        futureExpiry
      );

      const result = await registry.verifyUnit(hvBatchId, unitCodeHighValue, hvProof1);
      expect(result.exists).to.be.true;
      expect(result.expired).to.be.false;
    });
  });

  describe("Batch-Level Supply Chain Transfers", function () {
    const transferQuantity = 100n;
    const TransferStatus = { Pending: 0, Accepted: 1, Rejected: 2 };
    let batchIdForTransfer;

    beforeEach(async function () {
      await registry.connect(admin).authorizeManufacturer(manufacturer.address);
      await registry.connect(admin).authorizePartner(partner.address);

      batchIdForTransfer = ethers.keccak256(ethers.toUtf8Bytes("TRANSFER-BATCH-001"));
      await registry.connect(relayer).registerBatch(
        batchIdForTransfer,
        manufacturer.address,
        sampleMerkleRoot,
        sampleQuantity, // 500 units initial
        ProtectionLevel.Standard,
        futureExpiry
      );
    });

    it("should initiate a batch transfer successfully", async function () {
      const tx = await registry.connect(relayer).initiateBatchTransfer(
        batchIdForTransfer,
        manufacturer.address,
        partner.address,
        transferQuantity
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => registry.interface.parseLog(log)?.name === "BatchTransferInitiated"
      );
      const parsed = registry.interface.parseLog(event);
      const transferId = parsed.args.transferId;

      expect(transferId).to.not.equal(ethers.ZeroHash);
      expect(parsed.args.batchId).to.equal(batchIdForTransfer);
      expect(parsed.args.from).to.equal(manufacturer.address);
      expect(parsed.args.to).to.equal(partner.address);
      expect(parsed.args.quantity).to.equal(transferQuantity);

      // Verify transfer stored in Pending status
      const transfer = await registry.getTransfer(transferId);
      expect(transfer.transferId).to.equal(transferId);
      expect(transfer.status).to.equal(TransferStatus.Pending);
      expect(transfer.quantity).to.equal(transferQuantity);

      // Holdings should NOT have moved yet
      expect(await registry.getHoldings(batchIdForTransfer, manufacturer.address)).to.equal(sampleQuantity);
      expect(await registry.getHoldings(batchIdForTransfer, partner.address)).to.equal(0n);
    });

    it("should accept transfer and move holdings", async function () {
      const tx = await registry.connect(relayer).initiateBatchTransfer(
        batchIdForTransfer,
        manufacturer.address,
        partner.address,
        transferQuantity
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => registry.interface.parseLog(log)?.name === "BatchTransferInitiated"
      );
      const transferId = registry.interface.parseLog(event).args.transferId;

      const acceptTx = await registry.connect(relayer).respondBatchTransfer(transferId, true);

      await expect(acceptTx)
        .to.emit(registry, "BatchTransferAccepted")
        .withArgs(transferId, batchIdForTransfer, manufacturer.address, partner.address, transferQuantity);

      const transfer = await registry.getTransfer(transferId);
      expect(transfer.status).to.equal(TransferStatus.Accepted);

      // Verify holdings moved
      expect(await registry.getHoldings(batchIdForTransfer, manufacturer.address)).to.equal(sampleQuantity - transferQuantity);
      expect(await registry.getHoldings(batchIdForTransfer, partner.address)).to.equal(transferQuantity);
    });

    it("should reject transfer without moving holdings and close it", async function () {
      const tx = await registry.connect(relayer).initiateBatchTransfer(
        batchIdForTransfer,
        manufacturer.address,
        partner.address,
        transferQuantity
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => registry.interface.parseLog(log)?.name === "BatchTransferInitiated"
      );
      const transferId = registry.interface.parseLog(event).args.transferId;

      const rejectTx = await registry.connect(relayer).respondBatchTransfer(transferId, false);

      await expect(rejectTx)
        .to.emit(registry, "BatchTransferRejected")
        .withArgs(transferId, batchIdForTransfer, manufacturer.address, partner.address, transferQuantity);

      const transfer = await registry.getTransfer(transferId);
      expect(transfer.status).to.equal(TransferStatus.Rejected);

      // Verify holdings DID NOT move
      expect(await registry.getHoldings(batchIdForTransfer, manufacturer.address)).to.equal(sampleQuantity);
      expect(await registry.getHoldings(batchIdForTransfer, partner.address)).to.equal(0n);
    });

    it("should fail when quantity is above current holdings", async function () {
      const excessiveQuantity = sampleQuantity + 1n;

      await expect(
        registry.connect(relayer).initiateBatchTransfer(
          batchIdForTransfer,
          manufacturer.address,
          partner.address,
          excessiveQuantity
        )
      ).to.be.revertedWithCustomError(registry, "InsufficientHoldings")
        .withArgs(batchIdForTransfer, manufacturer.address, sampleQuantity, excessiveQuantity);
    });

    it("should fail when receiver has neither PARTNER_ROLE nor is the manufacturer", async function () {
      await expect(
        registry.connect(relayer).initiateBatchTransfer(
          batchIdForTransfer,
          manufacturer.address,
          otherAccount.address,
          transferQuantity
        )
      ).to.be.revertedWithCustomError(registry, "InvalidReceiverRole")
        .withArgs(otherAccount.address);
    });

    it("should fail on double response to the same transfer", async function () {
      const tx = await registry.connect(relayer).initiateBatchTransfer(
        batchIdForTransfer,
        manufacturer.address,
        partner.address,
        transferQuantity
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => registry.interface.parseLog(log)?.name === "BatchTransferInitiated"
      );
      const transferId = registry.interface.parseLog(event).args.transferId;

      // First response succeeds
      await registry.connect(relayer).respondBatchTransfer(transferId, true);

      // Second response (accept or reject) must fail
      await expect(
        registry.connect(relayer).respondBatchTransfer(transferId, true)
      ).to.be.revertedWithCustomError(registry, "TransferNotPending")
        .withArgs(transferId);

      await expect(
        registry.connect(relayer).respondBatchTransfer(transferId, false)
      ).to.be.revertedWithCustomError(registry, "TransferNotPending")
        .withArgs(transferId);
    });

    it("should fail to initiate transfer if batch is recalled", async function () {
      await registry.connect(relayer).recallBatch(batchIdForTransfer, "CONTAMINATION_FOUND");

      await expect(
        registry.connect(relayer).initiateBatchTransfer(
          batchIdForTransfer,
          manufacturer.address,
          partner.address,
          transferQuantity
        )
      ).to.be.revertedWithCustomError(registry, "BatchIsRecalled")
        .withArgs(batchIdForTransfer);
    });

    it("should revert if non-relayer attempts to initiate or respond to batch transfers", async function () {
      await expect(
        registry.connect(manufacturer).initiateBatchTransfer(
          batchIdForTransfer,
          manufacturer.address,
          partner.address,
          transferQuantity
        )
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");

      const tx = await registry.connect(relayer).initiateBatchTransfer(
        batchIdForTransfer,
        manufacturer.address,
        partner.address,
        transferQuantity
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => registry.interface.parseLog(log)?.name === "BatchTransferInitiated"
      );
      const transferId = registry.interface.parseLog(event).args.transferId;

      await expect(
        registry.connect(partner).respondBatchTransfer(transferId, true)
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Unit-Level Ownership & Resale", function () {
    // Merkle helpers
    function hashPair(a, b) {
      return BigInt(a) < BigInt(b)
        ? ethers.keccak256(ethers.concat([a, b]))
        : ethers.keccak256(ethers.concat([b, a]));
    }
    function leafHash(unitCode) {
      return ethers.keccak256(ethers.toUtf8Bytes(unitCode));
    }

    const unitCodeA = "RETAIL-UNIT-001";
    const unitCodeB = "RETAIL-UNIT-002";
    let unitHashA, unitHashB;
    let unitBatchId, unitMerkleRoot;
    let proofA, proofB;
    let retailer, customer, buyer;

    const SoldState = { Unsold: 0, Sold: 1, Claimed: 2 };
    const TransferStatus = { Pending: 0, Accepted: 1, Rejected: 2 };

    beforeEach(async function () {
      const signers = await ethers.getSigners();
      retailer = signers[3]; // partner
      customer = signers[4];
      buyer = signers[5];

      await registry.connect(admin).authorizeManufacturer(manufacturer.address);
      await registry.connect(admin).authorizePartner(retailer.address);

      // Build Merkle tree for 2 units
      unitHashA = leafHash(unitCodeA);
      unitHashB = leafHash(unitCodeB);
      unitMerkleRoot = hashPair(unitHashA, unitHashB);
      proofA = [unitHashB];
      proofB = [unitHashA];

      unitBatchId = ethers.keccak256(ethers.toUtf8Bytes("RETAIL-BATCH-001"));
      await registry.connect(relayer).registerBatch(
        unitBatchId,
        manufacturer.address,
        unitMerkleRoot,
        2n,
        ProtectionLevel.Standard,
        futureExpiry
      );

      // Transfer batch inventory to retailer
      const initTx = await registry.connect(relayer).initiateBatchTransfer(
        unitBatchId,
        manufacturer.address,
        retailer.address,
        2n
      );
      const receipt = await initTx.wait();
      const event = receipt.logs.find(
        (log) => registry.interface.parseLog(log)?.name === "BatchTransferInitiated"
      );
      const transferId = registry.interface.parseLog(event).args.transferId;
      await registry.connect(relayer).respondBatchTransfer(transferId, true);
    });

    it("should mark unit as sold, reduce retailer holdings, and update verifyUnit", async function () {
      expect(await registry.getHoldings(unitBatchId, retailer.address)).to.equal(2n);

      const tx = await registry.connect(relayer).markUnitSold(
        unitBatchId,
        unitCodeA,
        proofA,
        retailer.address,
        customer.address
      );

      await expect(tx)
        .to.emit(registry, "UnitSold")
        .withArgs(unitBatchId, unitCodeA, unitHashA, retailer.address, customer.address);

      // Holdings reduced
      expect(await registry.getHoldings(unitBatchId, retailer.address)).to.equal(1n);

      // verifyUnit returns real soldState (Sold) and currentOwner (customer)
      const verification = await registry.verifyUnit(unitBatchId, unitCodeA, proofA);
      expect(verification.exists).to.be.true;
      expect(verification.soldState).to.equal(BigInt(SoldState.Sold));
      expect(verification.currentOwner).to.equal(customer.address);
    });

    it("should block double sale of the same unit", async function () {
      await registry.connect(relayer).markUnitSold(
        unitBatchId,
        unitCodeA,
        proofA,
        retailer.address,
        customer.address
      );

      await expect(
        registry.connect(relayer).markUnitSold(
          unitBatchId,
          unitCodeA,
          proofA,
          retailer.address,
          buyer.address
        )
      ).to.be.revertedWithCustomError(registry, "UnitAlreadySold")
        .withArgs(unitHashA);
    });

    it("should block sale if retailer has zero or insufficient stock", async function () {
      const nonStockRetailer = otherAccount; // 0 holdings
      await expect(
        registry.connect(relayer).markUnitSold(
          unitBatchId,
          unitCodeA,
          proofA,
          nonStockRetailer.address,
          customer.address
        )
      ).to.be.revertedWithCustomError(registry, "InsufficientHoldings")
        .withArgs(unitBatchId, nonStockRetailer.address, 0n, 1n);
    });

    it("should claim unit by the owner and move state from Sold to Claimed", async function () {
      await registry.connect(relayer).markUnitSold(
        unitBatchId,
        unitCodeA,
        proofA,
        retailer.address,
        customer.address
      );

      const claimTx = await registry.connect(relayer).claimUnit(
        unitBatchId,
        unitCodeA,
        customer.address
      );

      await expect(claimTx)
        .to.emit(registry, "UnitClaimed")
        .withArgs(unitBatchId, unitCodeA, unitHashA, customer.address);

      // verifyUnit returns Claimed state
      const verification = await registry.verifyUnit(unitBatchId, unitCodeA, proofA);
      expect(verification.soldState).to.equal(BigInt(SoldState.Claimed));
      expect(verification.currentOwner).to.equal(customer.address);
    });

    it("should block claim by anyone other than the registered owner", async function () {
      await registry.connect(relayer).markUnitSold(
        unitBatchId,
        unitCodeA,
        proofA,
        retailer.address,
        customer.address
      );

      await expect(
        registry.connect(relayer).claimUnit(
          unitBatchId,
          unitCodeA,
          buyer.address // Not the owner
        )
      ).to.be.revertedWithCustomError(registry, "NotUnitOwner")
        .withArgs(customer.address, buyer.address);
    });

    it("should handle resale accept: initiate and accept unit transfer updating currentOwner", async function () {
      await registry.connect(relayer).markUnitSold(
        unitBatchId,
        unitCodeA,
        proofA,
        retailer.address,
        customer.address
      );

      // Initiate resale transfer
      const tx = await registry.connect(relayer).initiateUnitTransfer(
        unitHashA,
        customer.address,
        buyer.address
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => registry.interface.parseLog(log)?.name === "UnitTransferInitiated"
      );
      const transferId = registry.interface.parseLog(event).args.transferId;

      // Accept resale transfer
      const acceptTx = await registry.connect(relayer).respondUnitTransfer(transferId, true);

      await expect(acceptTx)
        .to.emit(registry, "UnitTransferAccepted")
        .withArgs(transferId, unitHashA, customer.address, buyer.address);

      const transfer = await registry.getUnitTransfer(transferId);
      expect(transfer.status).to.equal(TransferStatus.Accepted);

      // verifyUnit now reflects buyer as the owner
      const verification = await registry.verifyUnit(unitBatchId, unitCodeA, proofA);
      expect(verification.currentOwner).to.equal(buyer.address);
    });

    it("should handle resale reject: initiate and reject unit transfer leaving owner intact", async function () {
      await registry.connect(relayer).markUnitSold(
        unitBatchId,
        unitCodeA,
        proofA,
        retailer.address,
        customer.address
      );

      const tx = await registry.connect(relayer).initiateUnitTransfer(
        unitHashA,
        customer.address,
        buyer.address
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => registry.interface.parseLog(log)?.name === "UnitTransferInitiated"
      );
      const transferId = registry.interface.parseLog(event).args.transferId;

      // Reject resale transfer
      const rejectTx = await registry.connect(relayer).respondUnitTransfer(transferId, false);

      await expect(rejectTx)
        .to.emit(registry, "UnitTransferRejected")
        .withArgs(transferId, unitHashA, customer.address, buyer.address);

      const transfer = await registry.getUnitTransfer(transferId);
      expect(transfer.status).to.equal(TransferStatus.Rejected);

      // verifyUnit still reflects original customer as owner
      const verification = await registry.verifyUnit(unitBatchId, unitCodeA, proofA);
      expect(verification.currentOwner).to.equal(customer.address);
    });
  });

  describe("Batch Recall Lifecycle (recallBatch)", function () {
    // Merkle helpers
    function hashPair(a, b) {
      return BigInt(a) < BigInt(b)
        ? ethers.keccak256(ethers.concat([a, b]))
        : ethers.keccak256(ethers.concat([b, a]));
    }
    function leafHash(unitCode) {
      return ethers.keccak256(ethers.toUtf8Bytes(unitCode));
    }

    const recallUnitCode = "RECALL-UNIT-001";
    const otherUnitCode = "RECALL-UNIT-002";
    let recallBatchId;
    let recallLeaf, otherLeaf;
    let recallMerkleRoot;
    let recallProof;
    const recallReason = "CONTAMINATED_INGREDIENTS_DETECTED";

    beforeEach(async function () {
      await registry.connect(admin).authorizeManufacturer(manufacturer.address);
      await registry.connect(admin).authorizePartner(partner.address);

      recallLeaf = leafHash(recallUnitCode);
      otherLeaf = leafHash(otherUnitCode);
      recallMerkleRoot = hashPair(recallLeaf, otherLeaf);
      recallProof = [otherLeaf];

      recallBatchId = ethers.keccak256(ethers.toUtf8Bytes("RECALL-BATCH-2026"));
      await registry.connect(relayer).registerBatch(
        recallBatchId,
        manufacturer.address,
        recallMerkleRoot,
        100n,
        ProtectionLevel.Standard,
        futureExpiry
      );
    });

    it("should allow relayer to recall an existing batch, set recalled and reason, and emit event", async function () {
      const tx = await registry.connect(relayer).recallBatch(recallBatchId, recallReason);

      await expect(tx)
        .to.emit(registry, "BatchRecalled")
        .withArgs(recallBatchId, recallReason);

      const batch = await registry.getBatch(recallBatchId);
      expect(batch.recalled).to.be.true;
      expect(batch.recallReason).to.equal(recallReason);
    });

    it("should revert if non-relayer calls recallBatch", async function () {
      await expect(
        registry.connect(manufacturer).recallBatch(recallBatchId, recallReason)
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");

      await expect(
        registry.connect(otherAccount).recallBatch(recallBatchId, recallReason)
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });

    it("should revert if batch does not exist", async function () {
      const nonExistentBatchId = ethers.keccak256(ethers.toUtf8Bytes("NON-EXISTENT-RECALL"));

      await expect(
        registry.connect(relayer).recallBatch(nonExistentBatchId, recallReason)
      ).to.be.revertedWithCustomError(registry, "BatchNotFound")
        .withArgs(nonExistentBatchId);
    });

    it("should block initiateBatchTransfer when batch is recalled", async function () {
      await registry.connect(relayer).recallBatch(recallBatchId, recallReason);

      await expect(
        registry.connect(relayer).initiateBatchTransfer(
          recallBatchId,
          manufacturer.address,
          partner.address,
          10n
        )
      ).to.be.revertedWithCustomError(registry, "BatchIsRecalled")
        .withArgs(recallBatchId);
    });

    it("should block markUnitSold when batch is recalled", async function () {
      await registry.connect(relayer).recallBatch(recallBatchId, recallReason);

      await expect(
        registry.connect(relayer).markUnitSold(
          recallBatchId,
          recallUnitCode,
          recallProof,
          manufacturer.address,
          otherAccount.address
        )
      ).to.be.revertedWithCustomError(registry, "BatchIsRecalled")
        .withArgs(recallBatchId);
    });

    it("should return recalled = true and the recall reason in verifyUnit", async function () {
      // Before recall: recalled = false, reason = ""
      const beforeRecall = await registry.verifyUnit(recallBatchId, recallUnitCode, recallProof);
      expect(beforeRecall.exists).to.be.true;
      expect(beforeRecall.recalled).to.be.false;
      expect(beforeRecall.recallReason).to.equal("");

      // Recall the batch
      await registry.connect(relayer).recallBatch(recallBatchId, recallReason);

      // After recall: recalled = true, recallReason = recallReason
      const afterRecall = await registry.verifyUnit(recallBatchId, recallUnitCode, recallProof);
      expect(afterRecall.exists).to.be.true;
      expect(afterRecall.recalled).to.be.true;
      expect(afterRecall.recallReason).to.equal(recallReason);
    });
  });
});


