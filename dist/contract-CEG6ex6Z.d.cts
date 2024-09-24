interface Timing {
    allow: (input: {
        key: string;
        date: Date;
    }) => Promise<boolean>;
    complete: (input: {
        key: string;
        constraint: TimeConstraint;
        date: Date;
    }) => Promise<void>;
    terminate: () => Promise<void>;
}
interface TimeConstraint {
    next(date: Date): Date;
}

export type { Timing as T, TimeConstraint as a };
