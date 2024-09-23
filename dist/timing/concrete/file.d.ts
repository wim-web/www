import { TimeConstraint, Timing } from "../contract";
export declare class FileTiming implements Timing {
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
}
//# sourceMappingURL=file.d.ts.map