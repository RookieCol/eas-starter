import { SchemaRegistry, EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import 'dotenv/config';

// Get environment variables
const rpcUrl = process.env.RPC_ENDPOINT;
const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
const schemaRegistryContractAddress = process.env.SCHEMA_REGISTRY_CONTRACT;
const easContractAddress = process.env.EAS_CONTRACT;

// Ensure environment variables are defined
if (!rpcUrl || !walletPrivateKey) {
    throw new Error("Missing RPC_ENDPOINT or WALLET_PRIVATE_KEY in environment variables");
}

if (!schemaRegistryContractAddress || !easContractAddress) {
    throw new Error("Missing SCHEMA_REGISTRY_CONTRACT or EAS_CONTRACT in environment variables");
}

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(walletPrivateKey, provider);

// Initialize SchemaRegistry and EAS instances
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
const eas = new EAS(easContractAddress);

async function registerSchema() {
    try {
        // Connect SchemaRegistry instance to signer
        schemaRegistry.connect(signer);

        // Define schema details
        const schema = "bytes32 activity, address partner"; // Define your schema here
        const revocable = false; // Flag to indicate if attestation can be revoked

        // Register the schema
        const transaction = await schemaRegistry.register({
            schema,
            revocable,
            // Optional: Add a resolver field here for additional functionality
        });

        // Wait for the transaction to be validated
        await transaction.wait();
        console.log("New Schema Created", transaction.receipt);
    } catch (error) {
        console.error("An error occurred during schema registration:", error);
    }
}

async function attest() {
    try {
        // Connect EAS instance to signer
        eas.connect(signer);

        // Define the schema and encode data
        const schemaString = "bytes32 activity, address partner";
        const schemaEncoder = new SchemaEncoder(schemaString);
        const encodedData = schemaEncoder.encodeData([
            { name: "activity", value: "run", type: "bytes32" },
            { name: "partner", value: "0x62eade3C546aB1908eC4E0A95BB427Ae1a52E900", type: "address" },
        ]);

        const schemaUID = "0x9BA4C8CB4D768FC0944A88CA9EAE53F5A4417D5C5EEAE40F9CD7CA6B0054DE59"; // Define the UID of the schema

        // Send the attestation transaction
        const tx = await eas.attest({
            schema: schemaUID,
            data: {
                recipient: "0x08C4E4BdAb2473E454B8B2a4400358792786d341", // The recipient of the attestation
                expirationTime: 0n, // No expiration
                revocable: false, // Must be false if schema is not revocable
                data: encodedData,
            },
        });

        // Wait for the attestation transaction to be validated
        const newAttestationUID = await tx.wait();
        console.log("New attestation UID:", newAttestationUID);
    } catch (error) {
        console.error("An error occurred during attestation:", error);
    }
}

// Uncomment the function you want to execute
//registerSchema();
//attest();
