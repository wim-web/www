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
export {
  getEnvFunc
};
//# sourceMappingURL=index.js.map