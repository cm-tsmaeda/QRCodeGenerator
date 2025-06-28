// DOM要素の取得
const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrCanvas = document.getElementById('qr-canvas');
const placeholder = document.getElementById('placeholder');
const qrContainer = document.getElementById('qr-container');

// QRコードインスタンス
let qrCodeInstance = null;
let debounceTimer = null;

// リアルタイムQRコード生成関数（デバウンス付き）
function generateQRCodeRealtime() {
    const text = textInput.value.trim();

    // 空のテキストの場合はプレースホルダーを表示
    if (!text) {
        showPlaceholder();
        return;
    }

    try {
        // 既存のQRコードをクリア
        if (qrCodeInstance) {
            qrCodeInstance.clear();
        }

        // QRコードのオプション設定
        const options = {
            text: text,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        };

        // プレースホルダーを非表示にしてコンテナをクリア
        placeholder.style.display = 'none';
        qrContainer.innerHTML = '';

        // 新しいQRコードを生成
        qrCodeInstance = new QRCode(qrContainer, options);

        // ダウンロードボタンを表示
        downloadBtn.style.display = 'inline-block';

        console.log('QRコードがリアルタイムで生成されました');

    } catch (error) {
        console.error('QRコード生成エラー:', error);
        // エラー時はプレースホルダーを再表示
        showPlaceholder();
    }
}

// デバウンス付きリアルタイム生成
function debouncedGenerateQRCode() {
    // 既存のタイマーをクリア
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    // テキストがある場合は軽いローディング表示
    const text = textInput.value.trim();
    if (text) {
        // 軽いローディング表示（点滅効果）
        qrContainer.style.opacity = '0.7';
    }

    // 500ms後に実行（入力が止まったら生成）
    debounceTimer = setTimeout(() => {
        generateQRCodeRealtime();
        // 生成後に透明度を戻す
        qrContainer.style.opacity = '1';
    }, 500);
}

// QRコード生成関数
function generateQRCode() {
    const text = textInput.value.trim();

    // テキストが空の場合は警告
    if (!text) {
        alert('QRコードに変換するテキストを入力してください。');
        return;
    }

    try {
        // ローディング表示
        showLoading();

        // 既存のQRコードをクリア
        if (qrCodeInstance) {
            qrCodeInstance.clear();
        }

        // QRコードのオプション設定
        const options = {
            text: text,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        };

        // プレースホルダーを非表示にしてコンテナをクリア
        placeholder.style.display = 'none';
        qrContainer.innerHTML = '';

        // 新しいQRコードを生成
        qrCodeInstance = new QRCode(qrContainer, options);

        // ダウンロードボタンを表示
        downloadBtn.style.display = 'inline-block';

        console.log('QRコードが正常に生成されました');

    } catch (error) {
        console.error('QRコード生成エラー:', error);
        alert('QRコードの生成に失敗しました。テキストの内容を確認してください。');

        // エラー時はプレースホルダーを再表示
        showPlaceholder();
    }
}

// ローディング表示
function showLoading() {
    qrContainer.innerHTML = '<div class="loading"></div>';
}

// プレースホルダー再表示
function showPlaceholder() {
    qrContainer.innerHTML = `
        <div id="placeholder" class="placeholder">
            <p>左のテキストエリアに内容を入力すると<br>リアルタイムでQRコードが生成されます</p>
        </div>
    `;
    downloadBtn.style.display = 'none';
    qrCodeInstance = null;
}

// 画像ダウンロード関数
function downloadQRCode() {
    try {
        // QRコードが生成されているかチェック
        if (!qrCodeInstance) {
            alert('まずQRコードを生成してください。');
            return;
        }

        // qrcode.jsライブラリが生成したCanvas要素を取得
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) {
            alert('Canvas要素が見つかりません。');
            return;
        }

        // CanvasからデータURLを取得
        const dataURL = canvas.toDataURL('image/png');

        // ダウンロード用のリンクを作成
        const link = document.createElement('a');
        link.download = `qrcode_${new Date().getTime()}.png`;
        link.href = dataURL;

        // ダウンロードを実行
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('QRコード画像がダウンロードされました');

    } catch (error) {
        console.error('ダウンロードエラー:', error);
        alert('画像のダウンロードに失敗しました。');
    }
}

// イベントリスナーの設定
generateBtn.addEventListener('click', generateQRCode);
downloadBtn.addEventListener('click', downloadQRCode);

// リアルタイムQRコード生成（テキスト入力時）
textInput.addEventListener('input', debouncedGenerateQRCode);

// Enterキーでの生成（Ctrl+EnterまたはCmd+Enter）
textInput.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        generateQRCode();
    }
});

// テキスト入力時のリアルタイム文字数表示（オプション）
textInput.addEventListener('input', () => {
    const length = textInput.value.length;
    if (length > 1000) {
        console.warn('テキストが長すぎる可能性があります:', length, '文字');
    }
});

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    console.log('QRコードジェネレーターが初期化されました');

    // フォーカスをテキストエリアに設定
    textInput.focus();
});
