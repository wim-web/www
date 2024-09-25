import { Scheduler } from '../../src/scheduler/index'
import {
    Rate
} from '../../src/timing/concrete/constraint'
import { defaultLogger } from '../../dist'
import { RedisTiming, withTiming } from '../../src/timing'


async function main() {
    const redis = await RedisTiming.init({
        host: "localhost", port: 6666, keyPrefix: "test-list:", logger: defaultLogger("debug")
    })

    await withTiming(redis, async (timing) => {
        const s = new Scheduler(
            { _type: 'shot' },
            timing,
            [{
                name: "simple2",
                constraint: new Rate({ m: 1 }),
                fn: async () => { console.log("simple") }
            }],
            defaultLogger("debug")
        )

        await s.run()

        const list = await s.list()

        console.log(list)
    })
}


main().then(() => console.log("done")).catch(console.log)
