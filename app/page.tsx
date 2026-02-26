"use client"

import { useState, useEffect } from 'react';
import ParameterSettings from '@/components/ParameterSettings';
import AIAnalysis from '@/components/AIAnalysis';
import CostAnalysis from '@/components/CostAnalysis';
import TopNumbers from '@/components/TopNumbers';
import FrequencyChart from '@/components/FrequencyChart';
import NumberGrid from '@/components/NumberGrid';
import HistoryRecords from '@/components/HistoryRecords';
import PrizeChecker from '@/components/PrizeChecker';

interface BingoDrawResult {
  drawNumber: string;
  drawDate: string;
  drawTime?: string;
  numbers: number[];
}

interface AIRecommendation {
  bets: number[][];  // 多注号码
  numbers?: number[];  // 兼容旧格式
  reasoning: string;
}

export default function Home() {
  // 投注參數狀態
  const [stars, setStars] = useState<number>(3);
  const [multiple, setMultiple] = useState<number>(1);
  const [periods, setPeriods] = useState<number>(1);
  const [bets, setBets] = useState<number>(1);
  
  // 分析相關狀態
  const [analysisRange, setAnalysisRange] = useState<number>(10);
  const [historicalData, setHistoricalData] = useState<BingoDrawResult[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>('');

  // 初始化獲取歷史資料
  useEffect(() => {
    fetchHistoricalData();
  }, []);

  // 獲取歷史資料
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`/api/bingo-data?periods=202`);
      const result = await response.json();
      if (result.success) {
        setHistoricalData(result.data);
        setDataSource(result.source);
      }
    } catch (error) {
      console.error('獲取資料失敗:', error);
    }
  };

  // AI 分析處理
  const handleAIAnalysis = async (strategy: string) => {
    setLoading(true);
    try {
      // 计算频率
      const frequency = calculateFrequency();
      
      // 获取最冷门的15个号码（先找0次，不足15个则从冷门补齐）
      const zeroFreqNumbers = Object.entries(frequency)
        .filter(([, count]) => count === 0)
        .map(([num]) => parseInt(num));
      
      let coldest15: number[];
      if (zeroFreqNumbers.length < 15) {
        // 如果0次号码不足15个，从冷门号码补齐
        const sortedByFreq = Object.entries(frequency)
          .filter(([num]) => !zeroFreqNumbers.includes(parseInt(num)))
          .sort(([, a], [, b]) => a - b)
          .map(([num]) => parseInt(num));
        
        const needed = 15 - zeroFreqNumbers.length;
        const additionalCold = sortedByFreq.slice(0, needed);
        coldest15 = [...zeroFreqNumbers, ...additionalCold];
      } else {
        // 如果0次号码超过15个，只取前15个
        coldest15 = zeroFreqNumbers.slice(0, 15);
      }

      // 获取频率最低的两个区块的号码
      const lowestBlockNumbers = getLowestFrequencyBlockNumbers();

      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy,
          historicalData: historicalData.slice(0, analysisRange),
          stars,
          periods: analysisRange,
          bets,  // 传递注数参数
          coldestNumbers: coldest15,  // 传递最冷门的15个号码（含0次）
          lowestBlockNumbers  // 传递频率最低的两个区块的号码
        })
      });

      const result = await response.json();
      if (result.success) {
        setAiRecommendations(result.data);
      } else if (result.fallback) {
        setAiRecommendations(result.fallback);
      }
    } catch (error) {
      console.error('AI 分析失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 計算號碼頻率
  const calculateFrequency = () => {
    const frequency: { [key: number]: number } = {};
    for (let i = 1; i <= 80; i++) {
      frequency[i] = 0;
    }

    historicalData.slice(0, analysisRange).forEach(draw => {
      draw.numbers.forEach(num => {
        frequency[num]++;
      });
    });

    return frequency;
  };

  // 獲取頻率最低的兩個區塊的號碼
  const getLowestFrequencyBlockNumbers = () => {
    const frequency = calculateFrequency();
    const blocks: Array<{ range: string; numbers: number[]; totalFreq: number; hotCount: number }> = [];
    
    // 計算每個區塊（4個號碼一組）
    for (let i = 1; i <= 80; i += 4) {
      const blockNumbers = [i, i+1, i+2, i+3].filter(n => n <= 80);
      const totalFreq = blockNumbers.reduce((sum, n) => sum + (frequency[n] || 0), 0);
      
      // 計算區塊內熱門號碼數量（頻率高於平均值的號碼）
      const avgFreq = totalFreq / blockNumbers.length;
      const hotCount = blockNumbers.filter(n => frequency[n] >= avgFreq).length;
      
      blocks.push({
        range: `${i}-${Math.min(i + 3, 80)}`,
        numbers: blockNumbers,
        totalFreq,
        hotCount
      });
    }
    
    // 排序：先按總頻率，如果相同則按熱門號碼數量
    blocks.sort((a, b) => {
      if (a.totalFreq !== b.totalFreq) {
        return a.totalFreq - b.totalFreq;  // 頻率低的在前
      }
      return a.hotCount - b.hotCount;  // 熱門號碼少的在前
    });
    
    // 取最低的兩個區塊
    const lowestTwoBlocks = blocks.slice(0, 2);
    const excludedNumbers = lowestTwoBlocks.flatMap(block => block.numbers);
    
    console.log(`🎯 排除頻率最低的兩個區塊：`);
    lowestTwoBlocks.forEach(block => {
      console.log(`   ${block.range}: 總頻率=${block.totalFreq}, 熱門數=${block.hotCount}, 號碼=${block.numbers.join(',')}`);
    });
    
    return excludedNumbers;
  };

  // 獲取熱門/冷門號碼
  const getTopNumbers = (isHot: boolean) => {
    const frequency = calculateFrequency();
    const sorted = Object.entries(frequency)
      .sort(([, a], [, b]) => isHot ? b - a : a - b)
      .slice(0, 10);
    
    return sorted.map(([num, count]) => ({ number: parseInt(num), count }));
  };

  // 獲取圖表資料
  const getChartData = () => {
    const frequency = calculateFrequency();
    const data = [];
    
    for (let i = 1; i <= 80; i += 4) {
      const range = `${i}-${Math.min(i + 3, 80)}`;
      const total = [i, i+1, i+2, i+3]
        .filter(n => n <= 80)
        .reduce((sum, n) => sum + (frequency[n] || 0), 0);
      
      data.push({ range, frequency: total });
    }
    
    return data;
  };

  const hotNumbers = getTopNumbers(true);
  const coldNumbers = getTopNumbers(false);
  const chartData = getChartData();
  const frequency = calculateFrequency();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* 頁面標題 */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-2 sm:mb-3 md:mb-4 leading-tight tracking-tight">
            賓果 AI 預測
          </h1>
          {dataSource && (
            <div className="mt-2 sm:mt-3">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                資料來源：官方
              </span>
            </div>
          )}
        </header>

        {/* 1. 投注參數設定 */}
        <ParameterSettings
          stars={stars}
          setStars={setStars}
          multiple={multiple}
          setMultiple={setMultiple}
          periods={periods}
          setPeriods={setPeriods}
          bets={bets}
          setBets={setBets}
        />

        {/* 2. 成本與中獎分析 */}
        <CostAnalysis
          stars={stars}
          multiple={multiple}
          periods={periods}
          bets={bets}
        />

        {/* 3. AI 智慧分析 */}
        <AIAnalysis
          analysisRange={analysisRange}
          setAnalysisRange={setAnalysisRange}
          loading={loading}
          handleAIAnalysis={handleAIAnalysis}
          aiRecommendations={aiRecommendations}
          stars={stars}
          bets={bets}
        />

        {/* 4. 兌獎系統 */}
        <PrizeChecker
          latestDraw={historicalData.length > 0 ? {
            period: parseInt(historicalData[0].drawNumber),
            date: `${historicalData[0].drawDate} ${historicalData[0].drawTime || ''}`.trim(),
            numbers: historicalData[0].numbers
          } : null}
          multiple={multiple}
        />

        {/* 5. 熱門/冷門排行榜 */}
        <TopNumbers
          hotNumbers={hotNumbers}
          coldNumbers={coldNumbers}
        />

        {/* 6. 頻率分析圖表 */}
        <FrequencyChart
          chartData={chartData}
          analysisRange={analysisRange}
        />

        {/* 7. 號碼球全覽 */}
        <NumberGrid
          analysisRange={analysisRange}
          frequency={frequency}
          aiRecommendations={aiRecommendations}
        />

        {/* 8. 歷史開獎記錄 */}
        <HistoryRecords
          historicalData={historicalData}
          aiRecommendations={aiRecommendations}
          displayCount={20}
        />

        {/* 頁尾 */}
        <footer className="text-center text-gray-400 text-xs sm:text-sm py-6 sm:py-8 border-t border-slate-700/50 px-4 mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              本系統僅供娛樂參考，不構成投資建議
            </p>
            <span className="hidden sm:inline text-slate-600">|</span>
            <p>理性購彩，適度遊戲</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
