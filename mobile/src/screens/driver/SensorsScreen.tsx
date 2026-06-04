import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LineChart } from 'react-native-chart-kit';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { mockSensors, mockTemperatureHistory, mockSensorAlerts } from '../../mockData';
import { SensorReading, SensorAlert } from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2;

// Thresholds
const TEMP_MIN = 2;
const TEMP_MAX = 6;
const HUMIDITY_MIN = 80;
const HUMIDITY_MAX = 90;

function SignalBars({ strength }: { strength: number }) {
  const bars = 4;
  const filledBars = Math.ceil((strength / 100) * bars);
  return (
    <View style={styles.signalBars}>
      {Array.from({ length: bars }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.signalBar,
            { height: 6 + i * 3 },
            i < filledBars ? styles.signalBarFilled : styles.signalBarEmpty,
          ]}
        />
      ))}
    </View>
  );
}

function BatteryIcon({ percent }: { percent: number }) {
  const color = percent > 50 ? colors.success : percent > 25 ? colors.accent : colors.danger;
  return (
    <View style={styles.batteryContainer}>
      <View style={[styles.batteryBody, { borderColor: color }]}>
        <View
          style={[
            styles.batteryFill,
            { width: `${percent}%` as any, backgroundColor: color },
          ]}
        />
      </View>
      <View style={[styles.batteryNub, { backgroundColor: color }]} />
    </View>
  );
}

