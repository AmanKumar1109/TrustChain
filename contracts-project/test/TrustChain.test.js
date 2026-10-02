const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustChain Base Contract", function () {
  let trustChain;
  let admin, relayer, user, otherAccount;
  let RELAYER_ROLE;
  let DEFAULT_ADMIN_ROLE;

  beforeEach(async function () {
    [admin, relayer, user, otherAccount] = await ethers.getSigners();

    const TrustChainFactory = await ethers.getContractFactory("TrustChain");
    trustChain = await TrustChainFactory.deploy(admin.address, relayer.address);
    await trustChain.waitForDeployment();

    RELAYER_ROLE = await trustChain.RELAYER_ROLE();
    DEFAULT_ADMIN_ROLE = await trustChain.DEFAULT_ADMIN_ROLE();
  });

  describe("Deployment & Initialization", function () {
    it("should set the admin role correctly", async function () {
      expect(await trustChain.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await trustChain.hasRole(DEFAULT_ADMIN_ROLE, relayer.address)).to.be.false;
    });

    it("should set the initial relayer role correctly", async function () {
      expect(await trustChain.hasRole(RELAYER_ROLE, relayer.address)).to.be.true;
      expect(await trustChain.isRelayer(relayer.address)).to.be.true;
      expect(await trustChain.isRelayer(otherAccount.address)).to.be.false;
    });

    it("should revert deployment if admin or relayer is zero address", async function () {
      const TrustChainFactory = await ethers.getContractFactory("TrustChain");
      await expect(
        TrustChainFactory.deploy(ethers.ZeroAddress, relayer.address)
      ).to.be.revertedWithCustomError(trustChain, "InvalidAddress");

      await expect(
        TrustChainFactory.deploy(admin.address, ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(trustChain, "InvalidAddress");
    });
  });

  describe("Relayer Role Management", function () {
    it("should allow admin to grant RELAYER_ROLE to another address", async function () {
      await trustChain.connect(admin).grantRole(RELAYER_ROLE, otherAccount.address);
      expect(await trustChain.isRelayer(otherAccount.address)).to.be.true;
    });

    it("should allow admin to revoke RELAYER_ROLE", async function () {
      await trustChain.connect(admin).revokeRole(RELAYER_ROLE, relayer.address);
      expect(await trustChain.isRelayer(relayer.address)).to.be.false;
    });

    it("should prevent non-admin from granting roles", async function () {
      await expect(
        trustChain.connect(otherAccount).grantRole(RELAYER_ROLE, otherAccount.address)
      ).to.be.revertedWithCustomError(trustChain, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Relayer Design Pattern Execution", function () {
    it("should allow authorized relayer to execute actions on behalf of actingUser", async function () {
      const activityType = "USER_REGISTERED";

      const tx = await trustChain.connect(relayer).relayUserActivity(user.address, activityType);
      const receipt = await tx.wait();

      await expect(tx)
        .to.emit(trustChain, "UserActivityRelayed")
        .withArgs(user.address, activityType, (timestamp) => timestamp > 0);
    });

    it("should revert if a non-relayer tries to call state-changing function", async function () {
      await expect(
        trustChain.connect(user).relayUserActivity(user.address, "USER_REGISTERED")
      ).to.be.revertedWithCustomError(trustChain, "AccessControlUnauthorizedAccount");
    });

    it("should revert if actingUser is zero address", async function () {
      await expect(
        trustChain.connect(relayer).relayUserActivity(ethers.ZeroAddress, "USER_REGISTERED")
      ).to.be.revertedWithCustomError(trustChain, "InvalidAddress");
    });
  });

  describe("Emergency Pause Functionality", function () {
    it("should allow admin to pause and unpause", async function () {
      await trustChain.connect(admin).pause();
      expect(await trustChain.paused()).to.be.true;

      await trustChain.connect(admin).unpause();
      expect(await trustChain.paused()).to.be.false;
    });

    it("should prevent non-admin from pausing", async function () {
      await expect(
        trustChain.connect(relayer).pause()
      ).to.be.revertedWithCustomError(trustChain, "AccessControlUnauthorizedAccount");
    });

    it("should prevent relayer transactions while paused", async function () {
      await trustChain.connect(admin).pause();

      await expect(
        trustChain.connect(relayer).relayUserActivity(user.address, "USER_REGISTERED")
      ).to.be.revertedWithCustomError(trustChain, "EnforcedPause");
    });
  });
});
