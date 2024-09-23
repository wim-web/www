"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableLog = exports.logger = void 0;
const winston_1 = require("winston");
exports.logger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console({
            silent: true
        })
    ]
});
const enableLog = (level) => {
    exports.logger = (0, winston_1.createLogger)({
        level,
        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
        transports: [
            new winston_1.transports.Console()
        ]
    });
};
exports.enableLog = enableLog;
