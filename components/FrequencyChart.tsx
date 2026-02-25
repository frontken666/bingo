"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  range: string;
  frequency: number;
}

interface FrequencyChartProps {
  chartData: ChartData[];
  analysisRange: number;
}

export default function FrequencyChart({ chartData, analysisRange }: FrequencyChartProps) {
  return (
    <Card className="shadow-2xl border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300">
      <CardHeader className="p-4 sm:p-5 md:p-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-100 font-bold">
          號碼球頻率分析（1-80）
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm md:text-base text-gray-400 mt-1 sm:mt-2">
          最近 {analysisRange} 期各號段出現頻率統計
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
        <div className="w-full overflow-x-auto rounded-lg bg-slate-800/30 p-2 sm:p-3">
          <ResponsiveContainer width="100%" height={280} className="sm:h-[320px] md:h-[350px] min-w-[320px]">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -5, bottom: 10 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="range" 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#cbd5e1' }}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
                height={65}
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#cbd5e1' }}
                width={45}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569', 
                  borderRadius: '10px',
                  fontSize: '13px',
                  padding: '10px 12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
                }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                cursor={{ fill: 'rgba(139, 92, 246, 0.15)' }}
              />
              <Legend 
                wrapperStyle={{ 
                  color: '#94a3b8', 
                  fontSize: '13px',
                  paddingTop: '12px',
                  fontWeight: 500
                }} 
              />
              <Bar 
                dataKey="frequency" 
                fill="url(#colorGradient)" 
                name="出現次數"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
