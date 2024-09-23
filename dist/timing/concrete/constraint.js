"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Daily = exports.Rate = void 0;
class Rate {
    constructor(param) {
        this.param = param;
    }
    next(date) {
        const h_ms = (this.param.h || 0) * 60 * 60 * 1000;
        const m_ms = (this.param.m || 0) * 60 * 1000;
        const timestamp = date.getTime();
        return new Date(timestamp + h_ms + m_ms);
    }
}
exports.Rate = Rate;
class Daily {
    constructor(param) {
        this.param = param;
    }
    next(date) {
        const base = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), this.param.h, this.param.m));
        return date <= base
            ? base
            : (() => {
                base.setDate(base.getDate() + 1);
                return base;
            })();
    }
}
exports.Daily = Daily;
