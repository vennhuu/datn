import { useTheme } from "./ThemeContext";

export const useThemeTokens = () => {
  const { isDark } = useTheme();
  return {
    isDark,
    pageBg:        isDark ? "#0f172a" : "#f0f4f8",
    cardBg:        isDark ? "#1e293b" : "#ffffff",
    mutedBg:       isDark ? "#263548" : "#f8fafc",
    textPrimary:   isDark ? "#f1f5f9" : "#0f172a",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    textMuted:     isDark ? "#64748b" : "#94a3b8",
    border:        isDark ? "#334155" : "#e8edf3",
    borderLight:   isDark ? "#263548" : "#f0f4f8",
    brandBg:       isDark ? "#1e3a5f" : "#eef4ff",
    brand:         "#0a6abf",
  };
};