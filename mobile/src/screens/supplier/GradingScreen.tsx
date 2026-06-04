import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { GradingResult } from '../../types';

type GradingPhase = 'ready' | 'analyzing' | 'result';

const MOCK_RESULT: GradingResult = {
  cropType: 'Lettuce',
  grade: 'A',
  confidence: 94.2,
  notes: 'Excellent color uniformity, no defects detected. Leaves show optimal hydration and deep green pigmentation consistent with Grade A standards.',
};

function GradeBadgeLarge({ grade }: { grade: GradingResult['grade'] }) {
  const config: Record<GradingResult['grade'], { bg: string; text: string; label: string }> = {
    A: { bg: colors.success, text: colors.surface, label: 'Excellent' },
    B: { bg: colors.accent, text: colors.surface, label: 'Good' },
    C: { bg: colors.warning, text: colors.surface, label: 'Acceptable' },
    Rejected: { bg: colors.danger, text: colors.surface, label: 'Rejected' },
  };
  const c = config[grade];
  return (
    <View style={[styles.gradeBadgeLarge, { backgroundColor: c.bg }]}>
      <Text style={[styles.gradeLetter, { color: c.text }]}>{grade}</Text>
      <Text style={[styles.gradeLabel, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

export default function GradingScreen() {
  const [phase, setPhase] = useState<GradingPhase>('ready');
  const [weight, setWeight] = useState('');

  const handleCapture = () => {
    setPhase('analyzing');
    setTimeout(() => {
      setPhase('result');
    }, 2200);
  };

  const handleRetake = () => {
    setPhase('ready');
    setWeight('');
  };

  const handleSave = () => {
    // In a real app, this would persist the batch
    setPhase('ready');
    setWeight('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.headerContent}>
          <Ionicons name="camera" size={20} color={colors.secondary} />
          <Text style={styles.headerTitle}>AI Crop Grading</Text>
        </View>
        <Text style={styles.headerSub}>Point camera at crop for instant grade</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Camera Viewfinder */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinder}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {phase === 'ready' && (
              <View style={styles.viewfinderReady}>
                <Ionicons name="leaf-outline" size={48} color="rgba(139,195,74,0.6)" />
                <Text style={styles.viewfinderText}>Camera Viewfinder</Text>
                <Text style={styles.viewfinderSub}>Position crop in frame</Text>
              </View>
            )}

            {phase === 'analyzing' && (
              <View style={styles.viewfinderAnalyzing}>
                <View style={styles.analyzeRing}>
                  <ActivityIndicator size="large" color={colors.secondary} />
                </View>
                <Text style={styles.analyzingText}>Analyzing crop...</Text>
                <Text style={styles.analyzingSub}>AI processing image</Text>
                {/* Scan line animation representation */}
                <View style={styles.scanBar} />
              </View>
            )}

            {phase === 'result' && (
              <View style={styles.viewfinderResult}>
                <Ionicons name="checkmark-circle" size={40} color={colors.secondary} />
                <Text style={styles.viewfinderResultText}>Analysis Complete</Text>
              </View>
            )}

            {/* Grid lines for realism */}
            <View style={styles.gridH} />
            <View style={styles.gridV} />
          </View>

          {/* Instruction text */}
          {phase === 'ready' && (
            <Text style={styles.instructionText}>
              <Ionicons name="information-circle-outline" size={14} /> Point camera at crop sample
            </Text>
          )}
          {phase === 'analyzing' && (
            <Text style={styles.instructionText}>Please hold steady while AI grades...</Text>
          )}
          {phase === 'result' && (
            <Text style={[styles.instructionText, { color: colors.success }]}>
              <Ionicons name="checkmark" size={14} /> Grading complete!
            </Text>
          )}
        </View>

        {/* Capture Button — only show when ready */}
        {phase === 'ready' && (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            activeOpacity={0.85}
          >
            <View style={styles.captureInner}>
              <Ionicons name="camera" size={28} color={colors.surface} />
            </View>
            <Text style={styles.captureText}>Capture & Grade</Text>
          </TouchableOpacity>
        )}

        {/* Analyzing state extra UI */}
        {phase === 'analyzing' && (
          <View style={styles.analyzingCard}>
            <ActivityIndicator color={colors.primary} size="small" />
            <View style={styles.analyzingCardText}>
              <Text style={styles.analyzingCardTitle}>AI Model Processing</Text>
              <Text style={styles.analyzingCardSub}>Checking color, texture, defects...</Text>
            </View>
          </View>
        )}

        {/* Grading Result Card */}
        {phase === 'result' && (
          <View style={styles.resultCard}>
            {/* Card header */}
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultHeaderLabel}>Grading Result</Text>
                <Text style={styles.resultCropType}>{MOCK_RESULT.cropType}</Text>
              </View>
              <GradeBadgeLarge grade={MOCK_RESULT.grade} />
            </View>

            {/* Confidence */}
            <View style={styles.confidenceRow}>
              <Text style={styles.confidenceLabel}>AI Confidence</Text>
              <View style={styles.confidenceBarBg}>
                <View
                  style={[
                    styles.confidenceBarFill,
                    { width: `${MOCK_RESULT.confidence}%` as any },
                  ]}
                />
              </View>
              <Text style={styles.confidenceValue}>{MOCK_RESULT.confidence}%</Text>
            </View>

            {/* Notes */}
            <View style={styles.notesBox}>
              <Ionicons name="document-text-outline" size={16} color={colors.primary} />
              <Text style={styles.notesText}>{MOCK_RESULT.notes}</Text>
            </View>

            {/* Metrics row */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Ionicons name="color-palette-outline" size={16} color={colors.primaryLight} />
                <Text style={styles.metricLabel}>Color</Text>
                <Text style={styles.metricValue}>Excellent</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.primaryLight} />
                <Text style={styles.metricLabel}>Defects</Text>
                <Text style={styles.metricValue}>None</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Ionicons name="water-outline" size={16} color={colors.primaryLight} />
                <Text style={styles.metricLabel}>Freshness</Text>
                <Text style={styles.metricValue}>High</Text>
              </View>
            </View>

            {/* Weight Input */}
            <View style={styles.weightSection}>
              <Text style={styles.weightLabel}>Batch Weight (kg)</Text>
              <View style={styles.weightInputWrapper}>
                <MaterialCommunityIcons name="weight-kilogram" size={18} color={colors.textMid} />
                <TextInput
                  style={styles.weightInput}
                  placeholder="Enter weight in kg"
                  placeholderTextColor={colors.border}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.weightUnit}>kg</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleRetake}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={18} color={colors.primary} />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={18} color={colors.surface} />
                <Text style={styles.saveText}>Save Batch</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const CORNER_SIZE = 20;
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
  viewfinderContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  viewfinder: {
    width: '100%',
    height: 240,
    backgroundColor: '#1A1A1A',
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
    borderColor: colors.secondary,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  gridH: {
    position: 'absolute',
    width: '70%',
    height: 1,
    backgroundColor: 'rgba(139,195,74,0.15)',
  },
  gridV: {
    position: 'absolute',
    height: '70%',
    width: 1,
    backgroundColor: 'rgba(139,195,74,0.15)',
  },
  viewfinderReady: {
    alignItems: 'center',
  },
  viewfinderText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  viewfinderSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
  },
  viewfinderAnalyzing: {
    alignItems: 'center',
  },
  analyzeRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(139,195,74,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  analyzingText: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  analyzingSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  scanBar: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: colors.secondary,
    opacity: 0.7,
    top: '50%',
  },
  viewfinderResult: {
    alignItems: 'center',
  },
  viewfinderResultText: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  instructionText: {
    fontSize: 13,
    color: colors.textMid,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  captureButton: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  captureInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 4,
    borderColor: colors.secondary,
    ...shadows.header,
  },
  captureText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  analyzingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  analyzingCardText: {
    flex: 1,
  },
  analyzingCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  analyzingCardSub: {
    fontSize: 12,
    color: colors.textMid,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  resultHeaderLabel: {
    fontSize: 12,
    color: colors.textMid,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  resultCropType: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
  },
  gradeBadgeLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeLetter: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  gradeLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  confidenceLabel: {
    fontSize: 12,
    color: colors.textMid,
    fontWeight: '500',
    width: 90,
  },
  confidenceBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  confidenceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
    width: 46,
    textAlign: 'right',
  },
  notesBox: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMid,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metricDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMid,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  weightSection: {
    marginBottom: spacing.md,
  },
  weightLabel: {
    ...typography.label,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  weightInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 50,
    gap: spacing.sm,
  },
  weightInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
  },
  weightUnit: {
    fontSize: 14,
    color: colors.textMid,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: spacing.sm,
  },
  retakeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    gap: spacing.sm,
    ...shadows.card,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
});
