import { useTheme } from "./ThemeProvider";

export default function PerformancePanel() {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";

  // Mock data for the performance chart
  const chartData = [10, 30, 15, 45, 20, 35, 25, 55, 40, 60, 35, 25];
  const maxValue = Math.max(...chartData);

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-6`}>
      <h2 className="text-lg font-medium mb-4">Performance</h2>
      
      <div className="mb-6">
        <div className="text-sm text-gray-500">Response Time</div>
        <div className="text-3xl font-bold">200ms</div>
        <div className="text-sm text-gray-500 flex items-center">
          Last 24 Hours <span className="ml-2 text-green-500">+10%</span>
        </div>
      </div>
      
      <div className="h-40 flex items-end space-x-1">
        {chartData.map((value, index) => (
          <div 
            key={index} 
            className="flex-1"
            style={{ height: `${(value / maxValue) * 100}%` }}
          >
            <div 
              className={`w-full h-full rounded-t ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
            ></div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <div>12AM</div>
        <div>6AM</div>
        <div>12PM</div>
        <div>6PM</div>
      </div>
    </div>
  );
}