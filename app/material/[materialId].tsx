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

import { CommentItem } from "@/models/comment/Comment.model";
import { Material } from "@/models/material/Material.model";
import { getCommentsByTarget } from "@/services/comment.service";
import { getMaterialById } from "@/services/material.service";
import { useAuthStore } from "@/stores/auth.store";

type ScreenState = {
  comments: CommentItem[];
  material: Material | null;
};

const initialState: ScreenState = {
  comments: [],
  material: null,
};

export default function MaterialDetailScreen() {
  const { materialId } = useLocalSearchParams<{ materialId: string }>();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [screenState, setScreenState] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!materialId || !user || status !== "authenticated") {
      setLoading(false);
      return;
    }

    let isActive = true;

    async function loadMaterial() {
      setLoading(true);
      setError(null);

      try {
        const [material, comments] = await Promise.all([
          getMaterialById(materialId),
          getCommentsByTarget("material", materialId),
        ]);

        if (!isActive) {
          return;
        }

        setScreenState({ comments, material });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setScreenState(initialState);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load material details.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadMaterial();

    return () => {
      isActive = false;
    };
  }, [materialId, status, user]);

  if (status !== "authenticated" || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.errorText}>Sign in to view materials.</Text>
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

        {screenState.material ? (
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>Material</Text>
            <Text style={styles.title}>{screenState.material.title}</Text>
            <Text style={styles.subtitle}>
              {screenState.material.description ||
                "No material description provided."}
            </Text>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>File path</Text>
              <Text style={styles.metaValue}>
                {String(screenState.material.filePath || "Not available")}
              </Text>
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
  metaValue: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
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
