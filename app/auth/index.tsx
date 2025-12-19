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
// Google Sign-In requires native modules - comment out for Expo Go
// To enable: Run `npx expo prebuild` or create a development build with EAS
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; password?: string }>();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors: { [key: string]: string } = {};

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

  useEffect(() => {
    if (params?.email || params?.password) {
      setFormData({
        email: params.email || "",
        password: params.password || "",
      });
    }

    // Google Sign-In configuration (disabled for Expo Go)
    // GoogleSignin.configure({
    //   iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    //   webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    //   offlineAccess: false,
    //   forceCodeForRefreshToken: false,
    // });
  }, [params?.email, params?.password]);

  const handleLogin = async () => {
    if (!validateForm()) return;
    if (loading) return;

    setLoading(true);
    try {
      const res = await api.post(API_CONFIG.ENDPOINTS.SIGNINEMS, formData);

      try {
        await SecureStore.setItemAsync("auth_token", res.token);
        if (res.user) {
          await SecureStore.setItemAsync("user", JSON.stringify(res.user));
        }
      } catch (error) {
        // Fallback to AsyncStorage if SecureStore fails
        await AsyncStorage.setItem("auth_token", res.token);
        if (res.user) {
          await AsyncStorage.setItem("user", JSON.stringify(res.user));
        }
      }

      setAlert({
        visible: true,
        type: "success",
        message: "Login successful!",
      });
      setTimeout(() => router.replace("/courseList"), TIMING.SUCCESS_REDIRECT_DELAY);
    } catch (error: any) {
      setAlert({
        visible: true,
        type: "error",
        message: error.message || "Incorrect username/password",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In implementation (disabled for Expo Go)
  // const handleGoogleLogin = async () => {
  //   if (googleLoading) return;
  //   setGoogleLoading(true);
  //
  //   try {
  //     await GoogleSignin.hasPlayServices({
  //       showPlayServicesUpdateDialog: true,
  //     });
  //     const userInfo = await GoogleSignin.signIn();
  //     const idToken = userInfo.data?.idToken;
  //
  //     const res = await api.post(API_CONFIG.ENDPOINTS.GOOGLE_AUTH, {
  //       id_token: idToken,
  //     });
  //
  //     await SecureStore.setItemAsync("auth_token", res.token);
  //     if (res.user) {
  //       await SecureStore.setItemAsync("user", JSON.stringify(res.user));
  //     }
  //
  //     setAlert({
  //       visible: true,
  //       type: "success",
  //       message: "Login successful!",
  //     });
  //
  //     setTimeout(() => router.replace("/home"), TIMING.SUCCESS_REDIRECT_DELAY);
  //   } catch (error: any) {
  //     setAlert({
  //       visible: true,
  //       type: "error",
  //       message: error.message || "Google sign-in failed",
  //     });
  //   } finally {
  //     setGoogleLoading(false);
  //   }
  // };

  const handleSocialLogin = (provider: "Google" | "Apple") => {
    setAlert({
      visible: true,
      type: "info",
      message: `${provider} Sign-In requires a development build. Run "npx expo prebuild" to enable.`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
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
                <Ionicons name="lock-closed" size={32} color={colors.white} />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
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
              placeholder="Enter your password"
              value={formData.password}
              secureTextEntry={!showPassword}
              onChangeText={(text: string) => handleChange("password", text)}
              error={fieldErrors.password}
              icon="lock-closed-outline"
              isPassword={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              // onPress={handleLogin}
              onPress={() => router.push("/courseList")}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/signUpGoogle")}
              >
                <Text style={styles.signUpLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.buttonPrimary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
  },
  formCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.sm,
    color: colors.buttonPrimary,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: BORDER_RADIUS.lg,
    height: INPUT_HEIGHT.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    shadowColor: colors.buttonPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: FONT_SIZE.base,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  dividerText: {
    fontSize: FONT_SIZE.sm,
    color: colors.gray400,
    fontWeight: "500",
    marginHorizontal: SPACING.md,
  },
  socialButtons: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    height: INPUT_HEIGHT.md,
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingHorizontal: SPACING.md,
  },
  socialButtonText: {
    fontSize: FONT_SIZE.sm,
    color: colors.gray800,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: colors.gray500,
  },
  signUpLink: {
    fontSize: FONT_SIZE.sm,
    color: colors.buttonPrimary,
    fontWeight: "700",
  },
});
