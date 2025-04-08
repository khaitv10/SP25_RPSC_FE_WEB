import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Month: <span className="font-semibold">{label}</span></p>
        <p className="text-base text-blue-800 font-medium">
          Revenue: <span className="font-bold">{formatCurrency(payload[0].value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Helper function to format currency
const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0 VNĐ";
  return `${value.toLocaleString()} VNĐ`;
};

// Map month numbers to names for better readability
const getMonthName = (month) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months[parseInt(month) - 1] || month;
};

const Chart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [animateChart, setAnimateChart] = useState(false);
  const [maxValue, setMaxValue] = useState(0);

  // Process data for chart
  useEffect(() => {
    if (data && data.length > 0) {
      // Sort data by month first
      const sortedData = [...data].sort((a, b) => parseInt(a.month) - parseInt(b.month));
      
      // Format month names and find max value for scaling
      const processedData = sortedData.map(item => ({
        ...item,
        month: getMonthName(item.month),
        displayValue: item.actualValue // Keep original for animation
      }));
      
      setChartData(processedData);
      
      // Find max value for proper scaling
      const max = Math.max(...processedData.map(item => item.actualValue));
      setMaxValue(max);
      
      // Trigger animation after data is set
      setTimeout(() => {
        setAnimateChart(true);
      }, 100);
    }
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          tickFormatter={formatCurrency} 
          axisLine={false} 
          tickLine={false}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          width={80}
          domain={[0, maxValue * 1.2]} // Add some padding at the top
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
        <Bar 
          dataKey="actualValue" 
          name="Revenue"  
          radius={[6, 6, 0, 0]} 
          isAnimationActive={animateChart}
          animationDuration={1500}
          animationEasing="ease-out"
          className="transition-all duration-300"
        >
          {chartData.map((entry, index) => (
            <rect 
              key={`bar-${index}`} 
              fill={`url(#barGradient-${index})`} 
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
          
          {/* Dynamic gradients based on value */}
          {chartData.map((entry, index) => {
            const ratio = entry.actualValue / (maxValue || 1);
            let startColor, endColor;
            
            if (ratio > 0.7) {
              startColor = "#3B82F6"; // blue-500
              endColor = "#1E40AF"; // blue-800
            } else if (ratio > 0.4) {
              startColor = "#10B981"; // green-500
              endColor = "#065F46"; // green-800
            } else {
              startColor = "#F59E0B"; // amber-500
              endColor = "#92400E"; // amber-800
            }
            
            return (
              <defs key={`gradient-${index}`}>
                <linearGradient id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={startColor} />
                  <stop offset="100%" stopColor={endColor} />
                </linearGradient>
              </defs>
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;