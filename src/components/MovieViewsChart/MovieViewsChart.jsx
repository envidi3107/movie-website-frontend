import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MovieViewsChart = ({ title, viewData, obj, animation }) => {
  return (
    <div className="globalScrollStyle w-full h-auto overflow-x-auto">
      <h1 className="text-center font-bold text-[120%] my-[10px]">{title}</h1>
      <ResponsiveContainer
        minWidth={400}
        height={300}
        style={{
          border: "1px solid white",
          borderRadius: "10px",
        }}
      >
        <LineChart data={viewData} style={{ overflow: "visible" }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={obj.valueX} tick={{ fill: "white" }} dy={10} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip
            contentStyle={{ color: "black", borderRadius: "8px" }}
            itemStyle={{ color: "black" }}
            cursor={{ stroke: "grey", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey={obj.valueY}
            stroke="lightgreen"
            strokeWidth={5}
            cursor="pointer"
            isAnimationActive={animation}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MovieViewsChart;
