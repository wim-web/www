"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const function_1 = require("@/util/function");
const promises_1 = require("timers/promises");
class Scheduler {
    constructor(mode, timing, tasks) {
        this.mode = mode;
        this.timing = timing;
        this.tasks = tasks;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.mode._type) {
                case 'shot':
                    yield this.oneCycle();
                    break;
                case 'loop':
                    yield this.loop(this.mode.oneCycleTime);
                    break;
            }
        });
    }
    oneCycle() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const task of this.tasks) {
                try {
                    const input = {
                        key: task.name,
                        date: new Date(),
                    };
                    if (!(yield this.timing.allow(input))) {
                        continue;
                    }
                    yield task.fn();
                    yield this.timing.complete(Object.assign(Object.assign({}, input), { constraint: task.constraint }));
                }
                catch (e) {
                    //
                }
            }
        });
    }
    loop(oneCycleTime) {
        return __awaiter(this, void 0, void 0, function* () {
            // ループの最低時間
            const totalSleepMs = (0, function_1.calculateMilliseconds)(oneCycleTime);
            // const logger = makeLogger({ headers: [] })
            let running = true;
            const controller = new AbortController();
            const signalHandle = () => {
                running = false; // ループを停止する
                controller.abort(); // sleepを中断
            };
            process.on('SIGINT', () => {
                signalHandle();
            });
            process.on('SIGTERM', () => {
                signalHandle();
            });
            process.on('SIGQUIT', () => {
                signalHandle();
            });
            try {
                while (running) {
                    // スタート時刻を計測
                    const startTime = Date.now();
                    yield this.oneCycle();
                    const endTime = Date.now();
                    const elapsedTime = endTime - startTime; // 処理にかかった時間を計測
                    // 残り時間の計算
                    const remainingSleepTime = totalSleepMs - elapsedTime;
                    if (remainingSleepTime > 0 && running) {
                        yield (0, promises_1.setTimeout)(remainingSleepTime, null, { signal: controller.signal }); // 残り時間をスリープ
                        // logger.info(`sleep ${remainingSleepTime}`)
                    }
                }
            }
            catch (e) {
                if (e instanceof Error && e.name === "AbortError") {
                    // 正常なのでスルー
                }
                else {
                    throw e;
                }
            }
        });
    }
}
exports.Scheduler = Scheduler;
