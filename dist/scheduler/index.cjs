"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/scheduler/index.ts
var scheduler_exports = {};
__export(scheduler_exports, {
  Scheduler: () => Scheduler
});
module.exports = __toCommonJS(scheduler_exports);

// src/log.ts
var import_winston = require("winston");
var noneLogger = () => {
  return (0, import_winston.createLogger)({
    transports: [
      new import_winston.transports.Console({
        silent: true
      })
    ]
  });
};

// src/util/function.ts
function calculateMilliseconds({
  h,
  m,
  s,
  ms
}) {
  const toM = (h2) => h2 * 60;
  const toS = (m2) => m2 * 60;
  const toMS = (s2) => s2 * 1e3;
  return toMS(
    toS(
      toM(
        h || 0
      ) + (m || 0)
    ) + (s || 0)
  ) + (ms || 0);
}

// src/scheduler/index.ts
var import_promises = require("timers/promises");
var Scheduler = class {
  constructor(mode, timing, tasks, logger) {
    this.mode = mode;
    this.timing = timing;
    this.tasks = tasks;
    this.logger = logger || noneLogger();
  }
  logger;
  async run() {
    this.logger.debug(`run`, { mode: this.mode._type });
    switch (this.mode._type) {
      case "shot":
        return await this.oneCycle();
      case "loop":
        return await this.loop(this.mode.oneCycleTime);
    }
  }
  async oneCycle() {
    let isError = false;
    for (const task of this.tasks) {
      this.logger.info(`start ${task.name}`, { task_name: task.name });
      try {
        const input = {
          key: task.name,
          date: /* @__PURE__ */ new Date()
        };
        if (!await this.timing.allow(input)) {
          this.logger.info(`skip ${task.name}`, { task_name: task.name });
          continue;
        }
        await task.fn();
        await this.timing.complete({
          ...input,
          constraint: task.constraint
        });
        this.logger.info(`end ${task.name}`, { task_name: task.name });
      } catch (e) {
        isError = true;
        this.logger.error("", e);
      }
    }
    return isError;
  }
  // 最後のサイクルのみの結果を返す
  async loop(oneCycleTime) {
    const totalSleepMs = calculateMilliseconds(oneCycleTime);
    let running = true;
    const controller = new AbortController();
    const signalHandle = () => {
      running = false;
      controller.abort();
    };
    process.on("SIGINT", () => {
      signalHandle();
    });
    process.on("SIGTERM", () => {
      signalHandle();
    });
    process.on("SIGQUIT", () => {
      signalHandle();
    });
    let isError = false;
    try {
      while (running) {
        const startTime = Date.now();
        this.logger.debug("start oneCycle");
        isError = await this.oneCycle();
        const endTime = Date.now();
        this.logger.debug("end oneCycle");
        const elapsedTime = endTime - startTime;
        const remainingSleepTime = totalSleepMs - elapsedTime;
        if (remainingSleepTime > 0 && running) {
          this.logger.debug("sleep", { sleep_time_ms: remainingSleepTime, sleep_time_s: remainingSleepTime / 1e3, sleep_time_m: remainingSleepTime / (1e3 * 60) });
          await (0, import_promises.setTimeout)(remainingSleepTime, null, { signal: controller.signal });
        }
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        this.logger.debug("stopping");
      } else {
        this.logger.error("", e);
        isError = true;
        throw e;
      }
    }
    return isError;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Scheduler
});
//# sourceMappingURL=index.cjs.map