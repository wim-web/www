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

// src/spectra/index.ts
var spectra_exports = {};
__export(spectra_exports, {
  getPools: () => getPools,
  getPoolsByNetwork: () => getPoolsByNetwork
});
module.exports = __toCommonJS(spectra_exports);

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
  const res1 = await fetch("https://app.spectra.finance/portfolio");
  const html = await res1.text();
  const match = html.match(/"buildId":"([^"]+)"/);
  if (!match) throw new Error("Could not find buildId");
  const res = await fetch(`https://app.spectra.finance/_next/data/${match[1]}/pools.json`);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPools,
  getPoolsByNetwork
});
//# sourceMappingURL=index.cjs.map