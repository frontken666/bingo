import { NextResponse } from 'next/server';

export interface BingoDrawResult {
  drawNumber: string;
  drawDate: string;
  drawTime: string;
  numbers: number[];
}

// 方案1：嘗試官方 API
async function fetchFromOfficialAPI(date: string): Promise<BingoDrawResult[]> {
  try {
    console.log('嘗試官方 API:', date);
    
    const response = await fetch(
      `https://api.taiwanlottery.com/TLCAPIWeB/Lottery/BingoResult?openDate=${date}&pageNum=1&pageSize=202`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }
      }
    );
    
    console.log('官方 API 響應狀態:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('官方 API 數據類型:', typeof data);
      console.log('rtCode:', data.rtCode);
      
      // 官方 API 返回格式: { rtCode: 0, content: { totalSize: N, bingoQueryResult: [...] } }
      if (data.rtCode === 0 && data.content && Array.isArray(data.content.bingoQueryResult)) {
        const results = data.content.bingoQueryResult;
        console.log('✓ 官方 API 成功，獲得 ', results.length, ' 筆資料');
        
        if (results.length === 0) {
          return [];
        }
        
        // 找出今天的期號範圍
        // drawTerm 後4位是今年累計期號，我們需要找出今天開始的那一期
        
        // 方法：假設 API 按時間倒序返回，最後一筆就是今天第一期
        // 取得今天第一期的年度累計期號
        const todayFirstYearlyPeriod = parseInt(String(results[results.length - 1].drawTerm).slice(-4));
        
        console.log(`今天第一期的年度累計期號: ${todayFirstYearlyPeriod}`);
        console.log(`今天已開獎: ${results.length} 期`);
        
        // API 返回順序：從最新到最舊
        return results.map((item: any, index: number) => {
          // 從 drawTerm 取得今年累計期號
          const yearlyPeriodNum = parseInt(String(item.drawTerm).slice(-4));
          
          // 計算今天的期號：年度累計期號 - 今天第一期年度期號 + 1
          const todayPeriodNum = yearlyPeriodNum - todayFirstYearlyPeriod + 1;
          const drawNumber = String(todayPeriodNum).padStart(3, '0');
          
          // bigShowOrder 是號碼陣列
          const numbers = item.bigShowOrder
            .map((n: string) => parseInt(n))
            .filter((n: number) => !isNaN(n) && n >= 1 && n <= 80);
          
          // 計算開獎時間：第1期是07:05，每期加5分鐘
          const totalMinutesFromMidnight = 7 * 60 + 5 + (todayPeriodNum - 1) * 5;
          const drawHour = Math.floor(totalMinutesFromMidnight / 60);
          const drawMin = totalMinutesFromMidnight % 60;
          
          const drawTime = drawHour <= 23 
            ? `${String(drawHour).padStart(2, '0')}:${String(drawMin).padStart(2, '0')}`
            : '23:55';
          
          return {
            drawNumber: drawNumber,
            drawDate: date,
            drawTime: drawTime,
            numbers: numbers
          };
        }).filter((r: BingoDrawResult) => r.numbers.length === 20);
      } else {
        console.log('官方 API 返回格式不符預期');
        console.log('data.content:', data.content ? 'exists' : 'missing');
      }
    }
  } catch (error) {
    console.error('官方 API 失敗:', error);
  }
  return [];
}

// 方案2：備用 - 可以添加其他數據源
async function fetchFromBackupSource(date: string): Promise<BingoDrawResult[]> {
  // 預留給其他數據源
  // 如果需要網頁爬蟲，可以使用其他方法或升級 Node.js 版本
  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedPeriods = parseInt(searchParams.get('periods') || '50');
  const today = new Date().toISOString().split('T')[0];
  
  let results: BingoDrawResult[] = [];
  let source = 'unknown';
  
  console.log('=== 開始獲取賓果數據 ===');
  console.log('請求日期:', today);
  console.log('請求期數:', requestedPeriods);
  
  // 嘗試官方 API
  results = await fetchFromOfficialAPI(today);
  if (results.length > 0) {
    source = 'official-api';
    console.log('✓ 官方 API 成功');
  } else {
    // 如果 API 失敗，嘗試備用來源
    results = await fetchFromBackupSource(today);
    if (results.length > 0) {
      source = 'backup';
      console.log('✓ 備用來源成功');
    } else {
      console.log('⚠ 無法獲取數據');
      source = 'none';
    }
  }
  
  console.log('最終數據筆數:', results.length);
  console.log('數據來源:', source);
  console.log('=== 數據獲取完成 ===\n');
  
  // 只返回請求的期數
  const limitedResults = results.slice(0, requestedPeriods);
  
  return NextResponse.json({
    success: results.length > 0,
    data: limitedResults,
    source: source,
    totalToday: results.length,
    message: results.length === 0 ? '無法獲取開獎數據，請稍後再試' : undefined,
    debug: {
      requestedPeriods,
      returnedPeriods: limitedResults.length,
      totalAvailable: results.length
    }
  });
}
