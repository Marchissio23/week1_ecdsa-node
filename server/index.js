const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

  // Created more realistic public keys through file "generate.js"
const balances = {
  "02e91e1d5be0d0492314c579120696b92285a5a8bbe4e0b668c76944aee0275423": 100,
  "031b1b76d0ffe1f2733361f04527741fcbee5d773e4f0fd5f3eb1707b8b4a5b8be": 50,
  "0327069ead33bafd9f20c140c14a76f2871cf531548703e9cd8cf658434d7e99b5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
    // Added signature to the transfer parameters.
    // For a transfer to be accepted now users need to also sign it with their private key to verify they are the owners of sender account.
  const { sender, amount, recipient, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const { keccak256 } = require("ethereum-cryptography/keccak");
  const { utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
  const secp256k1 = require("secp256k1");

    // Combine all items into a single message (as locally done in "signature.js").
    // MessageHash should be exactly as the one made locally for everything to work.
  const message = amount + sender + recipient;
  const messageBytes = utf8ToBytes(message);
  const messageHash = keccak256(messageBytes);

    // Convert hex string back into bytes (Uint8Array)
  const signatureBytes = hexToBytes(signature);
  const senderBytes = hexToBytes(sender);

    // Verify signature was made with private key that corresponds to sender's public key.
  const isVerified = secp256k1.ecdsaVerify(signatureBytes, messageHash, senderBytes);

    // If that's the case, we make the transaction go through.
  if (isVerified) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Signature doesn't correspond sender." });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
