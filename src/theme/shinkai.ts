export const SHINKAI_THEMES = [
  "twilight-comet",
  "garden-rain",
  "golden-cumulus",
  "sakura-breeze",
] as const;

export type ShinkaiTheme = (typeof SHINKAI_THEMES)[number];
export type ThemeSelection = "auto" | ShinkaiTheme;

export const THEME_META: Record<ShinkaiTheme, { label: string; labelEn: string; icon: string; subtitle: string }> = {
  "twilight-comet": {
    label: "Twilight Comet",
    labelEn: "Twilight Comet",
    icon: "☄",
    subtitle: "Meteor & stardust",
  },
  "garden-rain": {
    label: "Garden Rain",
    labelEn: "Garden Rain",
    icon: "雨",
    subtitle: "Soft rainfall",
  },
  "golden-cumulus": {
    label: "Golden Cumulus",
    labelEn: "Golden Cumulus",
    icon: "☼",
    subtitle: "Sunset cloudscape",
  },
  "sakura-breeze": {
    label: "Sakura Breeze",
    labelEn: "Sakura Breeze",
    icon: "✿",
    subtitle: "Falling petals",
  },
};
