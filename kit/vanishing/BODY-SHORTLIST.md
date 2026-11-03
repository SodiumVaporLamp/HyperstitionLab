# More of the body of the machine: a shortlist

**Status.** Research only, update 5 (23 October 2026). Nothing new is drawn. This ranks candidates for at most two more views in “The body of the machine” (see `PANEL.md` for the two that are built). SVL decides whether either goes in.

**How it was gathered.** A research pass read seven candidates in their primary sources (SEC filings and XBRL, company and agency PDFs, utility decks posted by PJM). Its full notes, with every URL and derivation, are in `panel-sources/body-candidates-2026-10-23.md`. The figures marked ✓ below were then re-read separately from the primary document in this session. News articles and the review that prompted this (Sol, 23 October 2026) were used only as leads.

## What the built pair shows, and what it leaves out

The note already has money committed (one company’s cash spent on property and equipment) and energy used (one country’s metered data-centre electricity). Two steps between them are missing: what the money buys, and the queue between a signed site and a powered one.

## The recommendation

### 1. NVIDIA’s Data Center revenue (money becoming chips)

- **The view.** Four bars, US$ billion, fiscal years ending late January: FY2023 15.0, FY2024 47.5, FY2025 115.2, FY2026 193.7. Drawn like the Microsoft chart.
- **The line.** “Data Center” in “Schedule of Revenue by Market”, Forms 10-K, US$ millions ✓: 15,005 (FY2023), 47,525 (FY2024), 115,186 (FY2025), 193,737 (FY2026). FY2024 reads the same in the FY2024 and FY2026 10-Ks ✓. Compute and Networking sub-lines for FY2026: 162,361 and 31,376 ✓.
- **Ratios.** FY2026 is 12.9 times FY2023 and 68 percent above FY2025.
- **Why first.** It adds a step nothing else on the page shows (the money arriving at the chipmaker), it is the most direct link to AI of the seven, and the XBRL record makes it easy to reproduce.
- **Caveats the note would carry.**
  - It is revenue, not chips shipped, and it includes networking.
  - It is not the “Compute & Networking” segment, which is a different total.
  - From the first quarter of FY2027 NVIDIA split Data Center into Hyperscale and “AI Clouds, Industrial, & Enterprise”, and recast the earlier quarters. The Data Center total did not change; only the split did.
  - Geography is where the customer is billed, not where the chips go.
  - **Never add it to the cloud companies’ capital spending.** Much of NVIDIA’s revenue is that spending seen from the seller’s side, so a sum would count the same chips twice. The two charts can sit side by side; their fiscal years also differ (NVIDIA’s ends in late January, Microsoft’s on 30 June).

### 2. Dominion Energy Virginia: data centres under contract, by stage, against billed demand (signed sites becoming powered ones)

- **The view.** One chart in MW, bars from zero: Dominion’s data-centre billed demand by year, 2013–2025, then the capacity under contract in July 2025 and July 2026, split into its three stages. The stage Dominion calls not firm (ELOA) is drawn hollow.
- **Billed demand, MW** (PJM Load Analysis Subcommittee deck, 29 September 2026, slide 3 ✓): 462 (2013), 532, 636, 753, 931, 1,113, 1,421, 1,808, 2,302, 2,767, 3,183 (2023), 3,636 (2024), 4,237 (2025); 4,838 is the 2026 forecast. 2013–2023 read the same in the October 2024 deck ✓; 2024, a forecast of 3,562 there, was later reported as 3,584 and then 3,636.
- **Under contract, MW.**

  | As of | Electric Service Agreements (firm) | Construction Letters of Authorization (firm) | Engineering Letters of Authorization (not firm) | Total | Source |
  |---|---:|---:|---:|---:|---|
  | July 2025 | 9,815 (9.8 GW ✓) | 7,098 (7.1 GW ✓) | 30,132 (30.1 GW ✓) | 47,045 (“47 GW” ✓) | Dominion’s letter to PJM, 6 January 2026; MW from the September 2025 deck |
  | July 2026 | 11,997 ✓ | 9,356 ✓ | 32,473 ✓ | 53,826 (“Approximately 54GW” ✓) | PJM deck, 29 September 2026, slides 2 and 6 |

