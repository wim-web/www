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
export {
  extractTransactionReceipt,
  getPriorityFee,
  prettyData,
  sendTx
};
//# sourceMappingURL=index.js.map