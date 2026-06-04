import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { mockSyncHistory, mockBatches } from '../../mockData';
import { SyncRecord } from '../../types';

function SyncStatusIcon({ status }: { status: SyncRecord['status'] }) {
  if (status === 'success') {
    return (
      <View style={[styles.syncIconCircle, { backgroundColor: colors.success + '20' }]}>
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      </View>
    );
  } else if (status === 'partial') {
    return (
      <View style={[styles.syncIconCircle, { backgroundColor: colors.accent + '20' }]}>
        <Ionicons name="alert-circle" size={20} color={colors.accent} />
      </View>
    );
  }
  return (
    <View style={[styles.syncIconCircle, { backgroundColor: colors.danger + '20' }]}>
      <Ionicons name="close-circle" size={20} color={colors.danger} />
    </View>
  );
}

export default function SyncStatusScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const pendingBatches = mockBatches.filter((b) => b.syncStatus === 'pending').length;
  const failedBatches = mockBatches.filter((b) => b.syncStatus === 'failed').length;
  const syncedBatches = mockBatches.filter((b) => b.syncStatus === 'synced').length;

  const dataUsageKB = mockBatches.length * 12.4;

  const handleSyncNow = () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);
    setSyncDone(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncDone(true);
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.headerContent}>
          <Ionicons name="cloud-upload" size={20} color={colors.secondary} />
          <Text style={styles.headerTitle}>Data Sync</Text>
        </View>
        <Text style={styles.headerSub}>Manage batch uploads to BioLink cloud</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Connection Status Card */}
        <View style={[styles.connectionCard, isOnline ? styles.connectionCardOnline : styles.connectionCardOffline]}>
          <View style={styles.connectionLeft}>
            <View style={[styles.connectionDot, { backgroundColor: isOnline ? colors.success : colors.accent }]}>
              {isOnline && <View style={styles.connectionDotPulse} />}
            </View>
            <View>
              <Text style={[styles.connectionStatus, { color: isOnline ? colors.success : colors.accent }]}>
                {isOnline ? 'Connected' : 'Offline Mode'}
              </Text>
              <Text style={styles.connectionDetail}>
                {isOnline ? 'BioLink Cloud · High signal' : 'Working offline — data will sync when connected'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.toggleOnlineBtn, { backgroundColor: isOnline ? colors.success + '20' : colors.accent + '20' }]}
            onPress={() => setIsOnline(!isOnline)}
          >
            <Text style={[styles.toggleOnlineText, { color: isOnline ? colors.success : colors.accent }]}>
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sync Queue */}
        <Text style={styles.sectionTitle}>Sync Queue</Text>
        <View style={styles.queueCard}>
          <View style={styles.queueRow}>
            <View style={[styles.queueIconBox, { backgroundColor: colors.accent + '18' }]}>
              <Ionicons name="time-outline" size={22} color={colors.accent} />
            </View>
            <View style={styles.queueInfo}>
              <Text style={styles.queueCount}>{pendingBatches} batches pending upload</Text>
              <Text style={styles.queueDetail}>Awaiting internet connection or manual sync</Text>
            </View>
          </View>

          {failedBatches > 0 && (
            <View style={[styles.queueRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md }]}>
              <View style={[styles.queueIconBox, { backgroundColor: colors.danger + '18' }]}>
                <Ionicons name="alert-circle-outline" size={22} color={colors.danger} />
              </View>
              <View style={styles.queueInfo}>
                <Text style={[styles.queueCount, { color: colors.danger }]}>
                  {failedBatches} batches failed
                </Text>
                <Text style={styles.queueDetail}>Will retry on next sync attempt</Text>
              </View>
            </View>
          )}

          {/* Sync Now Button */}
          <TouchableOpacity
            style={[
              styles.syncNowButton,
              (!isOnline || isSyncing) && styles.syncNowDisabled,
              syncDone && styles.syncNowSuccess,
            ]}
            onPress={handleSyncNow}
            disabled={!isOnline || isSyncing}
            activeOpacity={0.85}
          >
            {isSyncing ? (
              <>
                <ActivityIndicator color={colors.surface} size="small" />
                <Text style={styles.syncNowText}>Syncing...</Text>
              </>
            ) : syncDone ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
                <Text style={styles.syncNowText}>Sync Complete!</Text>
              </>
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={20} color={colors.surface} />
                <Text style={styles.syncNowText}>
                  {isOnline ? 'Sync Now' : 'Offline — Cannot Sync'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Data Storage Stats */}
        <Text style={styles.sectionTitle}>Local Storage</Text>
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="server-outline" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{mockBatches.length}</Text>
              <Text style={styles.statLabel}>Stored Locally</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="cloud-done-outline" size={24} color={colors.success} />
              <Text style={[styles.statValue, { color: colors.success }]}>{syncedBatches}</Text>
              <Text style={styles.statLabel}>Synced</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="save-outline" size={24} color={colors.accent} />
              <Text style={[styles.statValue, { color: colors.accent }]}>
                {dataUsageKB.toFixed(0)} KB
              </Text>
              <Text style={styles.statLabel}>Data Used</Text>
            </View>
          </View>

          {/* Storage bar */}
          <View style={styles.storageBarSection}>
            <View style={styles.storageBarRow}>
              <Text style={styles.storageBarLabel}>Storage Usage</Text>
              <Text style={styles.storageBarPct}>
                {((syncedBatches / mockBatches.length) * 100).toFixed(0)}% synced
              </Text>
            </View>
            <View style={styles.storageBarBg}>
              <View
                style={[
                  styles.storageBarFill,
                  { width: `${(syncedBatches / mockBatches.length) * 100}%` as any },
                ]}
              />
              {pendingBatches > 0 && (
                <View
                  style={[
                    styles.storageBarPending,
                    { width: `${(pendingBatches / mockBatches.length) * 100}%` as any },
                  ]}
                />
              )}
            </View>
            <View style={styles.storageBarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                <Text style={styles.legendText}>Synced</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>Pending</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
                <Text style={styles.legendText}>Failed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sync History */}
        <Text style={styles.sectionTitle}>Sync History</Text>
        <View style={styles.historyCard}>
          {mockSyncHistory.map((record, index) => (
            <View
              key={record.id}
              style={[styles.historyItem, index < mockSyncHistory.length - 1 && styles.historyItemBorder]}
            >
              <SyncStatusIcon status={record.status} />
              <View style={styles.historyInfo}>
                <Text style={styles.historyMessage}>{record.message}</Text>
                <View style={styles.historyMeta}>
                  <Ionicons name="time-outline" size={12} color={colors.textMid} />
                  <Text style={styles.historyTime}>{record.timestamp}</Text>
                  {record.batchesSynced > 0 && (
                    <>
                      <View style={styles.historyDot} />
                      <Text style={styles.historyBatches}>{record.batchesSynced} batches</Text>
                    </>
                  )}
                </View>
              </View>
              <View
                style={[
                  styles.historyStatusBadge,
                  {
                    backgroundColor:
                      record.status === 'success'
                        ? colors.success + '15'
                        : record.status === 'partial'
                        ? colors.accent + '15'
                        : colors.danger + '15',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.historyStatusText,
                    {
                      color:
                        record.status === 'success'
                          ? colors.success
                          : record.status === 'partial'
                          ? colors.accent
                          : colors.danger,
                    },
                  ]}
                >
                  {record.status === 'success' ? 'OK' : record.status === 'partial' ? 'Partial' : 'Failed'}
                </Text>
              </View>
            </View>
          ))}
        </View>
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
  headerBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
    opacity: 0.3,
    top: -30,
    right: -20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.surface,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
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
    marginTop: spacing.sm,
  },
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    ...shadows.card,
  },
  connectionCardOnline: {
    backgroundColor: colors.success + '0D',
    borderColor: colors.success + '40',
  },
  connectionCardOffline: {
    backgroundColor: colors.accent + '0D',
    borderColor: colors.accent + '40',
  },
  connectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  connectionDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'relative',
  },
  connectionDotPulse: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success + '30',
  },
  connectionStatus: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  connectionDetail: {
    fontSize: 12,
    color: colors.textMid,
    maxWidth: 160,
  },
  toggleOnlineBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  toggleOnlineText: {
    fontSize: 12,
    fontWeight: '700',
  },
  queueCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  queueIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueInfo: {
    flex: 1,
  },
  queueCount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  queueDetail: {
    fontSize: 12,
    color: colors.textMid,
  },
  syncNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xs,
    ...shadows.card,
  },
  syncNowDisabled: {
    backgroundColor: colors.border,
  },
  syncNowSuccess: {
    backgroundColor: colors.success,
  },
  syncNowText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMid,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
  },
  storageBarSection: {
    marginTop: spacing.sm,
  },
  storageBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  storageBarLabel: {
    fontSize: 12,
    color: colors.textMid,
    fontWeight: '500',
  },
  storageBarPct: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  storageBarBg: {
    flexDirection: 'row',
    height: 10,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  storageBarFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  storageBarPending: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  storageBarLegend: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.textMid,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  syncIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyMessage: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '500',
    marginBottom: 4,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyTime: {
    fontSize: 11,
    color: colors.textMid,
  },
  historyDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  historyBatches: {
    fontSize: 11,
    color: colors.textMid,
  },
  historyStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  historyStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