- **Ratios.** In July 2026, about 54 GW was under contract against 4.2 GW billed in 2025, 12.7 times as much; the firm stages alone were 21.4 GW, 5.0 times. Billed demand in 2025 was 9.2 times 2013’s.
- **Why second.** It shows the grid admitting the machine, a mechanism nothing else on the page covers, in Dominion’s Virginia territory, with stage definitions Dominion has published. It pairs with the Irish chart: metered there, billed and contracted here.
- **Caveats the note would carry.**
  - Everything here is capacity (MW), not energy (MWh, as in the Irish chart). The two charts can sit near each other, but nothing should convert one into the other.
  - Contracted capacity is not load. Dominion: “Dominion’s industry average ramp period is 5 years maturing at a utilization rate of 63%” ✓. The Engineering Letter stage is a deposit for a study; Dominion: “ELOAs are not considered firm load” ✓.
  - Only two contract observations share the same labelled definitions. The October 2024 deck also has a July 2024 chart, but only its Substation Engineering Letters figure (7,570 MW) is labelled; its other numbers come out of the PDF without labels, so they are left out.
  - These are the utility’s own figures, posted for PJM’s load forecast; they are not audited.
  - AI is not separated from other data-centre load.

## Why not the others

- **The big four’s capital spending** (Alphabet, Amazon, Meta, Microsoft by calendar year: 147.2, 228.3 and 376.1 US$ billion for 2023–25). Amazon’s three years ✓ from XBRL. It adds scale, not a new mechanism, and needs work to compare like with like: Microsoft has to be rebuilt from quarters, Amazon’s line also covers software, and Meta restated 2023 when it began netting in sale proceeds. A good replacement for the Microsoft chart if SVL ever wants scale; not a new view.
- **TSMC** (high-performance computing rose from 43 to 58 percent of revenue, 2023–25; 15.0 million 12-inch-equivalent wafers shipped in 2025). Its high-performance computing category includes PCs, consoles and base stations, so the link to AI is indirect, and no packaging (CoWoS) capacity is published.
- **LBNL’s US estimate** (192 TWh, 4.7 percent of US electricity in 2024 ✓; 2030 reference case 649 TWh, range 521–843 ✓). A model built from shipments, not a meter reading, and the 2025 update lowered its earlier years “primarily due to a reduction in reported shipments of GPUs for 2023 and 2024” ✓. Two report vintages are not a series.
- **The IEA’s global estimate** (415 TWh in 2024 ✓, 485 TWh in 2025 ✓, 950 TWh in 2030 ✓). Also modelled “based on physical shipments of servers” ✓. The update-4 decision against estimates stands; it could be one line beside the Irish chart. The report gives 2025’s growth as both “17%” and “more than 15%”.
- **The IMF’s circular financing** (14 publicly disclosed deals since 2023: about $300 billion of equity, $650 billion of debt, $1.4 trillion of revenue commitments ✓, Global Financial Stability Report, October 2026, chapter 1). One snapshot of announced and contracted amounts, not spending; the firms are numbered, not named, and some sit on both sides, so the three totals must not be added. It suits a card or an annotation, not a chart.

## Scorecard

| Candidate | Metric as printed | Unit | Period | Status | Two observations, same definition | Definition changes | AI link |
|---|---|---|---|---|---|---|---|
| NVIDIA | “Data Center” revenue by market | US$ m | fiscal years to late January | company-reported accounts | FY2025 115,186; FY2026 193,737 ✓ | sub-split recast in FY2027; total unchanged | most direct |
| Dominion | contract capacity by stage; billed demand | MW | July 2025, July 2026; 2013–2025 | signed contracts; billed demand | 47,045 → 53,826 MW ✓; 3,183 (2023) → 4,237 (2025) ✓ | first stage renamed SELOA → ELOA; 2024 demand revised | broad |
| Big-four capex | “Purchases of / Additions to property and equipment” | US$ m | calendar years | company-reported accounts | 228,342 (2024); 376,051 (2025) | Meta nets proceeds from FY2024 10-K | company-wide |
| TSMC | HPC share of net revenue; wafer shipments | % ; 12-inch equivalent | calendar years | company-reported | 51% (2024), 58% (2025) | none found | indirect |
| LBNL | estimated US data-centre electricity | TWh ; % | 2023, 2024 | modelled | 176 TWh (2023, 2024 report); 192 TWh (2024, 2025 update) ✓ | 2023 revised down, figure in a chart only | broad |
| IEA | global data-centre electricity consumption | TWh | 2024, 2025 | modelled | 415; 485 ✓ | none to 2024 | broad |
| IMF | equity, debt, revenue commitments in 14 deals | US$ bn | cumulative since 2023 | announced or contracted | one snapshot only | n/a | direct, financial |

