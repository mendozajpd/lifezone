# Lifezone Campus — New Life Tacloban

Single-page site for Lifezone Campus, the college youth ministry of New Life Tacloban. Built with
Expo Router (React Native + web), currently targeting web only — the same codebase is set up to
grow into an actual mobile app later without a rewrite.

**Live:** https://nltac-lifezone.web.app

Everything runs through Docker. There is no requirement to have Node/npm/Expo installed on the
host machine.

## Requirements

- Docker + Docker Compose

## Setup

1. Clone the repo.
2. `cp .env.example .env` — only needed for the Firebase deploy step below; everyday frontend dev
   doesn't touch it.
3. `docker compose up app` and open **http://localhost:8081**.

That's it — `npm install` happens automatically as part of the Docker image build, there's nothing
to install on the host.

## Everyday development

```bash
docker compose up app
```

Starts the Expo web dev server with live reload at **http://localhost:8081**. Edit files under
`src/` and the browser updates automatically.

To run one-off commands against the same environment (typecheck, add a dependency, etc.):

```bash
docker compose run --rm app npm run typecheck
docker compose run --rm app npx expo install <package>
```

If you add/change a dependency, rebuild the image afterwards so it's baked in for good —
`docker compose run --rm` throws away its container (and the installed package with it) as soon as
the command exits:

```bash
docker compose build app
```

## Previewing the production build

Two ways to look at the static export instead of the dev server:

```bash
# Hermetic: builds the export inside the image and serves it with `serve` on :3000
docker compose up web
```

```bash
# Produces ./dist on the host (needed for the firebase step below)
docker compose run --rm app npm run export:web
```

## Deploying to Firebase Hosting

The `firebase` service is one image (`docker/firebase/Dockerfile`) built around `firebase-tools`.
What it does depends on the command you pass — the same image handles both the local emulator and
a real deploy. The project is already configured (`.firebaserc` → `nltac-lifezone`); credentials
in `.env` are the only thing needed per machine.

**Deploy:**

```bash
docker compose run --rm app npm run export:web
docker compose run --rm firebase deploy --only hosting
```

**Local hosting emulator** instead of a real deploy (serves whatever is currently in `./dist`, so
run `export:web` first):

```bash
docker compose run --rm app npm run export:web
docker compose up firebase
```

Then open **http://localhost:5000**.

### First-time credentials setup (per machine)

1. `cp .env.example .env`.
2. Get credentials — pick one:
   - **Service account key (recommended, no interactive login)**: Firebase Console → Project
     Settings → Service Accounts → "Generate new private key". Save the downloaded JSON as
     `./secrets/firebase-service-account.json` (git-ignored, bind-mounted read-only into the
     firebase container — `.env.example` already points `GOOGLE_APPLICATION_CREDENTIALS` at the
     right in-container path).
   - **CI token**: `docker compose run --rm firebase login:ci --no-localhost` — opens a URL to
     visit in a browser, paste the code back into the terminal. Put the resulting token in `.env`
     as `FIREBASE_TOKEN`.

To point this repo at a *different* Firebase project, edit `.firebaserc` and/or set
`FIREBASE_PROJECT_ID` in `.env` to override it per-run.

## Project structure

```
src/
├── app/            Expo Router routes — app/index.tsx is the entire single-scroll page
├── components/
│   ├── layout/      NavBar, Footer, Section (measures itself for scroll-to-section, optional bg image)
│   ├── sections/    Hero, Vision, Ministry, Gallery, GetInvolved, Contact
│   └── ui/           Logo, LogoName, Button
├── context/          ScrollContext — nav bar smooth-scrolls the shared ScrollView by section id
├── constants/         theme.ts (colors/fonts/spacing), layout.ts, content.ts (all site copy)
└── types/             shared content types

assets/images/
├── gallery/          real event photos, used by the Gallery grid and as section backgrounds
├── logo-mark.png      real logo artwork
└── icon.png, splash-icon.png, favicon.png, android-icon-*.png   app icons (still placeholders)
```

The nav bar scrolls to sections via `ScrollView.scrollTo`, not DOM APIs, so the same code will
work unmodified once native (iOS/Android) screens are added.

## Still placeholder

- `assets/images/icon.png`, `splash-icon.png`, `favicon.png`, `android-icon-*.png` — generated
  black-background/white-mark icons, not the final exported app icon set.
- `src/constants/theme.ts` — pure black/white/gray palette; add a brand accent color if/when one
  is defined.
