// src/log.ts
import { createLogger, format, transports } from "winston";
var noneLogger = () => {
  return createLogger({
    transports: [
      new transports.Console({
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
import { setTimeout } from "timers/promises";
var Scheduler = class {
  constructor(mode, timing, tasks, logger) {
    this.mode = mode;
    this.timing = timing;
    this.tasks = tasks;
    this.logger = logger || noneLogger();
  }
  logger;
  async run(filterItems = []) {
    this.logger.debug(`run`, { mode: this.mode._type });
    const filter = filterItems.length === 0 ? { filtered: false, items: [] } : { filtered: true, items: filterItems };
    switch (this.mode._type) {
      case "shot":
        return await this.oneCycle(filter);
      case "loop":
        return await this.loop(this.mode.oneCycleTime, filter);
    }
  }
  async oneCycle(filter) {
    let isError = false;
    for (const task of this.tasks) {
      if (filter.filtered && !filter.items.includes(task.name)) {
        continue;
      }
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
  async loop(oneCycleTime, filter) {
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
        isError = await this.oneCycle(filter);
        const endTime = Date.now();
        this.logger.debug("end oneCycle");
        const elapsedTime = endTime - startTime;
        const remainingSleepTime = totalSleepMs - elapsedTime;
        if (remainingSleepTime > 0 && running) {
          this.logger.debug("sleep", { sleep_time_ms: remainingSleepTime, sleep_time_s: remainingSleepTime / 1e3, sleep_time_m: remainingSleepTime / (1e3 * 60) });
          await setTimeout(remainingSleepTime, null, { signal: controller.signal });
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
  async list() {
    return await this.timing.list();
  }
};
export {
  Scheduler
};
//# sourceMappingURL=index.js.map