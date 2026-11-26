// Screen builders S04-S13. Each returns render data (no RN import) so they
// are unit-testable. States from the recon map are made explicit.

import { clipColor } from "../design/primitives.js";
import type { Project, Layer, ExportJob } from "../data/types.js";

// S04 - Timeline (multi-layer). States: empty, filled, selected, zoomed.
export function S04_timeline(project: Project, zoom: number, selectedId?: string) {
  if (project.layers.length === 0) {
    return { title: "Timeline", empty: "Add a clip to start editing.", rows: [], zoom };
  }
  const rows = project.layers.map((l) => ({
    id: l.id,
    name: l.name,
    kind: l.kind,
    accent: clipColor(l.kind),
    start: l.start,
    end: l.end,
    selected: l.id === selectedId,
  }));
  return {
    title: "Timeline",
    empty: null,
    rows,
    zoom,
    playhead: 0,
    actions: ["split", "trim", "reorder", "add"],
  };
}

// S05 - Transitions. States: none, one, custom duration.
export function S05_transitions(available: string[] = ["fade", "glitch", "ink", "shake"]) {
  return {
    title: "Transitions",
    options: available.map((t) => ({ label: t, durationMs: 400 })),
  };
}

// S06 - Audio mixer. States: silent, one, many, muted.
export function S06_audio(layers: Layer[]) {
  const audio = layers.filter((l) => l.kind === "audio");
  return {
    title: "Audio mixer",
    silent: audio.length === 0,
    lanes: audio.map((l) => ({
      id: l.id,
      name: l.name,
      volume: 1,
      pan: 0,
      fade: { in: 0, out: 0 },
      filters: ["reverb", "delay", "bass", "treble"],
    })),
  };
}

// S07 - Text layer. States: empty text, styled, animated.
export function S07_text(value: string, style: { size?: number; color?: string } = {}) {
  return {
    title: "Text",
    empty: value === "",
    value,
    style: { size: style.size ?? 48, color: style.color ?? "#e8eaed", font: "Sans" },
    options: ["font", "size", "color", "alignment", "outline", "shadow"],
  };
}

// S08 - Effects browser. States: empty, applied, params open.
export function S08_effects(categories: string[] = ["color", "glow", "blur", "particles"]) {
  return { title: "Effects", categories, applied: [] };
}

// S09 - Layer properties. States: defaults, custom.
export function S09_properties(layer: Layer) {
  return {
    title: `Layer: ${layer.name}`,
    props: [
      { key: "position", value: [0, 0] },
      { key: "scale", value: 1 },
      { key: "rotation", value: 0 },
      { key: "opacity", value: layer.opacity },
      { key: "speed", value: 1 },
      { key: "blend", value: layer.blend },
    ],
  };
}

// S10 - Keyframe panel. States: none, one pair, multi.
export function S10_keyframes(frames: { time: number; prop: string; value: number }[]) {
  return {
    title: "Keyframes",
    none: frames.length === 0,
    frames,
    easingPresets: ["linear", "ease-in", "ease-out", "ease-in-out", "custom"],
  };
}

// S11 - Export. States: queued, rendering, done, error.
export function S11_export(job?: ExportJob, freeTier: boolean = true) {
  return {
    title: "Export",
    formats: ["mp4", "gif", "png_seq", "still"],
    resolution: "1080x1920",
    watermark: freeTier,
    status: job?.status ?? "idle",
  };
}

// S12 - Share / save. States: saved, shared.
export function S12_share(saved: boolean, shared: string[] = []) {
  return {
    title: "Share",
    saved,
    targets: ["camera roll", "instagram", "youtube", "project package"],
    shared,
  };
}

// S13 - Sign in / Pro. States: signed out, signed in, pro, free.
export function S13_account(signedIn: boolean, isPro: boolean) {
  return {
    title: "Account",
    signedIn,
    isPro,
    proBenefit: isPro ? "No watermark. Premium effects enabled." : "Upgrade to remove the watermark.",
  };
}
