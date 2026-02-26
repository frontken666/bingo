"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

interface CostAnalysisProps {
  stars: number;
  multiple: number;
  periods: number;
  bets: number;
}

export default function CostAnalysis({ stars, multiple, periods, bets }: CostAnalysisProps) {
  // 每注基础金额（台币）
  const BASE_BET_AMOUNT = 25;
  
  // 奖金表
  const PRIZE_TABLE: { [key: number]: { [key: string]: number } } = {
    1: { '1': 75 },
    2: { '2': 150 },
    3: { '2': 25, '3': 1000 },
    4: { '2': 25, '3': 150, '4': 2000 },
    5: { '3': 50, '4': 600, '5': 10000 },
    6: { '3': 25, '4': 200, '5': 1200, '6': 50000 },
  };

  // 计算总投注成本
  const totalCost = BASE_BET_AMOUNT * bets * periods * multiple;

  // 获取当前星数的奖金表
  const currentPrizes = PRIZE_TABLE[stars as 3 | 4 | 5 | 6] || {};

  // 计算最大可能获利（中最高奖）
  const maxPrizeKey = Object.keys(currentPrizes).sort((a, b) => parseInt(b) - parseInt(a))[0];
  const maxPrize = currentPrizes[maxPrizeKey] || 0;
  const maxProfit = (maxPrize * multiple * bets * periods) - totalCost;

  // 计算回本分析：需要中多少次某个奖项才能回本
  const breakEvenAnalysis = Object.entries(currentPrizes).map(([hitCount, prize]) => {
    const singleWinAmount = prize * multiple;
    const timesNeeded = Math.ceil(totalCost / singleWinAmount);
    const profitIfWinOnce = singleWinAmount - totalCost;
    
    return {
      hitCount,
      prize,
      singleWinAmount,
      timesNeeded,
      profitIfWinOnce,
      isProfit: profitIfWinOnce > 0
    };
  }).sort((a, b) => parseInt(b.hitCount) - parseInt(a.hitCount));

  // 计算投资回报率 (假设中最高奖)
  const roi = totalCost > 0 ? ((maxProfit / totalCost) * 100).toFixed(2) : '0.00';

  return (
    <Card className="shadow-2xl border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-100 font-bold flex items-center gap-2">
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          成本與中獎分析
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-base text-gray-400 mt-1 sm:mt-2">
          基於您的投注配置進行盈虧分析
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">

        {/* 成本與收益分析 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* 總投注成本 */}
          <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 p-4 rounded-lg border-2 border-red-700/50 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-red-300" />
              <div className="text-sm text-red-300 font-medium">總投注成本</div>
            </div>
            <div className="text-3xl font-bold text-red-100">NT$ {totalCost.toLocaleString()}</div>
            <div className="text-xs text-red-300 mt-2">
              ${BASE_BET_AMOUNT} × {bets}注 × {periods}期 × {multiple}倍
            </div>
          </div>

          {/* 最大可能獲利 */}
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 p-4 rounded-lg border-2 border-green-700/50 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-300" />
              <div className="text-sm text-green-300 font-medium">最大可能獲利</div>
            </div>
            <div className="text-3xl font-bold text-green-100">
              {maxProfit > 0 ? '+' : ''}NT$ {maxProfit.toLocaleString()}
            </div>
            <div className="text-xs text-green-300 mt-2">
              中 {maxPrizeKey} 個號碼 × {periods}期 × {bets}注
            </div>
          </div>
        </div>

        {/* 回本分析表 */}
        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-base sm:text-lg font-bold text-gray-100">回本分析</h3>
          </div>
          
          <div className="space-y-3">
            {breakEvenAnalysis.map((analysis) => (
              <div 
                key={analysis.hitCount}
                className={`p-4 rounded-lg border-2 transition-all ${
                  analysis.isProfit 
                    ? 'bg-green-900/20 border-green-700/50 hover:bg-green-900/30' 
                    : 'bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg sm:text-xl font-bold text-gray-100">
                        中 {analysis.hitCount} 個號碼
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        analysis.isProfit 
                          ? 'bg-green-600/30 text-green-300 border border-green-500/50' 
                          : 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                      }`}>
                        單注獎金 ${analysis.prize}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="text-gray-300">
                        <span className="text-gray-500">單次中獎：</span>
                        <span className="font-bold ml-1">NT$ {analysis.singleWinAmount.toLocaleString()}</span>
                      </div>
                      <div className={analysis.isProfit ? 'text-green-300' : 'text-blue-300'}>
                        <span className="text-gray-500">單次{analysis.isProfit ? '獲利' : '虧損'}：</span>
                        <span className="font-bold ml-1">
                          {analysis.profitIfWinOnce > 0 ? '+' : ''}NT$ {analysis.profitIfWinOnce.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-yellow-300">
                        <span className="text-gray-500">回本需中：</span>
                        <span className="font-bold ml-1">{analysis.timesNeeded} 次</span>
                      </div>
                    </div>
                  </div>
                  
                  {analysis.isProfit && (
                    <div className="flex items-center gap-2 text-green-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-bold">一次回本</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 風險提示 */}
        <div className="mt-5 p-4 bg-yellow-900/20 border-2 border-yellow-700/50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-yellow-200">
              <p className="font-bold mb-1">⚠️ 風險提示</p>
              <p>以上分析僅供參考，實際中獎機率較低。請理性購彩，適度遊戲，切勿過度投注。</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
