import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  type AdminInstructor,
  getAdminInstructors,
} from "@/services/admin.service";
import { createCourse } from "@/services/course.service";
import { useAuthStore } from "@/stores/auth.store";

export default function AdminScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructors, setInstructors] = useState<AdminInstructor[]>([]);
  const [isInstructorListOpen, setIsInstructorListOpen] = useState(false);
  const [isInstructorsLoading, setIsInstructorsLoading] = useState(true);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      router.replace("/");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [status, user]);

  useEffect(() => {
    if (status !== "authenticated" || user?.role !== "admin") {
      return;
    }

    let isActive = true;

    async function loadInstructors() {
      setIsInstructorsLoading(true);

      try {
        const response = await getAdminInstructors();

        if (!isActive) {
          return;
        }

        setInstructors(response);
      } catch {
        if (!isActive) {
          return;
        }

        setInstructors([]);
      } finally {
        if (isActive) {
          setIsInstructorsLoading(false);
        }
      }
    }

    void loadInstructors();

    return () => {
      isActive = false;
    };
  }, [status, user]);

  if (status !== "authenticated" || user?.role !== "admin") {
    return null;
  }

  async function handleCreateCourse() {
    if (!code.trim() || !title.trim()) {
      setError("Course code and title are required.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const createdCourse = await createCourse({
        code,
        description,
        instructorId: selectedInstructorId || undefined,
        title,
      });

      setSuccessMessage(
        `Course ${createdCourse.courseName || createdCourse.title} created successfully.`,
      );
      setCode("");
      setTitle("");
      setDescription("");
      setSelectedInstructorId("");
    } catch (createError: unknown) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create course.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedInstructor = instructors.find(
    (instructor) => instructor.id === selectedInstructorId,
  );

  const selectedInstructorLabel = selectedInstructor
    ? `${selectedInstructor.firstName ?? ""} ${
        selectedInstructor.lastName ?? ""
      }`.trim() ||
      selectedInstructor.email ||
      "Selected instructor"
    : "Select instructor (optional)";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Admin tools</Text>
          <Text style={styles.title}>Create course</Text>
          <Text style={styles.subtitle}>
            Create a new course using the LMS admin endpoint.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Course code</Text>
            <TextInput
              autoCapitalize="characters"
              onChangeText={setCode}
              placeholder="CS101"
              placeholderTextColor="#7f8898"
              style={styles.input}
              value={code}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Course title</Text>
            <TextInput
              onChangeText={setTitle}
              placeholder="Introduction to Programming"
              placeholderTextColor="#7f8898"
              style={styles.input}
              value={title}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Instructor (optional)</Text>
            <Pressable
              onPress={() => setIsInstructorListOpen((prev) => !prev)}
              style={styles.dropdownTrigger}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.dropdownTriggerText,
                  selectedInstructorId ? null : styles.placeholderText,
                ]}
              >
                {isInstructorsLoading
                  ? "Loading instructors..."
                  : selectedInstructorLabel}
              </Text>
              <Text style={styles.dropdownChevron}>
                {isInstructorListOpen ? "▲" : "▼"}
              </Text>
            </Pressable>

            {isInstructorListOpen ? (
              <View style={styles.dropdownMenu}>
                <Pressable
                  onPress={() => {
                    setSelectedInstructorId("");
                    setIsInstructorListOpen(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>No instructor</Text>
                </Pressable>

                {instructors.map((instructor) => {
                  const label = `${instructor.firstName ?? ""} ${
                    instructor.lastName ?? ""
                  }`.trim();

                  return (
                    <Pressable
                      key={instructor.id}
                      onPress={() => {
                        setSelectedInstructorId(instructor.id);
                        setIsInstructorListOpen(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>
                        {label || instructor.email || instructor.id}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              multiline
              numberOfLines={4}
              onChangeText={setDescription}
              placeholder="Add a short course summary"
              placeholderTextColor="#7f8898"
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              value={description}
            />
          </View>

          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successCard}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          <Pressable
            disabled={isSubmitting || !code.trim() || !title.trim()}
            onPress={() => void handleCreateCourse()}
            style={[
              styles.button,
              isSubmitting || !code.trim() || !title.trim()
                ? styles.buttonDisabled
                : null,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Create course</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => void signOut()}
          >
            <Text style={styles.secondaryButtonText}>Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#1849d6",
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    backgroundColor: "#6f89cf",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    gap: 14,
    padding: 20,
  },
  content: {
    padding: 20,
  },
  dropdownChevron: {
    color: "#5f6879",
    fontSize: 12,
    fontWeight: "700",
  },
  dropdownItem: {
    borderBottomColor: "#edf1f7",
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownItemText: {
    color: "#122033",
    fontSize: 14,
  },
  dropdownMenu: {
    backgroundColor: "#ffffff",
    borderColor: "#d8deea",
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 220,
    overflow: "hidden",
  },
  dropdownTrigger: {
    alignItems: "center",
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 16,
  },
  dropdownTriggerText: {
    color: "#122033",
    flex: 1,
    fontSize: 15,
    marginRight: 8,
  },
  eyebrow: {
    color: "#1849d6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  errorCard: {
    backgroundColor: "#fff0ee",
    borderColor: "#f3b8af",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  errorText: {
    color: "#b33a2d",
    fontSize: 14,
    lineHeight: 20,
  },
  formGroup: {
    gap: 8,
  },
  input: {
    backgroundColor: "#f7f9fc",
    borderColor: "#d8deea",
    borderRadius: 14,
    borderWidth: 1,
    color: "#122033",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    color: "#32415a",
    fontSize: 14,
    fontWeight: "600",
  },
  placeholderText: {
    color: "#7f8898",
  },
  safeArea: {
    backgroundColor: "#edf2f8",
    flex: 1,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#d8deea",
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: "#122033",
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    color: "#5f6879",
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: "#122033",
    fontSize: 28,
    fontWeight: "800",
  },
  successCard: {
    backgroundColor: "#edf8f1",
    borderColor: "#b7e4c6",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  successText: {
    color: "#1f6f3f",
    fontSize: 14,
    lineHeight: 20,
  },
  textArea: {
    minHeight: 96,
  },
});
