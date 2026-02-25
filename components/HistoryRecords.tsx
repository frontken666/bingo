"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

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

interface HistoryRecordsProps {
  historicalData: BingoDrawResult[];
  aiRecommendations: AIRecommendation | null;
  displayCount?: number;
}

export default function HistoryRecords({ 
  historicalData, 
  aiRecommendations,
  displayCount = 20 
}: HistoryRecordsProps) {
  const [showCount, setShowCount] = useState(displayCount);
  
  // 获取今天的日期
  const today = new Date().toISOString().split('T')[0];
  
  // 只顯示今天的開獎記錄
  const allTodayRecords = historicalData.filter(draw => 
    draw.drawDate === today
  );
  
  const todayRecords = allTodayRecords.slice(0, showCount);
  
  // 获取所有推荐的号码（合并所有注）
  const allRecommendedNumbers = (() => {
    if (!aiRecommendations) return [];
    if (aiRecommendations.bets) {
      return Array.from(new Set(aiRecommendations.bets.flat()));
    }
    return aiRecommendations.numbers || [];
  })();
  
  // 載入更多
  const handleLoadMore = () => {
    setShowCount(prev => Math.min(prev + 20, allTodayRecords.length));
  };

  // 計算今天還有幾期未開獎
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const totalMinutesFromStart = (currentHour * 60 + currentMinute) - (7 * 60 + 5); // 從 07:05 開始
  const expectedDraws = Math.floor(totalMinutesFromStart / 5) + 1; // 已開獎期數
  const totalDrawsPerDay = 202; // 一天總期數

  return (
    <Card className="shadow-2xl border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-100 font-bold">
              今日開獎記錄
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 bg-slate-800/50 px-3 sm:px-4 py-2 rounded-lg shadow-sm flex-shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-mono">{today}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3 md:space-y-3.5">
          {todayRecords.length > 0 ? (
            todayRecords.map((draw, idx) => {
              const matchedCount = allRecommendedNumbers.length > 0
                ? draw.numbers.filter(n => allRecommendedNumbers.includes(n)).length 
                : 0;

              return (
                <div 
                  key={idx} 
                  className="p-3 sm:p-4 md:p-5 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {/* 期號、日期、時間資訊 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      {/* 期號 */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">期號</span>
                        <span className="text-sm text-gray-300 bg-slate-700/50 px-2.5 py-1 rounded font-mono">                          第 {draw.drawNumber} 期
                        </span>
                      </div>
                      
                      {/* 日期 */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">日期</span>
                        <span className="text-sm text-gray-300 bg-slate-700/50 px-2.5 py-1 rounded font-mono">
                          {draw.drawDate}
                        </span>
                      </div>
                      
                      {/* 時間 */}
                      {draw.drawTime && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">時間</span>
                          <span className="text-sm text-gray-300 bg-slate-700/50 px-2.5 py-1 rounded font-mono shadow-sm">
                            {draw.drawTime}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* 匹配標示 */}
                    {matchedCount > 0 && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm bg-purple-900/30 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-700/50 shadow-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">命中 {matchedCount} 個</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 號碼球 */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {draw.numbers.map((num, numIdx) => {
                      const isRecommended = allRecommendedNumbers.includes(num);
                      return (
                        <div
                          key={numIdx}
                          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full font-bold flex items-center justify-center text-sm sm:text-base transition-all hover:scale-110 shadow-sm ${
                            isRecommended
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white ring-2 sm:ring-3 ring-purple-400/50 shadow-lg shadow-purple-500/30'
                              : 'bg-slate-700 text-gray-200 border-2 border-slate-600 hover:border-slate-500'
                          }`}
                          title={isRecommended ? `${num} (AI推薦)` : num.toString()}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 sm:py-12 text-gray-400">
              <Calendar className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 opacity-40" />
              <p className="text-base sm:text-lg font-medium">今日尚無開獎記錄</p>
              <p className="text-xs sm:text-sm mt-2 text-gray-500">首期開獎時間：07:05</p>
            </div>
          )}
        </div>

        {/* 載入更多按鈕（如果有更多記錄） */}
        {showCount < allTodayRecords.length && (
          <div className="mt-5 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLoadMore}
              className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:border-slate-500 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base font-medium transition-all shadow-sm hover:shadow-md"
            >
              載入更多記錄 
              <span className="ml-2 text-purple-400 font-bold">
                ({allTodayRecords.length - showCount} 期未顯示)
              </span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
