import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "01", actualValue: 200 },
  { month: "02", actualValue: 500 },
  { month: "03", actualValue: 600 },
  { month: "04", actualValue: 400 },
  { month: "05", actualValue: 200 },
  { month: "06", actualValue: 500 },
  { month: "07", actualValue: 300 },
  { month: "08", actualValue: 500 },
  { month: "09", actualValue: 600 },
  { month: "10", actualValue: 400 },
  { month: "11", actualValue: 700 },
  { month: "12", actualValue: 500 },
  { month: "01", actualValue: 600 },
];

const Chart = () => {
  const [year, setYear] = useState("2024"); // Giả sử bạn muốn chọn năm 2024

  const handleYearChange = (e) => {
    setYear(e.target.value);
    // Cập nhật lại dữ liệu theo năm nếu có (ví dụ: API hoặc dữ liệu động)
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Overview Balance</h2>
        <div className="flex items-center">
          <label htmlFor="year" className="mr-2 text-sm"></label>
          <select
            id="year"
            value={year}
            onChange={handleYearChange}
            className="bg-gray-100 border border-gray-300 rounded p-2 text-sm"
          >
            <option value="2024">Year:2024</option>
            <option value="2023">Year:2023</option>
            <option value="2022">Year:2022</option>
          </select>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Last Month <span className="text-green-500 font-bold">563,443 VNĐ</span>
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={2}>
          <XAxis dataKey="month" tickLine={false} />
          <YAxis
            tickFormatter={(value) => `${value / 1000},000k`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Bar
            dataKey="actualValue"
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
