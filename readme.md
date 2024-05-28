## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.

### Solution

We created a new folder called "local" to safely run locally. On this folder we can create new private/public keys with "generate.js" and sign transactions with "signature.js". By signing transactions locally we avoid sending our private key to the server, instead sending the digital signature. Must be cautious when creating the messageHash of the transaction.

We modified Transfer.js to include "signature" as a parameter for transfers to go through, and index.js from server to receive this signature with the other parameters of the transaction and verify that the account transfering is the one that signed the transaction with its private key.

*** While you're working through this project consider the security implications of your implementation decisions. What if someone intercepted a valid signature, would they be able to replay that transfer by sending it back to the server?
* Answer: In our case, if someone found the valid signature sent to the server, he would be able to replicate that same transaction as much as he wanted. That means if we are sending 10 amount from A to B, he would be able to send exactly 10 amount from A to B as many times as he wanted, as he maliciously intercepted a valid signature from sender A to send 10 amount to B. To solve this issue we should also add to the messageHash something like a timestamp or a conditional.
