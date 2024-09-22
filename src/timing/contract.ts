export interface Timing {
    allow: (input: {
        key: string,
        date: Date,
    }) => boolean;
    complete: (input: {
        key: string,
        constraint: TimeConstraint,
        date: Date,
    }) => void;
}

export interface TimeConstraint {
    next(date: Date): Date;
}
