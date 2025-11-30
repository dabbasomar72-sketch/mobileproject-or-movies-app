// MovieDetailScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSettings } from "./SettingsContext";

function PrimaryButton({ onPress, disabled, children }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.registerBtn, disabled && styles.registerBtnDisabled]}
    >
      <Text style={styles.registerBtnText}>{children}</Text>
    </TouchableOpacity>
  );
}

function SimpleChip({ children }) {
  return (
    <View style={styles.simpleChip}>
      <Text style={styles.simpleChipText}>{children}</Text>
    </View>
  );
}

export default function MovieDetailScreen({ route, navigation }) {
  const { Event } = route.params ?? {};
  const [isToday, setIsToday] = useState(false);
  const { settings } = useSettings();
  const dark = !!settings?.darkMode;

  useEffect(() => {
    if (Event?.starttime) {
      const todayISO = new Date().toISOString().slice(0, 10);
      const eventDate = Event.starttime.slice(0, 10);
      setIsToday(todayISO === eventDate);
    }
  }, [Event]);

  if (!Event) {
    return (
      <View style={[styles.empty, dark && styles.darkBg]}>
        <Text style={dark ? styles.darkText : undefined}>No event data</Text>
      </View>
    );
  }

  const isRegistrationDisabled = Event.spotsRemaining === 0;

  return (
    <ScrollView contentContainerStyle={[styles.container, dark && styles.darkContainer]}>
      {/* Back arrow row */}
      <View style={styles.backRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={dark ? "#90caf9" : "#1976d2"} />
          <Text style={[styles.backText, dark && styles.darkText]}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, dark && styles.cardDark]}>
        <Text style={[styles.title, dark && styles.darkText]}>{Event.name}</Text>
        <Text style={[styles.description, dark && styles.darkText]}>{Event.description}</Text>

        <View style={styles.row}>
          <MaterialIcons name="schedule" size={18} color={dark ? "#90caf9" : undefined} />
          <Text style={[styles.infoText, dark && styles.darkText]}>
            {new Date(Event.starttime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(Event.endtime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="location-on" size={18} color={dark ? "#90caf9" : undefined} />
          <Text style={[styles.infoText, dark && styles.darkText]}>{Event.category}</Text>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="person" size={18} color={dark ? "#90caf9" : undefined} />
          <Text style={[styles.infoText, dark && styles.darkText]}>Spots remaining: {Event.spotsRemaining}</Text>
        </View>

        <View style={styles.chipsRow}>
          <SimpleChip>{Event.category}</SimpleChip>
          {isToday && <SimpleChip>Today</SimpleChip>}
        </View>

        <View style={styles.registerRow}>
          <PrimaryButton
            onPress={() => navigation.navigate("Register", { Event })}
            disabled={isRegistrationDisabled}
          >
            Register
          </PrimaryButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  backRow: {
    marginBottom: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#1976d2",
  },
  card: {
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  description: { fontSize: 14, color: "#444", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: { marginLeft: 6, fontSize: 13, color: "#333" },
  chipsRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  simpleChip: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  simpleChipText: {
    fontSize: 12,
    color: "#1976d2",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  registerBtn: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1976d2",
  },
  registerBtnDisabled: {
    backgroundColor: "#90a4ae",
  },
  registerBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  darkBg: { backgroundColor: "#121212" },
  darkText: { color: "#fff" },
  darkContainer: { backgroundColor: "#0b1220" },
  cardDark: { backgroundColor: "#0f1724" },
});
