import { Scheduler } from '../../src/scheduler/index'
import { withRedisTiming } from '../../src/timing/concrete/redis'
import {
    Rate
} from '../../src/timing/concrete/constraint'
import { enableLog } from '../../src/log'


async function main() {
    enableLog("debug")

    await withRedisTiming({
        host: "localhost", port: 6666, keyPrefix: "test"
    }, async (timing) => {

        const s = new Scheduler(
            { _type: 'loop', oneCycleTime: { h: 0, m: 2 } },
            timing,
            [{
                name: "simple",
                constraint: new Rate({ m: 1 }),
                fn: async () => { console.log("simple") }
            }]
        )


        await s.run()
    })
}


main().then(() => console.log("done")).catch(console.log)


