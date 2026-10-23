# The body of the machine

**Status.** Built in update 4 (23 October 2026): a note in Vanishing Point’s Notes with two bar charts, a computed summary sentence under each, and a “The figures and their sources” disclosure holding both tables and their links. The figures are `BODY` in `data.js`; `ui.js` draws them (`renderBody`, `bmBars`); `check.js` checks them and prints the ratios; `test.py` (`body_panel`) checks the drawing, the sentences and the tables at desk and phone width in both themes, and the axe scan covers `#body-machine`.

The lead was a review written by another model (“Sol”, 23 October 2026). Every figure below was taken from the primary source and checked against a second primary representation of the same number; none was taken from the review.

## A. Microsoft: cash additions to property and equipment

US$ millions, fiscal years ending 30 June. The cash-flow statement line “Additions to property and equipment”.

| Fiscal year | Value | Form 10-K for fiscal 2026, cash-flow statements (R6) | Form 10-K for fiscal 2025, cash-flow statements (R6) | SEC XBRL, `PaymentsToAcquirePropertyPlantAndEquipment` | Review’s lead |
|---|---:|---:|---:|---:|---:|
| FY2023 | 28,107 | — | 28,107 | 28,107 (in the FY2023, FY2024 and FY2025 10-Ks) | 28.107 |
| FY2024 | 44,477 | 44,477 | 44,477 | 44,477 (FY2024, FY2025, FY2026 10-Ks) | 44.477 |
| FY2025 | 64,551 | 64,551 | 64,551 | 64,551 (FY2025, FY2026 10-Ks) | 64.551 |
| FY2026 | 115,948 | 115,948 | — | 115,948 (FY2026 10-K, filed 29 July 2026, accession 0001193125-26-323660) | 115.948 |

- No year was restated between filings.
- The FY2026 annual report’s MD&A gives a $51.4 billion increase in additions to property and equipment (115,948 − 64,551 = 51,397) and cash used in investing of $139.5 billion, which matches the statement’s (139,500).
- **Finance leases are not in this line.** The FY2026 10-K’s supplemental lease table (R91) gives right-of-use assets obtained in exchange for finance lease obligations of 24,608 (FY2026), 20,511 (FY2025) and 11,633 (FY2024). Only the FY2026 figure is on the page, in the note under the chart. The “capital expenditures including finance leases” that Microsoft quotes on earnings calls is a different, larger measure and is not used.
- Ratios, computed by `check.js`: FY2026 is 4.125 times FY2023 and 79.6 percent above FY2025. The page prints 4.1 times and 80 percent.

Sources:
- FY2026 10-K, cash-flow statements: https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/R6.htm
- FY2026 10-K, supplemental lease cash-flow information: https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/R91.htm
- FY2025 10-K, cash-flow statements: https://www.sec.gov/Archives/edgar/data/789019/000095017025100235/R6.htm
- SEC XBRL company concept: https://data.sec.gov/api/xbrl/companyconcept/CIK0000789019/us-gaap/PaymentsToAcquirePropertyPlantAndEquipment.json
- FY2026 annual report (MD&A): https://www.microsoft.com/investor/reports/ar26/index.html

## B. Ireland: metered electricity used by data centres

GWh a year. All data centres the CSO identifies; AI is not measured separately. Shares are as published, to a whole percent.

| Year | Data centres | Other metered | Total | Share | PxStat MEC02, sum of four quarters (data centres / total) | 2024 release (data centres) |
|---|---:|---:|---:|---:|---|---:|
| 2015 | 1,240 | 23,360 | 24,600 | 5 | 1,240 / 24,599 | 1,238 |
| 2016 | 1,482 | 23,874 | 25,356 | 6 | 1,483 / 25,355 | 1,480 |
| 2017 | 1,762 | 23,963 | 25,725 | 7 | 1,762 / 25,726 | 1,760 |
| 2018 | 2,182 | 24,548 | 26,730 | 8 | 2,183 / 26,730 | 2,180 |
| 2019 | 2,490 | 24,015 | 26,505 | 9 | 2,489 / 26,504 | 2,488 |
| 2020 | 3,030 | 24,025 | 27,056 | 11 | 3,031 / 27,056 | 3,028 |
| 2021 | 4,012 | 24,493 | 28,506 | 14 | 4,013 / 28,506 | 4,010 |
| 2022 | 5,273 | 24,551 | 29,824 | 18 | 5,274 / 29,825 | 5,270 |
| 2023 | 6,339 | 24,242 | 30,581 | 21 | 6,339 / 30,581 | 6,335 |
| 2024 | 6,973 | 24,930 | 31,903 | 22 | 6,974 / 31,904 | 6,969 |
| 2025 | 7,663 | 25,324 | 32,986 | 23 | 7,662 / 32,987 | — |

