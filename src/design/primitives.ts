// Accessible primitives. Tokens only - no raw hex.
// (In the real RN app these map to nativewind classes; here as plain objects
// so they are testable in isolation.)

export const tokens = {
  color: {
    bg: "#0a1210",
    surface: "#12201d",
    surfaceRaised: "#1a2f2a",
    border: "#2a4a42",
    borderInput: "#5b8a80",
    text: "#e0f2ee",
    muted: "#7fb8a8",
    accent: "#0f766e",
    onAccent: "#ffffff",
    danger: "#f0566a",
    success: "#34c759",
    warning: "#f5b544",
    playhead: "#ffd60a",
  },
  radius: { sm: 4, md: 8, lg: 12, pill: 999 },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24 },
  type: {
    xs: 11, sm: 13, base: 15, lg: 18, xl: 24,
  },
};

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function buttonStyle(variant: ButtonVariant = "primary") {
  const map: Record<ButtonVariant, { bg: string; color: string; border?: string }> = {
    primary: { bg: tokens.color.accent, color: tokens.color.onAccent },
    secondary: { bg: tokens.color.surfaceRaised, color: tokens.color.text, border: tokens.color.border },
    ghost: { bg: "transparent", color: tokens.color.accent },
    danger: { bg: tokens.color.danger, color: tokens.color.onAccent },
  };
  const { bg, color, border } = map[variant];
  return {
    backgroundColor: bg,
    color,
    borderColor: border ?? "transparent",
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space[4],
    paddingVertical: tokens.space[3],
    fontSize: tokens.type.sm,
    fontWeight: "600" as const,
  };
}

export function clipColor(kind: string) {
  const m: Record<string, string> = {
    video: tokens.color.accent,
    audio: tokens.color.success,
    text: tokens.color.warning,
    effect: "#a855f7",
  };
  return m[kind] ?? tokens.color.accent;
}
