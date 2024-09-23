import { Logger } from 'winston';

declare const noneLogger: () => Logger;
declare const defaultLogger: (level: string) => Logger;

export { defaultLogger, noneLogger };
