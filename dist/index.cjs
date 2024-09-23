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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  enableLog: () => enableLog
});
module.exports = __toCommonJS(src_exports);

// src/log.ts
var import_winston = require("winston");
var logger = (0, import_winston.createLogger)({
  transports: [
    new import_winston.transports.Console({
      silent: true
    })
  ]
});
var enableLog = (level) => {
  logger = (0, import_winston.createLogger)({
    level,
    format: import_winston.format.combine(
      import_winston.format.timestamp(),
      import_winston.format.json()
    ),
    transports: [
      new import_winston.transports.Console()
    ]
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  enableLog
});
//# sourceMappingURL=index.cjs.map