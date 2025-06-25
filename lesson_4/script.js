// script.js

// 定数としてじゃんけんの手を定義（数値と絵文字）
const HANDS = [
    { name: 'グー', emoji: '✊' },     // 0: ROCK
    { name: 'チョキ', emoji: '✌️' }, // 1: SCISSORS
    { name: 'パー', emoji: '🖐️' }      // 2: PAPER
];

// 結果メッセージ
const RESULTS = {
    WIN: 'あなたの勝ち！🎉',
    LOSE: 'あなたの負け...😢',
    DRAW: 'あいこ！🤝'
};

// HTML要素を取得
const playerHandElement = document.getElementById('player-hand');
const computerHandElement = document.getElementById('computer-hand');
const resultElement = document.getElementById('result');
const rockButton = document.getElementById('btn-rock');
const scissorsButton = document.getElementById('btn-scissors');
const paperButton = document.getElementById('btn-paper');

// じゃんけんを実行し結果を表示する関数
function playGame(playerChoiceIndex) {
    // プレイヤーの手を表示
    playerHandElement.textContent = HANDS[playerChoiceIndex].emoji;
    playerHandElement.setAttribute('aria-label', `あなたの手: ${HANDS[playerChoiceIndex].name}`);

    // コンピューターの手をランダムに決定 (0, 1, 2 のいずれか)
    const computerChoiceIndex = Math.floor(Math.random() * 3);
    computerHandElement.textContent = HANDS[computerChoiceIndex].emoji;
    computerHandElement.setAttribute('aria-label', `コンピューターの手: ${HANDS[computerChoiceIndex].name}`);

    // 勝敗判定
    let resultText = '';



    // TODO: 課題
    // ここから先を実装してください
    // どういう手の組み合わせがあるか考えることが必要そう・・・
    // プレイヤーが勝つ場合の文章はRESULTS.WIN
    // プレイヤーが負ける場合の文章はRESULTS.LOSE
    // playerChoiceIndexが0のとき =「プレイヤーの手がグー」
    // computerChoiceIndexが2のとき =「コンピューターの手がパー」


    // プレイヤーが勝つ場合
    if (
        (playerChoiceIndex === 0 && computerChoiceIndex === 1) || // グー vs チョキ
        (playerChoiceIndex === 1 && computerChoiceIndex === 2) || // チョキ vs パー
        (playerChoiceIndex === 2 && computerChoiceIndex === 0)    // パー vs グー
    ) {
        resultText = RESULTS.WIN;
    }
    // プレイヤーが負ける場合
    else if (
        (playerChoiceIndex === 0 && computerChoiceIndex === 2) || // グー vs パー
        (playerChoiceIndex === 1 && computerChoiceIndex === 0) || // チョキ vs グー
        (playerChoiceIndex === 2 && computerChoiceIndex === 1)    // パー vs チョキ
    ) {
        resultText = RESULTS.LOSE;
    }
    // あいこの場合は既存のロジックで処理
    else if (playerChoiceIndex === computerChoiceIndex) {
        resultText = RESULTS.DRAW;
    }



    // ここまで

    // あいこ
    // プレイヤーの手(playerChoiceIndex)とコンピューターの手(computerChoiceIndex)が同じ場合
    if (playerChoiceIndex === computerChoiceIndex) {
        // 結果のテキストにあいこの場合の文章を代入
        resultText = RESULTS.DRAW;
    }

    // 結果を表示
    resultElement.textContent = resultText;
}

// ボタンにイベントリスナーを設定
// defer属性によりDOM読み込み後に実行されるため、DOMContentLoadedを待つ必要はない
if (rockButton && scissorsButton && paperButton) {
    rockButton.addEventListener('click', () => playGame(0)); // グー (index: 0)
    scissorsButton.addEventListener('click', () => playGame(1)); // チョキ (index: 1)
    paperButton.addEventListener('click', () => playGame(2)); // パー (index: 2)
} else {
    console.error("ボタン要素が見つかりません。HTMLのIDを確認してください。");
}
