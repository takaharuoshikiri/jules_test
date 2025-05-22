# カロリー計算アプリ (Calorie Calculator App)

簡易的なカロリー計算アプリです。食べ物とそのカロリーを記録し、合計カロリーを計算することができます。

## 機能

- 食べ物とカロリーの入力
- 記録された食べ物リストの表示
- 合計カロリーの自動計算
- 記録された食べ物の削除機能

## ファイル構成

- `index.html`: アプリケーションのメインHTMLファイル
- `style.css`: アプリケーションのスタイリング用CSSファイル
- `script.js`: アプリケーションの動作ロジックを記述したJavaScriptファイル
- `test.html`: JavaScriptのロジックをテストするためのユニットテストファイル
- `app.py`: Python Flask backend server
- `requirements.txt`: Python dependencies

## 使用方法

1.  リポジトリをクローンまたはダウンロードします。
2.  `index.html` ファイルをウェブブラウザで開きます。
3.  「食べ物」入力フィールドに食べ物の名前を入力します。
4.  「カロリー」入力フィールドにその食べ物のカロリー数を入力します。
5.  「追加」ボタンをクリックすると、食べ物がリストに追加され、合計カロリーが更新されます。
6.  リスト内の各項目の隣にある「削除」ボタンをクリックすると、その項目を削除できます。

## テストの実行方法

1.  `test.html` ファイルをウェブブラウザで開きます。
2.  ブラウザ上にテスト結果が表示されます。各テストケースがPASSしたかFAILしたかを確認できます。

## 技術スタック

- HTML
- CSS
- JavaScript (ES6)
- Python (Flask)
- Google Gemini API

## Backend Setup and Usage

### 1. Install Dependencies
Install the required Python packages using pip:
```bash
pip install -r requirements.txt
```

### 2. Set API Key
Set your Gemini API key as an environment variable named `GEMINI_API_KEY`. For example, in bash:
```bash
export GEMINI_API_KEY='YOUR_API_KEY'
```
Replace `YOUR_API_KEY` with your actual Gemini API key.

### 3. Run the Backend Server
Run the Flask backend server using:
```bash
python app.py
```
The server will start by default on `http://127.0.0.1:5000`. The frontend application expects to communicate with the backend at the `/api/getMenuSuggestions` endpoint (i.e., `http://127.0.0.1:5000/api/getMenuSuggestions`).
