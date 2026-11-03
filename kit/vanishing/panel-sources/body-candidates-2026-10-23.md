# Body of the machine: candidate series, research notes (23 October 2026)

> Gathered by a research pass in update 5 and kept as read. `BODY-SHORTLIST.md` (one folder up) has the ranking, and marks the figures re-read separately in that session. The July 2024 Dominion split by stage (8,012 / 5,835) is inferred from unlabelled chart series and is not used. The revised LBNL 2023 figure (about 168 TWh) is back-calculated, not a source number.


Research date: 23 October 2026. Primary sources only: SEC filings and XBRL APIs, company IR PDFs, agency PDFs, and grid-operator or utility decks posted by PJM and ERCOT. News items were used only to find documents; none of their numbers are cited. Unless stated otherwise, money is in US$ million. "Derived" marks a figure I computed from the cited values.

Existing pair on the page: Microsoft "Additions to property and equipment", FY2023–FY2026 = 28,107 / 44,477 / 64,551 / 115,948 (I re-checked these against XBRL and the FY2026 10-K R6), and Ireland CSO metered data-centre electricity.

---

## 1. Scorecard (one row per candidate)

| # | Metric (as printed) | Unit | Period | Geography | Coverage | Status | Source location | Obs 1 | Obs 2 | Definition changes | Main caveat | AI link |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Big-4 capex: "Purchases of property and equipment" (GOOGL, AMZN, META); "Additions to property and equipment" (MSFT) | US$ m, cash | CY2023–CY2025, H1 2026 (MSFT built from quarters) | Global, company-wide | Cash paid for PP&E. Excludes finance-lease assets (shown separately). Amazon's tag also covers software and intangibles. AI is not split out | Company-reported accounting figure (audited for full years) | SEC XBRL companyconcept APIs; 10-K cash-flow R pages (list in §2.1) | CY2024 sum 228,342 | CY2025 sum 376,051 (H1 2026: 294,800 vs H1 2025: 160,148) | Meta's FY2024 10-K nets "proceeds relating to property and equipment" into the purchases line (2023 restated 27,266 → 27,045). Others stable | Includes non-AI capex (warehouses, offices). Finance leases excluded (MSFT FY2026 finance-lease ROU 24,608). Timing differs from accrual capex | Company-wide proxy; AI not measured separately |
| 2 | NVIDIA "Data Center" revenue (revenue by market / market platform) | US$ m | FY ends late Jan: FY2024 (to 28 Jan 2024), FY2025, FY2026; Q1–Q2 FY2027 | Global (billing location) | Data-centre compute plus networking. From Q1 FY27 split into Hyperscale and ACIE | Company-reported accounting figure | 10-K R88 (FY24), R87 (FY25), R85 (FY26); 10-Q R66 (Q1 FY27), R67 (Q2 FY27) | FY2025: 115,186 | FY2026: 193,737 (Q2 FY27: 89,023 vs 41,096) | Q1 FY27 changed the market-platform presentation and recast prior periods. The Data Center total is unchanged; the sub-split moved from Compute/Networking to Hyperscale/ACIE. Q2 FY27 moved one customer from ACIE to Hyperscale | Revenue, not units: it moves with price and mix. Overlaps with hyperscaler capex (the same dollars), so the two must not be summed | Most direct AI link: AI accelerators and networking, though not 100% AI |
| 3 | TSMC: HPC share of net revenue; wafer shipments; annual capacity; capex | % ; k 12-inch-equiv. wafers ; m wafers ; US$ bn | CY2023–2025; 3Q26 | Global (TSMC) | HPC "includes PCs, tablets, game consoles, servers, base stations". CoWoS capacity not disclosed as a number | Company-reported (AR, management reports) | 2025/2024 AR ch1–2, ch6; 4Q24, 4Q25, 3Q26 Management Reports | 2024: HPC 51%, shipments 12,910k, capacity ≈17m, capex 29.76bn | 2025: HPC 58%, shipments 15,022k, capacity >17m, capex 40.90bn | No HPC reclassification found. The 2025 AR adopts a "Foundry 2.0" industry definition (market size only) | HPC is broader than AI. Capacity is roughly flat, so the AI story sits in mix and packaging, which is not quantified | Indirect: platform share. AI accelerators were a "high-teens percent" of 2025 revenue (call transcript) |
| 4 | LBNL estimated US data-centre electricity use | TWh ; % of US electricity | 2023, 2024 (history), 2025–2030 (scenarios) | United States | Servers, storage, network, infrastructure (PUE). AI servers modelled within | Modelled estimate (bottom-up from shipments), not metered | LBNL-2001637 p.6; LBNL-2001758 p.9, Table 2, p.27 | 2024 report: 2023 = 176 TWh, 4.4% | 2025 update: 2024 = 192 TWh, 4.7%; 2030 ref. 649 TWh (range 521–843) | 2025 update revises prior years "slightly below" the 2024 report because of fewer reported GPU shipments. Its 2023 value is in Figure 1 only; ≈168 TWh is derived from the stated +14% | Two vintages, not a reporting series; 2025 already partly projected | Broad: all data centres; AI is one modelled component |
| 5 | IEA global data-centre electricity consumption | TWh | 2024, 2025; 2030 projection | World | All data centres; AI-focused growth given as a rate | Modelled estimate (from server shipments) | Energy and AI (2025) exec. summary; Key Questions (16 Apr 2026) pp.9–10, 17, 24 | 2024: 415 TWh (≈1.5%) | 2025: 485 TWh (+17%); 2030: 950 TWh | No revision to 2024: KQ re-states "around 415 TWh in 2024". 2030 projection moved 945 → 950 | Modelled. Regional split given only as shares (2025 report: US 45%, China 25%). Dataset is login-only XLSX | Broad. AI-focused DC consumption "surging 50% in 2025" (rate only) |
| 6 | Dominion Energy Virginia data-centre contracts by stage (ESA, CLOA, ELOA/SELOA) plus metered billing demand | MW contract capacity ; MW billing demand | Contracts as of July 2024, July 2025, (31 Mar 2026), July 2026; billing demand annual 2013–2026F | Dominion Energy Virginia service territory (PJM DOM zone) | All data-centre customers; "mainly cloud/AI inference" | Contracted capacity (signed contracts) vs measured billing demand (metered) | PJM Load Analysis Subcommittee decks (Oct 2024, Sep 2025, Sep 2026); PJM documentation letter (6 Jan 2026); 8-K 18 May 2026 Ex.99.2 | July 2025: ESA 9.8 GW + CLOA 7.1 + ELOA 30.1 = 47 GW; 2025 billing demand 4,237 MW | July 2026: ESA 11,997 + CLOA 9,356 + ELOA 32,473 = 53,826 MW (≈54 GW); billing peak 4.8 GW (Aug 2026) | Stage renamed SELOA (2024) → ELOA (2025, 2026). The merger deck calls it "Substation Engineering Letter", so it is the same stage. Forecast method changed for the 2027 forecast. 2024 billing demand restated 3,584 → 3,636 | Contract MW is not load: utilization matures at about 63% after a ~5-year ramp. 2024/2025 chart values are partly unlabelled | Broad (all data centres), but this is AI's grid queue in the world's largest market |
| 7 | IMF "AI circular financing": equity, debt, revenue commitments across 14 deals | US$ bn | Cumulative "since 2023", as of GFSR Oct 2026 | Global | 14 "publicly disclosed transactions"; firms anonymised (1–10 investors, 9–14 investees) | Announced/contracted relationships, not spending | GFSR Oct 2026 Ch.1 p.5 and Figure 1.2 panel 2 (p.4) | Equity ≈300, debt 650 (≈320 at investees) | Revenue commitments 1,400 | Single snapshot; no time series | Deals not listed; underlying TNM 2026/13 not found online; overlap between categories not addressed | Direct (AI firms), but financial promises rather than machines |
| opt | Transformer lead time | years | 2025–26 | Global | n/a | Secondary citation inside IEA | IEA KQ p.21 | "lead times for transformers average between two and three years" | none | n/a | One-off, no repeatable official series found | Indirect |

