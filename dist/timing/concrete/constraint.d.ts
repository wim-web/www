import { TimeConstraint } from "@/timing/contract";
import { AtLeastOne } from "@/util/types";
export declare class Rate implements TimeConstraint {
    private readonly param;
    constructor(param: AtLeastOne<{
        h: number;
        m: number;
    }>);
    next(date: Date): Date;
}
export declare class Daily implements TimeConstraint {
    private readonly param;
    constructor(param: {
        h: number;
        m: number;
    });
    next(date: Date): Date;
}
//# sourceMappingURL=constraint.d.ts.map