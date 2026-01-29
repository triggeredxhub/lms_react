import SkeletonListItem from "@/components/skeleton/SkeletonListItem";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function QuizList() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Simulate initial loading
  useState(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  });

  return (
    <ScrollView
      style={{ flex: 1, padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Quizzes</Text>
        <Text style={styles.subtitle}>View and take your quizzes</Text>
      </View>

      {loading ? (
        <SkeletonListItem count={5} />
      ) : quizzes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No quizzes available</Text>
        </View>
      ) : (
        quizzes.map((quiz) => (
          <View key={quiz.id} style={styles.card}>
            <Text style={styles.cardTitle}>{quiz.title}</Text>
            <Text style={styles.cardInfo}>Questions: {quiz.questionCount}</Text>
          </View>
        ))
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardInfo: {
    fontSize: 14,
    color: "#666",
  },
});
