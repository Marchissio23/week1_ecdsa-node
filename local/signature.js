/*
This document is used to sign transfer transactions with the corresponding private keys of the sender address.
We use the function ecdsaSign(messageHash, PRIVATE_KEY): messageHash must be a hash of a string that includes amount, sender and recipient; private key must be bytes.
We use the function ecdsaVerify(signature, messageHash, publicKey): all must be bytes.
- If function returns true it means that the signature was created by using the private keys corresponding to the sender of the transaction (publicKey)
*/

const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { ecdsaSign } = require("secp256k1");

// Message to sign has 3 items (sender, recipient, amount)
const amount = 10;
const sender = "02e91e1d5be0d0492314c579120696b92285a5a8bbe4e0b668c76944aee0275423";
const recipient = "031b1b76d0ffe1f2733361f04527741fcbee5d773e4f0fd5f3eb1707b8b4a5b8be";

// Combine all items into a single message to hash.
const message = amount + sender + recipient;

// For sign function to work, message and private key have been converted from string to bytes and then hashed (32-length)

    // Convert message string into bytes (Uint8Array) and hash it into 32-length
const messageHash = keccak256(utf8ToBytes(message));
    // Convert private key back into bytes (Uint8Array)
const PRIVATE_KEY = hexToBytes("b79b454f956deb545d992eced92f8456aa3c0dcf8c10323c089f669074510a76")

    // Sign the message hash with the private key and get the signature to send it to the sender (converted toHex)
const { signature, recid } = ecdsaSign(messageHash, PRIVATE_KEY);

console.log("-------------------------------");
console.log("Signature:", toHex(signature));
console.log("-------------------------------");