import * as web3_types from 'web3-types';
import Web3, { Transaction, TransactionReceipt } from 'web3';

type Wallet = {
    wallet_address: string;
    private_key: string;
};

declare function getPriorityFee(web3: Web3): Promise<bigint>;
declare function sendTx(web3: Web3, wallet: Wallet, tx: Omit<Transaction, 'maxFeePerGas' | 'maxPriorityFeePerGas'>): Promise<web3_types.TransactionReceipt>;

type PrettyData = {
    method: string;
    parameters: string[];
};
declare function prettyData(data: string): PrettyData;
declare function extractTransactionReceipt(receipt: TransactionReceipt): {
    transactionHash: web3_types.Bytes;
};

export { type PrettyData, type Wallet, extractTransactionReceipt, getPriorityFee, prettyData, sendTx };
