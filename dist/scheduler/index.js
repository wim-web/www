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
const log_1 = require("@/log");
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
            log_1.logger.debug(`run`, { mode: this.mode._type });
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
                log_1.logger.info(`start ${task.name}`, { task_name: task.name });
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
                    log_1.logger.info(`end ${task.name}`, { task_name: task.name });
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
                    log_1.logger.debug("start oneCycle");
                    yield this.oneCycle();
                    const endTime = Date.now();
                    log_1.logger.debug("end oneCycle");
                    const elapsedTime = endTime - startTime; // 処理にかかった時間を計測
                    // 残り時間の計算
                    const remainingSleepTime = totalSleepMs - elapsedTime;
                    if (remainingSleepTime > 0 && running) {
                        log_1.logger.debug("sleep", { sleep_time_ms: remainingSleepTime, sleep_time_s: remainingSleepTime / 1000, sleep_time_m: remainingSleepTime / (1000 * 60) });
                        yield (0, promises_1.setTimeout)(remainingSleepTime, null, { signal: controller.signal }); // 残り時間をスリープ
                    }
                }
            }
            catch (e) {
                if (e instanceof Error && e.name === "AbortError") {
                    log_1.logger.info("", e);
                    // 正常なのでスルー
                    log_1.logger.debug("stopping");
                }
                else {
                    throw e;
                }
            }
        });
    }
}
exports.Scheduler = Scheduler;
