import { Scheduler } from '../../src/scheduler/index'
import { withRedisTiming } from '../../src/timing/concrete/redis'
import {
    Rate
} from '../../src/timing/concrete/constraint'
import { defaultLogger } from '../../dist'
import { setTimeout } from 'timers/promises'


async function main() {
    await withRedisTiming({
        host: "localhost", port: 6666, keyPrefix: "test", logger: defaultLogger("debug")
    }, async (timing) => {

        const s = new Scheduler(
            { _type: 'loop', oneCycleTime: { h: 0, m: 2 } },
            timing,
            [{
                name: "simple",
                constraint: new Rate({ m: 1 }),
                fn: async () => { console.log("simple") }
            }],
            defaultLogger("debug")
        )

        await s.run()
    })
}


main().then(() => console.log("done")).catch(console.log)


