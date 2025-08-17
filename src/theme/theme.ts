export const gamerTheme = {
  colors: {
    background: '#0B0B10',
    surface: '#12121A',
    primary: '#7B61FF',
    accent: '#19D3DA',
    textPrimary: '#EAEAF2',
    textSecondary: '#9AA0A6',
    border: '#22222E',
    success: '#2ECC71',
    warning: '#F1C40F',
    danger: '#E74C3C',
    cardGradientStart: '#1B1B2A',
    cardGradientEnd: '#0F0F18',
  },
  spacing: (n: number) => n * 8,
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    pill: 999,
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
  },
} as const;

export type GamerTheme = typeof gamerTheme;


