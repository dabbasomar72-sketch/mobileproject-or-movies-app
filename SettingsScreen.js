// SettingsScreen.js
import React from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSettings } from "./SettingsContext";

export default function SettingsScreen() {
  const { settings, setSettings } = useSettings();

  const setDark = (value) => setSettings({ ...settings, darkMode: value });

  const changeTextScale = (delta) => {
    let next = Math.round((settings.textScale + delta) * 10) / 10;
    if (next < 0.8) next = 0.8;
    if (next > 1.8) next = 1.8;
    setSettings({ ...settings, textScale: next });
  };

  const changeVolume = (delta) => {
    let next = Math.round((settings.volume + delta) * 100) / 100;
    if (next < 0) next = 0;
    if (next > 1) next = 1;
    setSettings({ ...settings, volume: next });
  };

  return (
    <View style={[styles.container, settings.darkMode && styles.darkBg]}>
      <Text style={[styles.header, settings.darkMode && styles.darkText]}>Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.label, settings.darkMode && styles.darkText]}>Dark Mode</Text>
        <Switch value={!!settings.darkMode} onValueChange={setDark} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, settings.darkMode && styles.darkText]}>Text size</Text>
        <View style={styles.rowControls}>
          <TouchableOpacity onPress={() => changeTextScale(-0.1)} style={styles.ctrlBtn}>
            <Text style={styles.ctrlBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.valueText, settings.darkMode && styles.darkText]}>{settings.textScale.toFixed(1)}x</Text>
          <TouchableOpacity onPress={() => changeTextScale(0.1)} style={styles.ctrlBtn}>
            <Text style={styles.ctrlBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, settings.darkMode && styles.darkText]}>Volume</Text>
        <View style={styles.rowControls}>
          <TouchableOpacity onPress={() => changeVolume(-0.05)} style={styles.ctrlBtn}>
            <Text style={styles.ctrlBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.valueText, settings.darkMode && styles.darkText]}>{Math.round(settings.volume * 100)}%</Text>
          <TouchableOpacity onPress={() => changeVolume(0.05)} style={styles.ctrlBtn}>
            <Text style={styles.ctrlBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.preview}>
        <Text style={[styles.previewText, { fontSize: 16 * settings.textScale }, settings.darkMode && styles.darkText]}>
          Preview text — font scaled by {settings.textScale.toFixed(1)}x
        </Text>
        <Text style={[styles.previewMeta, settings.darkMode && styles.darkText]}>Volume: {Math.round(settings.volume * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 18,
  },
  rowControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctrlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1976d2",
    justifyContent: "center",
    alignItems: "center",
  },
  ctrlBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  valueText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  preview: {
    marginTop: 24,
    alignItems: "center",
  },
  previewText: {
    color: "#333",
  },
  previewMeta: {
    marginTop: 8,
    color: "#666",
  },
  darkBg: {
    backgroundColor: "#121212",
  },
  darkText: {
    color: "#fff",
  },
});
