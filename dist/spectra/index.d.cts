declare const addressMapping: {
    readonly "0xe850283fe71d3a4758b4affafc6372c3f0de12ef": "beHYPE";
    readonly "0x9577da597ebec8dfe3fb835d56fe447d2efa9d04": "kHYPE";
    readonly "0xe09783233df89eb507851c7567a5903a943744e8": "hbUSDT";
    readonly "0xa78fb3bed7287d1da861d7f83963e13a35290362": "hbUSDT";
};
type Alias = typeof addressMapping[keyof typeof addressMapping];
declare const NetworkMapping: {
    readonly "999": "hyperevm";
    readonly "1": "mainnet";
};
type ChainID = keyof typeof NetworkMapping;
type Network = typeof NetworkMapping[ChainID];
declare function getPools(): Promise<{
    address: string;
    name: string;
    alias: "beHYPE" | "kHYPE" | "hbUSDT";
    symbol: string;
    decimals: number;
    chainId: number;
    network: "hyperevm" | "mainnet";
    maturity: number;
    createdAt: number;
    ytPriceUSD: number;
    impliedApy: number;
    ytLeverage: number | null;
    ptApy: number | null;
    ptPriceUSD: number;
    liquidityUSD: number;
    lpAdress: string;
}[]>;
declare function getPoolsByNetwork(network: Network): Promise<{
    address: string;
    name: string;
    alias: "beHYPE" | "kHYPE" | "hbUSDT";
    symbol: string;
    decimals: number;
    chainId: number;
    network: "hyperevm" | "mainnet";
    maturity: number;
    createdAt: number;
    ytPriceUSD: number;
    impliedApy: number;
    ytLeverage: number | null;
    ptApy: number | null;
    ptPriceUSD: number;
    liquidityUSD: number;
    lpAdress: string;
}[]>;

export { type Alias, type Network, getPools, getPoolsByNetwork };
