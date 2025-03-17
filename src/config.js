// AgentKit Configuration
const config = {
    // Network Configuration
    network: {
        chainId: 8453,  // Base Mainnet Chain ID
        name: 'base',
        rpcUrl: 'https://mainnet.base.org',  // Base Mainnet RPC URL
    },
    
    // Authentication (REPLACE THESE WITH YOUR ACTUAL VALUES)
    auth: {
        agentKitApiKey: 'YOUR_AGENTKIT_API_KEY_HERE',
        privateKey: 'YOUR_PRIVATE_KEY_HERE',  // Never commit the actual private key
    },
    
    // Token Configuration
    tokens: {
        USDC: {
            address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',  // USDC on Base
            decimals: 6,
            symbol: 'USDC'
        }
    },
    
    // Transaction Configuration
    transaction: {
        maxRetries: 3,
        confirmationBlocks: 2,
        gasLimitMultiplier: 1.1,  // 10% buffer on estimated gas
        maxGasPrice: '100000000000'  // 100 Gwei in wei
    }
};

module.exports = config;