import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from 'recharts';

interface HybridGraphProps {
  data: any[];
  xKey: string;
  barKeys: { key: string; name: string; color: string }[];
  lineKeys: { key: string; name: string; color: string }[];
  height?: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-xl">
        <p className="text-slate-300 mb-2 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-400">{entry.name}:</span>
            <span className="text-sm font-bold text-white">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const HybridGraph: React.FC<HybridGraphProps> = ({ 
  data, 
  xKey, 
  barKeys, 
  lineKeys, 
  height = 400 
}) => {
  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-white/5 p-4" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            {barKeys.map((item, index) => (
              <linearGradient key={item.key} id={`gradient-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0.3} />
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
          
          <XAxis 
            dataKey={xKey} 
            stroke="#94a3b8" 
            axisLine={false} 
            tickLine={false} 
            dy={10}
            tick={{ fontSize: 12 }} 
          />
          
          <YAxis 
            yAxisId="left"
            stroke="#94a3b8" 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(val) => `₹${val/1000}k`}
            tick={{ fontSize: 12 }} 
          />
          
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#94a3b8" 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(val) => `₹${val/1000}k`}
            tick={{ fontSize: 12 }} 
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

          {barKeys.map((bar) => (
            <Bar
              key={bar.key}
              yAxisId="left"
              dataKey={bar.key}
              name={bar.name}
              fill={`url(#gradient-${bar.key})`}
              radius={[6, 6, 0, 0]}
              barSize={32}
              animationDuration={1500}
            />
          ))}

          {lineKeys.map((line) => (
            <Line
              key={line.key}
              yAxisId="right"
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#1e293b' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={2000}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HybridGraph;
