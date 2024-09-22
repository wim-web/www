import { Daily, Rate } from "@/timing/concrete/constraint";
import { describe, expect, it } from "vitest";


describe('Rate', () => {
    it('next: hのみ', () => {
        const rate = new Rate({ h: 2 })
        const date = new Date('2020-01-01 00:00:00')
        const expected = new Date('2020-01-01 02:00:00')

        const next = rate.next(date)

        expect(next).toStrictEqual(expected)
    })

    it('next: mのみ', () => {
        const rate = new Rate({ m: 70 })
        const date = new Date('2020-01-01 00:00:00')
        const expected = new Date('2020-01-01 01:10:00')

        const next = rate.next(date)

        expect(next).toStrictEqual(expected)
    })

    it('next: hとm', () => {
        const rate = new Rate({ h: 2, m: 1 })
        const date = new Date('2020-01-01 00:00:00')
        const expected = new Date('2020-01-01 02:01:00')

        const next = rate.next(date)

        expect(next).toStrictEqual(expected)
    })

    it('next: 年付きまたぎ', () => {
        const rate = new Rate({ h: 2 })
        const date = new Date('2019-12-31 23:00:00')
        const expected = new Date('2020-01-01 01:00:00')

        const next = rate.next(date)

        expect(next).toStrictEqual(expected)
    })
})

describe('Daily', () => {
    it('next: date < base', () => {
        const daily = new Daily({ h: 1, m: 10 })
        const date = new Date('2020-01-01 00:00:00')
        const expected = new Date('2020-01-01 01:10:00')

        const next = daily.next(date)

        expect(next).toStrictEqual(expected)
    })

    it('next: date > base', () => {
        const daily = new Daily({ h: 1, m: 10 })
        const date = new Date('2020-01-01 02:00:00')
        const expected = new Date('2020-01-02 01:10:00')

        const next = daily.next(date)

        expect(next).toStrictEqual(expected)
    })

    it('next: 年付きまたぎ', () => {
        const daily = new Daily({ h: 1, m: 20 })
        const date = new Date('2019-12-31 23:00:00')
        const expected = new Date('2020-01-01 01:20:00')

        const next = daily.next(date)

        expect(next).toStrictEqual(expected)
    })
})
