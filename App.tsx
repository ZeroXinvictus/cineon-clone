import React, { useState } from "react";
import {
  View, Text, ScrollView, Pressable, StatusBar, SafeAreaView,
} from "react-native";
import { tokens, buttonStyle, clipColor } from "./src/design/primitives";
import { projects, openProject } from "./src/data/store";
import { S01_home, S02_import, S03_canvas } from "./src/screens/kit";
import {
  S04_timeline, S05_transitions, S06_audio, S07_text,
  S11_export, S12_share, S13_account,
} from "./src/screens/suites";
import type { Project } from "./src/data/types";

type Screen = "home" | "import" | "editor" | "timeline" | "transitions"
  | "audio" | "text" | "export" | "share" | "account";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [current, setCurrent] = useState<Project | null>(null);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const open = (id: string) => {
    const p = openProject(id);
    if (p) { setCurrent(p); setScreen("editor"); }
  };
  const startNew = () => { setScreen("import"); };
  const pickMedia = (mediaId: string) => {
    // ponytail: create a minimal project with one video layer on import
    const p = projects.create({
      name: "New project", resW: 1080, resH: 1920, fps: 30, durationMs: 8000,
      status: "draft", rev: 0, createdAt: new Date().toISOString(),
      layers: [{ id: "l-new", kind: "video", name: "Clip.mp4", start: 0, end: 8000, opacity: 1, blend: "normal", order: 0 }],
    });
    setCurrent(p); setScreen("editor");
  };

  const t = tokens.color;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        {screen === "home" && (
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ color: t.text, fontSize: 24, fontWeight: "700", marginBottom: 16 }}>Projects</Text>
            <ScrollView>
              {projects.get().map((p) => (
                <Pressable key={p.id} onPress={() => open(p.id)}
                  style={{ backgroundColor: t.surface, borderRadius: 12, padding: 14, marginBottom: 10,
                    borderColor: t.border, borderWidth: 1 }}>
                  <Text style={{ color: t.text, fontSize: 16, fontWeight: "600" }}>{p.name}</Text>
                  <Text style={{ color: t.muted, fontSize: 12 }}>{p.resW}x{p.resH} · {p.layers.length} layers</Text>
                </Pressable>
              ))}
              <Pressable onPress={startNew} style={[buttonStyle("secondary"), { marginTop: 12, alignItems: "center" }]}>
                <Text style={{ color: t.text }}>+ New project</Text>
              </Pressable>
            </ScrollView>
          </View>
        )}

        {screen === "import" && (
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ color: t.text, fontSize: 24, fontWeight: "700", marginBottom: 16 }}>Import media</Text>
            <Pressable onPress={() => pickMedia("m1")} style={[buttonStyle("primary"), { marginBottom: 12, alignItems: "center" }]}>
              <Text style={{ color: t.onAccent }}>Pick from camera roll</Text>
            </Pressable>
            <Pressable onPress={() => setScreen("home")} style={[buttonStyle("ghost"), { alignItems: "center" }]}>
              <Text style={{ color: t.accent }}>Back</Text>
            </Pressable>
          </View>
        )}

        {current && screen === "editor" && (
          <View style={{ flex: 1 }}>
            {/* S03 canvas */}
            <View style={{ flex: 1, backgroundColor: t.surface, margin: 12, borderRadius: 12,
              justifyContent: "center", alignItems: "center", borderColor: t.border, borderWidth: 1 }}>
              <Text style={{ color: t.muted, fontSize: 13, fontFamily: "monospace" }}>
                {current.resW}x{current.resH} · {current.layers.length} layers
              </Text>
              <Text style={{ color: t.text, fontSize: 11, marginTop: 6, fontFamily: "monospace" }}>
                00:00.000 / {(current.durationMs / 1000).toFixed(1)}
              </Text>
            </View>
            {/* tool rail */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 8 }}>
              {[["Timeline", "timeline"], ["Transitions", "transitions"], ["Audio", "audio"], ["Text", "text"], ["Export", "export"]].map(([lbl, to]) => (
                <Pressable key={to} onPress={() => setScreen(to as Screen)}
                  style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: t.surfaceRaised, borderRadius: 8,
                    borderColor: t.border, borderWidth: 1 }}>
                  <Text style={{ color: t.text, fontSize: 12 }}>{lbl}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {current && screen === "timeline" && (
          <View style={{ flex: 1, padding: 12 }}>
            <Text style={{ color: t.text, fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Timeline</Text>
            {current.layers.map((l) => {
              const w = Math.max(20, ((l.end - l.start) / current.durationMs) * 200);
              return (
                <Pressable key={l.id} onPress={() => setSelected(l.id)}
                  style={{ height: 40, backgroundColor: t.surface, borderRadius: 6, marginBottom: 6,
                    borderColor: l.id === selected ? t.accent : t.border, borderWidth: l.id === selected ? 2 : 1,
                    flexDirection: "row", alignItems: "center", overflow: "hidden" }}>
                  <View style={{ width: w, height: "100%", backgroundColor: clipColor(l.kind) }} />
                  <Text style={{ color: t.text, fontSize: 11, marginLeft: 8 }}>{l.name}</Text>
                </Pressable>
              );
            })}
            <Pressable onPress={() => setScreen("editor")} style={[buttonStyle("ghost"), { marginTop: 12, alignItems: "center" }]}>
              <Text style={{ color: t.accent }}>Back to preview</Text>
            </Pressable>
          </View>
        )}

        {screen === "transitions" && (
          <SimpleScreen title="Transitions" onBack={() => setScreen("timeline")}
            items={S05_transitions().options.map((o) => o.label)} accent={t.accent} />
        )}
        {screen === "audio" && current && (
          <SimpleScreen title="Audio mixer" onBack={() => setScreen("timeline")}
            items={S06_audio(current.layers).lanes.map((l) => l.name)} accent={t.success} />
        )}
        {screen === "text" && (
          <SimpleScreen title="Text" onBack={() => setScreen("editor")}
            items={S07_text("").options} accent={t.warning} />
        )}
        {screen === "export" && (
          <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ color: t.text, fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Export</Text>
            {S11_export(undefined, true).formats.map((f) => (
              <View key={f} style={{ backgroundColor: t.surface, borderRadius: 8, padding: 14, marginBottom: 8,
                borderColor: t.border, borderWidth: 1 }}>
                <Text style={{ color: t.text, fontSize: 14 }}>{f.toUpperCase()}</Text>
              </View>
            ))}
            <Text style={{ color: t.muted, fontSize: 12, marginTop: 8 }}>Free tier: small watermark on MP4.</Text>
          </View>
        )}
        {screen === "share" && (
          <SimpleScreen title="Share" onBack={() => setScreen("export")}
            items={S12_share(true).targets} accent={t.success} />
        )}
        {screen === "account" && (
          <SimpleScreen title="Account" onBack={() => setScreen("home")}
            items={S13_account(false, false).proBenefit ? [S13_account(false, false).proBenefit] : []} accent={t.accent} />
        )}
      </SafeAreaView>
    </View>
  );
}

function SimpleScreen({ title, items, onBack, accent }: {
  title: string; items: string[]; onBack: () => void; accent: string;
}) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: tokens.color.text, fontSize: 18, fontWeight: "600", marginBottom: 12 }}>{title}</Text>
      <ScrollView>
        {items.map((it, i) => (
          <View key={i} style={{ backgroundColor: tokens.color.surface, borderRadius: 8, padding: 14,
            marginBottom: 8, borderColor: tokens.color.border, borderWidth: 1 }}>
            <Text style={{ color: tokens.color.text, fontSize: 14 }}>{it}</Text>
          </View>
        ))}
      </ScrollView>
      <Pressable onPress={onBack} style={{ padding: 12, alignItems: "center", marginTop: 8 }}>
        <Text style={{ color: accent }}>Back</Text>
      </Pressable>
    </View>
  );
}
