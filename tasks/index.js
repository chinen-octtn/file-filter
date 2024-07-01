// ライブラリ・モジュールをインポート
const fs = require("fs").promises;
const path = require("path");

// 参照ディレクトリのパス
const INPUT_DIR = "./input";
// 出力ディレクトリのパス
const OUTPUT_DIR = "./output";
// 抽出対象のファイル名
const IMAGE_FILES = ["sample.jpg", "aa.png"];

// 出力ディレクトリ内を空にする関数
const clearOutputDir = async () => {
  try {
    // 出力ディレクトリ内のファイル一覧を取得
    const files = await fs.readdir(OUTPUT_DIR);
    // ファイルを順に削除
    await Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(OUTPUT_DIR, fileName);
        await fs.unlink(filePath);
      })
    );
    console.log(`出力ディレクトリ内のファイルをすべて削除しました`);
  } catch (error) {
    console.error(
      `出力ディレクトリのクリア中にエラーが発生しました: ${error.message}`
    );
  }
};

// ファイルを移動する関数
const moveFile = async (fileName) => {
  const inputPath = path.join(INPUT_DIR, fileName);
  const outputPath = path.join(OUTPUT_DIR, fileName);

  try {
    await fs.copyFile(inputPath, outputPath);
    console.log(`ファイル移動完了: ${outputPath}`);
  } catch (error) {
    console.error(`ファイル移動エラー: ${error.message}`);
  }
};

// 参照ディレクトリ内の対象ファイルを抽出して出力ディレクトリにコピーする関数
const moveTask = async () => {
  try {
    // 参照ディレクトリ内のファイル一覧を取得
    const files = await fs.readdir(INPUT_DIR);
    // 処理対象のファイルのみをフィルタリング
    const imageFiles = files.filter((fileName) => IMAGE_FILES.includes(fileName));

    // 対象ファイルを出力ディレクトリに移動
    await Promise.all(
      imageFiles.map(async (fileName) => {
        await moveFile(fileName);
      })
    );
  } catch (error) {
    console.error(`ファイル移動処理中にエラーが発生しました: ${error.message}`);
  }
}


// 出力ディレクトリをクリア後、処理を実行
const run = async () => {
  await clearOutputDir();
  await moveTask();
};

// 処理を実行し、エラーがあればコンソールに出力
run().catch(console.error);
