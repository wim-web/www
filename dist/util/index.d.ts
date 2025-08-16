declare const getEnvFunc: <Key extends string>() => (key: Key, defaultValue?: string) => string;

export { getEnvFunc };
