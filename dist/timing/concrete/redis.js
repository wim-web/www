"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisTiming = exports.withRedisTiming = void 0;
const ioredis_1 = require("ioredis");
const withRedisTiming = (input, f) => __awaiter(void 0, void 0, void 0, function* () {
    const timing = new RedisTiming(input);
    try {
        yield f(timing);
    }
    finally {
        yield timing.terminate();
    }
});
exports.withRedisTiming = withRedisTiming;
class RedisTiming {
    constructor({ host, port, keyPrefix }) {
        this.client = new ioredis_1.Redis({
            host,
            port,
            keyPrefix
        });
    }
    allow(_a) {
        return __awaiter(this, arguments, void 0, function* ({ key, date, }) {
            // TTLで勝手に消えるのでkeyで取得できたらfalse, なかったらtrue
            const result = yield this.client.exists(key);
            return result === 0;
        });
    }
    complete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ key, constraint, date, }) {
            const next = constraint.next(date).getTime();
            const ttl = Math.floor((next - date.getTime()) / 1000); // TTLを秒単位で計算
            // nextまでの時間をTTLとしてredisに保存する
            // keyはkeyでvalueはなくてもいい
            if (ttl > 0) {
                yield this.client.set(key, '', 'EX', ttl); // TTLを設定してキーを保存
            }
        });
    }
    terminate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.quit();
        });
    }
}
exports.RedisTiming = RedisTiming;
