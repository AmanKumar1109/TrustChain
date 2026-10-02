const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer, relayer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;

  console.log("====================================================");
  console.log(`Starting deployment on network: ${networkName}`);
  console.log(`Deployer (Admin): ${deployer.address}`);
  console.log(`Relayer (Second Account): ${relayer.address}`);
  console.log("====================================================");

  // 1. Deploy TrustPoints (TPTS) ERC-20 Token
  console.log("\nDeploying TrustPoints (TPTS)...");
  const TrustPointsFactory = await hre.ethers.getContractFactory("TrustPoints");
  const trustPoints = await TrustPointsFactory.deploy(
    deployer.address,
    deployer.address,
    deployer.address
  );
  await trustPoints.waitForDeployment();
  const trustPointsAddress = await trustPoints.getAddress();
  console.log(`TrustPoints deployed to: ${trustPointsAddress}`);

  // 2. Deploy TrustChainRegistry Contract
  console.log("\nDeploying TrustChainRegistry...");
  const RegistryFactory = await hre.ethers.getContractFactory("TrustChainRegistry");
  const registry = await RegistryFactory.deploy(deployer.address, deployer.address);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`TrustChainRegistry deployed to: ${registryAddress}`);

  // 3. Deploy TrustChain Base Contract
  console.log("\nDeploying TrustChain Base Contract...");
  const TrustChainFactory = await hre.ethers.getContractFactory("TrustChain");
  const trustChain = await TrustChainFactory.deploy(deployer.address, deployer.address);
  await trustChain.waitForDeployment();
  const trustChainAddress = await trustChain.getAddress();
  console.log(`TrustChain deployed to: ${trustChainAddress}`);

  // 4. Role Assignments: Grant RELAYER_ROLE & MINTER_ROLE to the relayer account
  console.log("\nConfiguring roles for Relayer...");
  const TPTS_RELAYER_ROLE = await trustPoints.RELAYER_ROLE();
  const TPTS_MINTER_ROLE = await trustPoints.MINTER_ROLE();
  const REGISTRY_RELAYER_ROLE = await registry.RELAYER_ROLE();
  const BASE_RELAYER_ROLE = await trustChain.RELAYER_ROLE();

  // Grant to TrustPoints
  let tx = await trustPoints.connect(deployer).grantRole(TPTS_RELAYER_ROLE, relayer.address);
  await tx.wait();
  console.log(`Granted RELAYER_ROLE on TrustPoints to: ${relayer.address}`);

  tx = await trustPoints.connect(deployer).grantRole(TPTS_MINTER_ROLE, relayer.address);
  await tx.wait();
  console.log(`Granted MINTER_ROLE on TrustPoints to: ${relayer.address}`);

  // Grant to TrustChainRegistry
  tx = await registry.connect(deployer).grantRole(REGISTRY_RELAYER_ROLE, relayer.address);
  await tx.wait();
  console.log(`Granted RELAYER_ROLE on TrustChainRegistry to: ${relayer.address}`);

  // Grant to TrustChain Base
  tx = await trustChain.connect(deployer).grantRole(BASE_RELAYER_ROLE, relayer.address);
  await tx.wait();
  console.log(`Granted RELAYER_ROLE on TrustChain to: ${relayer.address}`);

  // 5. Save addresses to /contracts-project/deployments/<network>.json
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const networkInfo = await hre.ethers.provider.getNetwork();
  const deploymentData = {
    network: networkName,
    chainId: Number(networkInfo.chainId),
    deployer: deployer.address,
    relayer: relayer.address,
    contracts: {
      TrustPoints: trustPointsAddress,
      TrustChainRegistry: registryAddress,
      TrustChain: trustChainAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  const deploymentPath = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));
  console.log(`\nDeployment details saved to: ${deploymentPath}`);

  // 6. Export ABIs to /contracts-project/abi/
  const abiDir = path.join(__dirname, "..", "abi");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  const contractNames = ["TrustPoints", "TrustChainRegistry", "TrustChain"];
  for (const name of contractNames) {
    const artifact = await hre.artifacts.readArtifact(name);
    const abiPath = path.join(abiDir, `${name}.json`);
    fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`ABI exported for ${name} to: ${abiPath}`);
  }

  console.log("\nDeployment & configuration completed successfully!");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
