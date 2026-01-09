
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskChartProps {
  score: number;
}

const RiskChart: React.FC<RiskChartProps> = ({ score }) => {
  // Score is 0-100. We create a 180-degree gauge.
  // Lower is better (safe), higher is riskier.
  const data = [
    { name: 'Risk', value: score },
    { name: 'Safe', value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s < 30) return '#10b981'; // Green (Safe)
    if (s < 60) return '#f59e0b'; // Orange (Medium)
    return '#ef4444'; // Red (High Risk)
  };

  return (
    <div className="w-full h-48 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={210}
            endAngle={-30}
            innerRadius={65}
            outerRadius={90}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getColor(score)} className="transition-all duration-500" />
            <Cell fill="#f3f4f6" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className={`text-5xl font-black transition-colors duration-500 ${score > 60 ? 'text-red-600' : score > 30 ? 'text-orange-600' : 'text-green-600'}`}>
          {score}
        </div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Audit Index</div>
      </div>
    </div>
  );
};

export default RiskChart;
