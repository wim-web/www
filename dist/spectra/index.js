// src/spectra/pool.ts
var addressMapping = {
  "0xe850283fe71d3a4758b4affafc6372c3f0de12ef": "beHYPE",
  "0x9577da597ebec8dfe3fb835d56fe447d2efa9d04": "kHYPE",
  "0xe09783233df89eb507851c7567a5903a943744e8": "hbUSDT",
  "0xa78fb3bed7287d1da861d7f83963e13a35290362": "hbUSDT"
};
var NetworkMapping = {
  "999": "hyperevm",
  "1": "mainnet"
};
async function getPools() {
  const res = await fetch("https://app.spectra.finance/_next/data/7wAc5OcW1pG8yZuqO0Pun/pools.json");
  if (res.status !== 200) {
    throw new Error(`Failed to fetch pools: ${res.statusText}`);
  }
  const data = await res.json();
  return convert(data.pageProps.dehydratedState.queries[0].state.data);
}
async function getPoolsByNetwork(network) {
  const res = await fetch(`https://app.spectra.finance/api/v1/${network}/pools`);
  if (res.status !== 200) {
    throw new Error(`Failed to fetch pools: ${res.statusText}`);
  }
  const data = await res.json();
  return convert(data);
}
function convert(data) {
  return data.filter((item) => item.pools.length > 0).map((item) => {
    const {
      ytPrice,
      impliedApy,
      ytLeverage,
      ptApy,
      ptPrice,
      liquidity,
      address
    } = item.pools[0];
    return {
      address: item.address,
      name: item.name,
      alias: addressMapping[item.address] || "",
      symbol: item.symbol,
      decimals: item.decimals,
      chainId: item.chainId,
      network: NetworkMapping[item.chainId.toString()],
      maturity: item.maturity,
      createdAt: item.createdAt,
      ytPriceUSD: ytPrice.usd,
      impliedApy,
      ytLeverage,
      ptApy,
      ptPriceUSD: ptPrice.usd,
      liquidityUSD: liquidity.usd,
      lpAdress: address
    };
  });
}
export {
  getPools,
  getPoolsByNetwork
};
//# sourceMappingURL=index.js.map