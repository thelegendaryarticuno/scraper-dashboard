import { useTheme } from "./ThemeProvider";

export default function StatusPanel({ website }) {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-6`}>
      <h2 className="text-lg font-medium mb-2">Status</h2>
      <div className={`text-2xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
        Online
      </div>
    </div>
  );
}