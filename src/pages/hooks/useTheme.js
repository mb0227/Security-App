import { useEffect, useState } from "react";

// Custom Hook for theme with localStorage persistence
export default function useTheme(defaultTheme = "dark") {
  const [theme, setTheme] = useState(() => {
    // Try to get from sessionStorage, else use default
    return sessionStorage.getItem("theme") || defaultTheme;
  });

  useEffect(() => {
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme];
}