# Leonida Trophy Tracker — GTA VI Trophy Guide

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/museshiro/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/museshiro/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI — built for the [make.fun](https://make.fun) bounty [gta6-trophy-guide-01](https://make.fun/c/gta6-trophy-guide-01).

## What it is

- **Every trophy**: all 55 official names, descriptions and grades (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden), each with a guide written in its own words and its sources cited beside it.
- **Tracker**: a checklist whose progress is saved in your browser (localStorage), with export to a file and import back.
- **Filters**: story, missable, collectibles, activities, online — plus earned / not earned and a search box.
- **Spoiler setting**: hides story trophy names and descriptions until you earn them.
- **Roadmap to the platinum**: the order to earn them in, in five stages, built from the official descriptions — with the one trophy the guides flag as possibly missable (Positive Mental Attitude) flagged in the list and on the roadmap.

## Run it

Serve `app/` with any static HTTP server and open `app/index.html`. It works with the network off — every file it loads is under `app/`, and it fetches nothing at run time.

```sh
cd app && python3 -m http.server 8000
# open http://localhost:8000
```

## Build the dossier

```sh
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json` with `buildDossier` from the kit's `vendor/makefun-frontend.ts`.

## Sources

Guides are written for this entry in its own words. Facts are cited per trophy from Push Square, PowerPyx, Planet GTA 6, KeenGamer, eGamers, GTA Spotter, GTABase, PSNProfiles and Exophase. The look is original — no Rockstar logo, artwork or game screenshots.

## Referral

New to make.fun? Join with my link: https://make.fun/r/xrr5vp10

## License

MIT — see [LICENSE](LICENSE).
