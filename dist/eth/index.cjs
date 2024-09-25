"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/eth/index.ts
var eth_exports = {};
__export(eth_exports, {
  extractTransactionReceipt: () => extractTransactionReceipt,
  getPriorityFee: () => getPriorityFee,
  prettyData: () => prettyData,
  sendTx: () => sendTx
});
module.exports = __toCommonJS(eth_exports);

// src/eth/tx.ts
async function getPriorityFee(web3) {
  const latestBlock = await web3.eth.getBlock("latest");
  const feeHistory = await web3.eth.getFeeHistory(4, latestBlock.number, [25, 50, 75]);
  const priorityFees = feeHistory.reward.map((reward) => parseInt(reward[1].toString(), 16));
  const averagePriorityFee = priorityFees.reduce((a, b) => a + b, 0) / priorityFees.length;
  return BigInt(averagePriorityFee === 0 ? 1 : Math.floor(averagePriorityFee));
}
async function sendTx(web3, wallet, tx) {
  const new_tx = tx;
  if (!("nonce" in new_tx)) {
    const nonce = await web3.eth.getTransactionCount(wallet.wallet_address);
    new_tx.nonce = nonce;
  }
  const latestBlock = await web3.eth.getBlock("latest");
  const baseFee = latestBlock.baseFeePerGas;
  const maxPriorityFeePerGas = await getPriorityFee(web3);
  new_tx.maxFeePerGas = (baseFee + maxPriorityFeePerGas) * BigInt(2);
  new_tx.maxPriorityFeePerGas = maxPriorityFeePerGas;
  const signed_tx = await web3.eth.accounts.signTransaction(tx, wallet.private_key);
  return await web3.eth.sendSignedTransaction(signed_tx.rawTransaction);
}

// src/eth/util.ts
function prettyData(data) {
  const method = data.slice(0, 10);
  const cleanedData = data;
  const chunkSize = 64;
  const parameters = [];
  for (let i = 10; i < cleanedData.length; i += chunkSize) {
    parameters.push(cleanedData.slice(i, i + chunkSize));
  }
  return {
    method,
    parameters
  };
}
function extractTransactionReceipt(receipt) {
  return {
    transactionHash: receipt.transactionHash
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractTransactionReceipt,
  getPriorityFee,
  prettyData,
  sendTx
});
//# sourceMappingURL=index.cjs.map