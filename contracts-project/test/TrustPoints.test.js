const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustPoints (TPTS) ERC-20 Contract", function () {
  let trustPoints;
  let admin, minter, relayer, user, otherAccount;
  let DEFAULT_ADMIN_ROLE, MINTER_ROLE, RELAYER_ROLE;

  beforeEach(async function () {
    [admin, minter, relayer, user, otherAccount] = await ethers.getSigners();

    const TrustPointsFactory = await ethers.getContractFactory("TrustPoints");
    trustPoints = await TrustPointsFactory.deploy(
      admin.address,
      minter.address,
      relayer.address
    );
    await trustPoints.waitForDeployment();

    DEFAULT_ADMIN_ROLE = await trustPoints.DEFAULT_ADMIN_ROLE();
    MINTER_ROLE = await trustPoints.MINTER_ROLE();
    RELAYER_ROLE = await trustPoints.RELAYER_ROLE();
  });

  describe("Deployment & Configuration", function () {
    it("should set token name and symbol correctly", async function () {
      expect(await trustPoints.name()).to.equal("TrustPoints");
      expect(await trustPoints.symbol()).to.equal("TPTS");
      expect(await trustPoints.decimals()).to.equal(18);
    });

    it("should assign roles properly on deployment", async function () {
      expect(await trustPoints.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await trustPoints.hasRole(MINTER_ROLE, minter.address)).to.be.true;
      expect(await trustPoints.hasRole(RELAYER_ROLE, relayer.address)).to.be.true;

      expect(await trustPoints.hasRole(MINTER_ROLE, user.address)).to.be.false;
      expect(await trustPoints.hasRole(RELAYER_ROLE, user.address)).to.be.false;
    });

    it("should revert if initialized with any zero address", async function () {
      const TrustPointsFactory = await ethers.getContractFactory("TrustPoints");

      await expect(
        TrustPointsFactory.deploy(ethers.ZeroAddress, minter.address, relayer.address)
      ).to.be.revertedWithCustomError(trustPoints, "InvalidAddress");

      await expect(
        TrustPointsFactory.deploy(admin.address, ethers.ZeroAddress, relayer.address)
      ).to.be.revertedWithCustomError(trustPoints, "InvalidAddress");

      await expect(
        TrustPointsFactory.deploy(admin.address, minter.address, ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(trustPoints, "InvalidAddress");
    });
  });

  describe("Minting Rewards (mintReward)", function () {
    const mintAmount = ethers.parseEther("100");
    const reason = "PRODUCT_VERIFICATION_REWARD";

    it("should allow MINTER_ROLE to mint rewards and emit RewardMinted event", async function () {
      const tx = await trustPoints.connect(minter).mintReward(user.address, mintAmount, reason);

      await expect(tx)
        .to.emit(trustPoints, "RewardMinted")
        .withArgs(user.address, mintAmount, reason);

      expect(await trustPoints.balanceOf(user.address)).to.equal(mintAmount);
      expect(await trustPoints.totalSupply()).to.equal(mintAmount);
    });

    it("should revert if caller does not have MINTER_ROLE", async function () {
      await expect(
        trustPoints.connect(user).mintReward(user.address, mintAmount, reason)
      ).to.be.revertedWithCustomError(trustPoints, "AccessControlUnauthorizedAccount");

      await expect(
        trustPoints.connect(relayer).mintReward(user.address, mintAmount, reason)
      ).to.be.revertedWithCustomError(trustPoints, "AccessControlUnauthorizedAccount");
    });

    it("should revert if recipient address is zero", async function () {
      await expect(
        trustPoints.connect(minter).mintReward(ethers.ZeroAddress, mintAmount, reason)
      ).to.be.revertedWithCustomError(trustPoints, "InvalidAddress");
    });

    it("should revert if mint amount is zero", async function () {
      await expect(
        trustPoints.connect(minter).mintReward(user.address, 0, reason)
      ).to.be.revertedWithCustomError(trustPoints, "InvalidAmount");
    });
  });

  describe("Redeeming Tokens (redeem)", function () {
    const mintAmount = ethers.parseEther("100");
    const redeemAmount = ethers.parseEther("40");
    const offerId = "OFFER_20_OFF_COUPON";

    beforeEach(async function () {
      await trustPoints
        .connect(minter)
        .mintReward(user.address, mintAmount, "INITIAL_SIGNUP_BONUS");
    });

    it("should allow RELAYER_ROLE to redeem tokens on behalf of user and burn them", async function () {
      const initialBalance = await trustPoints.balanceOf(user.address);
      const initialSupply = await trustPoints.totalSupply();

      const tx = await trustPoints.connect(relayer).redeem(user.address, redeemAmount, offerId);

      await expect(tx)
        .to.emit(trustPoints, "OfferRedeemed")
        .withArgs(user.address, redeemAmount, offerId);

      // Verify burn reflected in balance and totalSupply
      expect(await trustPoints.balanceOf(user.address)).to.equal(initialBalance - redeemAmount);
      expect(await trustPoints.totalSupply()).to.equal(initialSupply - redeemAmount);
    });

    it("should revert if caller does not have RELAYER_ROLE (even the token owner)", async function () {
      // By design, all state-changing interactions flow via backend relayer
      await expect(
        trustPoints.connect(user).redeem(user.address, redeemAmount, offerId)
      ).to.be.revertedWithCustomError(trustPoints, "AccessControlUnauthorizedAccount");

      await expect(
        trustPoints.connect(minter).redeem(user.address, redeemAmount, offerId)
      ).to.be.revertedWithCustomError(trustPoints, "AccessControlUnauthorizedAccount");
    });

    it("should revert if from address is zero", async function () {
      await expect(
        trustPoints.connect(relayer).redeem(ethers.ZeroAddress, redeemAmount, offerId)
      ).to.be.revertedWithCustomError(trustPoints, "InvalidAddress");
    });

    it("should revert if redeem amount is zero", async function () {
      await expect(
        trustPoints.connect(relayer).redeem(user.address, 0, offerId)
      ).to.be.revertedWithCustomError(trustPoints, "InvalidAmount");
    });

    it("should revert if user has insufficient balance to burn", async function () {
      const excessAmount = ethers.parseEther("101");
      await expect(
        trustPoints.connect(relayer).redeem(user.address, excessAmount, offerId)
      ).to.be.revertedWithCustomError(trustPoints, "ERC20InsufficientBalance");
    });
  });

  describe("Role Administration & Permissions", function () {
    it("should allow admin to grant and revoke MINTER_ROLE", async function () {
      await trustPoints.connect(admin).grantRole(MINTER_ROLE, otherAccount.address);
      expect(await trustPoints.hasRole(MINTER_ROLE, otherAccount.address)).to.be.true;

      await trustPoints.connect(admin).revokeRole(MINTER_ROLE, otherAccount.address);
      expect(await trustPoints.hasRole(MINTER_ROLE, otherAccount.address)).to.be.false;
    });

    it("should allow admin to grant and revoke RELAYER_ROLE", async function () {
      await trustPoints.connect(admin).grantRole(RELAYER_ROLE, otherAccount.address);
      expect(await trustPoints.hasRole(RELAYER_ROLE, otherAccount.address)).to.be.true;

      await trustPoints.connect(admin).revokeRole(RELAYER_ROLE, otherAccount.address);
      expect(await trustPoints.hasRole(RELAYER_ROLE, otherAccount.address)).to.be.false;
    });

    it("should revert when non-admin attempts to grant roles", async function () {
      await expect(
        trustPoints.connect(user).grantRole(MINTER_ROLE, user.address)
      ).to.be.revertedWithCustomError(trustPoints, "AccessControlUnauthorizedAccount");
    });
  });
});
