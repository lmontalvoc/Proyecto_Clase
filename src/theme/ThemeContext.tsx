import React, { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import { lightTheme } from "./light";
import { darkTheme } from "./dark";

export const ThemeContext = createContext({
  theme: lightTheme,
  mode: "light",
  setMode: (mode: string) => {},
});

export const ThemeProvider = ({ children }: any) => {
  const system = Appearance.getColorScheme();

  const [mode, setMode] = useState(system ?? "light");

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setMode(colorScheme ?? "light");
    });

    return () => sub.remove();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: mode === "light" ? lightTheme : darkTheme,
        mode,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
