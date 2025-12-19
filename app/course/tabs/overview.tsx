import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function OverviewTab() {
  const router = useRouter();
  return (
    <View style={{ padding: 20 }}>
      
              <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#251e1d" />
        </TouchableOpacity>
    </View>
  );
}
