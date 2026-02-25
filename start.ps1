# PowerShell script to start the Taiwan Bingo AI prediction app

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  台湾彩券宾果 AI 预测分析系统" -ForegroundColor Green
Write-Host "  Taiwan Bingo AI Prediction System" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-Not (Test-Path ".env.local")) {
    Write-Host "警告: 未找到 .env.local 文件!" -ForegroundColor Yellow
    Write-Host "请创建 .env.local 文件并配置 GROQ_API_KEY" -ForegroundColor Yellow
    Write-Host ""
}

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "正在安装依赖..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Get local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress

Write-Host "正在启动开发服务器..." -ForegroundColor Green
Write-Host ""
Write-Host "服务器启动后，可通过以下地址访问:" -ForegroundColor Cyan
Write-Host "  本机访问: http://localhost:3000" -ForegroundColor White
if ($localIP) {
    Write-Host "  局域网访问: http://${localIP}:3000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "其他设备请确保:" -ForegroundColor Magenta
    Write-Host "  1. 连接到同一个 WiFi/局域网" -ForegroundColor Gray
    Write-Host "  2. 防火墙允许 3000 端口" -ForegroundColor Gray
}
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

# Start the dev server
npm run dev
