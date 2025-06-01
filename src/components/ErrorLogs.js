import { useTheme } from "./ThemeProvider";

export default function ErrorLogs() {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const headerBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-100";

  const errors = [
    { time: "10:00 AM", error: "404 Not Found" },
    { time: "10:05 AM", error: "500 Internal Server Error" },
    { time: "10:10 AM", error: "200 OK" }
  ];

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-6`}>
      <h2 className="text-lg font-medium mb-4">Error Logs</h2>
      
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className={`grid grid-cols-2 ${headerBgColor} p-3`}>
          <div className="font-medium">Time</div>
          <div className="font-medium">Error</div>
        </div>
        
        <div>
          {errors.map((log, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-2 p-3 ${
                index < errors.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""
              }`}
            >
              <div>{log.time}</div>
              <div>{log.error}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}