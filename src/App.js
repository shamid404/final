import React, { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";

const App = () => {
    const [account, setAccount] = useState("");
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } else {
                alert("MetaMask is not installed!");
            }
        };
        loadWeb3();
    }, []);

    const fetchCandidates = async () => {
        const response = await axios.get("http://localhost:3001/candidates");
        setCandidates(response.data);
    };

    const vote = async (index) => {
        await axios.post("http://localhost:3001/vote", {
            candidateIndex: index,
            voterAddress: account,
        });
        alert("Vote cast successfully!");
    };

    return (
        <div>
            <h1>Decentralized Voting</h1>
            <p>Your account: {account}</p>
            <button onClick={fetchCandidates}>Fetch Candidates</button>
            <ul>
                {candidates.map((candidate, index) => (
                    <li key={index}>
                        {candidate.name} - Votes: {candidate.voteCount}
                        <button onClick={() => vote(index)}>Vote</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
