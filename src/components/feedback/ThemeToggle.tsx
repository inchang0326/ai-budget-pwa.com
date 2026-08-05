import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label="테마 전환"
      title="테마 전환"
    >
      <div className="theme-toggle-icon-container">
        {theme === "light" ? (
          <Sun className="theme-icon sun-icon" />
        ) : (
          <Moon className="theme-icon moon-icon" />
        )}
      </div>
    </button>
  );
}
