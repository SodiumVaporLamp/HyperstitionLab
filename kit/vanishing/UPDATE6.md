# Update 6: seven pre-1900 milestones, Grok, and links between cards

**Built 23 October 2026** from a handoff SVL commissioned (brainstormed with Sol), deepened before it was run. Milestones went from 262 to 276 (37 before 1900, from 30; 92 model releases, from 85). Forecasts unchanged at 20.

## What was added

| id | Date on the spiral | Lane | Weight | The particular each card turns on |
|---|---|---|---|---|
| `shang-oracle-bones` | ~-1200, shown “Late Shang, c. 1250–1050 BCE” | Language | 2 | The four parts of an inscription (preface, charge, prognostication, verification) are the shape of this page’s forecast cards; OBI-Bench (2024) tested 23 multimodal models on reading the bones |
| `antikythera` | ~-100, shown “2nd–1st century BCE” | Reckoning | 2 | Spiral dials that count months, one cell each, against this page’s spiral of tenfold turns; Babbage died thirty years before it surfaced |
| `gutenberg` | 1455, shown “1454–55” | Language | 2 | Fust lent the money and took the workshop in the year the Bible was finished (hearing recorded 6 November 1455) |
| `mercator` | 1569 | Capital | 2 | A constant-bearing course is a straight line on Mercator’s sheet and a logarithmic spiral seen from above the pole; about 8.3° north of due west gives this page’s spiral exactly |
| `watt-governor` | 1788 | Capital | 2 | Wiener: “governor” and “cybernetics” come from the same Greek word for steersman |
| `evans-mill` | 1791 | Capital | 2 | Washington signed Evans’s patent as president and bought a licence under it; Ben, an enslaved miller, worked the automated mill |
| `atlantic-cable` | 1866-07-27 | Capital | 2 | Hoag (2006): steamship crossing times can be recovered from stock prices, and the lag fell from ten days to none |

The Uruk card was retitled “Uruk: writing as bookkeeping”, its first sentence now says “among the oldest surviving written records”, and its reading points further in to the Shang archive.

Grok: `grok15` (28 March 2024), `grok2` (13 August 2024), `grok41` (17 November 2025), `grok420` (10 March 2026, API), `grok43` (April 2026, month only), `grok46` (12 August 2026), `grok47` (21 September 2026). `grok45` retitled “Grok 4.5 reaches the API”: 8 July is the release-notes date, 16 July the announcement; its secondary source was replaced by xAI’s own two.

## The deepening, in brief

Sol’s drafts were treated as leads. Every date and number was checked against a page fetched on 23 October 2026, and each card was given one physical particular that carries its reading. What changed from the handoff because of that:

- **The Evans “hopper boy”.** The deepening plan proposed a reading on the machine being named for the boy whose job it took. No source fetched says so (Mount Vernon and Wikipedia describe it as replacing hand raking), so the card names the machine and draws no conclusion from the name.
- **Gutenberg and Fust.** The handoff had them producing the Bible together. The Library of Congress calls Fust Gutenberg’s partner; Wikipedia, the lender who won control of the workshop. The card says he lent the money and took the workshop.
- **The Watt governor.** The Science Museum says this engine was the first fitted with the centrifugal governor (Watt’s first, at Boulton’s suggestion); similar regulators already ran windmills and water mills. The card says both.
- **Antikythera’s dating.** Wreck about 70–60 BCE; published estimates for the device from about 205 BCE (Freeth’s eclipse-dial epoch, which may differ from manufacture) to 87 BCE. Plotted at ~-100 and labelled by century.
- **The cable’s date.** The handoff allowed year precision; the landing at Heart’s Content on 27 July 1866 is well recorded, so the card uses the day.
- **Hand-written notes the additions would have made false.** “What counts” said the pre-1900 machine line runs “from Llull”, and the Models sentence said “the most notable from other labs” while xAI now has more releases (11) than Google (10). Both reworded.

## Decisions SVL can overrule

