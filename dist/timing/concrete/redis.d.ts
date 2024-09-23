import { TimeConstraint, Timing } from "@/timing/contract";
type RedisTimingInput = {
    host: string;
    port: number;
    keyPrefix?: string;
};
export declare const withRedisTiming: (input: RedisTimingInput, f: (timing: RedisTiming) => Promise<void>) => Promise<void>;
export declare class RedisTiming implements Timing {
    private client;
    constructor({ host, port, keyPrefix }: RedisTimingInput);
    allow({ key, date, }: {
        key: string;
        date: Date;
    }): Promise<boolean>;
    complete({ key, constraint, date, }: {
        key: string;
        constraint: TimeConstraint;
        date: Date;
    }): Promise<void>;
    terminate(): Promise<void>;
}
export {};
//# sourceMappingURL=redis.d.ts.map