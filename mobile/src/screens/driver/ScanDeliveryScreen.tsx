import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { mockCrateDelivery } from '../../mockData';
import { CustodyEvent } from '../../types';

type ScanPhase = 'ready' | 'scanning' | 'result' | 'confirmed';

function CustodyEventItem({
  event,
  isLast,
  index,
}: {
  event: CustodyEvent;
  isLast: boolean;
  index: number;
}) {
  return (
    <View style={styles.custodyRow}>
      {/* Timeline */}
      <View style={styles.custodyTimeline}>
        <View
          style={[
            styles.custodyDot,
            index === 0 && styles.custodyDotFirst,
          ]}
        />
        {!isLast && <View style={styles.custodyLine} />}
      </View>

      {/* Content */}
      <View style={[styles.custodyContent, !isLast && styles.custodyContentPadded]}>
        <Text style={styles.custodyAction}>{event.action}</Text>
        <View style={styles.custodyMetaRow}>
          <Ionicons name="location-outline" size={12} color={colors.textMid} />
          <Text style={styles.custodyLocation}>{event.location}</Text>
        </View>
        <View style={styles.custodyMetaRow}>
          <Ionicons name="time-outline" size={12} color={colors.textMid} />
          <Text style={styles.custodyTimestamp}>{event.timestamp}</Text>
        </View>
        <View style={styles.custodyActorRow}>
          <Ionicons name="person-outline" size={12} color={colors.primaryLight} />
          <Text style={styles.custodyActor}>{event.actor}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ScanDeliveryScreen() {
  const [phase, setPhase] = useState<ScanPhase>('ready');

  const handleSimulateScan = () => {
    setPhase('scanning');
    setTimeout(() => {
      setPhase('result');
    }, 1800);
  };

  const handleConfirmDelivery = () => {
    Alert.alert(
      'Confirm Delivery',
      `Confirm delivery of Crate ${mockCrateDelivery.crateId}?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'default',
          onPress: () => setPhase('confirmed'),
        },
      ]
    );
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Report Issue',
      'Report an issue with this delivery?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Temperature Issue',
          onPress: () => {},
        },
        {
          text: 'Missing Items',
          style: 'destructive',
          onPress: () => {},
        },
      ]
    );
  };

  const handleRescan = () => {
    setPhase('ready');
  };

  const gradeColor =
    mockCrateDelivery.grade === 'A'
      ? colors.success
      : mockCrateDelivery.grade === 'B'
      ? colors.accent
      : colors.danger;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.headerContent}>
          <Ionicons name="qr-code" size={20} color={colors.secondary} />
          <Text style={styles.headerTitle}>Delivery Scan</Text>
        </View>
        <Text style={styles.headerSub}>Scan crate QR to confirm delivery</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Confirmed Banner */}
        {phase === 'confirmed' && (
          <View style={styles.confirmedBanner}>
            <Ionicons name="checkmark-circle" size={28} color={colors.surface} />
            <View>
              <Text style={styles.confirmedTitle}>Delivery Confirmed!</Text>
              <Text style={styles.confirmedSub}>
                Crate {mockCrateDelivery.crateId} logged successfully
              </Text>
            </View>
          </View>
        )}

        {/* QR Viewfinder */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinder}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {phase === 'ready' && (
              <View style={styles.viewfinderCenter}>
                <Ionicons name="qr-code-outline" size={56} color="rgba(255,255,255,0.35)" />
                <Text style={styles.viewfinderText}>QR Scanner</Text>
                <Text style={styles.viewfinderSub}>Ready to scan</Text>
              </View>
            )}

            {phase === 'scanning' && (
              <View style={styles.viewfinderCenter}>
                <View style={styles.scanRing}>
                  <ActivityIndicator size="large" color={colors.secondary} />
                </View>
                <Text style={styles.scanningText}>Scanning...</Text>
                <View style={styles.scanLine} />
              </View>
            )}

            {(phase === 'result' || phase === 'confirmed') && (
              <View style={styles.viewfinderCenter}>
                <View style={styles.scannedSuccess}>
                  <Ionicons name="checkmark" size={32} color={colors.surface} />
                </View>
                <Text style={styles.scannedText}>{mockCrateDelivery.crateId}</Text>
                <Text style={styles.scannedSub}>Crate identified</Text>
              </View>
            )}
          </View>

          <Text style={styles.instructionText}>
            {phase === 'ready' && 'Position the crate QR code within the frame'}
            {phase === 'scanning' && 'Processing QR code...'}
            {(phase === 'result' || phase === 'confirmed') && 'QR code scanned successfully'}
          </Text>
        </View>

        {/* Simulate Scan Button */}
        {phase === 'ready' && (
          <TouchableOpacity
            style={styles.simulateScanBtn}
            onPress={handleSimulateScan}
            activeOpacity={0.85}
          >
            <Ionicons name="qr-code-outline" size={20} color={colors.surface} />
            <Text style={styles.simulateScanText}>Simulate Scan</Text>
          </TouchableOpacity>
        )}

        {/* Delivery Confirmation Card */}
        {(phase === 'result' || phase === 'confirmed') && (
          <View style={styles.deliveryCard}>
            {/* Card Header */}
            <View style={styles.deliveryCardHeader}>
              <View>
                <Text style={styles.deliveryCardLabel}>Crate ID</Text>
                <Text style={styles.deliveryCrateId}>{mockCrateDelivery.crateId}</Text>
              </View>
              <View style={[styles.gradeBadge, { backgroundColor: gradeColor }]}>
                <Text style={styles.gradeBadgeText}>Grade {mockCrateDelivery.grade}</Text>
              </View>
            </View>

            <View style={styles.deliveryDivider} />

            {/* Contents */}
            <View style={styles.deliveryInfoSection}>
              <View style={styles.deliveryInfoRow}>
                <View style={styles.deliveryInfoIcon}>
                  <Ionicons name="leaf-outline" size={16} color={colors.primary} />
                </View>
                <View style={styles.deliveryInfoText}>
                  <Text style={styles.deliveryInfoLabel}>Contents</Text>
                  <Text style={styles.deliveryInfoValue}>{mockCrateDelivery.contents}</Text>
                </View>
              </View>

              <View style={styles.deliveryInfoRow}>
                <View style={styles.deliveryInfoIcon}>
                  <MaterialCommunityIcons name="weight-kilogram" size={16} color={colors.primary} />
                </View>
                <View style={styles.deliveryInfoText}>
                  <Text style={styles.deliveryInfoLabel}>Weight</Text>
                  <Text style={styles.deliveryInfoValue}>{mockCrateDelivery.weightKg} kg</Text>
                </View>
              </View>

              <View style={styles.deliveryInfoRow}>
                <View style={styles.deliveryInfoIcon}>
                  <Ionicons name="location-outline" size={16} color={colors.primary} />
                </View>
                <View style={styles.deliveryInfoText}>
                  <Text style={styles.deliveryInfoLabel}>Origin</Text>
                  <Text style={styles.deliveryInfoValue}>{mockCrateDelivery.origin}</Text>
                </View>
              </View>

              <View style={styles.deliveryInfoRow}>
                <View style={styles.deliveryInfoIcon}>
                  <Ionicons name="person-outline" size={16} color={colors.primary} />
                </View>
                <View style={styles.deliveryInfoText}>
                  <Text style={styles.deliveryInfoLabel}>Farm</Text>
                  <Text style={styles.deliveryInfoValue}>{mockCrateDelivery.farmName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.deliveryDivider} />

            {/* Chain of Custody */}
            <Text style={styles.custodyTitle}>Chain of Custody</Text>
            <View style={styles.custodyList}>
              {mockCrateDelivery.custodyEvents.map((event, index) => (
                <CustodyEventItem
                  key={event.id}
                  event={event}
                  isLast={index === mockCrateDelivery.custodyEvents.length - 1}
                  index={index}
                />
              ))}
            </View>

            {/* Action Buttons */}
            {phase === 'result' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={handleReportIssue}
                  activeOpacity={0.85}
                >
                  <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
                  <Text style={styles.reportButtonText}>Report Issue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmDelivery}
                  activeOpacity={0.85}
                >
                  <Ionicons name="checkmark-circle" size={18} color={colors.surface} />
                  <Text style={styles.confirmButtonText}>Confirm Delivery</Text>
                </TouchableOpacity>
              </View>
            )}

            {phase === 'confirmed' && (
              <View style={styles.confirmedActions}>
                <View style={styles.confirmedCheckRow}>
                  <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                  <Text style={styles.confirmedCheckText}>Delivery confirmed and logged</Text>
                </View>
                <TouchableOpacity
                  style={styles.rescanButton}
                  onPress={handleRescan}
                  activeOpacity={0.85}
                >
                  <Ionicons name="qr-code-outline" size={18} color={colors.primary} />
                  <Text style={styles.rescanText}>Scan Another Crate</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const CORNER_SIZE = 22;
const CORNER_THICKNESS = 3;

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
  confirmedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  confirmedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
  confirmedSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  viewfinderContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  viewfinder: {
    width: '100%',
    height: 220,
    backgroundColor: '#111',
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: colors.accent,
  },
  cornerTL: {
    top: 14,
    left: 14,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 14,
    right: 14,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 14,
    left: 14,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 14,
    right: 14,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  viewfinderCenter: {
    alignItems: 'center',
  },
  viewfinderText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  viewfinderSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 4,
  },
  scanRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(255,143,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  scanningText: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: '600',
  },
  scanLine: {
    position: 'absolute',
    width: '70%',
    height: 2,
    backgroundColor: colors.accent,
    opacity: 0.8,
  },
  scannedSuccess: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  scannedText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.surface,
    letterSpacing: 1,
  },
  scannedSub: {
    fontSize: 12,
    color: colors.secondary,
  },
  instructionText: {
    fontSize: 13,
    color: colors.textMid,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  simulateScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    ...shadows.header,
  },
  simulateScanText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface,
  },
  deliveryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  deliveryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  deliveryCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMid,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  deliveryCrateId: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
    letterSpacing: 1,
  },
  gradeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  gradeBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.surface,
  },
  deliveryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  deliveryInfoSection: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  deliveryInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryInfoText: {
    flex: 1,
    justifyContent: 'center',
  },
  deliveryInfoLabel: {
    fontSize: 11,
    color: colors.textMid,
    fontWeight: '500',
    marginBottom: 2,
  },
  deliveryInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  custodyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  custodyList: {
    marginBottom: spacing.md,
  },
  custodyRow: {
    flexDirection: 'row',
  },
  custodyTimeline: {
    width: 20,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  custodyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
  custodyDotFirst: {
    backgroundColor: colors.secondary,
  },
  custodyLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 2,
    minHeight: 20,
  },
  custodyContent: {
    flex: 1,
  },
  custodyContentPadded: {
    paddingBottom: spacing.md,
  },
  custodyAction: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  custodyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  custodyLocation: {
    fontSize: 12,
    color: colors.textMid,
    flex: 1,
  },
  custodyTimestamp: {
    fontSize: 11,
    color: colors.textMid,
  },
  custodyActorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  custodyActor: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  reportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.danger,
    gap: spacing.sm,
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.success,
    gap: spacing.sm,
    ...shadows.card,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
  confirmedActions: {
    marginTop: spacing.sm,
  },
  confirmedCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.success + '12',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  confirmedCheckText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    flex: 1,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: spacing.sm,
  },
  rescanText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});
