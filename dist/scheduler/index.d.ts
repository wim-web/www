import { T as Timing, a as TimeConstraint } from '../contract-DdJfrOyN.js';
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
declare class Scheduler {
    private readonly mode;
    private readonly timing;
    private readonly tasks;
    private readonly logger;
    constructor(mode: Mode, timing: Timing, tasks: Task[], logger?: Logger);
    run(): Promise<void>;
    private oneCycle;
    private loop;
}
type Task = {
    name: string;
    constraint: TimeConstraint;
    fn: () => Promise<void>;
};

export { type LoopMode, type Mode, Scheduler, type ShotMode, type Task };
