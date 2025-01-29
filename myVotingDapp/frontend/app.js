const contractAddress = '0xDBB8cd290e0C570D9DA4f91a40389f332782CD61';  // Адрес контракта
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string[]",
                "name": "candidateNames",
                "type": "string[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "candidates",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getCandidates",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "voteCount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Voting.Candidate[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3;
let votingContract;
let accounts;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        accounts = await web3.eth.getAccounts();
        votingContract = new web3.eth.Contract(contractABI, contractAddress);
        loadCandidates();
        document.getElementById("connectButton").innerText = "Wallet Connected";
    } else {
        alert("Please install MetaMask to use this app.");
    }
}

async function loadCandidates() {
    const candidates = await votingContract.methods.getCandidates().call();
    const candidatesDiv = document.getElementById("candidates");

    candidates.forEach((candidate, index) => {
        const candidateElement = document.createElement("div");
        candidateElement.classList.add("candidate");
        candidateElement.innerHTML = `
            <h3>${candidate.name}</h3>
            <p>Votes: ${candidate.voteCount}</p>
            <button class="voteButton" onclick="vote(${index})">Vote</button>
        `;
        candidatesDiv.appendChild(candidateElement);
    });
}

async function vote(candidateId) {
    try {
        await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
        alert("Vote successful!");
        loadCandidates();
    } catch (error) {
        alert("Error voting: " + error.message);
    }
}

document.getElementById("connectButton").addEventListener("click", init);
ы