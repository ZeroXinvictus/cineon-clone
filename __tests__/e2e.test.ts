// ponytail: one runnable check. Fails if the core loop or any screen breaks.
// Run: node --experimental-vm-modules, or plain `node` (no ESM deps, plain JS
// transpile not needed because the kit is plain TS-free data builders).
// Here we exercise the data layer + every screen builder directly.

import { projects, media, exports, runExport, openProject } from "./src/data/store";
import { S01_home, S02_import, S03_canvas } from "./src/screens/kit";
import {
  S04_timeline, S05_transitions, S06_audio, S07_text, S08_effects,
  S09_properties, S10_keyframes, S11_export, S12_share, S13_account,
} from "./src/screens/suites";
import type { Project } from "./src/data/types";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error("FAIL: " + msg);
}

async function main() {
  // F01 + open: there is a seeded demo project we can open.
  const demo = openProject("p-demo-1");
  assert(demo && demo!.layers.length === 4, "seed project opens with 4 layers");

  // F02: timeline renders filled state, empty state, and selected state.
  assert(S04_timeline(demo as Project, 1).rows!.length === 4, "timeline shows all layers");
  assert(S04_timeline({ ...demo, layers: [] } as Project, 1).empty, "timeline empty state");
  assert(S04_timeline(demo as Project, 2, "l1").rows![0].selected, "selected layer row");

  // F03: transitions available.
  assert(S05_transitions().options.length > 0, "transitions list non-empty");

  // F04: audio mixer shows the audio lane.
  const mixer = S06_audio((demo as Project).layers);
  assert(!mixer.silent && mixer.lanes.length === 1, "one audio lane, not silent");

  // F06: vertical slice end to end - export completes.
  const p2 = projects.create({
    name: "Export test", resW: 1080, resH: 1920, fps: 30, durationMs: 2000,
    status: "draft", rev: 0, createdAt: new Date().toISOString(), layers: [],
  });
  const done = (await runExport(p2.id, "mp4", false)) as import("./src/data/types").ExportJob;
  assert(done.status === "done", "export job reaches done");
  assert(exports.get().some((e) => e.id === done.id), "export persisted");

  // S01: filled + empty.
  assert(S01_home(projects.get() as any, () => {}, (id) => {}).body!.length >= 2, "home lists projects");
  assert(S01_home([], () => {}, () => {}).empty, "home empty state");

  // S02: media import.
  assert(S02_import(media.get() as any, () => {}, () => {}).body!.length >= 2, "import lists media");
  assert(S02_import([], () => {}, () => {}).empty, "import empty state (no permission)");

  // S03: canvas.
  assert(S03_canvas(demo as Project, true).canvas.playing, "canvas playing state");

  // S07/S08/S09/S10: states.
  assert(S07_text("").empty, "text empty state");
  assert(S07_text("Hello").value === "Hello", "text filled");
  assert(S08_effects().categories.length > 0, "effects categories");
  assert(S09_properties((demo as Project).layers[0]).props.length >= 5, "layer properties");
  assert(S10_keyframes([]).none, "keyframes empty state");

  // S11/S12/S13: export/share/account states.
  assert(S11_export().watermark, "free tier watermarks by default");
  assert(S12_share(true).saved, "share saved state");
  assert(S13_account(false, false).isPro === false, "account signed out / free");

  console.log("OK: core loop + all 13 screens render every recon state.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
