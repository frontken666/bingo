import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

export async function POST(request: Request) {
  try {
    const { strategy, historicalData, stars, periods, bets = 1 } = await request.json();
    
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: '請設定 GROQ_API_KEY 環境變數' },
        { status: 500 }
      );
    }

    const prompt = generatePrompt(strategy, historicalData, stars, periods, bets);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `你是一個專業的台灣賓果彩券分析師。請根據歷史資料分析並推薦${bets}組號碼（每組${stars}個號碼）。返回JSON格式：{"bets": [[第1注號碼], [第2注號碼], ...], "reasoning": "分析理由"}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = chatCompletion.choices[0]?.message?.content || '';
    
    let parsedResponse;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = {
          bets: generateFallbackBets(bets, stars),
          reasoning: content
        };
      }
    } catch (e) {
      parsedResponse = {
        bets: generateFallbackBets(bets, stars),
        reasoning: content
      };
    }

    // 兼容旧格式（单注）
    if (parsedResponse.numbers && !parsedResponse.bets) {
      parsedResponse.bets = [parsedResponse.numbers.sort((a: number, b: number) => a - b)];
    }

    if (!parsedResponse.bets || parsedResponse.bets.length === 0) {
      parsedResponse.bets = generateFallbackBets(bets, stars);
    }

    // 确保每注都有正确数量的号码，并从小到大排序
    parsedResponse.bets = parsedResponse.bets.map((bet: number[]) => {
      let sortedBet: number[];
      if (bet.length < stars) {
        sortedBet = [...bet, ...generateFallbackNumbers(stars - bet.length)].slice(0, stars);
      } else {
        sortedBet = bet.slice(0, stars);
      }
      // 从小到大排序
      return sortedBet.sort((a, b) => a - b);
    });

    return NextResponse.json({
      success: true,
      data: parsedResponse
    });

  } catch (error: any) {
    console.error('AI Analysis error:', error);
    const fallbackBets = 1;
    return NextResponse.json(
      { 
        error: error.message || '分析失敗',
        fallback: {
          bets: generateFallbackBets(fallbackBets, 5),
          reasoning: '由於 API 錯誤，這是基於隨機演算法生成的推薦號碼'
        }
      },
      { status: 500 }
    );
  }
}

function generatePrompt(strategy: string, historicalData: any[], stars: number, periods: number, bets: number): string {
  const recentNumbers = historicalData.slice(0, periods).flatMap(d => d.numbers);
  const frequency: { [key: number]: number } = {};
  
  for (let i = 1; i <= 80; i++) {
    frequency[i] = 0;
  }
  
  recentNumbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });

  const sortedByFreq = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .map(([num]) => parseInt(num));

  const hot = sortedByFreq.slice(0, 15);
  const cold = sortedByFreq.slice(-15);

  let strategyPrompt = '';
  
  switch (strategy) {
    case 'hot':
      strategyPrompt = `請使用「熱門策略」：根據最近${periods}期的開獎資料，推薦${bets}組號碼，每組包含出現頻率最高的${stars}個號碼。熱門號碼(出現次數最多): ${hot.join(', ')}`;
      break;
    case 'cold':
      strategyPrompt = `請使用「冷門策略」：根據最近${periods}期的開獎資料，推薦${bets}組號碼，每組包含出現頻率最低的${stars}個號碼。冷門號碼(出現次數最少): ${cold.join(', ')}`;
      break;
    case 'consecutive':
      strategyPrompt = `請使用「連號策略」：分析最近${periods}期資料中的連號模式，推薦${bets}組可能出現連號的號碼組合，每組${stars}個號碼。`;
      break;
    case 'mixed':
      strategyPrompt = `請使用「混搭策略」：結合熱門號碼和冷門號碼，推薦${bets}組平衡的號碼組合，每組${stars}個號碼。熱門: ${hot.slice(0, 8).join(', ')}; 冷門: ${cold.slice(0, 8).join(', ')}`;
      break;
    default:
      strategyPrompt = `請根據最近${periods}期的開獎資料，使用你的AI智慧分析，推薦${bets}組號碼，每組${stars}個最有可能中獎的號碼。考慮頻率、分布、連號等多個因素。`;
  }

  return `${strategyPrompt}

歷史資料摘要：
- 分析期數：最近 ${periods} 期
- 需要推薦：${bets} 組號碼
- 每組號碼數：${stars} 個
- 號碼範圍：1-80

重要：
1. 請確保${bets}組號碼之間有差異性，不要重複
2. 每組號碼請按從小到大排序

請以JSON格式返回：
{
  "bets": [
    [第1組的${stars}個號碼（從小到大排序）],
    [第2組的${stars}個號碼（從小到大排序）],
    ${bets > 2 ? '...' : ''}
  ],
  "reasoning": "簡短的分析理由（100字以內）"
}`;
}

function extractNumbersFromText(text: string): number[] {
  const matches = text.match(/\b([1-7]?\d|80)\b/g);
  if (!matches) return [];
  
  const numbers = matches
    .map(n => parseInt(n))
    .filter(n => n >= 1 && n <= 80);
  
  return Array.from(new Set(numbers));
}

function generateFallbackNumbers(count: number): number[] {
  const numbers: number[] = [];
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * 80) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
}

function generateFallbackBets(betsCount: number, starsCount: number): number[][] {
  const allBets: number[][] = [];
  const usedNumbers = new Set<number>();
  
  for (let i = 0; i < betsCount; i++) {
    const betNumbers: number[] = [];
    let attempts = 0;
    
    while (betNumbers.length < starsCount && attempts < 1000) {
      const num = Math.floor(Math.random() * 80) + 1;
      // 尽量避免重复，但如果号码池不够，允许重复
      if (!betNumbers.includes(num) && (usedNumbers.size < 60 ? !usedNumbers.has(num) : true)) {
        betNumbers.push(num);
        usedNumbers.add(num);
      }
      attempts++;
    }
    
    allBets.push(betNumbers.sort((a, b) => a - b));
  }
  
  return allBets;
}