---

## 2. Per-candidate notes

### 2.1 Comparable capex: Alphabet, Amazon, Meta, Microsoft (and Oracle)

**Lines and tags (verified on the 10-K cash-flow statements):**

| Company | Cash-flow line as printed | XBRL tag | FYE | Source R page (latest 10-K) |
|---|---|---|---|---|
| Alphabet (CIK 1652044) | "Purchases of property and equipment" | us-gaap:PaymentsToAcquirePropertyPlantAndEquipment | 31 Dec | 0001652044-26-000018, R10.htm |
| Amazon (CIK 1018724) | "Purchases of property and equipment" | us-gaap:PaymentsToAcquireProductiveAssets (description: "PP&E... software, and other intangible assets") | 31 Dec | 0001018724-26-000004, R3.htm |
| Meta (CIK 1326801) | "Purchases of property and equipment" | us-gaap:PaymentsToAcquirePropertyPlantAndEquipment | 31 Dec | 0001628280-26-003942, R9.htm |
| Microsoft (CIK 789019) | "Additions to property and equipment" | us-gaap:PaymentsToAcquirePropertyPlantAndEquipment | 30 Jun | 0001193125-26-323660, R6.htm |
| Oracle (CIK 1341439) | printed label not checked | us-gaap:PaymentsToAcquirePropertyPlantAndEquipment | 31 May | 10-K 0001193125-26-277521 |

