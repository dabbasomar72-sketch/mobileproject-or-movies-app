// TodayEvents.js
import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import sampleEvents from "./eventsData";
import { useSettings } from "./SettingsContext";

const formatTimeRange = (startIso, endIso) => {
  if (!startIso || !endIso) return "Time TBA";
  try {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const opts = { hour: "2-digit", minute: "2-digit" };
    const s = start.toLocaleTimeString([], opts);
    const e = end.toLocaleTimeString([], opts);
    const dateLabel = start.toISOString().slice(0, 10);
    return `${dateLabel} ${s} - ${e}`;
  } catch {
    return "Time TBA";
  }
};

export default function TodayEvents({ navigation, route }) {
  const [events] = useState(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents);
  const { settings } = useSettings();
  const dark = !!settings?.darkMode;

  useEffect(() => {
    const initialCategory = route?.params?.initialCategory;
    if (initialCategory && initialCategory !== "Today") {
      setFilteredEvents(events.filter((e) => e.category === initialCategory));
    } else if (initialCategory === "Today") {
      const todayISO = new Date().toISOString().slice(0, 10);
      setFilteredEvents(events.filter((e) => (e.starttime || "").slice(0, 10) === todayISO));
    } else {
      setFilteredEvents(events);
    }
  }, [route, events]);

  const onCardPress = (item) => {
    navigation.navigate("EventDetail", { Event: item });
  };

  const renderEventCard = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => onCardPress(item)} activeOpacity={0.85}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.name}
              </Text>
            </ScrollView>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="schedule" size={18} />
            <Text style={styles.infoText}>{formatTimeRange(item.starttime, item.endtime)}</Text>
            <MaterialIcons name="location-on" size={18} style={{ marginLeft: 12 }} />
            <Text style={styles.infoText}>{item.category}</Text>
          </View>

          <Text style={styles.spots}>Spots remaining: {item.spotsRemaining}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, dark && styles.darkSafe]} edges={["left", "right", "bottom"]}>
      <View style={[styles.container, dark && styles.darkContainer]}>
        <View style={[styles.welcomeCard, dark && styles.welcomeCardDark]}>
          <Text style={[styles.welcomeTitle, dark && styles.darkText]}>Welcome</Text>
          <Text style={[styles.welcomeSubtitle, dark && styles.darkText]}>Find and register for Community Events</Text>
        </View>

        <Text style={[styles.resultsText, dark && styles.darkText]}>{filteredEvents.length} result{filteredEvents.length !== 1 ? "s" : ""} found</Text>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={renderEventCard}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadEvents({ refresh: true })} />}
          ListEmptyComponent={<Text style={[styles.noEvents, dark && styles.darkText]}>No events found</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 12, paddingBottom: 12, backgroundColor: "#f5f6f8" },
  welcomeCard: { marginBottom: 12, borderRadius: 10, backgroundColor: "#fff", padding: 12 },
  welcomeTitle: { fontSize: 28, fontWeight: "700" },
  welcomeSubtitle: { marginTop: 6, fontSize: 14, color: "#444" },
  resultsText: { marginVertical: 6, color: "#555" },
  card: { marginVertical: 6, borderRadius: 8, backgroundColor: "#fff", padding: 12 },
  titleRow: { flexDirection: "row", marginBottom: 8, minHeight: 28 },
  eventTitle: { fontSize: 16, fontWeight: "600", paddingRight: 12 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoText: { marginLeft: 6, fontSize: 13, color: "#444" },
  spots: { fontSize: 13, color: "#333", marginBottom: 6 },
  noEvents: { textAlign: "center", marginTop: 24, color: "#888" },
  /* Dark mode styles */
  darkSafe: { backgroundColor: "#0b1220" },
  darkContainer: { backgroundColor: "#0b1220" },
  welcomeCardDark: { backgroundColor: "#071028" },
  darkText: { color: "#fff" },
});
