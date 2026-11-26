# Cineon — run it

Mobile video editor clone (core loop), built with Expo / React Native.
Rebuilt clean-room from the Alight Motion recon in `../replica/`.

## Run

```bash
npm install          # already done in this repo, but on a fresh clone
npx expo start       # opens the dev server; scan the QR from the Expo Go app
# or
npx expo start --android
npx expo start --ios
```

The app opens on the Projects screen (S01). Tap **New project** → import →
the editor (S03 preview + tool rail) → Timeline / Transitions / Audio / Text /
Export / Share / Account.

## Scripts

```bash
npm test      # headless e2e: core loop + all 13 screens render every state
npm run render# layer-tree → PPM frames → ffmpeg MP4 (the native render layer)
npm run export# public exportProject() — real MP4 encode, returns buffer + job
```

## What is real vs. swapped-in

| part | status here | on-device |
| --- | --- | --- |
| screen builders (`src/screens/*`) | real, tested | real |
| data layer (`src/data/store.ts`) | in-memory fake, same signatures as Supabase | swap for Supabase client |
| render pipeline (`src/render/compositor.js`) | software PPM + ffmpeg, verified | swap PPM draw for the GL compositor |
| media import | expo-media-library wired in `app.json` | grant the permission on device |
| camera | expo-camera wired | on device |

The on-device GL compositor and the production Supabase client are the two
swap-ins; the screen code does not change when they land.

## Verified in this repo

- `tsc --noEmit` clean
- `expo export --platform android` bundles 593 modules to Hermes bytecode
- e2e: core loop + all 13 screens, every recon state
- `compositor.js` + `export.js` produce a real MP4 via ffmpeg
- brand sweep clean (no Alight name/domain/colour in the code)
