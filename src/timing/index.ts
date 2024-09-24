import { Timing } from '@/timing/contract'

export * from './concrete'
export * from './contract'


export const withTiming = async (timing: Timing, f: (timing: Timing) => Promise<void>) => {
    try {
        await f(timing)
    } finally {
        await timing.terminate()
    }
}
