/*
This document is used to generate private keys randomly and derive from those its corresponding public keys and addresses.
To later sign and verify transactions, we will reconvert those hexadecimal strings back to a bytes Uint8Array, using hexToBytes().
*/

const secp256k1 = require("ethereum-cryptography/secp256k1-compat");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

// Generate a random private key (Uint8Array (32)). To easily store and use private key in app, we convert it into hexadecimal string.
const privateKey = secp256k1.createPrivateKeySync();
const privateKeyHex = toHex(privateKey);

console.log("Private key:", privateKeyHex);

// Derive the public key from the private key and store it converted into hexadecimal string too.
const publicKey = secp256k1.publicKeyCreate(privateKey);
const publicKeyHex = toHex(publicKey);
console.log("Public key:", publicKeyHex);

// Get address from public key.
const shortedPublicKey = publicKey.slice(1);
const hashedPublicKey = keccak256(shortedPublicKey);
const publicAddress = "0x" + toHex(hashedPublicKey.slice(-20));
console.log("Public address:", publicAddress);