**Calendar-year values (US$ m):**

| | CY2023 | CY2024 | CY2025 | Q1 2026 | Q2 2026 | H1 2026 |
|---|---|---|---|---|---|---|
| Alphabet | 32,251 | 52,535 | 91,447 | 35,674 | 44,924 (derived: 80,598 YTD − 35,674) | 80,598 |
| Amazon | 52,729 | 82,999 | 131,819 | 44,203 | 54,208 | 98,411 |
| Meta | 27,045 (restated; first reported 27,266) | 37,256 | 69,691 | 18,997 | 30,116 (derived) | 49,113 |
| Microsoft (calendarized) | 35,202 (derived) | 55,552 (derived) | 83,094 (derived) | 30,876 | 35,802 (derived) | 66,678 (derived) |
| **Sum of four** | **147,227** | **228,342** | **376,051** | 129,750 | 165,050 | **294,800** |

H1 2025 on the same basis: 39,643 + 57,202 + 29,479 + 33,824 (MSFT Jan–Jun 2025) = 160,148. H1 2026 is +84%. No Q3 2026 10-Qs had been filed by 23 Oct 2026; MSFT Q1 FY27 and the others' Q3 reports are due in late October.

**How Microsoft was calendarized.** Three-month facts come from the 10-Qs. Each fiscal Q4 is derived as the full fiscal year minus the nine-month YTD:
- CY2023 = Jan–Mar 2023, 6,607 (10-Q 2023-04-25) + Apr–Jun 2023, 8,943 (= 28,107 − 19,164) + Jul–Sep 2023, 9,917 + Oct–Dec 2023, 9,735 = **35,202**
- CY2024 = 10,952 + 13,873 (= 44,477 − 30,604) + 14,923 + 15,804 = **55,552**
- CY2025 = 16,745 + 17,079 (= 64,551 − 47,472) + 19,394 + 29,876 = **83,094**
- H1 2026 = 30,876 (Jan–Mar 2026) + 35,802 (= 115,948 − 80,146) = **66,678**

Source: https://data.sec.gov/api/xbrl/companyconcept/CIK0000789019/us-gaap/PaymentsToAcquirePropertyPlantAndEquipment.json. Values were identical across re-filings, so no restatement.

**Oracle (FY ends 31 May; quarters end Aug/Nov/Feb/May, so exact calendarization is impossible).** FY2023 8,695; FY2024 6,866; FY2025 21,215; FY2026 55,663; Q1 FY27 (Jun–Aug 2026) 28,499. The nearest four-quarter windows (derived from YTD facts): Dec 2022–Nov 2023 6,935; Dec 2023–Nov 2024 10,745; Dec 2024–Nov 2025 35,477. Adding Oracle to the CY2025 sum gives ≈411bn. This is consistent with IEA's statement that five large tech companies' capex "exceeded USD 400 billion in 2025" (cross-check only).

**Finance leases (assets that do not appear in the capex line):**
- Amazon prints it in a supplemental note (R36): "Property and equipment acquired under finance leases, net of remeasurements and modifications": 642 (2023), 854 (2024), 2,911 (2025). The XBRL tag RightOfUseAssetObtainedInExchangeForFinanceLeaseLiability shows 1,565 for Q1 2026 and 563 for Q2 2026.
- Microsoft (R91 FY2026; R89 FY2025): "Right-of-use assets obtained in exchange for lease obligations: Finance leases": FY2023 3,128; FY2024 11,633; FY2025 20,511; FY2026 24,608. Calendarized from quarterly XBRL: CY2023 5,419, CY2024 18,900, CY2025 25,221 (derived). This is material: in FY2026 it equals 21% of the capex line.
- Microsoft also discloses leases not yet commenced, "primarily for datacenters": US$108.4bn finance + 8.6bn operating at 30 Jun 2024 (R97, "$ in Billions"); 92.7bn at 30 Jun 2025 (R87, one amount tagged to both lease types); **329.1bn at 30 Jun 2026**, "will commence between fiscal year 2027 and fiscal year 2033" (R23/R89 FY2026). This is a contracted pipeline, not spending.
- Meta and Alphabet show no finance-lease line on the cash-flow statement. XBRL lease notes: Meta finance-lease ROU 588 / 181 / 613 (2023/24/25); Alphabet 564 / 313 / 1,606, and H1 2026 902.
- Accrued (unpaid) capex, a non-cash timing gap: Alphabet "Purchases of property and equipment included in accrued liabilities and accounts payable" 7,435 / 10,326 / 15,090; Meta "Property and equipment in accounts payable and accrued expenses…" 4,105 / 7,127 / 9,331; Amazon "Increase (decrease) in property and equipment acquired but not yet paid" (1,414) / 7,039 / 10,155.

