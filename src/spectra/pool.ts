interface TokenInfo {
    address: string
    name: string
    symbol: string
    decimals: number
    chainId: number
}

interface BaseToken extends TokenInfo {
    price: {
        usd: number
        underlying?: number
    }
}

interface YieldToken {
    address: string
    decimals: number
    chainId: number
}

interface IBTToken extends TokenInfo {
    rate: string
    apr: {
        total: number | null
        details: {
            base: number
            rewards?: Record<string, number>
        }
    }
    price: {
        underlying: number
        usd: number
    }
    protocol: string
}

interface LPToken {
    address: string
    decimals: number
    chainId: number
    supply: string
}

interface Pool {
    address: string
    chainId: number
    lpt: LPToken
    liquidity: {
        underlying: number
        usd: number
    }
    ptApy: number | null
    ytLeverage: number | null
    impliedApy: number
    lpApy: {
        total: number | null
        details: {
            fees: number
            pt: number | null
            ibt: number | null
            boostedRewards?: {
                [key: string]: {
                    min: number
                    max: number
                }
            }
        }
        boostedTotal?: number
    }
    ibtToPt: string | null
    ptToIbt: string | null
    spotPrice: string
    ptPrice: {
        underlying: number
        usd: number
    }
    ytPrice: {
        underlying: number
        usd: number
    }
    ibtAmount: string
    ptAmount: string
    feeRate: string
    outFee: string
    midFee: string
    lastPrices: string
}

interface Multiplier {
    amount?: number
    name: string
}

type SpectraResponse = SymbolInfo[]

interface SymbolInfo {
    address: string
    name: string
    symbol: string
    decimals: number
    chainId: number
    rate: string
    yt: YieldToken
    ibt: IBTToken
    underlying: BaseToken
    maturity: number
    createdAt: number
    pools: Pool[]
    multipliers?: Multiplier[]
    maturityValue: {
        underlying: number
        usd: number
    }
}


const addressMapping = {
    "0xe850283fe71d3a4758b4affafc6372c3f0de12ef": "beHYPE",
    "0x9577da597ebec8dfe3fb835d56fe447d2efa9d04": "kHYPE",
    "0xe09783233df89eb507851c7567a5903a943744e8": "hbUSDT",
    "0xa78fb3bed7287d1da861d7f83963e13a35290362": "hbUSDT",
} as const

// beHYPE, kHYPE, hbUSDT
export type Alias = typeof addressMapping[keyof typeof addressMapping];

const NetworkMapping = {
    "999": "hyperevm",
    "1": "mainnet",
} as const

type ChainID = keyof typeof NetworkMapping;
export type Network = typeof NetworkMapping[ChainID];

export async function getPools() {
    const res = await fetch("https://app.spectra.finance/_next/data/7wAc5OcW1pG8yZuqO0Pun/pools.json")

    if (res.status !== 200) {
        throw new Error(`Failed to fetch pools: ${res.statusText}`);
    }

    const data: {
        pageProps: {
            dehydratedState: {
                queries: {
                    state: {
                        data: SpectraResponse
                    }
                }[]
            }
        }
    } = await res.json()

    return convert(data.pageProps.dehydratedState.queries[0].state.data)
}

export async function getPoolsByNetwork(network: Network) {
    const res = await fetch(`https://app.spectra.finance/api/v1/${network}/pools`)

    if (res.status !== 200) {
        throw new Error(`Failed to fetch pools: ${res.statusText}`);
    }

    const data: SpectraResponse = await res.json()

    return convert(data)
}

function convert(data: SpectraResponse) {
    return data
        .filter((item) => item.pools.length > 0)
        .map((item) => {
            const {
                ytPrice,
                impliedApy,
                ytLeverage,
                ptApy,
                ptPrice,
                liquidity,
                address,
            } = item.pools[0]

            return {
                address: item.address,
                name: item.name,
                alias: addressMapping[item.address as keyof typeof addressMapping] || "",
                symbol: item.symbol,
                decimals: item.decimals,
                chainId: item.chainId,
                network: NetworkMapping[item.chainId.toString() as ChainID],
                maturity: item.maturity,
                createdAt: item.createdAt,
                ytPriceUSD: ytPrice.usd,
                impliedApy,
                ytLeverage,
                ptApy,
                ptPriceUSD: ptPrice.usd,
                liquidityUSD: liquidity.usd,
                lpAdress: address,
            }
        })
}
