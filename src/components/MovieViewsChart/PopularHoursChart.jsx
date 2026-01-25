import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatXAxis = (item) => {
  return `${item.day.split("-").reverse().join("/")} ${item.startHour}h-${item.endHour}h`;
};

const PopularHoursChart = ({ viewData }) => {
  // Chuẩn bị dữ liệu
  if (!viewData) return null;

  const chartData = viewData.map((item) => ({
    ...item,
    timeLabel: formatXAxis(item),
  }));

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2 className="text-center font-bold text-[120%] my-[10px]">
        Thống kê người dùng nhiều nhất xem phim theo khung giờ
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timeLabel"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="userCount" name="Số người dùng" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularHoursChart;
