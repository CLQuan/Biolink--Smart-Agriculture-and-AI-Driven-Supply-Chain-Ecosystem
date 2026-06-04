import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SupplierTabParamList } from '../../types';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { mockBatches, mockTodaySummary, mockUser } from '../../mockData';
import { CropBatch } from '../../types';

type SupplierHomeNavProp = BottomTabNavigationProp<SupplierTabParamList, 'SupplierHome'>;

interface Props {
  navigation: SupplierHomeNavProp;
}

function GradeBadge({ grade }: { grade: CropBatch['grade'] }) {
  const badgeColors: Record<CropBatch['grade'], string> = {
    A: colors.success,
    B: colors.accent,
    C: colors.warning,
    Rejected: colors.danger,
  };
  return (
    <View style={[styles.gradeBadge, { backgroundColor: badgeColors[grade] }]}>
      <Text style={styles.gradeBadgeText}>{grade}</Text>
    </View>
  );
}

function SyncIcon({ syncStatus }: { syncStatus: CropBatch['syncStatus'] }) {
  if (syncStatus === 'synced') {
    return <Ionicons name="cloud-done" size={16} color={colors.success} />;
  } else if (syncStatus === 'pending') {
    return <Ionicons name="cloud-upload-outline" size={16} color={colors.accent} />;
  }
  return <Ionicons name="cloud-offline-outline" size={16} color={colors.danger} />;
}

export default function SupplierHomeScreen({ navigation }: Props) {
  const [isOnline, setIsOnline] = useState(true);
  const recentBatches = mockBatches.slice(0, 3);
  const today = new Date().toLocaleDateString('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBg1} />
        <View style={styles.headerBg2} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.userName}>{mockUser.supplier.name} 👋</Text>
            <Text style={styles.headerDate}>{today}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.farmBadge}>
              <Ionicons name="leaf" size={12} color={colors.secondary} />
              <Text style={styles.farmBadgeText} numberOfLines={1}>
                {mockUser.supplier.farmName}
              </Text>
            </View>
          </View>
        </View>

        {/* Online status bar */}
        <View style={styles.statusBar}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.secondary : colors.accent }]} />
          <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: colors.accent + '60', true: colors.secondary + '80' }}
            thumbColor={isOnline ? colors.secondary : colors.accent}
            style={styles.statusSwitch}
          />
          <Text style={styles.lastSyncText}>Last sync: 2 min ago</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.quickCard, styles.quickCardPrimary]}
            onPress={() => navigation.navigate('Grading')}
            activeOpacity={0.85}
          >
            <View style={styles.quickIconCircle}>
              <Ionicons name="camera" size={26} color={colors.surface} />
            </View>
            <Text style={styles.quickCardTitle}>Grade Crop</Text>
            <Text style={styles.quickCardSub}>AI camera grading</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, styles.quickCardSecondary]}
            onPress={() => navigation.navigate('BatchList')}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: colors.accent + '30' }]}>
              <Ionicons name="list" size={26} color={colors.accent} />
            </View>
            <Text style={[styles.quickCardTitle, { color: colors.textDark }]}>View Batches</Text>
            <Text style={styles.quickCardSub}>Manage harvests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, styles.quickCardSync]}
            onPress={() => navigation.navigate('SyncStatus')}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: colors.primaryLight + '30' }]}>
              <Ionicons name="cloud-upload-outline" size={26} color={colors.primary} />
            </View>
            <Text style={[styles.quickCardTitle, { color: colors.textDark }]}>Sync Data</Text>
            <Text style={styles.quickCardSub}>2 min ago</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeafDecor}>
            <Ionicons name="leaf" size={60} color={colors.primary} style={{ opacity: 0.06 }} />
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{mockTodaySummary.gradedToday}</Text>
              <Text style={styles.summaryLabel}>Graded Today</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.accent }]}>
                {mockTodaySummary.pendingSync}
              </Text>
              <Text style={styles.summaryLabel}>Pending Sync</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                {mockTodaySummary.approved}
              </Text>
              <Text style={styles.summaryLabel}>Approved</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.danger }]}>
                {mockTodaySummary.rejected}
              </Text>
              <Text style={styles.summaryLabel}>Rejected</Text>
            </View>
          </View>
        </View>

        {/* Recent Batches */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Batches</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BatchList')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentBatches.map((batch) => (
          <View key={batch.id} style={styles.batchCard}>
            <View style={styles.batchLeft}>
              <GradeBadge grade={batch.grade} />
            </View>
            <View style={styles.batchMiddle}>
              <Text style={styles.batchId}>{batch.batchId}</Text>
              <Text style={styles.batchCrop}>{batch.cropType} · {batch.weight}kg</Text>
              <Text style={styles.batchDate}>{batch.date}</Text>
            </View>
            <View style={styles.batchRight}>
              <SyncIcon syncStatus={batch.syncStatus} />
              <Text style={styles.batchConfidence}>{batch.gradeConfidence.toFixed(0)}%</Text>
            </View>
          </View>
        ))}

        {/* CTA banner */}
        <TouchableOpacity
          style={styles.ctaBanner}
          onPress={() => navigation.navigate('Grading')}
          activeOpacity={0.9}
        >
          <Ionicons name="camera-outline" size={24} color={colors.surface} />
          <View style={styles.ctaBannerText}>
            <Text style={styles.ctaBannerTitle}>Ready to grade more crops?</Text>
            <Text style={styles.ctaBannerSub}>Tap to open the AI grading camera</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color={colors.secondary} />
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
    paddingBottom: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  headerBg1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    opacity: 0.35,
    top: -50,
    right: -30,
  },
  headerBg2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    opacity: 0.15,
    bottom: -20,
    left: -10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: 2,
  },
  headerDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  headerRight: {
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  farmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
    maxWidth: 140,
  },
  farmBadgeText: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: colors.surface,
    fontWeight: '600',
    flex: 1,
  },
  statusSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  lastSyncText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  seeAllText: {
    fontSize: 13,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    ...shadows.card,
  },
  quickCardPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  quickCardSecondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  quickCardSync: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: 2,
  },
  quickCardSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.70)',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.card,
  },
  summaryLeafDecor: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  summaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 34,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textMid,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  batchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  batchLeft: {
    marginRight: spacing.md,
  },
  gradeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeBadgeText: {
    color: colors.surface,
    fontWeight: '800',
    fontSize: 14,
  },
  batchMiddle: {
    flex: 1,
  },
  batchId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  batchCrop: {
    fontSize: 12,
    color: colors.textMid,
    marginBottom: 2,
  },
  batchDate: {
    fontSize: 11,
    color: colors.border,
  },
  batchRight: {
    alignItems: 'center',
    gap: 4,
  },
  batchConfidence: {
    fontSize: 11,
    color: colors.textMid,
    fontWeight: '600',
  },
  ctaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  ctaBannerText: {
    flex: 1,
  },
  ctaBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: 2,
  },
  ctaBannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
});