## Judged on five things

| | NVIDIA | Dominion | Big four | TSMC | LBNL | IEA | IMF |
|---|---|---|---|---|---|---|---|
| A step not already shown | money → chips | signed → firm → billed | little | wafers, not only AI | overlaps Ireland | global energy | financing loops |
| Anyone can reproduce it | XBRL | PDFs posted by PJM | XBRL | annual reports | PDF, some figures only in charts | PDF; data behind a login | no deal list |
| Comparable year to year | yes | two Julys so far | after Meta’s restatement | yes | no | yes | no |
| Clear to a non-specialist | yes | yes, with the stage key | yes | needs a gloss | yes | yes | needs care |
| How directly it is AI | most | broad | company-wide | indirect | broad | broad | direct, financial |

## Not verified

- Dominion’s July 2024 split by stage (unlabelled in the extracted PDF text). It needs a look at slide 7 of the October 2024 deck before it can be used.
- LBNL’s revised 2023 figure: shown only in its Figure 1 (about 168 TWh, back-calculated from its stated 14 percent growth, is not a source number).
- The IEA’s data set (behind a login, a spreadsheet), the IMF’s technical note 2026/13 behind the deal figures, and the IMF blog of 13 October 2026 (not found; the press-briefing transcript of that day repeats the figures).
- Dominion’s MW detail for July 2025 (9,815 / 7,098 / 30,132) was read by the research pass from the September 2025 deck; this session confirmed the rounded GW in Dominion’s letter.
- Q3 2026 10-Qs for Alphabet, Amazon and Meta had not been filed on 23 October 2026.

## If SVL picks one

Follow `PANEL.md`: add the series to `BODY` in `data.js` with its source fields, draw it with `renderBody`, have `check.js` print its ratios, and read every figure in two primary representations before it goes on the page (for NVIDIA, the 10-K table and the XBRL record; for Dominion, two decks or the deck and the letter). Add a section to `PANEL.md` with the table, the caveats above and the decisions.

## Sources

- NVIDIA Form 10-K for FY2026, Schedule of Revenue by Market: https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/R85.htm
- NVIDIA Form 10-K for FY2024, Schedule of Revenue by Market: https://www.sec.gov/Archives/edgar/data/1045810/000104581024000029/R88.htm
- Dominion Energy, PJM Load Analysis Subcommittee, 29 September 2026: https://www.pjm.com/-/media/DotCom/committees-groups/subcommittees/las/2026/20260929/20260929-item-5ai---dominion_energy.pdf
- Dominion Energy, letter to PJM on its data-centre forecast, 6 January 2026: https://www.pjm.com/-/media/DotCom/planning/res-adeq/load-forecast/dominion-documentation.pdf
- Dominion Energy, PJM Load Analysis Subcommittee, 25 October 2024: https://pjm.com/-/media/committees-groups/subcommittees/las/2024/20241025/20241025-item-03ai---dominion-data-center-large-load-request.ashx
- Dominion Energy, PJM Load Analysis Subcommittee, 16 September 2025: https://www.pjm.com/-/media/DotCom/committees-groups/subcommittees/las/2025/20250916/20250916-item-04ai---dominion-data-center-large-load-request.pdf
- Amazon, SEC XBRL `PaymentsToAcquireProductiveAssets`: https://data.sec.gov/api/xbrl/companyconcept/CIK0001018724/us-gaap/PaymentsToAcquireProductiveAssets.json
- LBNL, United States Data Center Energy Usage Report: 2025 Update (LBNL-2001758, June 2026): https://escholarship.org/content/qt33m6w3x0/qt33m6w3x0.pdf
- IEA, Key Questions on Energy and AI (16 April 2026): https://iea.blob.core.windows.net/assets/3179f7f8-01f6-4dd6-bffa-c9f7b73f1dc9/KeyQuestionsonEnergyandAI.pdf
- IMF, Global Financial Stability Report, October 2026, chapter 1: https://www.imf.org/-/media/files/publications/gfsr/2026/october/english/ch1.pdf
