// 測試當前API返回的實際數據
const today = new Date().toISOString().split('T')[0];

console.log('=== 詳細測試 API 數據結構 ===');
console.log('日期:', today);
console.log('當前時間:', new Date().toLocaleTimeString('zh-TW'));
console.log('');

async function testDetailedAPI() {
  try {
    const response = await fetch(
      `https://api.taiwanlottery.com/TLCAPIWeB/Lottery/BingoResult?openDate=${today}&pageNum=1&pageSize=5`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.rtCode === 0 && data.content) {
        console.log('總筆數:', data.content.totalSize);
        console.log('\n前5筆詳細資料：\n');
        
        data.content.bingoQueryResult.slice(0, 5).forEach((item, idx) => {
          console.log(`--- 第 ${idx + 1} 筆 ---`);
          console.log('drawTerm (完整):', item.drawTerm);
          console.log('drawTerm (字串):', String(item.drawTerm));
          console.log('取最後3位:', String(item.drawTerm).slice(-3));
          console.log('取最後4位:', String(item.drawTerm).slice(-4));
          console.log('dDate:', item.dDate);
          console.log('號碼數量:', item.bigShowOrder?.length);
          console.log('');
        });
      }
    }
  } catch (error) {
    console.log('錯誤:', error.message);
  }
}

testDetailedAPI();
