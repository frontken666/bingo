// 完整測試 API 數據，找出規律
const today = new Date().toISOString().split('T')[0];

console.log('=== 完整分析 drawTerm 規律 ===');
console.log('日期:', today);
console.log('');

async function analyzeDrawTerm() {
  try {
    const response = await fetch(
      `https://api.taiwanlottery.com/TLCAPIWeB/Lottery/BingoResult?openDate=${today}&pageNum=1&pageSize=100`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.rtCode === 0 && data.content) {
        const results = data.content.bingoQueryResult;
        console.log('總筆數:', results.length);
        console.log('');
        
        // 查看前10筆和後10筆
        console.log('=== 前 10 筆（最新） ===');
        results.slice(0, 10).forEach((item, idx) => {
          const term = String(item.drawTerm);
          console.log(`${idx}: drawTerm=${term}, 後3位=${term.slice(-3)}, 後4位=${term.slice(-4)}`);
        });
        
        console.log('\n=== 後 10 筆（最舊） ===');
        results.slice(-10).forEach((item, idx) => {
          const term = String(item.drawTerm);
          const actualIdx = results.length - 10 + idx;
          console.log(`${actualIdx}: drawTerm=${term}, 後3位=${term.slice(-3)}, 後4位=${term.slice(-4)}`);
        });
        
        // 計算差值
        const first = parseInt(String(results[0].drawTerm).slice(-4));
        const last = parseInt(String(results[results.length - 1].drawTerm).slice(-4));
        console.log('\n=== 分析 ===');
        console.log('第一筆後4位:', first);
        console.log('最後一筆後4位:', last);
        console.log('差值:', first - last);
        console.log('實際筆數:', results.length);
      }
    }
  } catch (error) {
    console.log('錯誤:', error.message);
  }
}

analyzeDrawTerm();
