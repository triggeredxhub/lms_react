import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useAuthStore } from "@/stores/auth.store";

function AppDrawerContent(props: DrawerContentComponentProps) {
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.profileCard}>
        <Text style={styles.profileEyebrow}>Learning Management System</Text>
        <Text style={styles.profileName}>
          {user ? `${user.firstName} ${user.lastName}` : "Signed in user"}
        </Text>
        <Text style={styles.profileSubtitle}>{user?.email ?? ""}</Text>
      </View>

      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.drawerFooter}>
        <DrawerItem
          label="Sign out"
          icon={({ size, color }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          labelStyle={styles.signOutLabel}
          onPress={async () => {
            await signOut();
            props.navigation.closeDrawer();
            router.replace("/" as never);
          }}
          style={styles.signOutItem}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  const status = useAuthStore((state) => state.status);

  if (status === "hydrating") {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color="#1849d6" size="large" />
      </View>
    );
  }

  return (
    <Drawer
      initialRouteName="course"
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "#1849d6",
        drawerInactiveTintColor: "#32415a",
        drawerPosition: "left",
        drawerStyle: styles.drawerStyle,
        headerShadowVisible: false,
        headerStyle: styles.headerStyle,
        headerTintColor: "#122033",
        headerTitleAlign: "center",
        headerLeft: () => <DrawerMenuButton />,
      }}
    >
      <Drawer.Screen
        name="course"
        options={{
          title: "Courses",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="library-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="assignment"
        options={{
          title: "Assignments",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="quiz"
        options={{
          title: "Quizzes",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="help-buoy-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}

function DrawerMenuButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityLabel="Open navigation drawer"
      accessibilityRole="button"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={styles.menuButton}
    >
      <Ionicons name="menu-outline" size={24} color="#122033" />
    </Pressable>
  );
}

const styles = {
  drawerContent: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  drawerFooter: {
    marginTop: "auto",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  drawerList: {
    paddingTop: 12,
  },
  drawerStyle: {
    backgroundColor: "#f4f7fb",
    width: 300,
  },
  headerStyle: {
    backgroundColor: "#ffffff",
  },
  menuButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    marginLeft: 8,
    width: 44,
  },
  loadingScreen: {
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    flex: 1,
    justifyContent: "center",
  },
  profileCard: {
    backgroundColor: "#122033",
    borderRadius: 22,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 18,
  },
  profileEyebrow: {
    color: "#9fb5e8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  profileName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  profileSubtitle: {
    color: "#d3dbeb",
    fontSize: 13,
    marginTop: 6,
  },
  signOutItem: {
    backgroundColor: "#edf2f8",
    borderRadius: 16,
  },
  signOutLabel: {
    color: "#b33a2d",
    fontWeight: "700",
  },
} as const;
