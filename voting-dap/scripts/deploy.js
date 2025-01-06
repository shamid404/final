const hre = require("hardhat");

async function main() {
    const VotingDApp = await hre.ethers.getContractFactory("VotingDApp"); // Replace "VotingDApp" with your contract's name
    const votingDApp = await VotingDApp.deploy();

    await votingDApp.deployed();
    console.log("VotingDApp deployed to:", votingDApp.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

