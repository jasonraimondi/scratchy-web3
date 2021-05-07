import "dotenv/config";

import Web3 from "web3";
import type { TransactionConfig, TransactionReceipt } from "web3-core";

const web3 = new Web3(Web3.givenProvider || process.env.WEB3_PROVIDER);

(async () => {

  const amount = 5
  const value = web3.utils.toWei(amount.toString(), 'ether')

  console.log({ value, amount });

  const [from, to] = await web3.eth.getAccounts();
  console.log("balance: ", await web3.eth.getBalance(to));
  const tx: TransactionConfig = { from, to, value };
  const gasEstimate = await web3.eth.estimateGas(tx);
  tx.gas = await web3.eth.estimateGas(tx);

  console.log({ tx });

  const receipt = await web3.eth
    .sendTransaction({
      ...tx,
      gas: gasEstimate,
    })
    .on("transactionHash", (txHash: string) => {
      console.log({ txHash });
    })
    .on("receipt", (receipt: TransactionReceipt) => {
      console.log({ receipt });
    })
    .on("confirmation", (confNumber: number, receipt: TransactionReceipt, latestBlockHash?: string) => {
      console.log({ confNumber, receipt, latestBlockHash });
    })
    .on("error", (error: Error) => {
      console.log({ error });
    });

  console.log("balance: ", await web3.eth.getBalance(to));
})().finally(() => process.exit());
