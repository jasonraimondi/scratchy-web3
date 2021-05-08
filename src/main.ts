import "dotenv/config";

import Web3 from "web3";
import type { TransactionConfig, TransactionReceipt } from "web3-core";

const web3 = new Web3(Web3.givenProvider || process.env.WEB3_PROVIDER);

async function sendEth({ from, to, amount }: { from: string; to: string; amount: string }) {
  const value = web3.utils.toWei(amount, "ether");
  const currentBalance = await web3.eth.getBalance(to);
  console.log({ value, currentBalance });

  const tx: TransactionConfig = { from, to, value };
  tx.gas = await web3.eth.estimateGas(tx);

  const privateKey = "9c0719c2af30bbdb997c666cfcf73a1255d7a44c5a0df68e7523221e44fd04d7"; // testing key from ganache
  // const privateKey = "9c0719c2af30bbdb997c888cfcf73a1255d7a44c5a0df68e7523221e44fd04d7"; // not valid
  const signedTransaction = await web3.eth.accounts.signTransaction(tx, privateKey);
  if (typeof signedTransaction.rawTransaction !== "string") throw new Error("invalid signedTransaction");
  const receipt = await web3.eth
    .sendSignedTransaction(signedTransaction.rawTransaction)
    .on("transactionHash", (txHash: string) => {
      // console.log({ txHash });
    })
    .on("receipt", (receipt: TransactionReceipt) => {
      // console.log({ receipt });
    })
    .on("confirmation", (confNumber: number, receipt: TransactionReceipt, latestBlockHash?: string) => {
      // console.log({ confNumber, receipt, latestBlockHash });
    })
    .on("error", (error: Error) => {
      console.log({ error });
    });

  console.log({ tx });
  console.log("receipt: ", receipt);
  console.log("balance to: ", await web3.eth.getBalance(to));
  console.log("balance from: ", await web3.eth.getBalance(from));
}

(async () => {
  const [_, _1, to, from] = await web3.eth.getAccounts();
  await sendEth({ to, from, amount: "0.1" });
})()
  .catch(console.log)
  .finally(process.exit);
