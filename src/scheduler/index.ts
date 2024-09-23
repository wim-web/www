import { TimeConstraint, Timing } from "@/timing/contract"
import { calculateMilliseconds } from "@/util/function"
import { setTimeout } from "timers/promises"

type Mode = (ShotMode | LoopMode) & { _type: string }

type ShotMode = {
    _type: "shot"
}

type LoopMode = {
    _type: "loop"
    oneCycleTime: { h: number, m: number }
}

export class Scheduler {
    constructor(
        private readonly mode: Mode,
        private readonly timing: Timing,
        private readonly tasks: Task[],
    ) { }

    async run() {
        switch (this.mode._type) {
            case 'shot':
                await this.oneCycle()
                break
            case 'loop':
                await this.loop(this.mode.oneCycleTime)
                break
        }
    }

    private async oneCycle() {
        for (const task of this.tasks) {
            try {
                const input = {
                    key: task.name,
                    date: new Date(),
                }

                if (!await this.timing.allow(input)) {
                    continue
                }

                await task.fn()
                await this.timing.complete({
                    ...input,
                    constraint: task.constraint
                })
            } catch (e) {
                //
            }
        }
    }

    private async loop(oneCycleTime: { h: number, m: number }) {
        // ループの最低時間
        const totalSleepMs = calculateMilliseconds(oneCycleTime);
        // const logger = makeLogger({ headers: [] })
        let running = true
        const controller = new AbortController();

        const signalHandle = () => {
            running = false;  // ループを停止する
            controller.abort(); // sleepを中断
        }

        process.on('SIGINT', () => {
            signalHandle()
        });
        process.on('SIGTERM', () => {
            signalHandle()
        });
        process.on('SIGQUIT', () => {
            signalHandle()
        });

        try {
            while (running) {
                // スタート時刻を計測
                const startTime = Date.now()

                await this.oneCycle()

                const endTime = Date.now()
                const elapsedTime = endTime - startTime // 処理にかかった時間を計測

                // 残り時間の計算
                const remainingSleepTime = totalSleepMs - elapsedTime

                if (remainingSleepTime > 0 && running) {
                    await setTimeout(remainingSleepTime, null, { signal: controller.signal }) // 残り時間をスリープ
                    // logger.info(`sleep ${remainingSleepTime}`)
                }
            }
        } catch (e) {
            if (e instanceof Error && e.name === "AbortError") {
                // 正常なのでスルー
            } else {
                throw e
            }
        }
    }
}

type Task = {
    name: string,
    constraint: TimeConstraint,
    fn: () => Promise<void>
}
