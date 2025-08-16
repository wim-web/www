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

// src/util/index.ts
var util_exports = {};
__export(util_exports, {
  getEnvFunc: () => getEnvFunc
});
module.exports = __toCommonJS(util_exports);

// src/util/get_env.ts
var getEnvFunc = () => {
  return getEnv;
};
var getEnv = (key, defaultValue) => {
  const value = process.env[key];
  if (value === void 0) {
    if (defaultValue === void 0) {
      throw new Error(`\u74B0\u5883\u5909\u6570 ${key} \u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093`);
    }
    return defaultValue;
  }
  return value;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEnvFunc
});
//# sourceMappingURL=index.cjs.map