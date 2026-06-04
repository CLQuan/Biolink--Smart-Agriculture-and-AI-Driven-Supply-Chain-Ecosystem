import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DriverTabParamList } from '../../types';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { mockShipment, mockSensors, mockSensorAlerts, mockUser } from '../../mockData';

type DriverHomeNavProp = BottomTabNavigationProp<DriverTabParamList, 'DriverHome'>;

interface Props {
  navigation: DriverHomeNavProp;
}

export default function DriverHomeScreen({ navigation }: Props) {
  const primarySensor = mockSensors[0];
  const hasAlerts = mockSensorAlerts.length > 0;
  const criticalAlert = mockSensorAlerts.find(a => a.severity === 'critical');
  const warningAlert = mockSensorAlerts.find(a => a.severity === 'warning');
  const alertToShow = criticalAlert || warningAlert;

  const today = new Date().toLocaleDateString('en-MY', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
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
            <Text style={styles.headerLabel}>Driver Dashboard</Text>
            <Text style={styles.driverName}>{mockUser.driver.name}</Text>
            <View style={styles.vehicleRow}>
              <Ionicons name="car-outline" size={13} color={colors.secondary} />
              <Text style={styles.vehiclePlate}>{mockUser.driver.vehiclePlate}</Text>
              <View style={styles.headerDot} />
              <Text style={styles.headerDate}>{today}</Text>
            </View>
          </View>
          <View style={styles.driverAvatarCircle}>
            <MaterialCommunityIcons name="truck-delivery" size={28} color={colors.secondary} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Alert Banner */}
        {hasAlerts && alertToShow && (
          <TouchableOpacity
            style={[
              styles.alertBanner,
              alertToShow.severity === 'critical' ? styles.alertBannerCritical : styles.alertBannerWarning,
            ]}
            onPress={() => navigation.navigate('Sensors')}
            activeOpacity={0.85}
          >
            <Ionicons
              name={alertToShow.severity === 'critical' ? 'alert-circle' : 'warning'}
              size={18}
              color={alertToShow.severity === 'critical' ? colors.danger : colors.warning}
            />
            <Text style={styles.alertBannerText} numberOfLines={1}>
              {alertToShow.message}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMid} />
          </TouchableOpacity>
        )}

        {/* Current Shipment Card */}
        <Text style={styles.sectionTitle}>Current Shipment</Text>
        <View style={styles.shipmentCard}>
          {/* Route header */}
          <View style={styles.shipmentRouteRow}>
            <View style={styles.shipmentOrigin}>
              <View style={styles.routeDotGreen} />
              <Text style={styles.routePlace}>{mockShipment.origin}</Text>
            </View>
            <View style={styles.routeLineContainer}>
              <View style={styles.routeLine} />
              <MaterialCommunityIcons name="truck" size={18} color={colors.accent} style={styles.routeTruck} />
            </View>
            <View style={styles.shipmentDest}>
              <View style={styles.routeDotAccent} />
              <Text style={styles.routePlace}>{mockShipment.destination}</Text>
            </View>
          </View>

          <View style={styles.shipmentDivider} />

          {/* Status row */}
          <View style={styles.shipmentMetaRow}>
            <View style={styles.shipmentMetaItem}>
              <Ionicons name="navigate-outline" size={16} color={colors.primaryLight} />
              <Text style={styles.shipmentMetaLabel}>Status</Text>
              <View style={styles.inTransitBadge}>
                <View style={styles.inTransitDot} />
                <Text style={styles.inTransitText}>In Transit</Text>
              </View>
            </View>
            <View style={styles.shipmentMetaItem}>
              <Ionicons name="time-outline" size={16} color={colors.primaryLight} />
              <Text style={styles.shipmentMetaLabel}>ETA</Text>
              <Text style={styles.shipmentMetaValue}>{mockShipment.etaDisplay}</Text>
            </View>
            <View style={styles.shipmentMetaItem}>
              <MaterialCommunityIcons name="cube-outline" size={16} color={colors.primaryLight} />
              <Text style={styles.shipmentMetaLabel}>Crates</Text>
              <Text style={styles.shipmentMetaValue}>{mockShipment.crateCount}</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Journey Progress</Text>
              <Text style={styles.progressPct}>~56%</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: '56%' }]} />
            </View>
            <View style={styles.progressTimeRow}>
              <Text style={styles.progressTime}>Departed {mockShipment.departureTime}</Text>
              <Text style={styles.progressTime}>ETA 14:15</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Ionicons name="thermometer" size={22} color={colors.success} />
            <Text style={styles.statLabel}>Temperature</Text>
            <Text style={styles.statStatus}>OK ✓</Text>
            <Text style={styles.statValue}>{primarySensor.temperature}°C</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Ionicons name="water" size={22} color={colors.success} />
            <Text style={styles.statLabel}>Humidity</Text>
            <Text style={styles.statStatus}>OK ✓</Text>
            <Text style={styles.statValue}>{primarySensor.humidity}%</Text>
          </View>
          <View style={[styles.statCard, mockShipment.onSchedule ? styles.statCardGreen : styles.statCardAmber]}>
            <Ionicons name="timer" size={22} color={mockShipment.onSchedule ? colors.success : colors.accent} />
            <Text style={styles.statLabel}>Schedule</Text>
            <Text style={[styles.statStatus, { color: mockShipment.onSchedule ? colors.success : colors.accent }]}>
              {mockShipment.onSchedule ? 'On Time ✓' : 'Delayed'}
            </Text>
            <Text style={styles.statValue}>{mockShipment.remainingDisplay}</Text>
          </View>
        </View>

        {/* Sensor Summary */}
        <Text style={styles.sectionTitle}>Sensor Summary</Text>
        <TouchableOpacity
          style={styles.sensorSummaryCard}
          onPress={() => navigation.navigate('Sensors')}
          activeOpacity={0.88}
        >
          <View style={styles.sensorSummaryLeft}>
            <View style={styles.sensorIconCircle}>
              <MaterialCommunityIcons name="bluetooth" size={20} color={colors.surface} />
            </View>
            <View>
              <Text style={styles.sensorSummaryTitle}>BLE Sensors · {mockSensors.length} connected</Text>
              <Text style={styles.sensorSummaryTime}>Last reading: {primarySensor.timestamp}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMid} />
        </TouchableOpacity>

        <View style={styles.sensorReadingCard}>
          <View style={styles.sensorReadingItem}>
            <View style={[styles.sensorReadingIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="thermometer" size={18} color={colors.success} />
            </View>
            <Text style={styles.sensorReadingLabel}>Avg Temp</Text>
            <Text style={styles.sensorReadingValue}>
              {(mockSensors.reduce((a, b) => a + b.temperature, 0) / mockSensors.length).toFixed(1)}°C
            </Text>
          </View>
          <View style={styles.sensorReadingDivider} />
          <View style={styles.sensorReadingItem}>
            <View style={[styles.sensorReadingIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="water-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.sensorReadingLabel}>Avg Humidity</Text>
            <Text style={styles.sensorReadingValue}>
              {Math.round(mockSensors.reduce((a, b) => a + b.humidity, 0) / mockSensors.length)}%
            </Text>
          </View>
          <View style={styles.sensorReadingDivider} />
          <View style={styles.sensorReadingItem}>
            <View style={[styles.sensorReadingIcon, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.accent} />
            </View>
            <Text style={styles.sensorReadingLabel}>Alerts</Text>
            <Text style={[styles.sensorReadingValue, { color: mockSensorAlerts.length > 0 ? colors.accent : colors.success }]}>
              {mockSensorAlerts.length}
            </Text>
          </View>
        </View>

        {/* Quick Nav Buttons */}
        <View style={styles.quickNavRow}>
          <TouchableOpacity
            style={styles.quickNavBtn}
            onPress={() => navigation.navigate('Route')}
            activeOpacity={0.85}
          >
            <Ionicons name="map-outline" size={20} color={colors.primary} />
            <Text style={styles.quickNavText}>View Route</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickNavBtn, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '40' }]}
            onPress={() => navigation.navigate('ScanDelivery')}
            activeOpacity={0.85}
          >
            <Ionicons name="qr-code-outline" size={20} color={colors.accent} />
            <Text style={[styles.quickNavText, { color: colors.accent }]}>Scan Delivery</Text>
          </TouchableOpacity>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    opacity: 0.1,
    bottom: -20,
    left: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    marginBottom: 2,
  },
  driverName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  vehiclePlate: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
  },
  headerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  headerDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  driverAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139,195,74,0.5)',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
  },
  alertBannerWarning: {
    backgroundColor: colors.warning + '12',
    borderColor: colors.warning + '40',
  },
  alertBannerCritical: {
    backgroundColor: colors.danger + '12',
    borderColor: colors.danger + '40',
  },
  alertBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '500',
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  shipmentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  shipmentRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shipmentOrigin: {
    alignItems: 'center',
    gap: 4,
  },
  shipmentDest: {
    alignItems: 'center',
    gap: 4,
  },
  routeDotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  routeDotAccent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  routePlace: {
    fontSize: 11,
    color: colors.textDark,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 80,
  },
  routeLineContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: spacing.sm,
  },
  routeLine: {
    height: 2,
    backgroundColor: colors.border,
    width: '100%',
    borderStyle: 'dashed',
  },
  routeTruck: {
    position: 'absolute',
    top: -9,
    left: '50%',
    marginLeft: -9,
  },
  shipmentDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  shipmentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shipmentMetaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  shipmentMetaLabel: {
    fontSize: 11,
    color: colors.textMid,
    fontWeight: '500',
  },
  shipmentMetaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  inTransitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  inTransitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  inTransitText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  progressSection: {},
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textMid,
    fontWeight: '500',
  },
  progressPct: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  progressBg: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTime: {
    fontSize: 11,
    color: colors.textMid,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    ...shadows.card,
  },
  statCardGreen: {
    backgroundColor: colors.success + '0D',
    borderColor: colors.success + '30',
  },
  statCardAmber: {
    backgroundColor: colors.accent + '0D',
    borderColor: colors.accent + '30',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMid,
    textAlign: 'center',
  },
  statStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  sensorSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sensorSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sensorIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  sensorSummaryTime: {
    fontSize: 11,
    color: colors.textMid,
  },
  sensorReadingCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sensorReadingItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  sensorReadingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorReadingLabel: {
    fontSize: 10,
    color: colors.textMid,
    textAlign: 'center',
  },
  sensorReadingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  sensorReadingDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  quickNavRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + '12',
    borderWidth: 1,
    borderColor: colors.primary + '35',
  },
  quickNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
