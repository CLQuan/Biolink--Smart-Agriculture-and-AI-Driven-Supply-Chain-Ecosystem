import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('RoleSelect');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Green Header Section */}
          <View style={styles.header}>
            {/* Decorative leaf motif circles */}
            <View style={styles.leafCircle1} />
            <View style={styles.leafCircle2} />

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIconWrapper}>
                <Ionicons name="leaf" size={36} color={colors.surface} />
              </View>
              <Text style={styles.logoText}>BioLink</Text>
            </View>
            <Text style={styles.subtitle}>Smart Agriculture Ecosystem</Text>
            <Text style={styles.tagline}>Cameron Highlands → Johor / Singapore</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Sign In</Text>
            <Text style={styles.formSubtitle}>Welcome back to BioLink</Text>

            {/* Email Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={emailFocused ? colors.primary : colors.textMid}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.border}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={passwordFocused ? colors.primary : colors.textMid}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, styles.textInputPassword]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.border}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.visibilityToggle}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={colors.textMid}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, loading && styles.signInButtonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={colors.surface} size="small" />
              ) : (
                <>
                  <Ionicons name="leaf" size={18} color={colors.surface} style={styles.btnIcon} />
                  <Text style={styles.signInText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Demo hint */}
            <View style={styles.demoHint}>
              <Ionicons name="information-circle-outline" size={14} color={colors.textMid} />
              <Text style={styles.demoText}>Demo: tap Sign In to continue</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeaves}>
              <Ionicons name="leaf" size={14} color={colors.secondary} />
              <Ionicons name="leaf" size={10} color={colors.primaryLight} style={styles.footerLeaf2} />
              <Ionicons name="leaf" size={14} color={colors.secondary} style={styles.footerLeaf3} />
            </View>
            <Text style={styles.footerText}>© 2024 BioLink Sdn Bhd · Cameron Highlands, Malaysia</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  leafCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primaryLight,
    opacity: 0.3,
    top: -60,
    right: -40,
  },
  leafCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    opacity: 0.15,
    bottom: 20,
    left: -30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logoIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '400',
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    ...shadows.card,
  },
  formTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textDark,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
    height: '100%',
  },
  textInputPassword: {
    flex: 1,
  },
  visibilityToggle: {
    padding: spacing.xs,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.xs,
  },
  forgotText: {
    fontSize: 13,
    color: colors.primaryLight,
    fontWeight: '500',
  },
  signInButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.header,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  btnIcon: {
    marginRight: spacing.sm,
  },
  signInText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  demoText: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  footer: {
    backgroundColor: colors.background,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  footerLeaves: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
  },
  footerLeaf2: {
    marginHorizontal: spacing.xs,
    transform: [{ rotate: '20deg' }],
  },
  footerLeaf3: {
    transform: [{ scaleX: -1 }],
  },
  footerText: {
    ...typography.caption,
    textAlign: 'center',
  },
});
