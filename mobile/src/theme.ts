export const colors = {
  primary: '#2D5A1B',
  primaryLight: '#4A8C2A',
  secondary: '#8BC34A',
  accent: '#FF8F00',
  background: '#F5F0E8',
  surface: '#FFFFFF',
  textDark: '#2C1A0E',
  textMid: '#5C4A32',
  border: '#D4C9B0',
  success: '#4CAF50',
  warning: '#FF8F00',
  danger: '#DC2626',
  cardShadow: 'rgba(45, 90, 27, 0.12)',
  overlayDark: 'rgba(0,0,0,0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.textDark },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.textDark },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.textDark },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textMid },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: colors.textMid },
  label: { fontSize: 12, fontWeight: '600' as const, color: colors.textMid },
  caption: { fontSize: 11, fontWeight: '400' as const, color: colors.textMid },
};

export const shadows = {
  card: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
};
