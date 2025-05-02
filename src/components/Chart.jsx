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
  // Convert to integer to handle both '4' and '04' formats
  return months[parseInt(month, 10) - 1] || month;
};

// Normalize month format (handles both '4' and '04')
const normalizeMonth = (month) => {
  return parseInt(month, 10).toString();
};

const Chart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [animateChart, setAnimateChart] = useState(false);
  const [maxValue, setMaxValue] = useState(0);

  // Process data for chart
  useEffect(() => {
    // Create a base array with all 12 months initialized with zero values
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const monthNum = (i + 1).toString();
      return {
        month: monthNum,
        actualValue: 0,
        name: getMonthName(monthNum)
      };
    });
    
    // Merge provided data with the base array
    if (data && data.length > 0) {
      console.log("Original data:", data);
      
      // Create a map of existing data by month (normalized)
      const dataMap = {};
      data.forEach(item => {
        const normalizedMonth = normalizeMonth(item.month);
        dataMap[normalizedMonth] = item.actualValue;
        console.log(`Mapping month ${item.month} (normalized: ${normalizedMonth}) to value ${item.actualValue}`);
      });
      
      // Update the base array with actual values where they exist
      allMonths.forEach((item) => {
        const normalizedMonth = normalizeMonth(item.month);
        if (dataMap[normalizedMonth]) {
          item.actualValue = dataMap[normalizedMonth];
          console.log(`Set month ${item.month} (${item.name}) to value ${item.actualValue}`);
        }
      });
      
      // Find max value for proper scaling
      const max = Math.max(...allMonths.map(item => item.actualValue), 1000);
      setMaxValue(max);
      
      console.log("Processed chart data:", allMonths);
      setChartData(allMonths);
      
      // Trigger animation after data is set
      setTimeout(() => {
        setAnimateChart(true);
      }, 100);
    } else {
      // If no data, still show all months with zero values
      setChartData(allMonths);
      setMaxValue(1000); // Default max for empty chart
    }
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis 
          dataKey="name" 
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
          fill="#ACDCD0"
          isAnimationActive={animateChart}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;