- The page uses Table 1 of the 2025 release (the latest vintage) for every year. The quarterly PxStat table agrees to within 1 GWh, which is the rounding of the quarters; every published share equals data centres ÷ total, rounded.
- **Revisions.** The 2025 release raised each earlier year’s data-centre figure by 2 to 4 GWh against the 2024 release (10 June 2025), and lowered “other metered” by the same amount, so the totals did not change. The review’s values are the 2025 vintage.
- **Release date.** The release page’s header reads “07 July 2025”, but the statistician’s statement says it was published “today (07 July 2026)”, and the page metadata says 7 July 2026. A release of 2025 data cannot predate the year’s end, so the page cites it as July 2026.
- Ratio, computed by `check.js`: 2025 is 6.180 times 2015; the share rose from 5 to 23 percent. The page prints 6.2 times.

Sources:
- CSO, Data Centres Metered Electricity Consumption 2025, key findings and Table 1: https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/keyfindings/
- CSO PxStat MEC02 (quarterly): https://data.cso.ie/table/MEC02 (read through https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/MEC02/CSV/1.0/en)
- The previous release: https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2024/keyfindings/

## How the figures were read, and the limits

- The workspace shell cannot reach sec.gov or cso.ie. Every page was read through the fetch tool, which has a small model answer a prompt against the page. The values were asked for “exactly, all digits” and come out identical across independent reads (two 10-Ks, the XBRL record, the MD&A arithmetic; Table 1 against the quarterly table), which a copying slip would not.
- The Excel copy of Table 1 was not opened (the fetch tool does not read spreadsheets).
- `vanishing/panel-sources/mec02_quarterly.csv` is the quarterly table as read on 23 October 2026, kept so the reconciliation can be rerun offline.
- The two series are separate observations in different countries and on different calendars. Nothing on the page connects a dollar to a gigawatt hour.

## Decisions (SVL can overrule any of them)

1. **Placement.** A note in the Notes, after “What counts, and how much”, not a new panel in the stage.
2. **Two charts, one series each,** bars from zero, no dual axis; drawn like the releases chart (ink bars, violet on hover, values and years in the page’s mono).
3. **Labels.** All four Microsoft bars are labelled in US$ billion to one decimal. The Irish chart labels only the first and last bars; every value is in its tooltip and in the table.
4. **Units.** Microsoft in US$ billion on the chart and US$ million in the table (as filed). Ireland in GWh as published.
5. **The finance-lease caveat** carries the FY2026 lease figure only, as a sense of scale.
6. **Not added:** the review’s IEA global estimates (estimates, not measurements), and its reading “The future recruits concrete, copper and current”. The note’s opening ties the series to the Stargate and Three Mile Island cards instead.

## Maintaining it

- **Microsoft’s FY2027 10-K** (due late July 2027): add a row to `BODY.msft.rows` with `end: '30 June 2027'`, move `lease` to the new row, and update the R6 and R91 links to the new filing. Check the new filing’s earlier years for restatements.
- **The CSO’s 2026 release** (expected mid-2027): replace every row with the new vintage, not only the new year, since earlier years get revised.
- **Three Mile Island.** The note says the reactor is “still to be restarted”; the `tmi` card gives a target of mid-2027. Reword the note when it restarts.
- Run `node vanishing/check.js`: it prints the ratios the page will show.