**Gross vs net of proceeds:**
- Amazon's purchases line is gross. A separate line, "Proceeds from property and equipment sales and incentives", shows 4,596 / 5,341 / 3,499. Net (derived) is 48,133 / 77,658 / 128,320, which is Amazon's own "cash capital expenditures" concept.
- Meta, in its FY2023 10-K, printed "Proceeds relating to property and equipment" separately (245 in 2022, 221 in 2023). From the FY2024 10-K that line is gone and prior years are netted: 2023 27,266 → 27,045, 2022 31,431 → 31,186. The differences equal the proceeds exactly, so this is a definition change. Use the restated values.
- Alphabet and Microsoft show no proceeds line. Note that Microsoft's "Other, net" investing line was (19,861) in FY2026 against 2,317 in FY2025; I did not analyse it.
- AI-adjacent segment detail: Amazon AWS segment "Property and equipment additions" (R92), which includes finance-lease assets: 24,843 / 53,267 / 96,496 (2023/24/25).

### 2.2 NVIDIA Data Center revenue

- Line: "Data Center" in "Segment Information - Schedule of Revenue by Market (Details)" (10-Ks) and "...by Market Platform (Details)" (FY27 10-Qs). Do **not** use the "Compute & Networking" segment. It is a different, broader aggregate; in Q2 FY27 it was 88,299 against Data Center 89,023.
- Annual (FY ends 29 Jan 2023 / 28 Jan 2024 / 26 Jan 2025 / 25 Jan 2026): **15,005 / 47,525 / 115,186 / 193,737**. Compute: 11,317 / 38,950 / 102,196 / 162,361. Networking: 3,688 / 8,575 / 12,990 / 31,376.
  - FY2024 10-K (0001045810-24-000029) R88; FY2025 10-K (-25-000023) R87; FY2026 10-K (-26-000021) R85.
  - FY2024's 47,525 is identical in all three 10-Ks, and FY2025's 115,186 in two, so no restatement.
