import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { Assignment } from "@/models/assignment/Assignment.model";
import { CommentItem } from "@/models/comment/Comment.model";
import { getAssignmentById } from "@/services/assignment.service";
import { getCommentsByTarget } from "@/services/comment.service";
import { useAuthStore } from "@/stores/auth.store";

type ScreenState = {
  assignment: Assignment | null;
  comments: CommentItem[];
};

const initialState: ScreenState = {
  assignment: null,
  comments: [],
};

export default function AssignmentDetailScreen() {
  const { assignmentId } = useLocalSearchParams<{ assignmentId: string }>();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [screenState, setScreenState] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId || !user || status !== "authenticated") {
      setLoading(false);
      return;
    }

    let isActive = true;

    async function loadAssignment() {
      setLoading(true);
      setError(null);

      try {
        const [assignment, comments] = await Promise.all([
          getAssignmentById(assignmentId),
          getCommentsByTarget("assignment", assignmentId),
        ]);

        if (!isActive) {
          return;
        }

        setScreenState({ assignment, comments });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setScreenState(initialState);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load assignment details.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadAssignment();

    return () => {
      isActive = false;
    };
  }, [assignmentId, status, user]);

  if (status !== "authenticated" || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.errorText}>Sign in to view assignments.</Text>
          <Pressable onPress={() => router.replace("/")} style={styles.button}>
            <Text style={styles.buttonText}>Back to sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.centeredCard}>
            <ActivityIndicator color="#1849d6" size="large" />
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {screenState.assignment ? (
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>Assignment</Text>
            <Text style={styles.title}>{screenState.assignment.title}</Text>
            <Text style={styles.subtitle}>
              {screenState.assignment.description ||
                "No assignment description provided."}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>Due</Text>
                <Text style={styles.metaValue}>
                  {formatDate(
                    screenState.assignment.dueDate ||
                      screenState.assignment.due_date ||
                      null,
                  )}
                </Text>
              </View>
              <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>Max score</Text>
                <Text style={styles.metaValue}>
                  {String(screenState.assignment.max_score ?? "-")}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {!loading ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Comments</Text>
            {screenState.comments.length === 0 ? (
              <Text style={styles.emptyText}>No comments available yet.</Text>
            ) : (
              screenState.comments.map((comment, index) => (
                <View
                  key={String(comment.commentId ?? comment.id ?? index)}
                  style={styles.commentCard}
                >
                  <Text style={styles.commentAuthor}>
                    {formatCommentAuthor(comment)}
                  </Text>
                  <Text style={styles.commentBody}>
                    {formatCommentBody(comment)}
                  </Text>
                  <Text style={styles.commentDate}>
                    {formatDate(comment.createdAt || null)}
                  </Text>
                </View>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatCommentAuthor(comment: CommentItem) {
  const fullName = [comment.firstName, comment.lastName]
    .filter(Boolean)
    .join(" ");
  return fullName || `User ${comment.userId ?? ""}`.trim();
}

function formatCommentBody(comment: CommentItem) {
  return (
    comment.content || comment.comment || comment.text || "No comment content."
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not available";
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#dfe8fb",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#1849d6",
    fontSize: 13,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#1849d6",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  centeredCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    gap: 16,
    margin: 20,
    padding: 24,
  },
  commentAuthor: {
    color: "#122033",
    fontSize: 14,
    fontWeight: "700",
  },
  commentBody: {
    color: "#32415a",
    fontSize: 14,
    lineHeight: 20,
  },
  commentCard: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  commentDate: {
    color: "#5f6879",
    fontSize: 12,
  },
  content: {
    gap: 16,
    padding: 20,
  },
  emptyText: {
    color: "#5f6879",
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: "#fff0ee",
    borderColor: "#f3b8af",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  errorText: {
    color: "#b33a2d",
    fontSize: 14,
    lineHeight: 20,
  },
  eyebrow: {
    color: "#9db7ff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  headerRow: {
    alignItems: "flex-start",
  },
  heroCard: {
    backgroundColor: "#122033",
    borderRadius: 24,
    gap: 14,
    padding: 24,
  },
  metaCard: {
    backgroundColor: "#1b2f4c",
    borderRadius: 18,
    flex: 1,
    gap: 6,
    padding: 16,
  },
  metaLabel: {
    color: "#9db7ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaValue: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  safeArea: {
    backgroundColor: "#edf2f8",
    flex: 1,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    gap: 14,
    padding: 20,
  },
  sectionTitle: {
    color: "#122033",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#d3dbeb",
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
});
