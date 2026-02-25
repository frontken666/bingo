# 台灣彩券賓果 AI 預測分析系統

一個基於 Next.js 的台灣彩券賓果 AI 智慧預測系統，整合 Groq AI 進行號碼分析。

## 🚀 快速開始

### 本地開發

1. 安裝依賴：
```bash
npm install
```

2. 創建 `.env.local` 文件並配置環境變量：
```env
GROQ_API_KEY=your_groq_api_key_here
```

3. 啟動開發服務器：
```bash
npm run dev
```

4. 在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)

## 🌐 部署到 Vercel

### 方法一：通過 Vercel CLI（推薦）

1. 安裝 Vercel CLI：
```bash
npm install -g vercel
```

2. 在項目根目錄執行：
```bash
vercel
```

3. 跟隨提示完成部署，並在 Vercel Dashboard 設置環境變量：
   - `GROQ_API_KEY`: 你的 Groq API 密鑰

### 方法二：通過 Vercel Dashboard

1. 訪問 [vercel.com](https://vercel.com) 並登錄
2. 點擊 "Add New" → "Project"
3. 導入你的 GitHub 倉庫
4. 配置環境變量：
   - 添加 `GROQ_API_KEY`
5. 點擊 "Deploy"

## 🔑 獲取 Groq API Key

1. 訪問 [console.groq.com](https://console.groq.com)
2. 註冊/登錄賬號
3. 在 API Keys 頁面創建新的 API Key
4. 複製密鑰並添加到環境變量

## ✨ 主要功能

- 📊 投注參數設定（星數、倍數、期數、注數）
- 💰 成本與中獎分析
- 🤖 AI 智慧號碼推薦（多策略支持）
- 📈 號碼頻率分析與圖表
- 🎯 熱門/冷門號碼排行
- 📅 今日開獎記錄查詢
- 📱 完整響應式設計（支持手機、平板、桌面）

## 🛠 技術棧

- **框架**: Next.js 14
- **UI**: Shadcn UI + Tailwind CSS
- **AI**: Groq SDK (llama-3.3-70b-versatile)
- **圖表**: Recharts
- **語言**: TypeScript

## 📱 遠程訪問

開發服務器配置為監聽所有網絡接口（0.0.0.0），可以從局域網內的其他設備訪問：

```bash
npm run dev
# 訪問 http://your-local-ip:3000
```

## ⚠️ 注意事項

- 本系統僅供娛樂參考，不構成投資建議
- 請理性購彩，適度遊戲
- API Key 請妥善保管，不要提交到公開倉庫

## 📄 許可證

MIT
