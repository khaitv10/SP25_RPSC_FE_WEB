import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const formatCurrency = (value) => `${value.toLocaleString()} VNĐ`; // ✅ Định dạng giá tiền

const Chart = ({ year, setYear, data }) => {
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📊 Overview Balance</h2> {/* ✅ Thêm icon cho sinh động */}
        <div className="flex items-center">
          <label htmlFor="year" className="mr-2 text-sm">Select Year:</label>
          <select
            id="year"
            value={year}
            onChange={handleYearChange}
            className="bg-gray-100 border border-gray-300 rounded p-2 text-sm"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={2}>
          <XAxis dataKey="month" tickLine={false} />
          <YAxis 
            tickFormatter={formatCurrency} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 13 }} 
          />
          <Tooltip formatter={(value) => formatCurrency(value)} /> 
          <Bar 
                  dataKey="actualValue" 
                  name="Tổng Tiền"  
                  fill="#1E1B4B" 
                  barSize={20} 
                  radius={[10, 10, 0, 0]} 
                  isAnimationActive={false} 
                />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
