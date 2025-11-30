// RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useSettings } from "./SettingsContext";

export default function RegisterScreen({ route, navigation }) {
  const { Event } = route.params ?? {};
  const { settings } = useSettings();
  const dark = !!settings?.darkMode;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("member");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hasNameError = name.trim() === "";
  const hasEmailError =
    email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email.trim());

  const handleSubmit = async () => {
    // Mark as attempted
    setSubmitted(true);

    // Show validation errors only AFTER submit
    if (hasNameError || hasEmailError) {
      return;
    }

    setLoading(true);
    try {
      // Register user
      const userResponse = await fetch("https://grmoviev2.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          deactivated: false,
        }),
      });

      if (!userResponse.ok) throw new Error("User registration failed");

      // Register for event
      const registrationResponse = await fetch(
        "https://grmoviev2.onrender.com/registrations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movieId: Event?.id ?? null,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          }),
        }
      );

      if (!registrationResponse.ok)
        throw new Error("Event registration failed");

      setLoading(false);

      Alert.alert("Success", "You have successfully registered!", [
        {
          text: "OK",
          onPress: () => {
            // Go back to the events list in this stack
            navigation.popToTop();
          },
        },
      ]);
    } catch (err) {
      setLoading(false);
      console.error("Registration error:", err);
      Alert.alert("Error", err.message || "Registration failed.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
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
          {/* Full name */}
          <Text style={styles.label}>Compulsory Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, dark && styles.inputDark]}
          />
          {submitted && hasNameError && (
            <Text style={styles.errorText}>Name is required</Text>
          )}

          {/* Email */}
          <Text style={styles.label}>Compulsory Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.input, dark && styles.inputDark]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {submitted && hasEmailError && (
            <Text style={styles.errorText}>Enter a valid email</Text>
          )}

          {/* Phone */}
          <Text style={styles.label}>Phone (optional)</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={[styles.input, dark && styles.inputDark]}
            keyboardType="phone-pad"
          />

          {/* Role */}
          <Text style={[styles.label, dark && styles.darkText]}>Role</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={role}
              onValueChange={setRole}
              style={[styles.picker, dark && styles.pickerDark]}
            >
              <Picker.Item label="member" value="member" />
            </Picker>
          </View>

          {/* Submit button */}
          <View style={{ marginTop: 16, alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Submitting..." : "Submit Registration"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: "#f5f6f8", flexGrow: 1 },
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
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  submitButton: {
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#1976d2",
  },
  submitButtonDisabled: {
    backgroundColor: "#90a4ae",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 4,
  },
  picker: {
    minHeight: 56,
    width: "100%",
  },
  /* Dark mode styles */
  darkContainer: { backgroundColor: "#0b1220" },
  darkText: { color: "#fff" },
  cardDark: { backgroundColor: "#0f1724" },
  inputDark: { backgroundColor: "#071028", color: "#fff", borderColor: "#20314a" },
  pickerDark: { backgroundColor: "#071028", color: "#fff" },
});
