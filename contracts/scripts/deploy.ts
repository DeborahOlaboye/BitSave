import { ethers } from "hardhat";

async function main() {
  console.log("========================================");
  console.log("🚀 Deploying BitSave Contracts");
  console.log("========================================\n");

  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "BTC\n");

  // MUSD token address on Mezo testnet
  const MUSD_ADDRESS = "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503";
  console.log("📌 MUSD Token Address:", MUSD_ADDRESS, "\n");

  // Deploy Registry
  console.log("1️⃣  Deploying BitSaveRegistry...");
  const Registry = await ethers.getContractFactory("BitSaveRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("   ✅ BitSaveRegistry deployed to:", registryAddress);
  console.log("   ⏳ Waiting for confirmations...\n");

  // Deploy Vault (Budget Goals - complements Mezo, doesn't compete)
  console.log("2️⃣  Deploying BitSaveVault (Budget Goals)...");
  const Vault = await ethers.getContractFactory("BitSaveVault");
  const vault = await Vault.deploy(MUSD_ADDRESS);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("   ✅ BitSaveVault deployed to:", vaultAddress);
  console.log("   💡 Budget goals for MUSD - complements Mezo Savings Rate");
  console.log("   ⏳ Waiting for confirmations...\n");

  // Deploy Payments
  console.log("3️⃣  Deploying BitSavePayments...");
  const Payments = await ethers.getContractFactory("BitSavePayments");
  const payments = await Payments.deploy(MUSD_ADDRESS, registryAddress);
  await payments.waitForDeployment();
  const paymentsAddress = await payments.getAddress();
  console.log("   ✅ BitSavePayments deployed to:", paymentsAddress);
  console.log("   ⏳ Waiting for confirmations...\n");

  // Summary
  console.log("========================================");
  console.log("✅ All BitSave Contracts Deployed!");
  console.log("========================================\n");

  console.log("📋 Contract Addresses:");
  console.log("─────────────────────────────────────────");
  console.log("MUSD Token:        ", MUSD_ADDRESS);
  console.log("BitSaveRegistry:   ", registryAddress);
  console.log("BitSaveVault:      ", vaultAddress);
  console.log("BitSavePayments:   ", paymentsAddress);
  console.log("─────────────────────────────────────────\n");

  console.log("📝 Update your frontend .env.local:");
  console.log("─────────────────────────────────────────");
  console.log(`NEXT_PUBLIC_MUSD_CONTRACT=${MUSD_ADDRESS}`);
  console.log(`NEXT_PUBLIC_REGISTRY_CONTRACT=${registryAddress}`);
  console.log(`NEXT_PUBLIC_VAULT_CONTRACT=${vaultAddress}`);
  console.log(`NEXT_PUBLIC_PAYMENTS_CONTRACT=${paymentsAddress}`);
  console.log("─────────────────────────────────────────\n");

  console.log("🔍 Verify contracts on explorer:");
  console.log("─────────────────────────────────────────");
  console.log(`Registry: https://explorer.test.mezo.org/address/${registryAddress}`);
  console.log(`Vault:    https://explorer.test.mezo.org/address/${vaultAddress}`);
  console.log(`Payments: https://explorer.test.mezo.org/address/${paymentsAddress}`);
  console.log("─────────────────────────────────────────\n");

  console.log("📤 To verify contracts, run:");
  console.log("─────────────────────────────────────────");
  console.log(`npx hardhat verify --network mezoTestnet ${registryAddress}`);
  console.log(`npx hardhat verify --network mezoTestnet ${vaultAddress} ${MUSD_ADDRESS}`);
  console.log(`npx hardhat verify --network mezoTestnet ${paymentsAddress} ${MUSD_ADDRESS} ${registryAddress}`);
  console.log("─────────────────────────────────────────\n");

  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    network: "mezoTestnet",
    chainId: 31611,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      musd: MUSD_ADDRESS,
      registry: registryAddress,
      vault: vaultAddress,
      payments: paymentsAddress,
    },
  };

  fs.writeFileSync(
    "deployments.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployments.json");
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
