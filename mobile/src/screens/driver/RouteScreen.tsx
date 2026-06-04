import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { mockRouteStops, mockShipment } from '../../mockData';
import { RouteStop } from '../../types';

function RouteStopItem({
  stop,
  isLast,
}: {
  stop: RouteStop;
  isLast: boolean;
}) {
  const isCurrent = stop.status === 'current';
  const isCompleted = stop.status === 'completed';
  const isUpcoming = stop.status === 'upcoming';

  return (
    <View style={styles.stopRow}>
      {/* Timeline column */}
      <View style={styles.timelineCol}>
        {/* Dot */}
        <View
          style={[
            styles.stopDot,
            isCompleted && styles.stopDotCompleted,
            isCurrent && styles.stopDotCurrent,
            isUpcoming && styles.stopDotUpcoming,
          ]}
        >
          {isCompleted && <Ionicons name="checkmark" size={12} color={colors.surface} />}
          {isCurrent && <View style={styles.stopDotCurrentInner} />}
          {isUpcoming && <View style={styles.stopDotUpcomingInner} />}
        </View>
        {/* Line below dot (not for last item) */}
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              isCompleted ? styles.timelineLineCompleted : styles.timelineLinePending,
            ]}
          />
        )}
      </View>

      {/* Content */}
      <View style={[styles.stopContent, !isLast && styles.stopContentPadded]}>
        <View style={styles.stopHeader}>
          <View style={styles.stopTitleRow}>
            <Text
              style={[
                styles.stopName,
                isCurrent && styles.stopNameCurrent,
                isUpcoming && styles.stopNameUpcoming,
              ]}
            >
              {stop.name}
            </Text>
            {stop.isDestination && (
              <View style={styles.destinationBadge}>
                <Ionicons name="flag" size={10} color={colors.surface} />
                <Text style={styles.destinationBadgeText}>Destination</Text>
              </View>
            )}
          </View>
          <View style={styles.stopTimeRow}>
            <Ionicons
              name={isCompleted ? 'time' : isCurrent ? 'navigate' : 'time-outline'}
              size={12}
              color={
                isCompleted ? colors.success : isCurrent ? colors.primary : colors.textMid
              }
            />
            <Text
              style={[
                styles.stopTime,
                isCompleted && styles.stopTimeCompleted,
                isCurrent && styles.stopTimeCurrent,
              ]}
            >
              {isCurrent ? 'Now · ' : isUpcoming ? 'ETA ' : ''}{stop.time}
            </Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>Completed</Text>
              </View>
            )}
            {isCurrent && (
              <View style={styles.currentBadge}>
                <View style={styles.currentBadgeDot} />
                <Text style={styles.currentBadgeText}>Current Location</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function RouteScreen() {
  const completedCount = mockRouteStops.filter(s => s.status === 'completed').length;
  const totalStops = mockRouteStops.length;

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Contact',
      'Call dispatch center?\n\n📞 BioLink Dispatch: +60-3-1234-5678',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.headerContent}>
          <Ionicons name="map" size={20} color={colors.secondary} />
          <Text style={styles.headerTitle}>Route Tracking</Text>
        </View>
        <View style={styles.headerRouteRow}>
          <Ionicons name="location" size={13} color={colors.secondary} />
          <Text style={styles.headerRoute}>
            {mockShipment.origin} → {mockShipment.destination}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Schedule Status */}
        <View style={[styles.scheduleCard, mockShipment.onSchedule ? styles.scheduleOnTime : styles.scheduleDelayed]}>
          <View style={styles.scheduleLeft}>
            <Ionicons
              name={mockShipment.onSchedule ? 'checkmark-circle' : 'alert-circle'}
              size={22}
              color={mockShipment.onSchedule ? colors.success : colors.accent}
            />
            <View>
              <Text
                style={[
                  styles.scheduleStatus,
                  { color: mockShipment.onSchedule ? colors.success : colors.accent },
                ]}
              >
                {mockShipment.onSchedule ? 'On Schedule' : 'Slightly Delayed'}
              </Text>
              <Text style={styles.scheduleDetail}>ETA: 14:15 · {mockShipment.etaDisplay} remaining</Text>
            </View>
          </View>
          <View style={styles.scheduleRight}>
            <Text style={styles.scheduleSpeed}>{mockShipment.currentSpeedKmh}</Text>
            <Text style={styles.scheduleSpeedUnit}>km/h</Text>
          </View>
        </View>

        {/* Journey Stats */}
        <Text style={styles.sectionTitle}>Journey Statistics</Text>
        <View style={styles.journeyStatsCard}>
          <View style={styles.journeyStatItem}>
            <View style={[styles.journeyStatIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="speedometer-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.journeyStatValue}>{mockShipment.distanceKm} km</Text>
            <Text style={styles.journeyStatLabel}>Total Distance</Text>
          </View>
          <View style={styles.journeyStatDivider} />
          <View style={styles.journeyStatItem}>
            <View style={[styles.journeyStatIcon, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="time-outline" size={20} color={colors.accent} />
            </View>
            <Text style={styles.journeyStatValue}>{mockShipment.elapsedDisplay}</Text>
            <Text style={styles.journeyStatLabel}>Elapsed</Text>
          </View>
          <View style={styles.journeyStatDivider} />
          <View style={styles.journeyStatItem}>
            <View style={[styles.journeyStatIcon, { backgroundColor: colors.success + '15' }]}>
              <MaterialCommunityIcons name="map-clock-outline" size={20} color={colors.success} />
            </View>
            <Text style={styles.journeyStatValue}>{mockShipment.remainingDisplay}</Text>
            <Text style={styles.journeyStatLabel}>Remaining</Text>
          </View>
        </View>

        {/* Route Progress Summary */}
        <View style={styles.progressSummaryRow}>
          <Text style={styles.sectionTitle}>Route Progress</Text>
          <Text style={styles.progressFraction}>{completedCount}/{totalStops} stops</Text>
        </View>

        <View style={styles.progressBarCard}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(completedCount / totalStops) * 100}%` as any }]} />
            {/* Current position marker */}
            <View style={[styles.progressCurrentMarker, { left: `${((completedCount + 0.5) / totalStops) * 100}%` as any }]}>
              <MaterialCommunityIcons name="truck" size={14} color={colors.surface} />
            </View>
          </View>
        </View>

        {/* Route Timeline */}
        <Text style={styles.sectionTitle}>Route Timeline</Text>
        <View style={styles.timelineCard}>
          {mockRouteStops.map((stop, index) => (
            <RouteStopItem
              key={stop.id}
              stop={stop}
              isLast={index === mockRouteStops.length - 1}
            />
          ))}
        </View>

        {/* Emergency Contact */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergency}
          activeOpacity={0.85}
        >
          <View style={styles.emergencyIcon}>
            <Ionicons name="call" size={18} color={colors.danger} />
          </View>
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency Contact</Text>
            <Text style={styles.emergencyDetail}>Call BioLink dispatch center</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.danger} />
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
  headerRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerRoute: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    ...shadows.card,
  },
  scheduleOnTime: {
    backgroundColor: colors.success + '0D',
    borderColor: colors.success + '40',
  },
  scheduleDelayed: {
    backgroundColor: colors.accent + '0D',
    borderColor: colors.accent + '40',
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  scheduleStatus: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  scheduleDetail: {
    fontSize: 12,
    color: colors.textMid,
  },
  scheduleRight: {
    alignItems: 'center',
  },
  scheduleSpeed: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textDark,
    lineHeight: 30,
  },
  scheduleSpeedUnit: {
    fontSize: 11,
    color: colors.textMid,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  journeyStatsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  journeyStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  journeyStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyStatValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
  },
  journeyStatLabel: {
    fontSize: 10,
    color: colors.textMid,
    textAlign: 'center',
  },
  journeyStatDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  progressSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressFraction: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBarCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  progressBarBg: {
    height: 20,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'visible',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressCurrentMarker: {
    position: 'absolute',
    top: 3,
    width: 14,
    height: 14,
    marginLeft: -7,
    backgroundColor: colors.accent,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  stopRow: {
    flexDirection: 'row',
  },
  timelineCol: {
    width: 32,
    alignItems: 'center',
  },
  stopDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stopDotCompleted: {
    backgroundColor: colors.success,
  },
  stopDotCurrent: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  stopDotUpcoming: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  stopDotCurrentInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  stopDotUpcomingInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginTop: 2,
  },
  timelineLineCompleted: {
    backgroundColor: colors.success,
  },
  timelineLinePending: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  stopContent: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  stopContentPadded: {
    paddingBottom: spacing.md,
  },
  stopHeader: {},
  stopTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  stopName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMid,
  },
  stopNameCurrent: {
    fontWeight: '800',
    color: colors.primary,
    fontSize: 16,
  },
  stopNameUpcoming: {
    color: colors.textMid,
    fontWeight: '500',
  },
  destinationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 3,
  },
  destinationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.surface,
  },
  stopTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  stopTime: {
    fontSize: 13,
    color: colors.textMid,
  },
  stopTimeCompleted: {
    color: colors.success,
    fontWeight: '500',
  },
  stopTimeCurrent: {
    color: colors.primary,
    fontWeight: '700',
  },
  completedBadge: {
    backgroundColor: colors.success + '18',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.success,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  currentBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger + '0D',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger + '30',
    gap: spacing.md,
    ...shadows.card,
  },
  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.danger + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 2,
  },
  emergencyDetail: {
    fontSize: 12,
    color: colors.textMid,
  },
});
