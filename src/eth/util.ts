export type PrettyData = {
    method: string
    parameters: string[]
}

export function prettyData(data: string): PrettyData {
    const method = data.slice(0, 10)

    const cleanedData = data

    const chunkSize = 64; // 32バイト = 64文字

    // 32バイトごとに分割
    const parameters: string[] = []
    for (let i = 10; i < cleanedData.length; i += chunkSize) {
        parameters.push(cleanedData.slice(i, i + chunkSize));
    }

    return {
        method,
        parameters
    }
}
