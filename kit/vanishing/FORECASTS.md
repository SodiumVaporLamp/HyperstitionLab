# Forecasts on Vanishing Point

**Status.** Built in update 2 (23 October 2026): twenty forecasts, a Looking ahead view reached by a button or by pushing past today, resolved forecasts as dashed rings with threads in the history views, and a list of forecasts that doubles as a text version of the rings. Centring the spiral on a forecast is not built (deferred). The records are in `forecasts.js`; `check.js` checks them; `test.py` tests them; `codebook.js` prints the table below.

Forecasts are counted apart from the milestones: 20 forecasts (262 milestones as of update 3).

## 1. The selection rule

Written before any forecast was chosen or any outcome looked up. Copied here unchanged:

> A forecast goes on the page only if it passes all four tests.
> 
> 1. Who said it: one of five groups, fixed now.
>    a. Pioneers already on the spiral: a dated forecast made in the very source of an existing
>       milestone card (the same paper, talk or demonstration), or the source of a named centre
>       (2045). Candidates from the cards: Turing 1950, Georgetown-IBM 1954, the Dartmouth
>       proposal 1955, Good 1965, Moore 1965, von Foerster, Mora and Amiot 1960, Vinge 1993,
>       Kurzweil 2005 (the 2045 centre). The Navy/Rosenblatt 1958 card counts only if the
>       Navy's or Rosenblatt's own words survive (the card's source is a newspaper).
>    b. Frontier labs and their heads, from 1 January 2023: the four labs the Models lane
>       names (OpenAI, Anthropic, Google DeepMind, Meta), and their chief executives,
>       co-founders and chief scientists. At most two per lab. Within a lab, the lab's own
>       documents come first; then the most specific dated claim by its head (month beats year,
>       year beats "this decade").
>    c. Surveys of AI researchers: the first and latest editions of AI Impacts' Expert Survey on
>       Progress in AI (2016 and 2023), the longest-running series that asks the same question.
>    d. Public bets with written terms and a named judge (Long Bets).
>    e. Land: dated claims in the Land texts already checked for the page.
> 
> 2. A date: the claim names an event and a time that can be placed without guessing
>    (a date, a deadline, a window, a spread of probabilities, a scenario timeline, a bet's
>    end date). "Within N years" counts, with N added to the date said. "Soon" does not.
> 
> 3. The original: the paper, the forecaster's own post, the lab's PDF, an official
>    transcript or the video at a timestamp. Quoted verbatim with page or timestamp, plus an
>    archived link. News write-ups, Wikipedia, earlier summaries and FORECASTS.md are
>    leads only. If the original can't be reached, the forecast is left out and listed.
> 
> 4. Limits: at most two forecasts per forecaster; one per survey edition.
> 
> Outcomes play no part in choosing. Hits, misses and open forecasts go in as they fall;
> every candidate considered and every exclusion is listed with its reason.
> written 2026-10-23 15:33 UTC

**How it was applied.** The candidates were the 29 rows of the earlier plan plus what searching each group turned up. Two points where the rule had to be read:

- The rule names the survey editions "(2016 and 2023)". A newer edition (surveyed December 2024, published September 2026) turned up during checking. The rule's principle is "first and latest", so the 2024 edition replaced 2023's; the 2023 figure is on the 2024 card.
- Kurzweil's 2045 is on the spiral as a centre, not a milestone; the rule counts the centre's source as on the spiral.

**Left out, with the reason:**

| Candidate | Why it is not on the page |
|---|---|
| Simon and Newell, a computer chess champion within ten years (1958) | Not made in the source of any card (Deep Blue's card is the 1997 match). |
| Simon, machines doing "any work a man can do" in twenty years (1965); Minsky, AI "substantially solved" within a generation (1967) | Not in the source of any card. |
| The Navy and Rosenblatt on the perceptron (1958) | The card's source is a newspaper; the Navy's and Rosenblatt's own words were not found. |
| Hinton, stop training radiologists (2016) | In no group: not a lab head speaking since 2023. |
| Christiano and Yudkowsky on AI gold at the International Mathematical Olympiad (2021) | The rule's bets are Long Bets bets with a named judge. |
| Amodei, powerful AI "as early as 2026" (October 2024) | Anthropic's two places went to its own document (March 2025) and to Amodei's more specific claim at the Council on Foreign Relations. |
| Altman's "The Intelligence Age", "The Gentle Singularity"; OpenAI's "AI progress and recommendations" | OpenAI's two places went to its two October 2025 goals, the most specific (month-level) claims. |
| Hassabis, AGI in "five to ten years" (2025) | Google DeepMind's places went to its own paper and to Legg's more specific 50% date. |
| Musk, AI smarter than any human by the end of 2025 (2024) | xAI is not one of the four labs the Models lane names. |
| The 2022 and 2023 researcher surveys | Neither the first nor the latest edition (2023's figure is on the 2024 card). |
| AI 2027 and its authors' later medians; Cotra's Bio Anchors; Roodman's world-output model; METR's time-horizon trend; Metaculus | The rule has no group for forecasting organisations or markets (see decision 8). |
| Legg on his blog (2011) | Legg's statement since 2023 is used; the 2011 post is quoted on the card. |

Every forecast on the page reached its original; none was left out for lack of a source. What could not be fully checked is listed in section 8.

## 2. The coded table

One row per forecast, generated from `forecasts.js` by `node vanishing/codebook.js --now 2026-10-23` (also written as CSV with `--csv FILE`). The quotations are verbatim; straight quotes and spaced hyphens are set as curly quotes and en dashes, and nothing else is changed. The horizon is the date named minus the date said. A year named as a date sits mid-year; "by" a year means by its end; a 50% date is drawn as a 50% date, never as a deadline.

| id | Forecaster | Verbatim claim | Where (page, section or time) | The event, in their terms | Type | Probability or hedge | Said | Target | Horizon | How the outcome is decided | Outcome (as of 2026-10-23) | Who judged |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| f-turing | Alan Turing | I believe that in about fifty years’ time it will be possible to programme computers, with a storage capacity of about 10⁹, to make them play the imitation game so well that an average interrogator will not have more than 70 per cent. chance of making the right identification after five minutes of questioning. | Turing, “Computing Machinery and Intelligence”, Mind 59, no. 236 (October 1950), p. 442 | an average interrogator will not have more than 70 per cent. chance of making the right identification after five minutes of questioning | date |  | 1950-10 | 2000 | 49.7 y | A test in Turing’s own format: five minutes of questioning, with the interrogator right no more than 70 percent of the time. | came true, late (2025-03-31) | Cameron Jones and Benjamin Bergen, UC San Diego (a preprint) |
| f-georgetown | Leon Dostert, Georgetown–IBM | five, perhaps three years hence, interlingual meaning conversion by electronic process in important functional areas of several languages may well be an accomplished fact. | IBM press release, 8 January 1954 (datelined New York, 7 January), quoting Leon Dostert of Georgetown University | interlingual meaning conversion by electronic process in important functional areas of several languages | window | may well be | 1954-01-07 | 1957-01 to 1959-01 | 3 y to 5.1 y | Whether machine translation had become useful by about 1959. The US government’s advisory committee reviewed the field in 1966. | missed (1966-11) | ALPAC, the Automatic Language Processing Advisory Committee of the US National Academy of Sciences |
| f-dartmouth | McCarthy, Minsky, Rochester and Shannon | We think that a significant advance can be made in one or more of these problems if a carefully selected group of scientists work on it together for a summer. | McCarthy, Minsky, Rochester and Shannon, “A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence”, 31 August 1955, opening paragraph | a significant advance … in one or more of these problems | deadline |  | 1955-08-31 | by 1956-08 | 12 mo | Whether the study in the summer of 1956 made that advance. The proposers set no test. | missed (2006-10-30) | John McCarthy, one of the four proposers, fifty years on |
| f-moore | Gordon Moore | That means by 1975, the number of components per integrated circuit for minimum cost will be 65,000. | Moore, “Cramming more components onto integrated circuits”, Electronics, 19 April 1965, p. 115 | the number of components per integrated circuit for minimum cost will be 65,000 | date |  | 1965-04-19 | 1975 | 10.2 y | The most complex chips made in 1975, against the doubling every year that Moore extended for ten years. | came true (1975-12) | Gordon Moore himself, in 1975 |
| f-good | I. J. Good | It is more probable than not that, within the twentieth century, an ultraintelligent machine will be built and that it will be the last invention that man need make, since it will lead to an “intelligence explosion.” | Good, “Speculations Concerning the First Ultraintelligent Machine”, Advances in Computers 6 (1965), p. 78, section 9, “Conclusions” | an ultraintelligent machine will be built | deadline | more probable than not | 1965 | by 2000 | 35.5 y | Whether a machine that can “far surpass all the intellectual activities of any man however clever” (Good’s definition, p. 33) was built by the end of 2000. | missed (2000-12-31) | No formal judge: nobody has claimed such a machine was built in the twentieth century |
| f-doomsday | Heinz von Foerster, Patricia Mora and Lawrence Amiot | At this date human population will approach infinity if it grows as it has grown in the last two millenia. | von Foerster, Mora and Amiot, “Doomsday: Friday, 13 November, A.D. 2026”, Science 132 (4 November 1960), p. 1291. The fitted date is t₀ = A.D. 2026.87 ± 5.50 years (p. 1293); “millenia” is as printed. | human population will approach infinity | date |  | 1960-11-04 | 2026-11-13 | 66 y | World population on the day. The authors’ condition was that growth kept to the curve of the previous two thousand years. | open | from 2026-11-14: The UN Population Division’s estimates |
| f-vinge-means | Vernor Vinge | Within thirty years, we will have the technological means to create superhuman intelligence. Shortly after, the human era will be ended. | Vinge, “The Coming Technological Singularity”, VISION-21 Symposium, NASA Lewis Research Center, 30–31 March 1993; NASA CP-10129, p. 12, abstract | the technological means to create superhuman intelligence | deadline |  | 1993-03-30 | by 2023-03-30 | 30 y | No test was named. | no verdict | No verdict found. The thirty years ran out with no ruling either way |
| f-vinge-window | Vernor Vinge | Just so I’m not guilty of a relative-time ambiguity, let me more specific: I’ll be surprised if this event occurs before 2005 or after 2030. | Vinge, “The Coming Technological Singularity” (1993), NASA CP-10129, p. 12. “Let me more specific” is as printed. | the creation of greater than human intelligence (from the sentence before) | window |  | 1993-03-30 | 2005 to 2030 | 11.8 y to 37.8 y | No test was named. The window closes at the end of 2030. | open |  |
| f-kurzweil | Ray Kurzweil | I set the date for the Singularity—representing a profound and disruptive transformation in human capability—as 2045. | Kurzweil, questions and answers for The Singularity Is Near, singularity.com (2005), “When will that occur?” | the Singularity—representing a profound and disruptive transformation in human capability | date |  | 2005-09 | 2045 | 39.8 y | No test was named. | open |  |
| f-longbet | Mitchell Kapor and Ray Kurzweil | By 2029 no computer – or “machine intelligence” – will have passed the Turing Test. | Long Bets, Bet 1 (2002), the statement. Kapor is the predictor; Kurzweil challenges it and says a computer will pass. | a computer will pass the Turing test, under the bet’s terms | bet | $20,000 at even stakes | 2002 | by 2029 | 27.5 y | The bet’s terms: three judges each interview four candidates, the computer and three human foils, for two hours each. The computer passes if it fools two of the three judges and is ranked at least as human as two of the three foils, before the end of 2029. The winner’s charity gets $20,000. | open |  |
| f-land | Nick Land | Converging upon terrestrial meltdown singularity, phase-out culture accelerates through its digitech-heated adaptive landscape, passing through compression thresholds normed to an intensive logistic curve: 1500, 1756, 1884, 1948, 1980, 1996, 2004, 2008, 2010, 2011 … | Land, “Meltdown” (1994), section “Machinic Synthesis”, as the Ccru published it (Abstract Culture, swarm 1) | terrestrial meltdown singularity | date |  | 1994 | 2012 | 18 y | Land named no year and no test. | no verdict | No one: the year is derived, and the event has no test |
| f-legg | Shane Legg, Google DeepMind | And so, yeah, I think there’s a 50% chance that we have AGI by 2028. | Legg on the Dwarkesh Podcast, 26 October 2023, answer beginning at 0:34:32 | AGI, which he defined at the start of the episode as “a machine that can do the sorts of cognitive things that people can typically do, possibly more” (0:00:26) | spread | 50% | 2023-10-26 | 50% by 2028 | 5.2 y | No test was named. A 50% date is not a deadline: if 2028 ends without AGI, the forecast has not been shown wrong. | open |  |
| f-anthropic | Anthropic | As our CEO Dario Amodei writes in ‘Machines of Loving Grace’, we expect powerful AI systems will emerge in late 2026 or early 2027. | Anthropic, “Anthropic’s Recommendations to OSTP for the U.S. AI Action Plan”, blog post, 6 March 2025 | powerful AI systems, which the post defines by four properties: “Intellectual capabilities matching or exceeding that of Nobel Prize winners across most disciplines”; every interface a human doing digital work uses; reasoning on its own through tasks over “hours, days, or even weeks”; and control of laboratory and manufacturing equipment | window | we expect | 2025-03-06 | 2026-09 to 2027-04 | 18 mo to 2.2 y | No test was named. | open |  |
| f-amodei-code | Dario Amodei, Anthropic | If I look at coding, programming, which is one area where AI is making the most progress, what we are finding is we are not far from the world—I think we’ll be there in three to six months—where AI is writing 90 percent of the code. | Amodei at the Council on Foreign Relations, CEO Speaker Series, 10 March 2025, from CFR’s uncorrected transcript | AI is writing 90 percent of the code | window |  | 2025-03-10 | 2025-06-10 to 2025-09-10 | 3 mo to 6 mo | No measure was named: whose code, and counted how. | disputed (2025-10-22) | Ryan Greenblatt, Redwood Research, against Amodei’s own later claim that it was true |
| f-deepmind | Google DeepMind | We are highly uncertain about the timelines until powerful AI systems are developed, but crucially, we find it plausible that they will be developed by 2030. | Shah and others, Google DeepMind, “An Approach to Technical AGI Safety and Security”, arXiv 2504.01849, 2 April 2025, p. 2, “Background assumptions” | powerful AI systems; the paper aims at what it calls Exceptional AGI, “an AI system that matches or exceeds that of the 99th percentile of skilled adults on a wide range of non-physical tasks” (p. 15) | deadline | plausible | 2025-04-02 | by 2030 | 5.7 y | No test was named. | open |  |
| f-openai-intern | OpenAI, in Sam Altman’s words | We have set internal goals of having an automated AI research intern by September of 2026 running on hundreds of thousands of GPUs, and a true automated AI researcher by March of 2028. | Sam Altman on X, 29 October 2025, summing up OpenAI’s livestream of the day before | an automated AI research intern | deadline |  | 2025-10-28 | by 2026-09 | 11 mo | OpenAI’s own measurements. It later defined an intern as “a system that can carry out well-defined research tasks under human direction”. | claimed met (self-judged) (2026-09-06) | OpenAI itself, by its own measurements; there was no outside test |
| f-openai-researcher | OpenAI, in Sam Altman’s words | We have set internal goals of having an automated AI research intern by September of 2026 running on hundreds of thousands of GPUs, and a true automated AI researcher by March of 2028. | Sam Altman on X, 29 October 2025, summing up OpenAI’s livestream of the day before | a true automated AI researcher | deadline |  | 2025-10-28 | by 2028-03 | 2.4 y | No test was named. OpenAI judged the first goal by its own measurements. | open |  |
| f-zuckerberg | Mark Zuckerberg, Meta | I also expect that 2025 will be the year when it becomes possible to build an AI engineering agent that has coding and problem-solving abilities of around a good mid-level engineer. | Meta, fourth-quarter 2024 earnings call, 29 January 2025, transcript p. 2 | an AI engineering agent that has coding and problem-solving abilities of around a good mid-level engineer | date |  | 2025-01-29 | 2025 | 5 mo | No test was named. | no verdict | No verdict. Meta’s call a year later did not say the goal had been met |
| f-survey-2016 | 352 AI researchers, surveyed by AI Impacts in 2016 | Taking the mean over each individual, the aggregate forecast gave a 50% chance of HLMI occurring within 45 years and a 10% chance of it occurring within 9 years. | Grace, Salvatier, Dafoe, Zhang and Evans, “When Will AI Exceed Human Performance? Evidence from AI Experts”, arXiv 1705.08807v3, p. 2. Answered 3 May to 28 June 2016 by researchers who published at NIPS or ICML in 2015. | “High-level machine intelligence” (HLMI) is achieved when unaided machines can accomplish every task better and more cheaply than human workers. | spread |  | 2016-06 | 10% by 2025, 50% by 2061 | 9.5 y to 45.5 y | A spread is a probability, so no single date passing makes it right or wrong. | open |  |
| f-survey-2024 | 1,580 AI researchers, surveyed by AI Impacts in 2024 | In the mean aggregate forecast, HLMI reaches a 10% chance in 2027 and a 50% chance in 2042 (18 years from the survey). | Grace and others, “Advanced AI according to 1,580 researchers: uncertain, unsafe, and sooner than we thought”, AI Impacts, September 2026, p. 12. Answered 9–24 December 2024. | when unaided machines can accomplish every task better and more cheaply than human workers (p. 5) | spread |  | 2024-12 | 10% by 2027, 50% by 2042 | 3 y to 18 y | A spread is a probability, so no single date passing makes it right or wrong. | open |  |

**Coding conventions.**

- *Type.* A date names a point; a deadline says "by"; a window has a start and an end; a spread gives odds by dates; a bet has terms and a judge. None of the twenty is a scenario: the one scenario candidate (AI 2027) is outside the rule.
- *Outcome.* Came true, came true late, claimed met (by the forecaster, with no outside test), disputed, missed, no verdict. A forecast whose time passes with nothing recorded shows as "closed, no verdict yet"; the page never rules on it.
- *Who judged.* The person or body whose verdict is quoted, with the date. Two of the three hits are self-judged (Moore in 1975, OpenAI in 2026); only Turing's was judged by outsiders.
- *Doomsday* resolves on 14 November 2026, when the day its title names has passed, against the UN's population estimates. The paper's error band (± 5.50 years) is on the card but is not used to delay the verdict: the event, population approaching infinity, did not happen and cannot on any date in the band.

## 3. Horizons, and how this set is skewed

Horizons in years, the central date minus the date said (a window counts at its midpoint, as Armstrong and Sotala counted ranges):

| Group | n | Median | Under 10 years | 16 to 25 years | Over 30 years |
|---|---|---|---|---|---|
| All twenty | 20 | 14.1 | 9 (45%) | 3 (15%) | 6 (30%) |
| Forecasts of general AI only (11) | 11 | 24.8 | 3 (27%) | 3 (27%) | 4 (36%) |
| Pioneers on the spiral | 9 | 30.0 | 2 | 1 | 5 |
| Frontier labs since 2023 | 7 | 1.8 | 7 (100%) | 0 | 0 |
| Researcher surveys (50% dates) | 2 | 31.8 | 0 | 1 | 1 |
| Said before 2000 | 9 | 24.8 | 2 | 2 | 4 |
| Said in 2000 or later | 11 | 5.2 | 7 | 1 | 2 |

Sorted: Amodei 0.4, Zuckerberg 0.4, OpenAI intern 0.9, Dartmouth 1.0, Anthropic 1.8, OpenAI researcher 2.4, Georgetown 4.0, Legg 5.2, DeepMind 5.7, Moore 10.2, Land 18.0, survey 2024 18.0, Vinge's window 24.8, the Long Bet 27.5, Vinge's means 30.0, Good 35.5, Kurzweil 39.8, survey 2016 45.5, Turing 49.7, Doomsday 66.0.

**The independent compilation.** The dataset Armstrong and Sotala analysed (95 timeline predictions from the 1950s to 2012, gathered for MIRI) and AI Impacts' corrected version of it (65 predictions). The spreadsheets are on Dropbox, which neither this workspace nor the fetch tool can reach, so the comparison uses their published figures:

- Armstrong and Sotala (2012), p. 1: "Predictions that AI lie 15 to 25 years in the future are the most common". Experts 21 of 62, non-experts 13 of 33 in the 16–25-year band: 34 of 95, 36%.
- AI Impacts' corrected data: a median time remaining of about 30 years; the six predictions made before 1980 were all under 30 years; early and late predictions were otherwise distributed alike (correlation of date made with years to AI, 0.13).
- AI Impacts on Armstrong and Sotala's error (2016): the expert/non-expert comparison rested on a misread column; by predictor type, 10–25-year predictions made up 54% (AGI researchers), 47% (futurists), 27% (AI researchers) and 13% (others).

**Is the set skewed? Yes, in five ways.**

1. *Too short.* Median 14 years against about 30; only 15% in the 16–25-year band where the historical data is densest (36%). The cause is one group: all seven lab forecasts look less than six years ahead. The published summaries do not say how many of the historical predictions were that short; they say the earliest ones were shorter than the rest, and that the band of 15 to 25 years was the most common. Lab forecasts since 2023 are product goals and policy statements as much as predictions, and the rule let in seven of them against two surveys.
2. *Two clusters, few in between.* The set splits into under six years (9) and 18 to 66 years (11). Nothing is said between 1966 and 1992, or between 2006 and 2015: the rule's groups (cards on the spiral, labs since 2023) skip the AI winters and the deep-learning decade.
3. *Mostly not about AGI.* Only 11 of the 20 forecast general AI (Good, Vinge's two, Kurzweil, the Long Bet, Land, Anthropic, Google DeepMind, Legg and the two surveys); the rest are a chip count, a population curve, machine translation, coding shares and research goals. The historical dataset is AGI timelines only, so the restricted comparison (general AI, median 24.8 years) is the fair one. On that, the set is roughly in line with the historical centre but more spread out.
4. *No sceptics.* Every forecaster expected the event; none of the dated "not before" forecasts of sceptics is in, because no group admits them. The historical data includes pessimistic "other" predictors. Rodney Brooks's dated and self-scored predictions would be the obvious addition (see decision 18).
5. *Famous and interested parties.* Pioneers on the spiral are there because they are famous, and famous forecasts are disproportionately bold. Seven of the twenty come from companies with a stake in the answer, and two of the three hits were judged by the forecaster.

## 4. The flip: looking ahead, and the one-day floor

Log time has no bottom at today, so the spiral stops one day short of it. What happens there:

- **Centred on now.** Travel inward stops at one day before today. Going on (scrolling in, spreading fingers, pressing ↑) builds up pressure, drawn as a dashed crimson ring growing from the centre, with the head tag reading "today · keep going to look ahead" and a screen-reader announcement. About a third of a decade of further travel (two or three wheel notches, spreading the fingers about 1.4 times wider, or two presses of ↑) turns the spiral round. Stop early and the pressure drains in 0.7 seconds (1.6 for keys).
- **Turning round.** The spiral becomes Looking ahead: today at the centre, the far future at the rim, one turn per decade ahead, turning the other way. The view lands with the head about three years out, flying there from the centre over 1.1 seconds with one ring sweeping out from the centre. The rest of the gesture that caused the turn is swallowed: a trackpad's momentum does not carry on into the new view.
- **The next scroll.** Scrolling keeps its meaning in both views: in is toward today, out is away from it. After turning round, scrolling out looks further ahead, and scrolling in comes back toward today; past the floor again, the spiral turns back to look into the past, centred on now. Pinch works the same way (spread is in), and so do ↑ and ↓, Home and End. Dragging to turn the spiral never turns it round: the floor is a plain stop for a drag, and so is the slider.
- **Centred on Doomsday or on 2045.** The centre is not today, so there is no today to pass through. The floor is a plain stop a little past today's mark, as it was, and the head tag says "looking ahead starts from today". The Looking ahead button works from any centre and remembers it: pressing it again returns to the same centre at the same depth.
- **Keyboard.** The button is in the tab order after Next; it has `aria-pressed`. With the spiral focused, ↑ at the floor once announces "Today. Keep going to look ahead.", and a second press turns round. ← and → step through open forecasts while looking ahead.
- **Reduced motion.** No flight and no sweeping ring: the view jumps to where it would land. The pressure ring still grows, because it moves only with the reader's own input.

Why push-through rather than a seamless zoom: in log time the two views are separate tunnels that both converge on today, one from the past side and one from the future side. A gesture that kept going "forward in time" would have to zoom out after the turn, so a pinch would shrink the spiral under spreading fingers. The push-and-turn keeps every gesture meaning what it meant, and the landing flight shows the reader coming out the other side.

## 5. Decisions taken (SVL can overrule any of them)

1. **Which forecasts.** The twenty the rule admits; nothing added by hand.
2. **Lanes.** By subject: forecasts of AGI, powerful AI and the Singularity in Hyperstition (11 of 20), as prophecies the page already treats that way; coding claims in Language; research automation in Learning; Moore in Capital; Turing and the Long Bet in Reckoning.
3. **Colour.** Crimson and dashed for open forecasts; muted for resolved ones, with a dot inside if it came true, a small ring if claimed, a cross if missed, and a half-filled ring for a 50% date. A darker crimson (and a lighter one in dark mode) carries text, to keep 4.5:1.
4. **Resolved forecasts** show in the history views by default, with a "Resolved forecasts" checkbox to hide them. Open forecasts show only when looking ahead (under the 2045 centre they would crowd into a twenty-fifth of a turn).
5. **Looking ahead** is a separate button, not a Centre option.
6. **Spreads.** Drawn at the 50% date, half-filled, with a dotted run from the 10% date if that is still ahead and a fading run past the 50% date. No centring this round, so p50 or p90 as a centre does not arise.
7. **Markets** (Metaculus) are out: no group in the rule, and their dates move daily.
8. **AI 2027** is out this round: the rule has no group for forecasting organisations. Adding one would bring in AI 2027, Bio Anchors, Roodman and METR together.
9. **Descend** while looking ahead comes in from the farthest open forecast toward today, showing each card as it passes.
10. **Where a turn-round lands:** the head about three years out (depth 0.45), not at the floor, so the next scroll is useful at once.
11. **Vague dates:** late 2026 = September to December; early 2027 = January to April, following Greenblatt's strict reading (he allows the first half). "By 2030" = by the end of 2030. "Three to five years" from January 1954 = January 1957 to January 1959.
12. **Anthropic's two wordings.** The blog post's "we expect … late 2026 or early 2027" is used over the submission's "could emerge as soon as late 2026 or 2027", as the more specific; the card quotes both.
13. **Doomsday resolves on 14 November 2026** (see section 2).
14. **Closed forecasts wait** for a recorded verdict; `check.js` warns, and the page says "closed, no verdict yet" instead of judging.
15. **Two contrast fixes found by the scan:** the gold "From the texts" heading (3.0:1, now 4.8:1 on its tint, on every Land card too) and crimson text and pressed buttons (now 4.5:1 or better in both themes). The Era chips' group also got the role its label needs.
16. **Releases per year** now ends at the last year with a recorded release; the 2031 test showed empty years crowding the chart.
17. **Forecast count** is shown and printed separately from the milestone count.
18. **Not added:** sceptics' dated forecasts (Rodney Brooks's scored list would be the first). Adding them means a sixth group in the rule.

## 6. A five-minute test with readers

Two or three people who have not seen the page. Open it on a laptop at the default view. Say only: "This page is about the history of AI and some forecasts about it. Have a look around for a minute." Then ask, without helping:

1. "Find a forecast that is still open, and tell me the year it names." *Works if* they reach Looking ahead or the forecast list on their own and read a year correctly (Legg's 2028, say).
2. Looking ahead: "Where is today on this spiral, and where is the far future?" *Works if* they say today is the centre and the far future the rim.
3. Point at Legg's half-filled ring: "What is this one claiming? If 2028 ends without AGI, was he wrong?" *Works if* they say even odds by 2028 and that missing it does not make him wrong. *Fails if* they read it as a deadline.
4. "Find Turing's forecast. Did it come true, and who says so?" *Works if* they find "came true, late" and name Jones and Bergen, or the UC San Diego researchers.
5. "Without the button, go from the history to looking ahead." (If they are on the Doomsday centre, it is fair to say "try the centre called Now".) *Works if* they scroll or pinch in until the spiral turns round, within about a minute.

The page works if at least two of three people get 1 to 4 right without help. Question 5 tests the push-through: if fewer than two manage it, keep the button as the way in and cut the push-through from the hint and notes rather than adding instructions.

## 7. Maintaining forecasts

- **When a forecast closes,** add an `outcome` with `is`, `on`, `judge` and, for a verdict someone stated, `say`, `sayc` and `s`. Run `node vanishing/check.js --now YYYY-MM-DD` to see what will close on a given day; it warns about every closed forecast without an outcome. As of 23 October 2026 the next to close are: Anthropic's window (end of April 2027), OpenAI's researcher (end of March 2028), the Long Bet (end of 2029), Vinge's window and Google DeepMind's limit (end of 2030).
- **Doomsday** needs nothing: its outcome is recorded with `after: '2026-11-14'`.
- **A new forecast** has to pass the rule in section 1, quote its original verbatim with page or timestamp, and carry an archived copy. Then rerun `node vanishing/codebook.js` and paste its table into section 2.
- **Statuses come from the reader's clock,** so the page changes on its own when a date passes. The notes’ wording about the Doomsday centre was made date-proof in update 5 (see CLAUDE.md).

## 8. What could not be fully verified

- **OpenAI's livestream** (28 October 2025) could not be read: YouTube served a bot check. The goals are quoted from Altman's own post on X the next day, read in SVL's built-in browser, with the date taken from the post's ID; no timestamp in the video is given.
- **Good, p. 78,** was read from the text layer of the gwern.net scan in the built-in browser. There is no archived copy of that scan; the archived link on the card is to another scan (incompleteideas.net) whose page 78 has no text layer and was not read.
- **The Dartmouth proposal's page:** two readings of the PDF disagreed (page 1 or 2), so the card cites the opening paragraph.
- **Moore (1965)** was read from the scan's text layer, not by eye. The sentence begins "That means by 1975", not the "By 1975" usually quoted.
- **Doomsday** was read from a PDF copy on a Rensselaer course page; Science's own PDF is paywalled, and only its landing page is archived.
- **Turing's page number,** p. 442, rests on the paper's layout (section 6 starts there) and on a citation of the next sentence to p. 442; no page image was checked.
- **Amodei** is quoted from the Council on Foreign Relations' uncorrected transcript; the video was not checked against it.
- **Archived copies** were confirmed to exist through the Wayback Machine's availability service, with their dates, but most were not opened: the fetch tool cannot read web.archive.org, and the one tried in the browser stopped at a bot check.
- **The comparison dataset** itself (Dropbox) could not be reached; the published summaries were used.
- **Smaller points:** Legg's 2011 post has no date on the page (end of 2011 comes from its address); Kurzweil's answers page has no date (earliest archived copy 24 September 2005; on sale 26 September, per Viking's release); Jones and Bergen's paper is a preprint and its later status was not checked; OpenAI's 3.1 agent workdays per human workday is paraphrased, because the tool would not quote the whole sentence; Zuckerberg's reported remark that agents had progressed more slowly than he hoped exists only second-hand and is not used; no claim that Anthropic's "powerful AI" has arrived was found, but that is an absence of evidence.
