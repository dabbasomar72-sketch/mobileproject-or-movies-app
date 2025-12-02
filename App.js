// App.js
import * as React from "react";
import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import fetchEvents from "./eventsData";
import { useSettings } from "./SettingsContext";

import TodayMovie from "./TodayEvents";
import MovieDetailScreen from "./MovieDetailScreen";
import RegisterScreen from "./RegisterScreen";
import SettingsScreen from "./SettingsScreen";
import { SettingsContext } from "./SettingsContext";
import TodayEvents from "./TodayEvents";


const Tab = createBottomTabNavigator();
const EventsStack = createStackNavigator();

function HomeScreen({ navigation }) {
  const { settings } = useSettings();
  const dark = !!settings?.darkMode;
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    // Load events on mount
    setEvents(fetchEvents);
  }, []);
  // events come from local `eventsData.js` (no remote fetch)

  const categories = React.useMemo(() => {
    return Array.from(new Set(["Today", ...events.map((e) => e.category)]));
  }, []);

  // Deterministic daily selection of 3 events.
  // We derive a simple numeric seed from today's date and pick three consecutive events (wrap-around).
  const dailyEvents = React.useMemo(() => {
    const list = events || [];
    if (list.length === 0) return [];
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    // simple hash: sum of char codes
    let sum = 0;
    for (let i = 0; i < today.length; i++) sum = (sum + today.charCodeAt(i)) % 100000;
    const start = sum % list.length;
    const picks = [];
    for (let i = 0; i < 3; i++) {
      picks.push(list[(start + i) % list.length]);
    }
    return picks;
  }, []);

  const onChange = (text) => {
    setQuery(text);
    const q = text.trim().toLowerCase();
    if (q.length === 0) {
      setSuggestions([]);
      return;
    }
    const results = events.filter((e) => e.name.toLowerCase().startsWith(q));
    setSuggestions(results);
  };

  const onSelectSuggestion = (item) => {
    setQuery("");
    setSuggestions([]);
    navigation.navigate("Events", { screen: "EventDetail", params: { Event: item } });
  };

  return (
    <View style={[styles.screenCenter, dark ? { backgroundColor: "#0b1220" } : undefined]}>
      <Text style={[styles.homeTitle, dark && styles.darkText]}>Home</Text>
      <Text style={[styles.homeText, dark && styles.darkText]}>
        Welcome to Community Events. Use the Events tab below to browse and register.
      </Text>

      {/* Daily featured events */}
      <View style={styles.dailyWrapper}>
        <Text style={styles.sectionTitle}>Today's Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dailyScroll}>
          {dailyEvents.map((ev) => (
            <TouchableOpacity key={ev.id} style={[styles.dailyCard, dark && { backgroundColor: "#0f1724" }]} onPress={() => navigation.navigate("Events", { screen: "EventDetail", params: { Event: ev } })}>
              <Text style={[styles.dailyTitle, dark && styles.darkText]} numberOfLines={1}>{ev.name}</Text>
              <Text style={[styles.dailyCategory, dark && styles.darkText]}>{ev.category}</Text>
              <Text style={[styles.dailySpots, dark && styles.darkText]}>{ev.spotsRemaining} spots</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search events"
          value={query}
          onChangeText={onChange}
          style={[styles.searchInput, dark && { backgroundColor: "#071028", color: "#fff", borderColor: "#20314a" }]}
        />
        <TouchableOpacity style={styles.searchIconRight} onPress={() => onChange(query)}>
          <MaterialIcons name="search" size={22} />
        </TouchableOpacity>
      </View>

      {suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, dark && { backgroundColor: "#071028" }]}>
          {suggestions.slice(0, 6).map((s) => (
            <TouchableOpacity key={s.id} style={styles.suggestionItem} onPress={() => onSelectSuggestion(s)}>
              <Text style={[styles.suggestionText, dark && styles.darkText]}>{s.name} — {s.category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.fixedCategoryContainerHome}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat} style={[styles.chip, dark && { backgroundColor: "#071028", borderColor: "#20314a" }]} onPress={() => navigation.navigate("Events", { screen: "EventsList", params: { initialCategory: cat } })}>
              <Text style={[styles.chipText, dark && styles.darkText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}



// Stack for Events tab: list -> detail -> register
function EventsStackScreen() {
  return (
    <EventsStack.Navigator screenOptions={{ headerShown: false }}>
      <EventsStack.Screen name="EventsList" component={TodayEvents} />
      <EventsStack.Screen name="EventDetail" component={MovieDetailScreen} />
      <EventsStack.Screen name="Register" component={RegisterScreen} />
    </EventsStack.Navigator>
  );
}

export default function App() {
  const [settings, setSettings] = React.useState({
    darkMode: false,
    textScale: 1.0,
    volume: 0.5,
  });

  const dynamicStyles = {
    appRoot: {
      flex: 1,
      backgroundColor: settings.darkMode ? "#121212" : "#f5f6f8",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    topBar: {
      height: 56,
      backgroundColor: settings.darkMode ? "#0d47a1" : "#1976d2",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
    },
    topBarTitle: {
      marginLeft: 8,
      fontSize: 18 * settings.textScale,
      fontWeight: "600",
      color: "#fff",
    },
    navRoot: { flex: 1 },
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <View style={dynamicStyles.appRoot}>
        {/* Top bar always visible */}
        <View style={dynamicStyles.topBar}>
          <MaterialIcons name="location-on" size={24} color="#fff" />
          <Text style={dynamicStyles.topBarTitle}>Community Events</Text>
        </View>

        {/* Navigation (tabs + stacks) */}
        <View style={dynamicStyles.navRoot}>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Events"
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#1976d2",
                tabBarInactiveTintColor: "#666",
                tabBarLabelStyle: { fontSize: 12 },
                tabBarIcon: ({ color, size }) => {
                  let iconName = "home";
                  if (route.name === "Home") iconName = "home";
                  else if (route.name === "Events") iconName = "event";
                  else if (route.name === "Settings") iconName = "settings";
                  return (
                    <MaterialIcons name={iconName} size={size} color={color} />
                  );
                },
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen
                name="Events"
                component={EventsStackScreen}
                listeners={({ navigation }) => ({
                  tabPress: (e) => {
                    // Always go to the events list when Events tab is pressed
                    navigation.navigate("Events", { screen: "EventsList" });
                  },
                })}
              />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </View>
    </SettingsContext.Provider>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: "#f5f6f8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topBar: {
    height: 56,
    backgroundColor: "#1976d2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  topBarTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  navRoot: {
    flex: 1,
  },
  screenCenter: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6f8",
    justifyContent: "center",
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  homeText: {
    fontSize: 14,
    color: "#444",
  },
  searchWrapper: { marginTop: 12, width: "100%", position: "relative" },
  searchInput: {
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  searchIconRight: {
    position: "absolute",
    right: 8,
    top: 9,
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionsContainer: { width: "100%", backgroundColor: "#fff", borderRadius: 8, marginTop: 6, paddingVertical: 4 },
  suggestionItem: { paddingVertical: 8, paddingHorizontal: 12 },
  suggestionText: { color: "#333" },
  fixedCategoryContainerHome: { height: 52, marginTop: 12 },
  categoryScroll: { alignItems: "center", paddingLeft: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1976d2",
    backgroundColor: "#fff",
  },
  chipText: { color: "#1976d2" },
  dailyWrapper: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  dailyScroll: { paddingLeft: 4 },
  dailyCard: { width: 220, padding: 12, marginRight: 10, borderRadius: 10, backgroundColor: "#fff" },
  dailyTitle: { fontSize: 16, fontWeight: "600" },
  dailyCategory: { marginTop: 6, color: "#666", fontSize: 13 },
  dailySpots: { marginTop: 8, color: "#333", fontSize: 13 },
  darkText: { color: "#fff" },
});
