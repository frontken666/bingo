"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopNumber {
  number: number;
  count: number;
}

interface TopNumbersProps {
  hotNumbers: TopNumber[];
  coldNumbers: TopNumber[];
}

export default function TopNumbers({ hotNumbers, coldNumbers }: TopNumbersProps) {
  return (
    <Card className="shadow-2xl border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300">
      <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-100 font-bold">
          號碼統計排行榜
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        <Tabs defaultValue="hot" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 mb-4 sm:mb-5 h-11 sm:h-12">
            <TabsTrigger 
              value="hot" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600/80 data-[state=active]:text-white text-xs sm:text-sm font-medium transition-all"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">熱門號碼</span>
              <span className="sm:hidden">熱門</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cold"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600/80 data-[state=active]:text-white text-xs sm:text-sm font-medium transition-all"
            >
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">冷門號碼</span>
              <span className="sm:hidden">冷門</span>
            </TabsTrigger>
          </TabsList>

          {/* 熱門號碼內容 */}
          <TabsContent value="hot" className="mt-0">
            <div className="space-y-2 sm:space-y-2.5">
              {hotNumbers.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 sm:p-3.5 md:p-4 bg-red-900/30 rounded-lg border border-red-800/50 hover:bg-red-900/40 hover:border-red-700/60 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-base sm:text-lg font-bold text-gray-300 w-7 sm:w-9 flex-shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-bold flex items-center justify-center shadow-lg text-base sm:text-lg flex-shrink-0 ring-2 ring-red-400/30">
                      {item.number}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap font-medium">
                    出現 <span className="text-red-400 font-bold">{item.count}</span> 次
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 冷門號碼內容 */}
          <TabsContent value="cold" className="mt-0">
            <div className="space-y-2 sm:space-y-2.5">
              {coldNumbers.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 sm:p-3.5 md:p-4 bg-blue-900/30 rounded-lg border border-blue-800/50 hover:bg-blue-900/40 hover:border-blue-700/60 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-base sm:text-lg font-bold text-gray-300 w-7 sm:w-9 flex-shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold flex items-center justify-center shadow-lg text-base sm:text-lg flex-shrink-0 ring-2 ring-blue-400/30">
                      {item.number}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap font-medium">
                    出現 <span className="text-blue-400 font-bold">{item.count}</span> 次
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