function SensorCard({ sensor }: { sensor: SensorReading }) {
  const tempOk = sensor.temperature >= TEMP_MIN && sensor.temperature <= TEMP_MAX;
  const humidOk = sensor.humidity >= HUMIDITY_MIN && sensor.humidity <= HUMIDITY_MAX;
  const isWarning = sensor.status === 'warning';
  const isCritical = sensor.status === 'critical';

  const statusColor = isCritical
    ? colors.danger
    : isWarning
    ? colors.accent
    : colors.success;

  return (
    <View
      style={[
        styles.sensorCard,
        isWarning && styles.sensorCardWarning,
        isCritical && styles.sensorCardCritical,
      ]}
    >
      {/* Card Header */}
      <View style={styles.sensorCardHeader}>
        <View style={styles.sensorIdRow}>
          <View style={[styles.sensorStatusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.sensorId}>{sensor.sensorId}</Text>
          {(isWarning || isCritical) && (
            <View style={[styles.alertBadge, { backgroundColor: statusColor + '20', borderColor: statusColor + '50' }]}>
              <Ionicons
                name={isCritical ? 'alert-circle' : 'warning'}
                size={12}
                color={statusColor}
              />
              <Text style={[styles.alertBadgeText, { color: statusColor }]}>
                {isCritical ? 'Critical' : 'Warning'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.sensorMeta}>
          <BatteryIcon percent={sensor.batteryPercent} />
          <Text style={styles.sensorBatteryText}>{sensor.batteryPercent}%</Text>
          <SignalBars strength={sensor.signalStrength} />
        </View>
      </View>

      {/* Readings */}
      <View style={styles.sensorReadings}>
        <View
          style={[
            styles.readingBox,
            { backgroundColor: tempOk ? colors.success + '0F' : colors.danger + '0F' },
          ]}
        >
          <Ionicons
            name="thermometer"
            size={20}
            color={tempOk ? colors.success : colors.danger}
          />
          <Text style={[styles.readingValue, { color: tempOk ? colors.success : colors.danger }]}>
            {sensor.temperature.toFixed(1)}°C
          </Text>
          <Text style={styles.readingLabel}>Temperature</Text>
          {!tempOk && (
            <Text style={[styles.readingAlert, { color: colors.danger }]}>
              {sensor.temperature > TEMP_MAX ? '↑ High' : '↓ Low'}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.readingBox,
            { backgroundColor: humidOk ? colors.primary + '0F' : colors.accent + '0F' },
          ]}
        >
          <Ionicons
            name="water"
            size={20}
            color={humidOk ? colors.primary : colors.accent}
          />
          <Text style={[styles.readingValue, { color: humidOk ? colors.primary : colors.accent }]}>
            {sensor.humidity}%
          </Text>
          <Text style={styles.readingLabel}>Humidity</Text>
          {!humidOk && (
            <Text style={[styles.readingAlert, { color: colors.accent }]}>
              {sensor.humidity > HUMIDITY_MAX ? '↑ High' : '↓ Low'}
            </Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.sensorFooter}>
        <MaterialCommunityIcons name="bluetooth" size={12} color={colors.textMid} />
        <Text style={styles.sensorTimestamp}>Updated: {sensor.timestamp}</Text>
        <View style={styles.sensorSignalRow}>
          <Text style={styles.sensorSignalText}>{sensor.signalStrength}% signal</Text>
        </View>
      </View>
    </View>
  );
}

function AlertItem({ alert }: { alert: SensorAlert }) {
  const color = alert.severity === 'critical' ? colors.danger : colors.accent;
  return (
    <View style={styles.alertItem}>
      <View style={[styles.alertIconBox, { backgroundColor: color + '18' }]}>
        <Ionicons
          name={alert.severity === 'critical' ? 'alert-circle' : 'warning-outline'}
          size={18}
          color={color}
        />
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertSensorId}>{alert.sensorId}</Text>
        <Text style={styles.alertMessage}>{alert.message}</Text>
        <View style={styles.alertMeta}>
          <Ionicons name="time-outline" size={12} color={colors.textMid} />
          <Text style={styles.alertTime}>{alert.timestamp}</Text>
        </View>
      </View>
      <View style={[styles.alertSeverityBadge, { backgroundColor: color + '15' }]}>
        <Text style={[styles.alertSeverityText, { color }]}>
          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
        </Text>
      </View>
    </View>
  );
}

export default function SensorsScreen() {
  const chartData = {
    labels: mockTemperatureHistory
      .filter((_, i) => i % 2 === 0)
      .map(p => p.time.slice(-5)),
    datasets: [
      {
        data: mockTemperatureHistory.map(p => p.value),
        color: () => colors.primary,
        strokeWidth: 2,
      },
      // Upper threshold line
      {
        data: mockTemperatureHistory.map(() => TEMP_MAX),
        color: () => colors.danger + '80',
        strokeWidth: 1,
      },
      // Lower threshold line
      {
        data: mockTemperatureHistory.map(() => TEMP_MIN),
        color: () => colors.accent + '80',
        strokeWidth: 1,
      },
    ],
    legend: ['Temp °C', 'Max 6°C', 'Min 2°C'],
  };

  const warningCount = mockSensors.filter(s => s.status === 'warning').length;
  const normalCount = mockSensors.filter(s => s.status === 'normal').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="thermometer" size={20} color={colors.secondary} />
          <Text style={styles.headerTitle}>BLE Sensors</Text>
        </View>
        <View style={styles.headerStatusRow}>
          <View style={[styles.headerStatusDot, { backgroundColor: colors.success }]} />
          <Text style={styles.headerStatusText}>{normalCount} normal</Text>
          {warningCount > 0 && (
            <>
              <View style={[styles.headerStatusDot, { backgroundColor: colors.accent, marginLeft: spacing.sm }]} />
              <Text style={[styles.headerStatusText, { color: colors.accent }]}>{warningCount} warning</Text>
            </>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thresholds Info */}
        <View style={styles.thresholdsCard}>
          <View style={styles.thresholdsHeader}>
            <Ionicons name="options-outline" size={16} color={colors.primary} />
            <Text style={styles.thresholdsTitle}>Cold Chain Thresholds</Text>
          </View>
          <View style={styles.thresholdsRow}>
            <View style={styles.thresholdItem}>
              <Ionicons name="thermometer" size={16} color={colors.primary} />
              <Text style={styles.thresholdLabel}>Temperature</Text>
              <Text style={styles.thresholdRange}>
                {TEMP_MIN}–{TEMP_MAX}°C
              </Text>
            </View>
            <View style={styles.thresholdDivider} />
            <View style={styles.thresholdItem}>
              <Ionicons name="water-outline" size={16} color={colors.primary} />
              <Text style={styles.thresholdLabel}>Humidity</Text>
              <Text style={styles.thresholdRange}>
                {HUMIDITY_MIN}–{HUMIDITY_MAX}%
              </Text>
            </View>
          </View>
        </View>

        {/* Sensor Cards */}
        <Text style={styles.sectionTitle}>Connected Sensors ({mockSensors.length})</Text>
        {mockSensors.map(sensor => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}

        {/* Temperature Chart */}
        <Text style={styles.sectionTitle}>Temperature History (Last 2h)</Text>
        <View style={styles.chartCard}>
          <LineChart
            data={chartData}
            width={CHART_WIDTH}
            height={200}
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(45, 90, 27, ${opacity})`,
              labelColor: () => colors.textMid,
              style: { borderRadius: borderRadius.md },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.primary,
              },
              propsForBackgroundLines: {
                strokeDasharray: '4',
                stroke: colors.border,
                strokeWidth: 1,
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withShadow={false}
            withVerticalLines={false}
          />
          <View style={styles.chartAnnotations}>
            <View style={styles.chartAnnotation}>
              <View style={[styles.annotationDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.annotationText}>Sensor readings</Text>
            </View>
            <View style={styles.chartAnnotation}>
              <View style={[styles.annotationDot, { backgroundColor: colors.danger }]} />
              <Text style={styles.annotationText}>Max threshold (6°C)</Text>
            </View>
          </View>
        </View>

        {/* Alert History */}
        <Text style={styles.sectionTitle}>
          Journey Alerts ({mockSensorAlerts.length})
        </Text>
        <View style={styles.alertsCard}>
          {mockSensorAlerts.length === 0 ? (
            <View style={styles.noAlerts}>
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <Text style={styles.noAlertsText}>No alerts this journey</Text>
            </View>
          ) : (
            mockSensorAlerts.map((alert, index) => (
              <View key={alert.id}>
                <AlertItem alert={alert} />
                {index < mockSensorAlerts.length - 1 && (
                  <View style={styles.alertDivider} />
                )}
              </View>
            ))
          )}
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
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  headerStatusText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  thresholdsCard: {
    backgroundColor: colors.primary + '0D',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  thresholdsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  thresholdsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  thresholdsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thresholdItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  thresholdDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.primary + '30',
    marginHorizontal: spacing.md,
  },
  thresholdLabel: {
    fontSize: 12,
    color: colors.textMid,
    flex: 1,
  },
  thresholdRange: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  sensorCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sensorCardWarning: {
    borderColor: colors.accent + '60',
    backgroundColor: colors.accent + '05',
  },
  sensorCardCritical: {
    borderColor: colors.danger + '60',
    backgroundColor: colors.danger + '05',
  },
  sensorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sensorIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sensorStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sensorId: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    letterSpacing: 0.5,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 3,
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  sensorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBody: {
    width: 22,
    height: 11,
    borderRadius: 3,
    borderWidth: 1.5,
    overflow: 'hidden',
    padding: 1,
  },
  batteryFill: {
    height: '100%',
    borderRadius: 1,
  },
  batteryNub: {
    width: 3,
    height: 5,
    borderRadius: 1,
    marginLeft: 1,
  },
  sensorBatteryText: {
    fontSize: 11,
    color: colors.textMid,
    fontWeight: '500',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  signalBar: {
    width: 4,
    borderRadius: 2,
  },
  signalBarFilled: {
    backgroundColor: colors.success,
  },
  signalBarEmpty: {
    backgroundColor: colors.border,
  },
  sensorReadings: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  readingBox: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  readingValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  readingLabel: {
    fontSize: 11,
    color: colors.textMid,
    textAlign: 'center',
  },
  readingAlert: {
    fontSize: 11,
    fontWeight: '700',
  },
  sensorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sensorTimestamp: {
    fontSize: 11,
    color: colors.textMid,
    flex: 1,
  },
  sensorSignalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensorSignalText: {
    fontSize: 11,
    color: colors.textMid,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: borderRadius.md,
    marginLeft: -spacing.xs,
  },
  chartAnnotations: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  chartAnnotation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  annotationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  annotationText: {
    fontSize: 11,
    color: colors.textMid,
  },
  alertsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  alertDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  alertIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertSensorId: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 13,
    color: colors.textDark,
    marginBottom: 4,
    lineHeight: 18,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertTime: {
    fontSize: 11,
    color: colors.textMid,
  },
  alertSeverityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  alertSeverityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  noAlerts: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  noAlertsText: {
    fontSize: 14,
    color: colors.textMid,
    fontWeight: '500',
  },
});
