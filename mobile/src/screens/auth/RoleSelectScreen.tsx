import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';

type RoleSelectNavigationProp = StackNavigationProp<RootStackParamList, 'RoleSelect'>;

interface Props {
  navigation: RoleSelectNavigationProp;
}

interface RoleCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  iconBg: string;
  onPress: () => void;
  features: string[];
}

function RoleCard({
  emoji,
  title,
  subtitle,
  description,
  accentColor,
  iconBg,
  onPress,
  features,
}: RoleCardProps) {
  return (
    <TouchableOpacity style={styles.roleCard} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.roleIconCircle, { backgroundColor: iconBg }]}>
        <Text style={styles.roleEmoji}>{emoji}</Text>
      </View>
      <View style={[styles.roleAccentBar, { backgroundColor: accentColor }]} />
      <Text style={styles.roleTitle}>{title}</Text>
      <Text style={styles.roleSubtitle}>{subtitle}</Text>
      <Text style={styles.roleDescription}>{description}</Text>

      <View style={styles.featureList}>
        {features.map((f, i) => (
          <View key={i} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={14} color={accentColor} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.roleButton, { backgroundColor: accentColor }]}>
        <Text style={styles.roleButtonText}>Continue as {subtitle}</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.surface} style={{ marginLeft: 6 }} />
      </View>
    </TouchableOpacity>
  );
}

export default function RoleSelectScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeafBg1} />
        <View style={styles.headerLeafBg2} />
        <View style={styles.logoRow}>
          <View style={styles.logoMini}>
            <Ionicons name="leaf" size={18} color={colors.surface} />
          </View>
          <Text style={styles.headerBrand}>BioLink</Text>
        </View>
        <Text style={styles.headerTitle}>Select Your Role</Text>
        <Text style={styles.headerSubtitle}>Choose how you use the BioLink ecosystem today</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RoleCard
          emoji="🌿"
          title="Supplier / Farmer"
          subtitle="Supplier"
          description="Manage your harvest batches, grade crops with AI, and sync data to the BioLink network."
          accentColor={colors.primary}
          iconBg="rgba(45,90,27,0.10)"
          onPress={() => navigation.navigate('SupplierTabs')}
          features={[
            'AI crop grading with camera',
            'Batch management & tracking',
            'Offline data sync',
          ]}
        />

        <RoleCard
          emoji="🚛"
          title="Driver / Transporter"
          subtitle="Driver"
          description="Monitor cold-chain sensors on crates, track your delivery route, and confirm deliveries with QR scan."
          accentColor={colors.accent}
          iconBg="rgba(255,143,0,0.10)"
          onPress={() => navigation.navigate('DriverTabs')}
          features={[
            'BLE temperature monitoring',
            'Live route & ETA tracking',
            'QR crate delivery confirmation',
          ]}
        />

        {/* Back link */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={16} color={colors.textMid} />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerLeafBg1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primaryLight,
    opacity: 0.3,
    top: -50,
    right: -30,
  },
  headerLeafBg2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    opacity: 0.2,
    bottom: -20,
    left: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoMini: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  roleIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  roleEmoji: {
    fontSize: 36,
  },
  roleAccentBar: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  roleSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMid,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  roleDescription: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  featureList: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    color: colors.textMid,
    flex: 1,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
  },
  roleButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  backText: {
    ...typography.body,
    color: colors.textMid,
    marginLeft: spacing.xs,
  },
});
