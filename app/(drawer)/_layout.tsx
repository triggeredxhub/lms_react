import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const loadUserName = async () => {
      try {
        let userStr = await SecureStore.getItemAsync("user");
        if (!userStr) {
          userStr = await AsyncStorage.getItem("user");
        }
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "Student",
          );
        }
      } catch (error) {
        console.error("Error loading user name:", error);
      }
    };
    loadUserName();
  }, []);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user");
    } catch {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user");
    }
    router.replace("/auth");
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={64} color={colors.primary} />
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userRole}>Student</Text>
      </View>

      <View style={styles.menuSection}>
        <DrawerItem
          label="My Courses"
          icon={({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate("courseList")}
          labelStyle={styles.drawerLabel}
          activeBackgroundColor={colors.backgroundLight}
          activeTintColor={colors.primary}
        />
        <DrawerItem
          label="Profile"
          icon={({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
          onPress={() => {
            // Add profile navigation when implemented
          }}
          labelStyle={styles.drawerLabel}
          activeBackgroundColor={colors.backgroundLight}
          activeTintColor={colors.primary}
        />
        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          onPress={() => {
            // Add settings navigation when implemented
          }}
          labelStyle={styles.drawerLabel}
          activeBackgroundColor={colors.backgroundLight}
          activeTintColor={colors.primary}
        />
      </View>

      <View style={styles.bottomSection}>
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={handleLogout}
          labelStyle={[styles.drawerLabel, styles.logoutLabel]}
          inactiveTintColor={colors.error}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.white,
          width: 280,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: "600",
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
      }}
    >
      <Drawer.Screen
        name="courseList"
        options={{
          drawerLabel: "My Courses",
          title: "My Courses",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="course"
        options={{
          drawerLabel: () => null,
          title: "Course",
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.backgroundLight,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuSection: {
    flex: 1,
    paddingTop: 16,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  drawerLabel: {
    fontSize: 15,
    marginLeft: -16,
  },
  logoutLabel: {
    fontWeight: "500",
  },
});
