// ponytail: fake data layer - same signatures the real (Supabase) layer will
// have, so replica-backend swaps the implementation, not the screens.
// Local-first: editing works with zero network.
import type { Project, Layer, ExportJob, MediaItem } from "./types.js";

type Repo<T> = {
  get(): T[];
  create(input: Omit<T, "id"> & Partial<Record<string, unknown>>): T;
  update(id: string, patch: Partial<T>): T | undefined;
};

function repo<T extends { id: string }>(seed: T[]): Repo<T> {
  let items = [...seed];
  let n = 0;
  return {
    get: () => items,
    create(input) {
      const item = { ...input, id: `id-${Date.now()}-${n++}`, createdAt: new Date().toISOString() } as unknown as T;
      items = [...items, item];
      return item;
    },
    update(id, patch) {
      items = items.map((x) => (x.id === id ? { ...x, ...patch } : x));
      return items.find((x) => x.id === id);
    },
  };
}

// ponytail: seed data so screens have something real to show.
const seedProjects: Project[] = [
  {
    id: "p-demo-1",
    name: "Untitled project",
    resW: 1080,
    resH: 1920,
    fps: 30,
    durationMs: 12000,
    status: "draft",
    rev: 0,
    createdAt: new Date().toISOString(),
    layers: [
      { id: "l1", kind: "video", name: "Intro.mp4", start: 0, end: 4000, opacity: 1, blend: "normal", order: 0 },
      { id: "l2", kind: "video", name: "B-roll.mp4", start: 4000, end: 8000, opacity: 1, blend: "normal", order: 0 },
      { id: "l3", kind: "audio", name: "music.mp3", start: 0, end: 12000, opacity: 1, blend: "normal", order: 1 },
      { id: "l4", kind: "text", name: "Title", start: 1000, end: 3000, opacity: 1, blend: "normal", order: 2 },
    ],
  },
];

export function openProject(id: string): Project | null {
  return projects.get().find((x) => x.id === id) ?? null;
}

export const projects = repo<Project>(seedProjects);
export const media = repo<MediaItem>([
  { id: "m1", kind: "video", name: "Intro.mp4", width: 1080, height: 1920, durationMs: 4000 },
  { id: "m2", kind: "audio", name: "music.mp3", durationMs: 12000 },
]);
export const exports = repo<ExportJob>([]);

// ponytail: in-memory "encode". Real backend replaces this with Inngest + ffmpeg.
export function runExport(projectId: string, format: ExportJob["format"], watermark: boolean) {
  return new Promise<ExportJob>((resolve) => {
    const job = exports.create({
      projectId,
      format,
      resW: 1080,
      resH: 1920,
      fps: 30,
      watermark,
      status: "rendering",
      createdAt: new Date().toISOString(),
    });
    setTimeout(() => {
      resolve(exports.update(job.id, { status: "done" }) as ExportJob);
    }, 800);
  });
}
