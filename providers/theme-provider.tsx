"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Add a custom hook to access the theme easily
export function useTheme() {
  const { systemTheme, theme, setTheme } = React.useContext(NextThemesProvider.Provider);

  return {
    systemTheme,
    theme,
    setTheme,
  };
}


import { useTheme } from "./ThemeProvider";

export default function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Switch to dark theme</button>
      <button onClick={() => setTheme("light")}>Switch to light theme</button>
    </div>
  );
}
