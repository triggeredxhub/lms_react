import { AlertMessage } from "@/components/alerts/AlertMessage";
import { API_CONFIG, TIMING } from "@/constants/api";
import colors from "@/constants/colors";
import {
  BORDER_RADIUS,
  FONT_SIZE,
  INPUT_HEIGHT,
  SPACING,
} from "@/constants/ui";

import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen() {
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const router = useRouter();
  const callCounterRef = useRef(0);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const { first_name, last_name, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors: { [key: string]: string } = {};

    if (!first_name) {
      errors.first_name = "First name is required.";
    }

    if (!last_name) {
      errors.last_name = "Last name is required.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (loading) return;

    setLoading(true);
    try {
      const payload = {
        // Include onboarding context data
        ...formData,
      };

      const res = await api.post(API_CONFIG.ENDPOINTS.SIGNUP, payload);

      setAlert({
        visible: true,
        type: "success",
        message: "Sign up successful!",
      });

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });

      setTimeout(() => router.push("../login/"), TIMING.SUCCESS_REDIRECT_DELAY);
    } catch (error: any) {
      let message = "Sign up failed";
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      setAlert({
        visible: true,
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AlertMessage
            visible={alert.visible}
            type={alert.type}
            message={alert.message}
            onHide={() => setAlert((a) => ({ ...a, visible: false }))}
          />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="person-add" size={32} color={colors.white} />
              </View>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us and start your journey today
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Name Row */}

            <View style={styles.nameRow}>
              <InputField
                label="First Name"
                placeholder="John"
                value={formData.first_name}
                onChangeText={(text: string) =>
                  handleChange("first_name", text)
                }
                error={fieldErrors.first_name}
                icon="person-outline"
                wrapperStyle={styles.nameInput}
              />

              <InputField
                label="Last Name"
                placeholder="Doe"
                value={formData.last_name}
                onChangeText={(text: string) => handleChange("last_name", text)}
                error={fieldErrors.last_name}
                icon="person-outline"
                wrapperStyle={styles.nameInput}
              />
            </View>

            {/* Email Input */}
            <InputField
              label="Email Address"
              placeholder="user@example.com"
              value={formData.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text: string) => handleChange("email", text)}
              error={fieldErrors.email}
              icon="mail-outline"
            />

            {/* Password Input */}
            <InputField
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              secureTextEntry={!showPassword}
              onChangeText={(text: string) => handleChange("password", text)}
              error={fieldErrors.password}
              icon="lock-closed-outline"
              isPassword={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                loading && styles.signUpButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Terms Notice */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and
              Privacy Policy
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("../login/")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* Reusable input component */
const InputField = ({
  label,
  error,
  icon,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  wrapperStyle,
  ...props
}: {
  label: string;
  error?: string;
  icon?: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  wrapperStyle?: any;
  [key: string]: any;
}) => (
  <View style={[styles.inputContainer, wrapperStyle]}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={20}
          color={colors.textSecondary}
          style={styles.inputIcon}
        />
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  logoContainer: {
    marginBottom: SPACING.sm,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.buttonPrimary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "700",
    color: colors.gray800,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: colors.gray500,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  formCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: SPACING.lg,
  },
  nameRow: {
    flexDirection: "column",
    gap: SPACING.md,
  },
  nameInput: {},
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: colors.gray800,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: SPACING.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: INPUT_HEIGHT.md,
    fontSize: FONT_SIZE.base,
    color: colors.gray800,
    paddingVertical: SPACING.sm,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  error: {
    color: colors.error,
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    fontWeight: "500",
  },
  signUpButton: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: BORDER_RADIUS.lg,
    height: INPUT_HEIGHT.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: colors.buttonPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: colors.white,
    fontSize: FONT_SIZE.base,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: FONT_SIZE.xs,
    color: colors.gray400,
    textAlign: "center",
    lineHeight: 16,
    marginTop: SPACING.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: colors.gray500,
  },
  signInLink: {
    fontSize: FONT_SIZE.sm,
    color: colors.buttonPrimary,
    fontWeight: "700",
  },
});
