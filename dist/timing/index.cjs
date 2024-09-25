"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/timing/index.ts
var timing_exports = {};
__export(timing_exports, {
  Daily: () => Daily,
  FileTiming: () => FileTiming,
  Immediate: () => Immediate,
  Rate: () => Rate,
  RedisTiming: () => RedisTiming,
  withTiming: () => withTiming
});
module.exports = __toCommonJS(timing_exports);

// src/timing/concrete/file.ts
var import_fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var FileTiming = class {
  constructor(filepath) {
    this.filepath = filepath;
    const dir = path.dirname(this.filepath);
    if (!import_fs.default.existsSync(dir)) {
      import_fs.default.mkdirSync(dir, { recursive: true });
    }
    if (!import_fs.default.existsSync(this.filepath)) {
      this.flush();
      return;
    }
    this.read();
  }
  locker = {};
  read() {
    this.locker = JSON.parse(import_fs.default.readFileSync(this.filepath, "utf-8"));
  }
  flush() {
    import_fs.default.writeFileSync(this.filepath, JSON.stringify(this.locker), "utf-8");
  }
  async allow({
    key,
    date
  }) {
    if (this.locker[key] === void 0) {
      return true;
    }
    const nextTime = new Date(this.locker[key]);
    return date >= nextTime;
  }
  async complete({
    key,
    constraint,
    date
  }) {
    this.locker[key] = constraint.next(date).toISOString();
    this.flush();
  }
  async terminate() {
  }
  async list() {
    return this.locker;
  }
};

// src/timing/concrete/redis.ts
var import_ioredis = require("ioredis");
var import_promises = require("timers/promises");
var RedisTiming = class _RedisTiming {
  constructor(client) {
    this.client = client;
  }
  static async init({ host, port, keyPrefix, logger }) {
    const client = new import_ioredis.Redis({
      host,
      port,
      keyPrefix,
      retryStrategy(times2) {
        const delay = Math.min(times2 * 50, 2e3);
        return delay;
      },
      lazyConnect: true
    });
    client.on("error", (err) => {
      logger !== void 0 ? logger.error("Redis connection error:", err) : console.error("Redis connection error:", err);
    });
    const maxRetry = 5;
    let times = 1;
    let connected = false;
    while (times <= maxRetry && !connected) {
      try {
        await client.connect();
        connected = true;
      } catch (e) {
        console.log(`error ${times}`);
        const delay = Math.min(times * 50, 2e3);
        await (0, import_promises.setTimeout)(delay);
        times++;
      }
    }
    if (!connected) {
      await client.disconnect(false);
      throw new Error("Failed to connect to Redis");
    }
    return new _RedisTiming(client);
  }
  async allow({
    key,
    date
  }) {
    const result = await this.client.exists(key);
    return result === 0;
  }
  async complete({
    key,
    constraint,
    date
  }) {
    const next = constraint.next(date).getTime();
    const ttl = Math.floor((next - date.getTime()) / 1e3);
    if (ttl > 0) {
      await this.client.set(key, "", "EX", ttl);
    }
  }
  async terminate() {
    await this.client.quit();
  }
  async list() {
    const result = {};
    const keys = await this.client.keys("*");
    const prefix = this.client.options.keyPrefix || "";
    for (const fullKey of keys) {
      const key = fullKey.replace(prefix, "");
      const ttl = await this.client.ttl(key);
      if (ttl > 0) {
        const expirationTimestamp = Date.now() + ttl * 1e3;
        const expirationDate = new Date(expirationTimestamp);
        result[key] = expirationDate.toISOString();
      } else {
        result[key] = "No TTL";
      }
    }
    return result;
  }
};

// src/timing/concrete/constraint.ts
var Immediate = class {
  next(date) {
    return date;
  }
};
var Rate = class {
  constructor(param) {
    this.param = param;
  }
  next(date) {
    const h_ms = (this.param.h || 0) * 60 * 60 * 1e3;
    const m_ms = (this.param.m || 0) * 60 * 1e3;
    const timestamp = date.getTime();
    return new Date(timestamp + h_ms + m_ms);
  }
};
var Daily = class {
  constructor(param) {
    this.param = param;
  }
  next(date) {
    const base = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), this.param.h, this.param.m)
    );
    return date <= base ? base : (() => {
      base.setDate(base.getDate() + 1);
      return base;
    })();
  }
};

// src/timing/index.ts
var withTiming = async (timing, f) => {
  try {
    await f(timing);
  } finally {
    await timing.terminate();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Daily,
  FileTiming,
  Immediate,
  Rate,
  RedisTiming,
  withTiming
});
//# sourceMappingURL=index.cjs.map