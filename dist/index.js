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
var defaultLogger = (level) => {
  return createLogger({
    level,
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    transports: [
      new transports.Console({
        silent: false
        // ログ出力を有効化
      })
    ]
  });
};
export {
  defaultLogger,
  noneLogger
};
//# sourceMappingURL=index.js.map