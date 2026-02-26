"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ParameterSettingsProps {
  stars: number;
  setStars: (value: number) => void;
  multiple: number;
  setMultiple: (value: number) => void;
  periods: number;
  setPeriods: (value: number) => void;
  bets: number;
  setBets: (value: number) => void;
}

export default function ParameterSettings({
  stars,
  setStars,
  multiple,
  setMultiple,
  periods,
  setPeriods,
  bets,
  setBets,
}: ParameterSettingsProps) {
  return (
    <Card className="shadow-2xl border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-100 font-bold">
          投注參數設定
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-base text-gray-400 mt-1 sm:mt-2">
          選擇您的投注配置
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-300 pl-1">
              幾星
            </label>
            <Select value={stars.toString()} onValueChange={(v) => setStars(parseInt(v))}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-gray-100 h-10 sm:h-11 text-sm sm:text-base hover:bg-slate-750 transition-colors focus:ring-2 focus:ring-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <SelectItem key={n} value={n.toString()} className="text-gray-100 hover:bg-slate-700">
                    {n} 星
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-300 pl-1">
              幾倍
            </label>
            <Select value={multiple.toString()} onValueChange={(v) => setMultiple(parseInt(v))}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-gray-100 h-10 sm:h-11 text-sm sm:text-base hover:bg-slate-750 transition-colors focus:ring-2 focus:ring-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <SelectItem key={n} value={n.toString()} className="text-gray-100 hover:bg-slate-700">
                    {n} 倍
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-300 pl-1">
              幾期
            </label>
            <Select value={periods.toString()} onValueChange={(v) => setPeriods(parseInt(v))}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-gray-100 h-10 sm:h-11 text-sm sm:text-base hover:bg-slate-750 transition-colors focus:ring-2 focus:ring-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <SelectItem key={n} value={n.toString()} className="text-gray-100 hover:bg-slate-700">
                    {n} 期
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-300 pl-1">
              幾注
            </label>
            <Select value={bets.toString()} onValueChange={(v) => setBets(parseInt(v))}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-gray-100 h-10 sm:h-11 text-sm sm:text-base hover:bg-slate-750 transition-colors focus:ring-2 focus:ring-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <SelectItem key={n} value={n.toString()} className="text-gray-100 hover:bg-slate-700">
                    {n} 注
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
