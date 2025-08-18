
import { TimeConstraint } from "@/timing/contract"
import { calculateMilliseconds } from "@/util/function"
import { AtLeastOne } from "@/util/types"

export class Immediate implements TimeConstraint {
    next(date: Date): Date {
        return date
    }
}

export class Rate implements TimeConstraint {
    constructor(private readonly param: AtLeastOne<{
        h: number,
        m: number,
        s: number,
        ms: number,
    }>) { }

    next(date: Date): Date {
        const timestamp = date.getTime()

        return new Date(timestamp + calculateMilliseconds(this.param))
    }
}

export class Daily implements TimeConstraint {
    constructor(private readonly param: {
        h: number,
        m: number,
    }) { }

    next(date: Date): Date {
        const base = new Date(
            Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), this.param.h, this.param.m)
        )

        return date <= base
            ? base
            : (() => {
                base.setDate(base.getDate() + 1)
                return base
            })()
    }
}
