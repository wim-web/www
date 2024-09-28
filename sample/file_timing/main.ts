import { Scheduler } from '../../src/scheduler/index'
import { FileTiming } from '../../src/timing/concrete/file'
import {
    Rate
} from '../../src/timing/concrete/constraint'
import { defaultLogger } from '../../dist'
import { withTiming } from '../../src/timing'


async function main() {
    const file = new FileTiming("./json.json")

    await withTiming(file, async (timing) => {
        const s = new Scheduler(
            { _type: 'shot' },
            timing,
            [
                {
                    name: "simple",
                    constraint: new Rate({ m: 1 }),
                    fn: async () => { console.log("simple") }
                },
                {
                    name: "not",
                    constraint: new Rate({ m: 1 }),
                    fn: async () => { console.log("not") }
                }
            ],
            defaultLogger("debug")
        )

        await s.run(["simple"])
    })
}


main().then(() => console.log("done")).catch(console.log)


