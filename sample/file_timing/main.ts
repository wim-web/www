import { Scheduler } from '../../src/scheduler/index'
import { FileTiming } from '../../src/timing/concrete/file'
import {
    Rate
} from '../../src/timing/concrete/constraint'
import { defaultLogger } from '../../dist'


async function main() {
    const timing = new FileTiming("./json.json")

    const s = new Scheduler(
        { _type: 'shot' },
        timing,
        [{
            name: "simple",
            constraint: new Rate({ m: 1 }),
            fn: async () => { console.log("simple") }
        }],
        defaultLogger("debug")
    )


    await s.run()
}


main().then(() => console.log("done")).catch(console.log)


