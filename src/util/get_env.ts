export const getEnvFunc = <Key extends string>() => {
    return getEnv<Key>
}

const getEnv = <Key extends string>(key: Key, defaultValue?: string): string => {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue === undefined) {
            throw new Error(`環境変数 ${key} が設定されていません`);
        }
        return defaultValue
    }

    return value;
}
