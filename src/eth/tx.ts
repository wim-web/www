import { Wallet } from "@/eth/wallet";
import Web3, { Transaction } from "web3";

export async function getPriorityFee(web3: Web3) {
    // 最新のブロックを取得
    const latestBlock = await web3.eth.getBlock('latest');

    // FeeHistoryを取得
    const feeHistory = await web3.eth.getFeeHistory(4, latestBlock.number, [25, 50, 75]);

    // 中央値（50パーセンタイル）のpriority feeを計算
    const priorityFees = feeHistory.reward.map(reward => parseInt(reward[1].toString(), 16));
    const averagePriorityFee = priorityFees.reduce((a, b) => a + b, 0) / priorityFees.length;

    return BigInt(averagePriorityFee === 0 ? 1 : Math.floor(averagePriorityFee));
}


// nonceやmaxFeePerGas, maxPriorityFeePerGas を自動で設定してtxをとばす
export async function sendTx(web3: Web3, wallet: Wallet, tx: Omit<Transaction, 'maxFeePerGas' | 'maxPriorityFeePerGas'>) {
    const new_tx = tx as Transaction

    if (!('nonce' in new_tx)) {
        const nonce = await web3.eth.getTransactionCount(wallet.wallet_address)
        new_tx.nonce = nonce
    }

    const latestBlock = await web3.eth.getBlock("latest");
    const baseFee = latestBlock.baseFeePerGas!;
    const maxPriorityFeePerGas = await getPriorityFee(web3);

    new_tx.maxFeePerGas = (baseFee + maxPriorityFeePerGas) * BigInt(2)
    new_tx.maxPriorityFeePerGas = maxPriorityFeePerGas

    const signed_tx = await web3.eth.accounts.signTransaction(tx, wallet.private_key)
    return await web3.eth.sendSignedTransaction(signed_tx.rawTransaction)
}
