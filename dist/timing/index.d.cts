import { T as Timing, a as TimeConstraint } from '../contract-B0_abbDi.cjs';
import { Logger } from 'winston';

type Locker = {
    [key: string]: string;
};
declare class FileTiming implements Timing {
    private readonly filepath;
    private locker;
    constructor(filepath: string);
    private read;
    private flush;
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
    list(): Promise<Locker>;
}

type RedisTimingInput = {
    host: string;
    port: number;
    keyPrefix?: string;
    logger?: Logger;
};
declare class RedisTiming implements Timing {
    private readonly client;
    private constructor();
    static init({ host, port, keyPrefix, logger }: RedisTimingInput): Promise<RedisTiming>;
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
    list(): Promise<{
        [key: string]: string;
    }>;
}

type AtLeastOne<T, U = {
    [K in keyof T]: Pick<T, K>;
}> = Partial<T> & U[keyof U];

declare class Immediate implements TimeConstraint {
    next(date: Date): Date;
}
declare class Rate implements TimeConstraint {
    private readonly param;
    constructor(param: AtLeastOne<{
        h: number;
        m: number;
    }>);
    next(date: Date): Date;
}
declare class Daily implements TimeConstraint {
    private readonly param;
    constructor(param: {
        h: number;
        m: number;
    });
    next(date: Date): Date;
}

declare const withTiming: (timing: Timing, f: (timing: Timing) => Promise<void>) => Promise<void>;

export { Daily, FileTiming, Immediate, Rate, RedisTiming, type RedisTimingInput, TimeConstraint, Timing, withTiming };
