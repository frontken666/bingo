# Vercel 部署指南

## 🚀 部署步驟

### 準備工作

1. **確保你的代碼已推送到 GitHub**
   ```bash
   git add .
   git commit -m "準備部署到 Vercel"
   git push origin main
   ```

2. **獲取 Groq API Key**
   - 訪問：https://console.groq.com
   - 註冊並創建 API Key

---

## 方法一：使用 Vercel CLI（推薦）

### 1. 安裝 Vercel CLI

```powershell
npm install -g vercel
```

### 2. 登錄 Vercel

```powershell
vercel login
```

### 3. 部署項目

在項目根目錄執行：

```powershell
vercel
```

第一次部署會詢問：
- `Set up and deploy "~/Desktop/Project/build_site"?` → 輸入 `Y`
- `Which scope do you want to deploy to?` → 選擇你的帳號
- `Link to existing project?` → 輸入 `N`
- `What's your project's name?` → 輸入項目名稱（例如：`taiwan-bingo-ai`）
- `In which directory is your code located?` → 直接按 Enter（使用當前目錄）

### 4. 設置環境變量

部署完成後，在 Vercel Dashboard 設置環境變量：

```bash
vercel env add GROQ_API_KEY
```

輸入你的 Groq API Key，選擇環境（Production, Preview, Development）。

### 5. 重新部署

設置環境變量後，重新部署：

```powershell
vercel --prod
```

---

## 方法二：使用 Vercel Dashboard（簡單）

### 1. 訪問 Vercel

打開 https://vercel.com 並登錄（可以使用 GitHub 賬號）

### 2. 導入項目

1. 點擊 **"Add New"** → **"Project"**
2. 選擇 **"Import Git Repository"**
3. 授權 Vercel 訪問你的 GitHub
4. 選擇 `build_site` 倉庫

### 3. 配置項目

1. **Project Name**: 輸入項目名稱
2. **Framework Preset**: 自動檢測為 Next.js
3. **Root Directory**: 保持默認（./）
4. **Build and Output Settings**: 保持默認

### 4. 添加環境變量

在 "Environment Variables" 部分：

| Name | Value |
|------|-------|
| `GROQ_API_KEY` | `your_groq_api_key_here` |

### 5. 部署

點擊 **"Deploy"** 按鈕，等待部署完成（通常需要 2-3 分鐘）

---

## 🎉 部署完成！

部署成功後，你會獲得：

- 🌐 **生產環境 URL**: `https://your-project.vercel.app`
- 🔄 **自動部署**: 每次 git push 都會自動重新部署
- 📊 **部署日誌**: 可在 Dashboard 查看

---

## 🔧 更新部署

### 自動更新（推薦）

只需推送代碼到 GitHub：

```bash
git add .
git commit -m "更新功能"
git push origin main
```

Vercel 會自動檢測並重新部署。

### 手動更新

使用 CLI：

```powershell
vercel --prod
```

---

## 🌐 自定義域名（可選）

在 Vercel Dashboard 的項目設置中：

1. 進入 **"Domains"** 標籤
2. 點擊 **"Add"**
3. 輸入你的域名
4. 按照指引配置 DNS

---

## ⚙️ 環境變量管理

### 查看環境變量

```powershell
vercel env ls
```

### 添加環境變量

```powershell
vercel env add VARIABLE_NAME
```

### 刪除環境變量

```powershell
vercel env rm VARIABLE_NAME production
```

---

## 🐛 常見問題

### 1. API Routes 返回 404

**原因**: 環境變量未設置或 Next.js 配置錯誤

**解決**: 確保在 Vercel Dashboard 設置了 `GROQ_API_KEY`

### 2. 部署失敗

**原因**: 依賴安裝失敗或構建錯誤

**解決**: 
- 檢查 `package.json` 依賴
- 查看 Vercel 部署日誌
- 本地測試 `npm run build`

### 3. 環境變量不生效

**原因**: 環境變量更新後需要重新部署

**解決**: 執行 `vercel --prod` 重新部署

---

## 📊 監控和日誌

在 Vercel Dashboard 可以查看：

- **部署狀態**: 成功/失敗/進行中
- **構建日誌**: 詳細的構建過程
- **運行時日誌**: API 調用和錯誤信息
- **性能分析**: 頁面加載速度

---

## 💰 費用說明

Vercel 免費套餐包括：

- ✅ 無限部署
- ✅ 100GB 帶寬/月
- ✅ 自動 HTTPS
- ✅ 全球 CDN
- ✅ 環境變量

**足夠個人項目使用！**

---

## 📞 需要幫助？

- Vercel 文檔: https://vercel.com/docs
- Next.js 文檔: https://nextjs.org/docs
- Vercel 社區: https://github.com/vercel/vercel/discussions
