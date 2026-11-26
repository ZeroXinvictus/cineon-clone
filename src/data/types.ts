// Core editor data types. These mirror the server schema (replica/schema.sql).

export type LayerKind = "video" | "photo" | "text" | "audio" | "effect" | "camera";
export type BlendMode = "normal" | "multiply" | "overlay" | "screen";
export type ExportFormat = "mp4" | "gif" | "png_seq" | "still";
export type ExportStatus = "queued" | "rendering" | "done" | "failed";

export interface Layer {
  id: string;
  kind: LayerKind;
  name: string;
  start: number; // ms
  end: number; // ms
  opacity: number; // 0..1
  blend: BlendMode;
  order: number;
}

export interface Keyframe {
  id: string;
  time: number; // ms
  prop: string; // e.g. "scale", "opacity"
  value: number;
  easing?: string;
}

export interface Project {
  id: string;
  name: string;
  resW: number;
  resH: number;
  fps: number;
  durationMs: number;
  status: "draft" | "exported" | "archived";
  rev: number;
  createdAt: string;
  layers: Layer[];
}

export interface MediaItem {
  id: string;
  kind: "video" | "photo" | "audio";
  name: string;
  width?: number;
  height?: number;
  durationMs?: number;
}

export interface ExportJob {
  id: string;
  projectId: string;
  format: ExportFormat;
  resW: number;
  resH: number;
  fps: number;
  watermark: boolean;
  status: ExportStatus;
  createdAt: string;
}
