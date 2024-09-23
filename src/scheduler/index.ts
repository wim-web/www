import { noneLogger } from "@/log"
import { TimeConstraint, Timing } from "@/timing/contract"
import { calculateMilliseconds } from "@/util/function"
import { setTimeout } from "timers/promises"
import { Logger } from "winston"

export type Mode = (ShotMode | LoopMode) & { _type: string }

export type ShotMode = {
    _type: "shot"
}

export type LoopMode = {
    _type: "loop"
    oneCycleTime: { h: number, m: number }
}

export class Scheduler {
    private readonly logger: Logger

    constructor(
        private readonly mode: Mode,
        private readonly timing: Timing,
        private readonly tasks: Task[],
        logger?: Logger,
    ) {
        this.logger = logger || noneLogger()
    }

    async run() {
        this.logger.debug(`run`, { mode: this.mode._type })
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
            this.logger.info(`start ${task.name}`, { task_name: task.name })
            try {
                const input = {
                    key: task.name,
                    date: new Date(),
                }

                if (!await this.timing.allow(input)) {
                    this.logger.info(`skip ${task.name}`, { task_name: task.name })
                    continue
                }

                await task.fn()
                await this.timing.complete({
                    ...input,
                    constraint: task.constraint
                })
                this.logger.info(`end ${task.name}`, { task_name: task.name })
            } catch (e) {
                //
            }
        }
    }

    private async loop(oneCycleTime: { h: number, m: number }) {
        // ループの最低時間
        const totalSleepMs = calculateMilliseconds(oneCycleTime);
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
                this.logger.debug("start oneCycle")

                await this.oneCycle()

                const endTime = Date.now()
                this.logger.debug("end oneCycle")
                const elapsedTime = endTime - startTime // 処理にかかった時間を計測

                // 残り時間の計算
                const remainingSleepTime = totalSleepMs - elapsedTime

                if (remainingSleepTime > 0 && running) {
                    this.logger.debug("sleep", { sleep_time_ms: remainingSleepTime, sleep_time_s: remainingSleepTime / 1000, sleep_time_m: remainingSleepTime / (1000 * 60) })
                    await setTimeout(remainingSleepTime, null, { signal: controller.signal }) // 残り時間をスリープ
                }
            }
        } catch (e) {
            if (e instanceof Error && e.name === "AbortError") {
                this.logger.info("", e)
                // 正常なのでスルー
                this.logger.debug("stopping")
            } else {
                throw e
            }
        }
    }
}

export type Task = {
    name: string,
    constraint: TimeConstraint,
    fn: () => Promise<void>
}
