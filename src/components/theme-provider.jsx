import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "system", setTheme: () => {} });
const KEY = "kirana-theme";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(KEY) || "system");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    const dark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.add(dark ? "dark" : "light");
  }, [theme]);

  const setTheme = (t) => {
    localStorage.setItem(KEY, t);
    setThemeState(t);
  };
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
