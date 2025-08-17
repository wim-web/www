import { getPools, getPoolsByNetwork } from '../../src/spectra'

async function main() {
    // const pools = await getPoolsByNetwork("hyperevm")
    const pools = await getPools()

    console.log(pools[0])
}

main().catch(console.error)
