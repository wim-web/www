import { TimeConstraint, Timing } from "@/timing/contract";
import { Redis } from "ioredis";
import { setTimeout } from "timers/promises";
import { Logger } from "winston";

export type RedisTimingInput = {
    host: string, port: number, keyPrefix?: string, logger?: Logger
}

export const withRedisTiming = async (input: RedisTimingInput, f: (timing: RedisTiming) => Promise<void>) => {
    const timing = await RedisTiming.init(input)

    try {
        await f(timing)
    } finally {
        await timing.terminate()
    }
}

export class RedisTiming implements Timing {
    private constructor(private readonly client: Redis) { }

    static async init({ host, port, keyPrefix, logger }: RedisTimingInput) {
        const client = new Redis({
            host,
            port,
            keyPrefix,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            lazyConnect: true,
        })

        // エラーイベントのハンドリング
        client.on('error', (err) => {
            logger !== undefined
                ? logger.error('Redis connection error:', err)
                : console.error('Redis connection error:', err)
        })

        const maxRetry = 5
        let times = 1
        let connected = false

        while (times <= maxRetry && !connected) {
            try {
                await client.connect();  // 明示的に接続を開始
                connected = true
            } catch (e) {
                console.log(`error ${times}`)
                const delay = Math.min(times * 50, 2000);
                await setTimeout(delay)
                times++
            }
        }

        if (!connected) {
            await client.disconnect(false)
            throw new Error('Failed to connect to Redis');
        }

        return new RedisTiming(client)
    }

    async allow({
        key,
        date,
    }: { key: string, date: Date; }) {
        // TTLで勝手に消えるのでkeyで取得できたらfalse, なかったらtrue
        const result = await this.client.exists(key)
        return result === 0
    }

    async complete({
        key,
        constraint,
        date,
    }: { key: string, constraint: TimeConstraint, date: Date; }) {
        const next = constraint.next(date).getTime()
        const ttl = Math.floor((next - date.getTime()) / 1000); // TTLを秒単位で計算

        // nextまでの時間をTTLとしてredisに保存する
        // keyはkeyでvalueはなくてもいい
        if (ttl > 0) {
            await this.client.set(key, '', 'EX', ttl); // TTLを設定してキーを保存
        }
    }

    async terminate() {
        await this.client.quit()
    }
}
