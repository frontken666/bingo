// 測試台灣彩券 API
const today = new Date().toISOString().split('T')[0];

console.log('=== 測試台灣彩券賓果 API ===');
console.log('日期:', today);
console.log('');

// 測試不同的 API endpoint
const endpoints = [
  `https://api.taiwanlottery.com/TLCAPIWeB/Lottery/BingoResult?openDate=${today}&pageNum=1&pageSize=10`,
  `https://www.taiwanlottery.com/api/Lottery/BingoResult?openDate=${today}`,
  `https://www.taiwanlottery.com.tw/Lotto/Bingo/history.aspx`,
];

async function testAPI(url) {
  console.log(`\n測試: ${url}`);
  console.log('─'.repeat(80));
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/html',
      }
    });
    
    console.log('狀態碼:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        console.log('數據類型:', typeof data);
        console.log('是否為陣列:', Array.isArray(data));
        console.log('數據結構:', JSON.stringify(data, null, 2).substring(0, 500));
      } else {
        const text = await response.text();
        console.log('HTML/文本長度:', text.length);
        console.log('前 200 字元:', text.substring(0, 200));
      }
    } else {
      console.log('請求失敗:', response.statusText);
    }
  } catch (error) {
    console.log('錯誤:', error.message);
  }
}

async function main() {
  for (const endpoint of endpoints) {
    await testAPI(endpoint);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 延遲 1 秒
  }
  
  console.log('\n=== 測試完成 ===');
}

main();
