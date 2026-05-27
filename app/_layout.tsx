import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { Stack } from "expo-router";

import { useAuthStore } from "@/stores/auth.store";

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#f4f7fb",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#1849d6" size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
