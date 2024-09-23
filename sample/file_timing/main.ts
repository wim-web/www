import { Scheduler } from '../../src/scheduler/index'
import { FileTiming } from '../../src/timing/concrete/file'
import { enableLog } from '../../src/log'
import {
    Rate
} from '../../src/timing/concrete/constraint'


async function main() {
    enableLog("debug")
    const timing = new FileTiming("./json.json")

    const s = new Scheduler(
        { _type: 'shot' },
        timing,
        [{
            name: "simple",
            constraint: new Rate({ m: 1 }),
            fn: async () => { console.log("simple") }
        }]
    )


    await s.run()
}


main().then(() => console.log("done")).catch(console.log)