- Quarterly: Q1 FY27 (to 26 Apr 2026) 75,246 vs 39,112 (10-Q -26-000052, R66). Q2 FY27 (to 26 Jul 2026) 89,023 vs 41,096; six months 164,269 vs 80,208 (10-Q -26-000075, R67).
- Full recast quarterly trend (NVIDIA IR PDF https://s201.q4cdn.com/141608511/files/doc_financials/2027/Q227/Q227-Revenue-by-Market-Platform-Slides.pdf), FY25 Q1 → FY27 Q2:

  22,563 / 26,272 / 30,771 / 35,580 / 39,112 / 41,096 / 51,215 / 62,314 / 75,246 / 89,023

  The four FY25 quarters sum to 115,186 and the four FY26 quarters to 193,737, matching the 10-Ks. That confirms the recast did not change the Data Center total.
- Definition change. The 10-Q says "we changed our presentation of revenue by market platform, and the comparable period has been recast". The new sub-lines are Hyperscale and "AI Clouds, Industrial, & Enterprise" (ACIE). Edge Computing absorbs Gaming, ProViz, Automotive and OEM; the CFO commentary says it covers "PCs, game consoles, workstations…".
  - Q2 FY27: "we reclassified a company from AI Clouds, Industrial, & Enterprise" to Hyperscale. This changed the sub-line history (Q1 FY27 Hyperscale 37,869 → 43,050), not the Data Center total.
  - From FY27 the Compute/Networking split is only in CFO commentary (Q1 FY27: compute "a record $60.4 billion", networking "$14.8 billion").
- Caveats: revenue is not unit shipments. It is priced: segment operating income was 66,595 on revenue of 96,221 in Q2 FY27, about 69% (derived). Geography is billing location; in Q1 FY26, Singapore-billed revenue was 20% of the total, and the R68 concentration note tags 99% of it to US- and Europe-based end customers. It overlaps with hyperscaler capex.

### 2.3 TSMC

- HPC share of net revenue: 2023 43%, 2024 51%, 2025 58%. Quarterly: 3Q25 57%, 4Q25 55%, 2Q26 66%, 3Q26 68%. Sources: 4Q24 Management Report (16 Jan 2025); 4Q25 MR (15 Jan 2026), "High Performance Computing 58% 51%"; 3Q26 MR (15 Oct 2026). The 2025 AR ch2 pp.18–19 says "58% HPC; 29% smartphones; 5% the IoT; and 5% automotive."; the 2024 AR ch2 says "51% HPC; 35% smartphones; 6% the IoT; and 5% automotive."
- Capex:
  - 2024 US$29.76bn (NT$956.01bn); 2025 US$40.90bn (NT$1,272.41bn), per the 4Q24 and 4Q25 MRs.
  - The AR 2025 ch6 §6.1.4 table "Recent Years Major Capital Expenditures…" (Unit: NT$ thousands) gives actual use 1,272,410,529 for 2025 and 956,006,536 for 2024.
  - 2026: 3Q26 13.84bn, YTD 40.64bn. The 2026 budget was US$52–56bn in January 2026, and "between USD60 billion and USD64 billion" was reiterated in October 2026.
- Wafer shipments (k 12-inch equivalent): 12,002 (2023) / 12,910 (2024) / 15,022 (2025), per the MRs. The ARs say "Total wafer shipments were 15.0 million 12-inch equivalent wafers" (2025 AR ch1) and "12.9 million… as compared to 12.0 million" (2024 AR ch1). Quarterly: 3Q25 4,085; 2Q26 4,336; 3Q26 4,476.
- Annual capacity: "approximately 17 million 12-inch equivalent wafers in 2024" (2024 AR ch2 pp.14–15) and "exceeded 17 million 12-inch equivalent wafers in 2025" (2025 AR ch2 pp.16–17). Capacity rose "by approximately 0.5 million 12-inch equivalent wafers in 2025" (AR ch6).
- CoWoS: no capacity number in any document reached; it is mentioned only as a service. Related shares from TSMC-posted call transcripts:
  - Advanced packaging "over 8%" of 2024 revenue and "slightly over 10%" of 2025.
  - AI accelerators "close to mid-teens percent" of 2024 revenue and "high-teens percent" of 2025.
- HPC definition (2025 AR ch2): "includes PCs, tablets, game consoles, servers, base stations and more." No reclassification note was found.
- URLs: 2025 AR chapters https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch{1,2,6}.pdf; 2024 AR https://investor.tsmc.com/static/annualReports/2024/english/pdf/2024_tsmc_ar_e_ch{1,2}.pdf; MRs and transcripts via https://investor.tsmc.com/english/quarterly-results/{2024/q4, 2025/q4, 2026/q3}.

### 2.4 LBNL US Data Center Energy Usage Report

- **2024 report** (LBNL-2001637, Dec 2024; https://escholarship.org/content/qt32d6m0d1/qt32d6m0d1.pdf), p.6:
  - "reaching 176 TWh by 2023, representing 4.4% of total U.S. electricity" (**verified**)
  - 2018: "about 76 TWh, representing 1.9%"
  - 2028: "roughly 325 and 580 TWh", "6.7% to 12.0%"
  - Method: "a 'bottom-up' model, with data and assumptions starting at the equipment level" (p.15)
- **2025 Update** (LBNL-2001758, June 2026, DOI 10.71468/P1RP4F; https://escholarship.org/content/qt33m6w3x0/qt33m6w3x0.pdf), p.9:
  - "data center electricity use in 2024 is 192 terawatt-hours (TWh)"
  - "accounting for 4.7% of total U.S. electricity consumption."
  - Revision: "revised estimates of electricity use in prior years falling slightly below 2024 Report estimates", "primarily due to a reduction in reported shipments of GPUs for 2023 and 2024".
  - 2023 appears only in Figure 1 and could not be extracted as text. The Conclusion (p.27) gives "a 14% increase… between 2023 and 2024", which implies ≈168 TWh (**derived, not a source number**) against the 176 first published.
  - 2025: "the 2025 results include some projections" (footnote 1). "Reference Case energy consumption increasing 22% from 2024 to 2025" implies ≈234 TWh (derived).
  - 2028 reference: 464 TWh.
  - Table 2 (2030):

    | Case | TWh | % of US electricity |
    |---|---|---|
    | Reference | 649 | 11.8% |
    | Consolidated Deployment | 578 | |
    | High ASIC | 664 | |
    | Low Accelerator Lifetime | 590 | |
    | High Inference Energy | 782 | 14.2% |
    | Compounded Uncertainty low–high | 521–843 | 9.5–15.3% |

  - Method: IDC and Omdia shipments → installed base → power draw → PUE. It is modelled, not metered.

### 2.5 IEA

- Energy and AI (2025) executive summary (https://www.iea.org/reports/energy-and-ai/executive-summary): "around 1.5% of the world's electricity consumption in 2024, or 415 terawatt-hours (TWh)". The US share is 45% and China's 25%, and the outlook is "around 945 TWh by 2030". The page does not give a publication date or licence.
- Key Questions on Energy and AI (16 Apr 2026, CC BY 4.0; PDF https://iea.blob.core.windows.net/assets/3179f7f8-01f6-4dd6-bffa-c9f7b73f1dc9/KeyQuestionsonEnergyandAI.pdf):
  - p.9: "grew by 17% in 2025"
  - p.10: "roughly doubling from 485 TWh in 2025 to 950 TWh in 2030"
  - p.17: "almost 500 TWh" and "slightly more than 1.5%"
  - p.24: "around 415 TWh in 2024", so **no revision** to 2024 (415 + ~70 = 485)
  - AI-focused data centres: "surging 50% in 2025" (rate only); about 465 TWh by 2030
  - Regional TWh: not in the text; Figure 1.4 gives shares of growth only.
  - Method: "based on physical shipments of servers going into data centres" (p.25)
- Dataset page (https://www.iea.org/data-and-statistics/data-product/key-questions-on-energy-and-ai): a 42 KB XLSX, login required, under the "Terms of Use for Non-CC Material". Not readable here.

### 2.6 Sites/power: Dominion Energy Virginia is the recommended geography

**Why Dominion over PJM-wide or ERCOT:**
- It is the only source found with the **same three contract stages reported at the same month (July) in three successive years**, alongside a **metered** demand history.
- PJM's own load-forecast reports aggregate across zones; the accuracy report's chart values were not legible as text.
- ERCOT's queue has changed reporting categories with "Batch Zero" (2026). It mixes non-data-centre loads; data-centre share (~87%) is only intermittently stated; and recent decks give approved/observed MW but not stage totals (details below).

**Stage definitions** (Dominion letter to PJM, 6 Jan 2026, https://www.pjm.com/-/media/DotCom/planning/res-adeq/load-forecast/dominion-documentation.pdf):
- ELOA: a $250,000 deposit buys an engineering study that "typically takes 9 to 12 months". "ELOAs are not considered firm load."
- CLOA: "CLOAs are considered firm load." The customer commits to cost reimbursement and long-lead equipment deposits.
- ESA: "An ESA is required in order to set a meter and provide electric service."
- The 2024 deck calls the first stage "Substation Engineering Letters of Authorization (SELOA)"; the 2025 and 2026 decks say ELOA. The May 2026 merger deck calls it "Substation Engineering Letter of Authorization", so it is the same stage.

**Contract capacity (MW) by date:**

| As of | ESA | CLOA | ELOA/SELOA | Total | Source |
|---|---|---|---|---|---|
| July 2024 | 8,012* | 5,835* | 7,570 | ≈21,417 (derived) | PJM LAS deck, Oct 2024, slide 7, "Contracts in Hand – July 2024" (https://pjm.com/-/media/committees-groups/subcommittees/las/2024/20241025/20241025-item-03ai---dominion-data-center-large-load-request.ashx) |
| July 2025 | 9,815 (9.8 GW) | 7,098 (7.1 GW) | 30,132 | 47 GW ("9.8 ESA + 7.1 CLOA + 30.1 ELOA") | Jan 2026 letter; Sep 2025 deck slide 7 (https://www.pjm.com/-/media/DotCom/committees-groups/subcommittees/las/2025/20250916/20250916-item-04ai---dominion-data-center-large-load-request.pdf) |
| 31 Mar 2026 | 10.4 GW | 11.1 GW (date not stated) | 29.5 GW (date not stated) | ≈51 GW | 8-K 18 May 2026 Ex.99.2, slides 24 and 34 (https://www.sec.gov/Archives/edgar/data/715957/000119312526227930/d158175dex992.htm) |
| July 2026 | 11,997 | 9,356 | 32,473 (13,429 in forecast, 19,044 not) | 53,826 (deck: "About 54 GW") | PJM LAS deck 29 Sep 2026, slides 2 and 7 (https://www.pjm.com/-/media/DotCom/committees-groups/subcommittees/las/2026/20260929/20260929-item-5ai---dominion_energy.pdf) |

\*July 2024 ESA and CLOA come from unlabelled chart series: a ramp to 8,012 and a flat 5,835. I mapped them by analogy with 2025, where ESA ramps to 9,815 and CLOA is flat at 7,098. **Verify visually in the PDF before publishing.**

Firm contracts (ESA + CLOA): 13,847 → 16,913 → 21,353 MW (July 2024 / 2025 / 2026). An earlier vintage exists: the 8-K of 1 Mar 2024 shows a July 2023 contracted-capacity chart (values not extractable) and "over 8,500MW… of requests for detailed engineering".

**Metered billing demand (MW), Dominion service territory:**

| Year | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026F |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| MW | 462 | 532 | 636 | 753 | 931 | 1,113 | 1,421 | 1,808 | 2,302 | 2,767 | 3,183 | 3,584 → 3,636 | 4,237 | 4,838 |

- 2024 was printed as 3,584 in the Sep 2025 deck and 3,636 in the Sep 2026 deck, which is a restatement. 2025 was 4,149F in the Sep 2025 deck.
- "Data center billing peak load as of August 2026 is 4.8 GW."
- The 2026 deck also gives coincident demand: 1,697 (2020) … 3,999 (2025), 4,559 (2026F). These values are unlabelled; the year mapping is inferred.

**MW vs MWh, contracted vs energized:**
- All of the above is capacity (MW), not energy. Contract capacity is a customer's entitlement; billing demand is the metered peak draw.
- The deck says the "average ramp period is 5 years, maturing at a 63% utilization rate (Demand / Contract Capacity)".
- In 2025 metered demand (4.2 GW) was about a quarter of firm contracts (16.9 GW).
- The 2027 forecast changed method from customer regression to "Quantile Regression".

**ERCOT (checked, not recommended):**
- LLI Queue Status Update, 3 Jun 2024: total 43,683 MW; "Approved to Energize" 5,479; "Planning Studies Approved" 10,259; observed non-simultaneous peak 2,991.
- 6 Sep 2024: 5,496 MW approved to energize; peak 3,282.
- TAC reports Feb/Mar 2026: approved to energize 8,876 / 9,042 MW; observed peak 3,998 / 3,883 MW. The text labels the months "February 2025" and "March 2025", which may be a source typo; not checked.
- Board, 20–21 Apr 2026: "approximately 410 GW of Large Loads", "~87% are data centers", "an increase of 178 GW since the end of 2025".
- Usable, but the category totals are not consistently reported over time.

**EIA (alternative, not reached):** EIA's Today in Energy (5 May 2026) says Virginia commercial sales "increased by nearly 30.0 million megawatthours (MWh) between 2019 and 2025" (EIA-861/861M). Annual values are only in the XLSX state tables, which I could not read. It would be a US metered analogue to Ireland, but it covers all commercial customers, not just data centres.

### 2.7 IMF GFSR October 2026: AI circular financing

- Location: Chapter 1, p.5 text and Figure 1.2 panel 2, "2. Equity Investment, Debt, and Revenue" (p.4). URL: https://www.imf.org/-/media/files/publications/gfsr/2026/october/english/ch1.pdf
- Text, quoted in pieces:
  - "Fourteen publicly disclosed transactions since 2023"
  - "approximately $300 billion of aggregate equity investments"
  - "led by hyperscalers in financially weaker AI firms"
  - "supplemented by $650 billion in debt"
  - "$1.4 trillion in future revenue commitments through services or chip orders"
- Figure note: "About $320 billion of the $650 billion debt is taken on by investees". It includes "debt backed by investor guarantees, contingent financing, and other off-balance-sheet debt".
- Firms are not named: "Firms 1 to 10 are investors, firms 9 to 14 are investees", "with some overlap".
- Sources: "Bloomberg Finance L.P.; Chen, Gautam, and Wu 2026; and IMF staff calculations." That reference is "The AI Ecosystem: Structure, Financing and Financial Stability Considerations", IMF Technical Notes and Manuals 2026/13. **I could not find it**: the IMF TNM listing page shows no issues, and RePEc lists only up to 2026/010. Background Analysis 1.1 ("Rising Leverage in the AI Ecosystem", https://www.imf.org/-/media/files/publications/gfsr/2026/october/english/backgroundanalysis11.pdf) does not contain the deal table.
- Not addressed by the IMF:
  - **double counting.** Firms 9–10 sit on both sides. Equity is often recycled into the same chip or cloud purchases that make up the commitments, and debt raised by investees funds the same capex. The three totals should not be added.
  - **announced vs disbursed.** Commitments are multi-year headline values.
- The 13 Oct 2026 blog itself was not located. The same figures appear in the 13 Oct 2026 GFSR press-briefing transcript (https://imf.org/en/news/articles/2026/10/13/tr-101326-press-briefing-transcript-global-financial-stability-report-annual-meetings-2026): "$300 billion in equity", "$650 billion in debt, including in off‑balance sheet vehicles".
- Background Analysis 1.1 has other usable single points (paraphrased from the extraction; check the wording before quoting): hyperscaler share of IG corporate issuance is almost 10% so far in 2026 vs 0.5% in 2024, and consensus hyperscaler capex is about $1 trillion in 2027. Chapter 1 itself says the share "has increased to 10 percent from less than 1 percent."

### 2.8 Optional: equipment and memory

- IEA Key Questions p.21: "lead times for transformers average between two and three years" and gas turbines "around five years (Wood Mackenzie, 2025)". These are one-off, second-hand figures. No clean, repeatable official transformer or HBM series was found in the time available.

---

## 3. Proposal: what adds most beyond Microsoft capex + Ireland metered electricity

The current pair shows money committed (one firm) and energy consumed (one country). The missing middle is (a) what the money buys and (b) the queue between a signed site and a powered one.

| Criterion | NVIDIA Data Center rev. | Dominion stages + billing demand | Big-4 capex sum | TSMC | LBNL | IEA | IMF |
|---|---|---|---|---|---|---|---|
| New mechanism | Money → chips (supplier side) | Signed load → firm → metered: the grid lag, contracted vs energized | Little: same mechanism, more firms | Wafers/packaging, but HPC not AI | Energy, overlaps Ireland | Energy, global | Financing loops |
| Public reproducibility | Very high (XBRL, R pages, IR PDF) | Good (public PJM PDFs, 8-K); some unlabelled chart values for 2024 | Very high | High | Medium (figure values not in text) | Medium (XLSX login) | Low (anonymised, TNM not found) |
| Period comparability | High; DC total unchanged by the FY27 recast | Good: July 2024/25/26, same stages; SELOA→ELOA rename; 2024 demand restated | High after the Meta restatement | High | Low (vintages revised) | High for 2024–25 | None (snapshot) |
| Clarity for a non-specialist | High ("what data centres paid Nvidia") | High ("GW promised vs GW drawing power") | High | Medium | High | High | Medium |
| Directness of AI link | Most direct | Broad (all DCs; "mainly cloud/AI inference") | Company-wide | Indirect | Broad | Broad (AI growth rate only) | Direct but financial |

**Leading pair (not a final ranking):**
1. **NVIDIA Data Center revenue** (FY2023–FY2026: 15,005 → 47,525 → 115,186 → 193,737; quarterly to Q2 FY27, 89,023). It is the clearest "money becomes silicon" step. It is fully reproducible from XBRL, and the definition is stable at the total level. Footnotes needed: revenue not units; the FY27 sub-split recast; do not add to capex.
2. **Dominion Energy Virginia contract stages plus metered billing demand** (ELOA/CLOA/ESA: ≈21.4 → 47.0 → 53.8 GW, July 2024 → July 2026; billing demand 3,183 → 4,237 MW, 2023 → 2025). It adds a mechanism nothing else on the page shows: physical admission to the grid, with a pipeline more than ten times metered load. It also pairs naturally with Ireland, being metered in MW where Ireland is metered in GWh. Footnotes needed: capacity not energy; contracts vs load (63% maturity); the rename and the 2024 restatement; verify the 2024 ESA/CLOA mapping.

**Alternatives worth weighing:**
- Replace the Microsoft-only series with the calendarized big-four sum (147.2 → 228.3 → 376.1bn; H1 2026 294.8bn). This adds scale and context rather than a new mechanism.
- Use IEA's 415 → 485 TWh as a one-line global scale note beside Ireland.
- Keep the IMF $300bn / $650bn / $1.4tn as an annotation rather than a series, because it cannot be reproduced or tracked over time.

---

## 4. Sources that could not be reached (and what was tried)

- **LBNL 2025 Update, annual values for 2016–2025:** in Figure 1 only. Two WebFetch passes over the eScholarship PDF found no text table; the shell download got a proxy 403.
- **IEA dataset XLSX:** login-only, and WebFetch cannot read XLSX.
- **IMF TNM 2026/13 (Chen, Gautam, Wu):** not found. Tried a web search, the IMF TNM listing (no issues shown), the 2026 issues URL (client error) and RePEc (lists to 2026/010). The 13 Oct 2026 IMF blog itself was not located; the press-briefing transcript was used instead.
- **Dominion IR events page:** client error. Earnings-presentation PDFs were not retrieved, and EDGAR full-text search found no 8-K stage tables apart from the May 2026 merger deck and the March 2024 investor meeting. The PJM-posted decks were used instead.
- **EIA Virginia retail sales by sector:** XLSX only.
- **CoWoS capacity:** no numeric primary disclosure in any TSMC AR, MR or transcript reached.
- **Not yet filed as of 23 Oct 2026:** Q3 2026 10-Qs for Alphabet, Amazon and Meta, and Microsoft Q1 FY27.
