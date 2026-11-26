// Shared, testable UI kit for the clone screens.
// ponytail: plain functions returning data (no react-native import), so unit
// tests can run without a native runtime. The real app binds these to RN
// components one-to-one.

import { buttonStyle, tokens, clipColor } from "../design/primitives.js";

export interface ScreenProps {
  [k: string]: unknown;
}

// S01 - Home / Projects. States: empty, filled.
export function S01_home(projects: { id: string; name: string; resW: number; resH: number; layers: unknown[] }[], onNew: () => void, onOpen: (id: string) => void) {
  if (projects.length === 0) {
    return {
      title: "Projects",
      body: [],
      cta: { label: "Create your first project", variant: "primary" as const, action: onNew },
      empty: "No projects yet. Import media to get started.",
    };
  }
  return {
    title: "Projects",
    body: projects.map((p) => ({
      kind: "card",
      name: p.name,
      meta: `${p.resW}x${p.resH} · ${p.layers.length} layers`,
      action: () => onOpen(p.id),
    })),
    cta: { label: "+ New project", variant: "secondary" as const, action: onNew },
    empty: null,
  };
}

// S02 - New project / import. States: empty picker, importing.
export function S02_import(media: { id: string; name: string; kind: string }[], onPick: (id: string) => void, onNew: () => void) {
  return {
    title: "Import media",
    body: media.map((m) => ({
      kind: "media",
      name: m.name,
      type: m.kind,
      accent: clipColor(m.kind),
      action: () => onPick(m.id),
    })),
    cta: { label: "Add from camera roll", variant: "primary" as const, action: onNew },
    empty: media.length === 0 ? "No media found. Grant the storage permission to import." : null,
  };
}

// S03 - Editor canvas / preview. States: idle, playing, zoomed.
export function S03_canvas(project: { resW: number; resH: number; durationMs: number; layers: unknown[] }, playing: boolean) {
  return {
    title: "Preview",
    canvas: {
      aspect: `${project.resW} / ${project.resH}`,
      layers: project.layers.length,
      playing,
      timecode: "00:00.000 / " + (project.durationMs / 1000).toFixed(1),
    },
    rail: ["select", "split", "trim", "text", "audio", "fx"],
  };
}
