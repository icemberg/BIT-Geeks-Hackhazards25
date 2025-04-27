import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy CitizenNFT
  console.log("Deploying CitizenNFT...");
  const CitizenNFT = await ethers.getContractFactory("CitizenNFT");
  const citizenNFT = await CitizenNFT.deploy();
  await citizenNFT.waitForDeployment();
  console.log("CitizenNFT deployed to:", await citizenNFT.getAddress());

  // Deploy GreenPoints
  console.log("Deploying GreenPoints...");
  const GreenPoints = await ethers.getContractFactory("GreenPoints");
  const greenPoints = await GreenPoints.deploy();
  await greenPoints.waitForDeployment();
  console.log("GreenPoints deployed to:", await greenPoints.getAddress());

  // Set up permissions
  console.log("Setting up permissions...");
  await greenPoints.setCitizenNFT(await citizenNFT.getAddress());
  console.log("Permissions set up successfully");

  console.log("Deployment complete!");
  console.log("CitizenNFT address:", await citizenNFT.getAddress());
  console.log("GreenPoints address:", await greenPoints.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 