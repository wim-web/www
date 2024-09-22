import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Redis from 'ioredis';
import { RedisTiming } from '@/timing/concrete/redis';


// Redis サーバーの接続設定
const redisOptions = {
    host: 'localhost',
    port: 6666,
};

let redisTiming: RedisTiming;
let redisClient: Redis;

describe('RedisTiming', () => {
    const redisTiming = new RedisTiming(redisOptions)
    let redisClient: Redis;

    beforeAll(async () => {
        redisClient = new Redis(redisOptions)
        await redisClient.flushall()
    })

    it('should return true if key does not exist', async () => {
        const key = 'test-key-1';

        const result = await redisTiming.allow({ key, date: new Date() });
        expect(result).toBe(true);
    });

    it('should return false if key exists', async () => {
        const key = 'test-key-2';

        // Redisにダミーのキーをセット
        await redisClient.set(key, 'dummy-value', 'EX', 60); // 60秒のTTL

        const result = await redisTiming.allow({ key, date: new Date() });
        expect(result).toBe(false);
    });

    it('should set key with TTL in Redis', async () => {
        const key = 'test-key-3';
        const constraint = {
            next: (date: Date) => new Date(date.getTime() + 60 * 5000), // 5分後を返す
        };

        // キーに制約に基づくTTLを設定
        await redisTiming.complete({ key, constraint, date: new Date() });

        const ttl = await redisClient.ttl(key);
        expect(ttl).toBeGreaterThan(0); // TTLが0より大きければOK
    });
});
