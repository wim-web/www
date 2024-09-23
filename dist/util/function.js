"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMilliseconds = calculateMilliseconds;
function calculateMilliseconds({ h, m, s, ms, }) {
    const toM = (h) => h * 60;
    const toS = (m) => m * 60;
    const toMS = (s) => s * 1000;
    return toMS(toS(toM(h || 0) + (m || 0)) + (s || 0)) + (ms || 0);
}
