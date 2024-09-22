import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomBytes } from 'crypto';

export function createTempFile(data: string = ''): string {
    // OSの一時ディレクトリを取得
    const tempDir = os.tmpdir();

    // ランダムなバイト列を16進数の文字列に変換
    const randomName = randomBytes(8).toString('hex');

    // 一時ファイル名を生成（ランダムな名前を使用）
    const tempFileName = `${randomName}`;

    // 一時ファイルのフルパスを生成
    const tempFilePath = path.join(tempDir, tempFileName);

    // ファイルにデータを書き込む
    fs.writeFileSync(tempFilePath, data, 'utf-8');

    return tempFilePath; // 作成した一時ファイルのパスを返す
}
