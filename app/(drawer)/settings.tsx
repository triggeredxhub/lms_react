import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Settings() {
  const router = useRouter();

  const settingsOptions = [
    { id: 1, title: "Profile", icon: "person-outline", onPress: () => {} },
    {
      id: 2,
      title: "Notifications",
      icon: "notifications-outline",
      onPress: () => {},
    },
    { id: 3, title: "Privacy", icon: "lock-closed-outline", onPress: () => {} },
    {
      id: 4,
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => {},
    },
    {
      id: 5,
      title: "About",
      icon: "information-circle-outline",
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences</Text>
      </View>

      <View style={styles.section}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              index === settingsOptions.length - 1 && styles.lastCard,
            ]}
            onPress={option.onPress}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name={option.icon as any}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.optionTitle}>{option.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
});
