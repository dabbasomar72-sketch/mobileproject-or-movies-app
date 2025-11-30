import React, { createContext, useContext } from "react";

const defaultSettings = {
  darkMode: false,
  textScale: 1.0,
  volume: 0.5,
};

export const SettingsContext = createContext({
  settings: defaultSettings,
  setSettings: () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsContext;
