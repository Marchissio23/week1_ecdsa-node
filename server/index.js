const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

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
  const { sender, amount, recipient, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const { keccak256 } = require("ethereum-cryptography/keccak");
  const { utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
  const secp256k1 = require("secp256k1");

  // Combine all items into a single message (as we did locally). MessageHash should be exxactly same as the one made locally.
  const message = amount + sender + recipient;

    // Convert message string into bytes (Uint8Array) and hash it into 32-length
  const messageBytes = utf8ToBytes(message);
  const messageHash = keccak256(messageBytes);

    // Convert signature string into bytes (Uint8Array)
  const signatureBytes = hexToBytes(signature);
  const senderBytes = hexToBytes(sender);

    // Verify signature was made with private keys that correspond to sender's public key.
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
