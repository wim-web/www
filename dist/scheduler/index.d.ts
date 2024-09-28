import { T as Timing, a as TimeConstraint } from '../contract-B0_abbDi.js';
import { Logger } from 'winston';

type Mode = (ShotMode | LoopMode) & {
    _type: string;
};
type ShotMode = {
    _type: "shot";
};
type LoopMode = {
    _type: "loop";
    oneCycleTime: {
        h: number;
        m: number;
    };
};
declare class Scheduler<T extends string = string> {
    private readonly mode;
    private readonly timing;
    private readonly tasks;
    private readonly logger;
    constructor(mode: Mode, timing: Timing, tasks: Tasks<T>, logger?: Logger);
    run(filterItems?: T[]): Promise<boolean>;
    private oneCycle;
    private loop;
    list(): Promise<{
        [key: string]: string;
    }>;
}
type Task<T extends string = string> = {
    name: T;
    constraint: TimeConstraint;
    fn: () => Promise<void>;
};
type Tasks<T extends string = string> = Task<T>[];

export { type LoopMode, type Mode, Scheduler, type ShotMode, type Task, type Tasks };
