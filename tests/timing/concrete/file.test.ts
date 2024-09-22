import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FileTiming } from '@/timing/concrete/file';
import { createTempFile } from 'tests/util';

describe('FileTiming', () => {
    describe('allow', () => {
        it('key is not exists', async () => {
            const filePath = createTempFile(JSON.stringify({}))
            const fileTiming = new FileTiming(filePath)

            const actual = await fileTiming.allow({ key: "key", date: new Date() })

            expect(actual).toBe(true)
        })

        it('key is exists', async () => {
            const filePath = createTempFile(JSON.stringify({
                "key": new Date("2020-01-01 00:00:00").toISOString()
            }))

            const fileTiming = new FileTiming(filePath)

            const before = await fileTiming.allow({ key: "key", date: new Date("2000-01-01 00:00:00") })
            const after = await fileTiming.allow({ key: "key", date: new Date("2100-01-01 00:00:00") })

            expect(before).toBe(false)
            expect(after).toBe(true)

        })
    })
});
