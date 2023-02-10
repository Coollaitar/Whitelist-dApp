// STEP 2
const { ethers } = require('hardhat');

async function main() {
  // contractFactory in ether js is an abstraction used to  deploy new smart contract

  const whitelistContract = await ethers.getContractFactory('Whitelist');

  const deployedWhitelistContract = await whitelistContract.deploy(10);
  // 10 is the max number of contract address allowed

  await deployedWhitelistContract.deployed();

  console.log(
    'Whitelist Contract Address : ',
    deployedWhitelistContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
