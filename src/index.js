// Include necessary dependencies
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Connect to Ethereum node (replace 'http://localhost:8545' with your node endpoint)
const web3 = new Web3('http://localhost:8545');

// Read and compile the smart contract
const contractPath = path.resolve(__dirname, 'SimpleStorage.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');
const contractCompiled = solc.compile(contractSource, 1);
const contractABI = JSON.parse(contractCompiled.contracts[':SimpleStorage'].interface);
const contractBytecode = '0x' + contractCompiled.contracts[':SimpleStorage'].bytecode;

// Create contract object
const contract = new web3.eth.Contract(contractABI);

// Deploy the contract
const deployContract = async () => {
    const accounts = await web3.eth.getAccounts();
    const deployedContract = await contract.deploy({
        data: contractBytecode,
        arguments: [42] // Initial value for the storage variable
    }).send({
        from: accounts[0], // Deployer's account
        gas: 1500000, // Gas limit
        gasPrice: '30000000000' // Gas price
    });

    console.log('Contract deployed at address:', deployedContract.options.address);
};

// Interact with the deployed contract
const interactWithContract = async (contractAddress) => {
    // Load deployed contract instance
    const deployedContract = new web3.eth.Contract(contractABI, contractAddress);

    // Call contract function to get stored value
    const storedValue = await deployedContract.methods.get().call();
    console.log('Value stored in the contract:', storedValue);

    // Call contract function to set new value
    await deployedContract.methods.set(100).send({
        from: accounts[0], // Account making the transaction
        gas: 1000000 // Gas limit
    });

    // Retrieve updated value from the contract
    const updatedValue = await deployedContract.methods.get().call();
    console.log('Updated value stored in the contract:', updatedValue);
};

// Example usage
deployContract().then(() => {
    interactWithContract('0x...'); // Pass the deployed contract address here
}).catch((error) => {
    console.error('Error deploying or interacting with contract:', error);
});
