const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [admin, relayer, demoManufacturer, partner1, partner2] = await hre.ethers.getSigners();
  const networkName = hre.network.name;

  console.log("====================================================");
  console.log(`Seeding demo actors on network: ${networkName}`);
  console.log(`Admin Account:        ${admin.address}`);
  console.log(`Relayer Account:      ${relayer.address}`);
  console.log(`Demo Manufacturer:    ${demoManufacturer.address}`);
  console.log(`Demo Partner 1:       ${partner1.address}`);
  console.log(`Demo Partner 2:       ${partner2.address}`);
  console.log("====================================================");

  let registryAddress;
  const deploymentPath = path.join(__dirname, "..", "deployments", `${networkName}.json`);

  if (fs.existsSync(deploymentPath)) {
    const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
    registryAddress = deploymentData.contracts?.TrustChainRegistry;
  }

  let code = registryAddress ? await hre.ethers.provider.getCode(registryAddress) : "0x";
  let registry;

  if (code === "0x") {
    console.log(`No active contract code at ${registryAddress || "undefined"} on ${networkName}.`);
    console.log("Deploying fresh TrustChainRegistry for seeding...");
    const RegistryFactory = await hre.ethers.getContractFactory("TrustChainRegistry");
    registry = await RegistryFactory.deploy(admin.address, relayer.address);
    await registry.waitForDeployment();
    registryAddress = await registry.getAddress();
    console.log(`TrustChainRegistry deployed to: ${registryAddress}`);
  } else {
    console.log(`Connecting to existing TrustChainRegistry at: ${registryAddress}`);
    registry = await hre.ethers.getContractAt("TrustChainRegistry", registryAddress);
  }

  const MANUFACTURER_ROLE = await registry.MANUFACTURER_ROLE();
  const PARTNER_ROLE = await registry.PARTNER_ROLE();

  // 1. Authorize Demo Manufacturer
  const isManufacturer = await registry.hasRole(MANUFACTURER_ROLE, demoManufacturer.address);
  if (!isManufacturer) {
    console.log(`\nAuthorizing demo manufacturer: ${demoManufacturer.address}...`);
    const tx = await registry.connect(admin).authorizeManufacturer(demoManufacturer.address);
    await tx.wait();
    console.log("✓ Demo manufacturer authorized successfully.");
  } else {
    console.log("✓ Demo manufacturer is already authorized.");
  }

  // 2. Authorize Demo Partner 1
  const isPartner1 = await registry.hasRole(PARTNER_ROLE, partner1.address);
  if (!isPartner1) {
    console.log(`Authorizing demo partner 1: ${partner1.address}...`);
    const tx = await registry.connect(admin).authorizePartner(partner1.address);
    await tx.wait();
    console.log("✓ Demo partner 1 authorized successfully.");
  } else {
    console.log("✓ Demo partner 1 is already authorized.");
  }

  // 3. Authorize Demo Partner 2
  const isPartner2 = await registry.hasRole(PARTNER_ROLE, partner2.address);
  if (!isPartner2) {
    console.log(`Authorizing demo partner 2: ${partner2.address}...`);
    const tx = await registry.connect(admin).authorizePartner(partner2.address);
    await tx.wait();
    console.log("✓ Demo partner 2 authorized successfully.");
  } else {
    console.log("✓ Demo partner 2 is already authorized.");
  }

  console.log("\n====================================================");
  console.log("Seeding summary:");
  console.log(`- Contract:     ${registryAddress}`);
  console.log(`- Manufacturer: ${demoManufacturer.address} (MANUFACTURER_ROLE)`);
  console.log(`- Partner 1:    ${partner1.address} (PARTNER_ROLE)`);
  console.log(`- Partner 2:    ${partner2.address} (PARTNER_ROLE)`);
  console.log("====================================================");
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
});