1. **The four Grok specialist releases stay out** (Grok-1.5V preview, grok-code-fast-1, Grok 4 Fast, Grok 4.1 Fast). The page has no Gemini Flash or other “other lab” variants, so the existing policy excludes them. All four were confirmed on x.ai with the dates in the handoff, so adding them is quick.
2. **Grok 1 and Grok 3 dates left as they are.** xAI’s pages say 3 November 2023 (the page has 4 November) and 19 February 2025 (the page has 17 February, the livestream). The handoff asked not to move Grok 3 for a later post date; Grok 1 is the same kind of one-day gap.
3. **Grok 4.3 cites the model documentation and Wikipedia, not the SpaceX S-1.** EDGAR full-text search shows “Grok 4.3” and “April 2026” are both in the S-1, but the sentence could not be fetched (the file is 11.8 MB and sec.gov refused direct download from both machines), so it is not quoted or cited. A browser search of the S-1 for “Grok 4.3” would settle it.
4. **The maker is still `org: 'xAI'`.** From Grok 4.5, xAI’s own pages call the company “SpaceXSI”, with “SpaceXAI LLC” in the footer, and Wikipedia says SpaceXAI. The Grok 4.5 card quotes the new name; the tag stays xAI so the line reads as one maker.
5. **Links between cards (`see`).** New: a card lists related milestones under “Elsewhere on the spiral”, shown both ways. Used only on the seven new cards. Remove the field and the six lines in `ui.js` to undo.
6. **No Land quotation on the new cards**, as the handoff asked. A candidate if SVL wants one on the Watt card: “Logistically accelerating techno-economic interactivity crumbles social order in auto-sophisticating machine runaway.” (“Meltdown”, checked in this session), the runaway loop set against the governor’s steadying one.

## Checks

- `node vanishing/check.js`: 276 milestones, 37 before 1900, 17 links on 21 cards, no errors or warnings.
- `python3 test.py --vp …` with all sixteen new or changed ids: all checks passed; desktop and phone screenshots looked at, including the 1788–93 crowd in the Capital lane (Watt, Evans, de Prony), which the nudge keeps apart.
- `python3 vanishing/loxodrome_check.py`: a course 8.30° north of due west, integrated step by step on a sphere and projected stereographically, is a logarithmic spiral to 6 × 10⁻¹² in ln r, grows ×2.500000 per turn, winds clockwise inward and crosses every radius at 81.7029°, the same angle as the page’s spiral.
- An independent agent checked every new card against its listed sources without seeing how they were written (a weaker check than the sources themselves); see below.

## Independent read

A separate agent fetched every listed source and checked each claim on the sixteen cards (23 October 2026). It confirmed the dates, numbers and quotations, and checked the loxodrome maths independently (exact logarithmic spiral; 8.30° north of west for ×2.5 a turn, so “about eight degrees” stands). It flagged nine things, all changed:

| Card | Flag | Now |
|---|---|---|
| `grok43` | “No exact day has been published” is contradicted: secondary reports give a SuperGrok Heavy beta on 17 April and API availability around 30 April–1 May | “xAI’s own pages give no exact day” (the secondary dates were not checked further) |
| `shang-oracle-bones` | OBI-Bench’s “comparable to untrained humans” is said of the best three models, not all 23 | “the best of them did about as well as untrained people” |
| `uruk` | Wikipedia says the lexical lists were “probably used” to teach writing (an existing sentence) | “word lists, probably used in part to train scribes”, and “probably” in the reading |
| `evans-mill` | Mount Vernon says Washington signed the patent *application* | “after George Washington, as president, signed his application”; the reading follows |
| `evans-mill` | “revolving” rake not in the listed sources | “a mechanical rake” |
| `antikythera` | Babbage’s death unsourced | Babbage’s article added |
| `gutenberg` | Lagado’s five hundred frames unsourced on this card | the Lagado passage added |
| `mercator` | “Local angles stay true” unsourced | Mercator projection article added (conformal, Wright’s 1599 tables, the poles), replacing Wright’s |
| `atlantic-cable` | Wikipedia’s “Saturday, 7 September” can’t be right (7 September 1866 was a Friday); other accounts say by 8 September | “early in September”; “from stock prices alone” trimmed to Hoag’s wording |
