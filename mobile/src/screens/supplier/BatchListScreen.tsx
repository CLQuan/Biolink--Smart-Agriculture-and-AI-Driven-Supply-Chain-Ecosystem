import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { mockBatches } from '../../mockData';
import { CropBatch, BatchStatus } from '../../types';

type FilterTab = 'all' | BatchStatus;

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

function GradeBadge({ grade }: { grade: CropBatch['grade'] }) {
  const cfg: Record<CropBatch['grade'], { bg: string; border: string }> = {
    A: { bg: colors.success, border: '#388E3C' },
    B: { bg: colors.accent, border: '#E65100' },
    C: { bg: colors.warning, border: '#E65100' },
    Rejected: { bg: colors.danger, border: '#B71C1C' },
  };
  const c = cfg[grade];
  return (
    <View style={[styles.gradeBadge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={styles.gradeBadgeText}>{grade}</Text>
    </View>
  );
}

function SyncStatusPill({ syncStatus }: { syncStatus: CropBatch['syncStatus'] }) {
  const cfg = {
    synced: { icon: 'cloud-done' as const, color: colors.success, label: 'Synced' },
    pending: { icon: 'cloud-upload-outline' as const, color: colors.accent, label: 'Pending' },
    failed: { icon: 'cloud-offline-outline' as const, color: colors.danger, label: 'Failed' },
  };
  const c = cfg[syncStatus];
  return (
    <View style={[styles.syncPill, { borderColor: c.color + '50', backgroundColor: c.color + '12' }]}>
      <Ionicons name={c.icon} size={12} color={c.color} />
      <Text style={[styles.syncPillText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

function StatusPill({ status }: { status: BatchStatus }) {
  const cfg: Record<BatchStatus, { color: string; label: string }> = {
    pending: { color: colors.accent, label: 'Pending' },
    approved: { color: colors.success, label: 'Approved' },
    rejected: { color: colors.danger, label: 'Rejected' },
    synced: { color: colors.primary, label: 'Synced' },
  };
  const c = cfg[status];
  return (
    <View style={[styles.statusPill, { backgroundColor: c.color + '15', borderColor: c.color + '40' }]}>
      <Text style={[styles.statusPillText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

function BatchCard({ batch }: { batch: CropBatch }) {
  return (
    <View style={styles.batchCard}>
      {/* Left accent bar colored by grade */}
      <View
        style={[
          styles.batchAccent,
          {
            backgroundColor:
              batch.grade === 'A'
                ? colors.success
                : batch.grade === 'B'
                ? colors.accent
                : colors.danger,
          },
        ]}
      />

      <View style={styles.batchBody}>
        {/* Row 1: ID + Grade badge */}
        <View style={styles.batchRow1}>
          <Text style={styles.batchId}>{batch.batchId}</Text>
          <GradeBadge grade={batch.grade} />
        </View>

        {/* Row 2: Crop type + weight */}
        <View style={styles.batchRow2}>
          <Ionicons name="leaf-outline" size={13} color={colors.primary} />
          <Text style={styles.batchCropText}>
            {batch.cropType} · {batch.weight} kg
          </Text>
        </View>

        {/* Row 3: Farm + Date */}
        <View style={styles.batchRow3}>
          <Ionicons name="location-outline" size={13} color={colors.textMid} />
          <Text style={styles.batchFarmText}>{batch.farmName}</Text>
          <View style={styles.batchDot} />
          <Ionicons name="calendar-outline" size={13} color={colors.textMid} />
          <Text style={styles.batchDateText}>{batch.date}</Text>
        </View>

        {/* Row 4: Confidence + Status + Sync */}
        <View style={styles.batchRow4}>
          <View style={styles.confidencePill}>
            <Ionicons name="analytics-outline" size={12} color={colors.primaryLight} />
            <Text style={styles.confidenceText}>{batch.gradeConfidence.toFixed(1)}%</Text>
          </View>
          <StatusPill status={batch.status} />
          <SyncStatusPill syncStatus={batch.syncStatus} />
        </View>

        {/* Notes preview */}
        <Text style={styles.batchNotes} numberOfLines={1}>
          {batch.notes}
        </Text>
      </View>
    </View>
  );
}

export default function BatchListScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredBatches = mockBatches.filter((b) => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

  const counts: Record<FilterTab, number> = {
    all: mockBatches.length,
    pending: mockBatches.filter((b) => b.status === 'pending').length,
    approved: mockBatches.filter((b) => b.status === 'approved').length,
    rejected: mockBatches.filter((b) => b.status === 'rejected').length,
    synced: mockBatches.filter((b) => b.status === 'synced').length,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.headerContent}>
          <Ionicons name="list" size={20} color={colors.secondary} />
          <Text style={styles.headerTitle}>Batch Management</Text>
        </View>
        <Text style={styles.headerSub}>{mockBatches.length} total batches · Ladang Hijau Ahmad</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterTab, activeFilter === f.key && styles.filterTabActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === f.key && styles.filterTabTextActive,
                ]}
              >
                {f.label}
              </Text>
              <View
                style={[
                  styles.filterCount,
                  activeFilter === f.key && styles.filterCountActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    activeFilter === f.key && styles.filterCountTextActive,
                  ]}
                >
                  {counts[f.key]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Batch List */}
      <FlatList
        data={filteredBatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BatchCard batch={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={48} color={colors.border} />
            <Text style={styles.emptyTitle}>No batches found</Text>
            <Text style={styles.emptyText}>No batches match the selected filter.</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: spacing.xl }} />}
      />
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
  filterRow: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMid,
  },
  filterTabTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  filterCount: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMid,
  },
  filterCountTextActive: {
    color: colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  batchCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  batchAccent: {
    width: 5,
  },
  batchBody: {
    flex: 1,
    padding: spacing.md,
  },
  batchRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  batchId: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    letterSpacing: 0.3,
  },
  gradeBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.surface,
  },
  batchRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  batchCropText: {
    fontSize: 13,
    color: colors.textMid,
    fontWeight: '500',
  },
  batchRow3: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  batchFarmText: {
    fontSize: 12,
    color: colors.textMid,
  },
  batchDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  batchDateText: {
    fontSize: 12,
    color: colors.textMid,
  },
  batchRow4: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
  },
  confidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: 3,
  },
  confidenceText: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  statusPill: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    gap: 3,
  },
  syncPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  batchNotes: {
    fontSize: 12,
    color: colors.textMid,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
});
