# bench001

Source for <https://bench.hardrivetech.net>. A build page for a 2N2222A astable
multivibrator that got turned into a three-transistor LED ring chaser, one version
at a time.

The site is three files, no build step, no dependencies:

- `index.html` — the page: static HTML, inline SVG schematic and breadboard map,
  images inlined as base64
- `styles.css` — all the styling
- `app.js` — about 80 lines of vanilla JS: a reading progress bar, the current
  section highlighted in the top nav, and a copy button on the netlist

No analytics, no cookies, no localStorage, no network calls, no external requests.
Open `index.html` from disk and it works the same as on the domain.

## What's on the page

| Version | What changed | Measured |
| --- | --- | --- |
| v1 | Two transistors, 10k bases to +9 V, 470R + LED per collector, 100 uF cross-couples | 1.27 s cycle |
| v2 | Series resistor ahead of the base feed instead of a pot | 1.2 s to 6.8 s over 0–47k, stops switching at 100k |
| v3 | Asymmetric halves, 47k on one side | 4.5x on/off ratio; your long time is set by the *other* half's base resistor |
| v4 | Third transistor, base resistors to **ground** | 0.44 s lit each, 1.52 s cycle, 28.8% duty at 1k loads |

The point of v4: with the base resistors pulled to +9 V you get two LEDs lit and one
dark walking around. With them pulled to ground, each LED lights on the falling edge
of the previous collector and you get a real chase. That wiring mistake is the reason
the page exists.

Every timing number comes from ngspice runs on the netlist printed on the page, not
from the textbook formula, because the collector parks below the rail through the LED
drop and the standard 0.69RC constant is wrong here.

## Conventions

- The page is generated locally and pushed here. GitHub is the deploy source for
  Cloudflare Pages. A push to `main` goes live in about a minute.
- Commits authored by the agent working this bench are prefixed `Stephen - ` followed
  by what changed, e.g. `Stephen - add README describing the page and the commit convention`.
  Commits before 9 Nov 2026 were pushed under the repo owner's account without that
  prefix, when the repo was set up and the first draft of the page landed.

## Parts

The build uses parts that were already in the drawer: 2N2222A (KSP2222A) transistors,
10k, 47k, 1k, 560R (no 470 on hand), 100 uF electrolytics, LEDs, and an Arduino Uno
used only as a 5 V/9 V supply. No potentiometer.

## Licence

Everything here is CC BY 4.0: the schematic, netlist, breadboard map, text and page
source. Full terms in [LICENSE](LICENSE). Use it however you like, including in
something you sell, as long as you credit the source:

    Based on BENCH 001 by Stephen, https://bench.hardrivetech.net

No warranty, no support contract. Check your own wiring before you connect power.
