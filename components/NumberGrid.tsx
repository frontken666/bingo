"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AIRecommendation {
  bets: number[][];  // 多注号码
  numbers?: number[];  // 兼容旧格式
  reasoning: string;
}

interface NumberGridProps {
  analysisRange: number;
  frequency: { [key: number]: number };
  aiRecommendations: AIRecommendation | null;
}

export default function NumberGrid({ 
  analysisRange, 
  frequency, 
  aiRecommendations 
}: NumberGridProps) {
  const maxCount = Math.max(...Object.values(frequency));
  
  // 获取所有推荐的号码（合并所有注）
  const allRecommendedNumbers = (() => {
    if (!aiRecommendations) return [];
    if (aiRecommendations.bets) {
      return Array.from(new Set(aiRecommendations.bets.flat()));
    }
    return aiRecommendations.numbers || [];
  })();

  return (
    <Card className="shadow-2xl border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-100 font-bold">
          號碼球全覽（1-80）
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-base text-gray-400 flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
          <span>最近 {analysisRange} 期各號碼出現次數</span>
          {aiRecommendations && (
            <span className="text-purple-400 flex items-center gap-1.5 bg-purple-900/30 px-2 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              AI 推薦號碼
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-10 lg:grid-cols-10 gap-1.5 sm:gap-2 md:gap-2.5">
          {Array.from({ length: 80 }, (_, i) => i + 1).map(num => {
            const count = frequency[num];
            const isRecommended = allRecommendedNumbers.includes(num);
            const intensity = Math.floor((count / maxCount) * 200);
            
            return (
              <div
                key={num}
                className={`relative aspect-square rounded-md sm:rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all hover:scale-110 hover:z-10 hover:shadow-lg cursor-pointer ${
                  isRecommended 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white ring-2 sm:ring-4 ring-purple-400/50 shadow-lg shadow-purple-500/50' 
                    : 'bg-slate-700 text-gray-300 border border-slate-600 hover:border-slate-500'
                }`}
                style={!isRecommended ? {
                  backgroundColor: `rgb(${55 + intensity}, ${45 + intensity/2}, ${100 + intensity})`
                } : {}}
                title={`號碼 ${num} - 出現 ${count} 次${isRecommended ? ' (AI推薦)' : ''}`}
              >
                <span className="text-sm sm:text-base md:text-lg font-bold leading-none">
                  {num}
                </span>
                <span className="text-[10px] sm:text-xs opacity-80 leading-none mt-0.5 font-medium">
                  {count}
                </span>
                {isRecommended && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-[8px] sm:text-[10px]">✨</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* 圖例說明 */}
        <div className="mt-5 pt-4 sm:pt-5 border-t border-slate-700 flex flex-wrap gap-3 sm:gap-5 text-xs sm:text-sm text-gray-400 justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-200 to-indigo-400 shadow-sm"></div>
            <span className="font-medium">低頻率</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-400 to-indigo-600 shadow-sm"></div>
            <span className="font-medium">中頻率</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-600 to-indigo-800 shadow-sm"></div>
            <span className="font-medium">高頻率</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
