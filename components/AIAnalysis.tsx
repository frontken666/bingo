"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, TrendingDown, Zap, Brain, Play } from 'lucide-react';

interface AIRecommendation {
  bets: number[][];  // 多注号码
  numbers?: number[];  // 兼容旧格式
  reasoning: string;
}

interface AIAnalysisProps {
  analysisRange: number;
  setAnalysisRange: (value: number) => void;
  loading: boolean;
  handleAIAnalysis: (strategy: string) => void;
  aiRecommendations: AIRecommendation | null;
  stars: number;
  bets: number;
}

export default function AIAnalysis({
  analysisRange,
  setAnalysisRange,
  loading,
  handleAIAnalysis,
  aiRecommendations,
  stars,
  bets,
}: AIAnalysisProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');

  const strategies = [
    { id: 'hot', name: '熱門策略', icon: TrendingUp, color: 'bg-red-600/80 hover:bg-red-700 border-red-500' },
    { id: 'cold', name: '冷門策略', icon: TrendingDown, color: 'bg-blue-600/80 hover:bg-blue-700 border-blue-500' },
    { id: 'consecutive', name: '連號策略', icon: Zap, color: 'bg-yellow-600/80 hover:bg-yellow-700 border-yellow-500' },
    { id: 'mixed', name: '混搭策略', icon: Sparkles, color: 'bg-pink-600/80 hover:bg-pink-700 border-pink-500' },
    { id: 'ai', name: 'AI 建議', icon: Brain, color: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-purple-500' },
  ];

  const handleStartAnalysis = () => {
    if (selectedStrategy) {
      handleAIAnalysis(selectedStrategy);
    }
  };

  return (
    <Card className="shadow-2xl border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-100 font-bold">
          AI 智慧分析
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-base text-gray-400 mt-1 sm:mt-2">
          選擇分析範圍和策略，然後點擊開始分析
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        {/* 分析範圍選擇 */}
        <div className="mb-5">
          <label className="block text-xs sm:text-sm font-medium mb-3 text-gray-300 pl-1">
            分析範圍
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[5, 10, 20, 50].map(n => (
              <Button
                key={n}
                variant={analysisRange === n ? "default" : "outline"}
                onClick={() => setAnalysisRange(n)}
                size="sm"
                className={`text-xs sm:text-sm h-10 sm:h-11 px-3 sm:px-4 font-medium transition-all ${
                  analysisRange === n 
                    ? "bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-400/50 shadow-lg" 
                    : "border-slate-600 text-gray-300 hover:bg-slate-800 hover:border-slate-500"
                }`}
              >
                最近 {n} 期
              </Button>
            ))}
          </div>
        </div>

        {/* 分析策略選擇 */}
        <div className="mb-5">
          <label className="block text-xs sm:text-sm font-medium mb-3 text-gray-300 pl-1">
            選擇分析策略
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {strategies.map((strategy) => {
              const Icon = strategy.icon;
              const isSelected = selectedStrategy === strategy.id;
              
              return (
                <Button
                  key={strategy.id}
                  onClick={() => setSelectedStrategy(strategy.id)}
                  disabled={loading}
                  className={`flex items-center justify-center gap-1 sm:gap-2 text-white border-2 text-xs sm:text-sm h-9 sm:h-10 px-2 sm:px-4 transition-all ${
                    isSelected 
                      ? `${strategy.color} ring-2 ring-white/50 scale-105` 
                      : 'bg-slate-700/50 hover:bg-slate-700 border-slate-600'
                  } ${strategy.id === 'ai' ? 'col-span-2 sm:col-span-1' : ''}`}
                  variant="outline"
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="whitespace-nowrap">{strategy.name}</span>
                  {isSelected && (
                    <span className="ml-1 text-xs">✓</span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 開始分析按鈕 */}
        <div className="mb-4">
          <Button
            onClick={handleStartAnalysis}
            disabled={!selectedStrategy || loading}
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {loading ? '分析中...' : selectedStrategy ? `開始 ${strategies.find(s => s.id === selectedStrategy)?.name}` : '請先選擇策略'}
          </Button>
        </div>

        {/* 載入動畫 */}
        {loading && (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base">
              AI 正在分析中...
            </p>
          </div>
        )}

        {/* AI 推薦結果 */}
        {aiRecommendations && !loading && (
          <div className="mt-4 sm:mt-6 space-y-4">
            {(() => {
              // 兼容旧格式和新格式
              const allBets = aiRecommendations.bets || (aiRecommendations.numbers ? [aiRecommendations.numbers] : []);
              
              return allBets.map((betNumbers, betIndex) => (
                <div 
                  key={betIndex}
                  className="p-4 sm:p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border-2 border-purple-500/50 backdrop-blur-sm shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-purple-300 flex items-center gap-2">
                      <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                        {betIndex + 1}
                      </span>
                      第 {betIndex + 1} 注推薦號碼
                    </h3>
                    <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded">
                      {stars} 星
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                    {betNumbers.slice(0, stars).map((num, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center text-base sm:text-lg shadow-lg ring-2 ring-purple-400/50 hover:scale-110 transition-transform"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
            
            {/* 分析理由 */}
            <div className="text-xs sm:text-sm text-gray-200 bg-slate-800/50 p-4 rounded-lg leading-relaxed border border-slate-700">
              <strong className="text-purple-300 block mb-2">💡 AI 分析理由：</strong> 
              {aiRecommendations.reasoning}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
