import { createLogger, format, Logger, transports } from "winston";

export const noneLogger = (): Logger => {
    return createLogger({
        transports: [
            new transports.Console({
                silent: true
            })
        ]
    })
}

export const defaultLogger = (level: string): Logger => {
    return createLogger({
        level,
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            new transports.Console({
                silent: false // ログ出力を有効化
            })
        ]
    })
}
