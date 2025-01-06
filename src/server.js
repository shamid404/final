const express = require("express");
const Web3 = require("web3");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const web3 = new Web3("http://127.0.0.1:7545"); // Ganache RPC URL
const contractABI = [/* Paste contract ABI here */];
const contractAddress = "YOUR_CONTRACT_ADDRESS";

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.get("/candidates", async (req, res) => {
    try {
        const candidates = await contract.methods.getCandidates().call();
        res.json(candidates);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.post("/vote", async (req, res) => {
    const { candidateIndex, voterAddress } = req.body;
    try {
        const result = await contract.methods.vote(candidateIndex).send({
            from: voterAddress,
            gas: 3000000,
        });
        res.json(result);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(3001, () => {
    console.log("Server running on port http://localhost:3001");
});
