# The Astra review, November 2026

**Received 11 November 2026.** SVL brought in a review of Vanishing Point by OpenAI’s GPT-6 Astra, the monthly review by a model family other than Claude that the note “How this page is made” describes. (Gemini 4 Argon’s review in October is the first; see `UPDATE7.md`. SVL plans an open-weights model for December.) Astra audited the 11 November page as it stood after scout PRs #1 and #2: 287 milestones, 94 in the Models lane, and 20 forecasts. It did not see `alphaproof-signal` or the note, which came in with PR #3.

Astra said it checked the data and the chart code, then compared the claims it suspected against original papers, announcements and historical sources. It listed only findings it could back, and said the cards it didn’t list should not be taken as verified sentence by sentence.

As with Argon’s review, everything here is a lead until it has been checked against a primary source. A chat session on 11 November checked every quote against the page (all matched) and sorted the findings into the groups below. That session could reach anthropic.com and storage.googleapis.com, but not OpenAI, Epoch, AI Impacts, Wikipedia, Stanford, ABC, SBS or DeepMind’s blog, so it did not open most of the sources. **The next session should run where those hosts can be fetched** (a claude.ai chat, or a cloud environment that allows them).

## Done in PR #4 (11 November)

- **Share-preview description** (`build.py`, the GitHub Pages version only). The description still read “centred on von Foerster’s 1960 Doomsday date”, missed in update 11. It now reads: “A history of AI on a logarithmic spiral, from the first ledgers to the present, with dated forecasts extending into the future.” (Astra’s wording.)
- **`f-dartmouth`: missed → disputed.** SVL’s decision. The proposal promised “a significant advance … in one or more of these problems” and set no test; McCarthy’s 2006 verdict measured the summer against his own hope for a breakthrough toward human-level AI, a higher bar. The judge line and the card text now say so. McCarthy’s quotation is unchanged. `FORECASTS.md`’s coded table was regenerated with `codebook.js`; only this row and the table’s “as of” date changed.
- **`rur`: dated to publication, November 1920.** SVL’s decision. The text gives both 1921 performances: the amateur staging in Hradec Králové on 2 January and the National Theatre’s premiere in Prague on 25 January. Checked through search results quoting Wikipedia and the Czech Ministry of Foreign Affairs’ centenary page (added as a source); the session could not open Wikipedia itself.
- **The releases chart and its paragraph.** SVL’s decision, Astra’s wording. The chart counts cards, not models (Astra counted 24 Models-lane cards in 2025 and 32 in 2026 to 11 November, and the session got the same). It is now “Selected model milestones per year” (title and aria-label in `ui.js`, figcaption in `body.html`). In “What counts, and how much”, the sentence “the crowding of triangles toward the centre is the pace showing through it” is replaced with “By October, the spiral already contained more model milestones for 2026 than for all of 2025”, and the paragraph now says some cards cover two models or previews.

## For the next session: check against the source, then edit

### Group A: established history the session agreed with, still to be checked against a source

| Card | Page now | Astra’s point | Suggested change | Open |
|---|---|---|---|---|
| `boole` | “variables taking the values 1 and 0 for true and false and with AND, OR and NOT” | Boole’s algebra is of classes: 1 is the universe of discourse, 0 the empty class; his addition is restricted (to disjoint classes), unlike inclusive OR | Astra: “Boole represented classes algebraically. Shannon later adapted Boolean algebra to describe switching circuits.” Keep the card’s tone | *Laws of Thought* (1854), ch. II–III; Shannon (1938) |
| `frege` | “the first fully formal logic … In 1902 Russell found a contradiction in Frege’s system” | The contradiction is in the *Grundgesetze* (vol. 1, 1893), from Basic Law V, not the 1879 *Begriffsschrift* | “a formal calculus with nested quantifiers”; place Russell’s 1902 letter against the *Grundgesetze* | Stanford Encyclopedia, “Frege”; Russell’s letter of 16 June 1902 |
| `markov` | “the chance of each letter depends on the one before” | He classed letters as vowels or consonants and compared transitions between the two classes | “A vowel was more likely after a consonant than after another vowel” (check the numbers before adding any) | Markov (1913); Hayes, “First links in the Markov chain”, *American Scientist* (2013) |
| `saussure` | “the link between a word and what it names is arbitrary” | The sign joins a sound-image and a concept, not a word and a thing | “Nothing about the sound of a word inherently ties it to its concept” | *Course*, part 1, ch. 1 |
| `godel` | “any consistent formal system rich enough for arithmetic” | Needs “effectively axiomatized”: the set of all true arithmetic sentences is consistent and complete | “Any consistent, effectively axiomatized theory strong enough to express elementary arithmetic leaves some arithmetic statements undecided” | Stanford Encyclopedia, “Gödel’s Incompleteness Theorems” |
| `arpanet` | “from UCLA to Stanford” | The receiving machine was at the Stanford Research Institute in Menlo Park | “from UCLA to the Stanford Research Institute in Menlo Park”; keep “LO” | SRI’s or UCLA’s own account |
| `openai-lp` | “investors’ returns limited to 100 times their stake” | 100× was for first-round investors; later caps were to be lower, set per partner | Add “first-round” | OpenAI, “OpenAI LP”, 11 March 2019 |
| `copilot` | “the first mass-market product built on a large language model” | No definition of mass market supports it; over 300 GPT-3 applications existed by March 2021 | “An early commercial use of large language models inside a programmer’s editor” | OpenAI, “GPT-3 powers the next generation of apps”, March 2021 |
| `dalle2` | “By July it was open to a million people from the waitlist” | On 20 July OpenAI said it was *beginning* to invite a million people over the coming weeks | Reword as an announced roll-out | OpenAI, “DALL·E now available in beta”, 20 July 2022 |
| `mistral7b` | “a torrent link posted on X, with no announcement” | Mistral published a dated announcement on 27 September with benchmarks, licence and downloads | Keep the torrent; drop “with no announcement” | mistral.ai, “Mistral 7B”, 27 September 2023 |
| `llama31` | “The largest open-weight model yet” | Google’s sparse Switch Transformer (1.6 trillion parameters) had a public checkpoint; Llama 3.1 405B is dense | “The largest dense open-weight model yet” | Switch Transformers paper and checkpoint; Meta’s 405B post |
| `sonnet35new` | “An upgraded Sonnet and a new Haiku, released alongside the computer-use beta” | Sonnet and computer use shipped on 22 October; Haiku 3.5 was announced that day for later | Say Haiku was announced, available later | Anthropic, 22 October 2024 post |
| `deepseekv3`, `deepseek` | V3: “final training run … about $5.6 million”; R1: “final training run of its base model had cost under $6 million” | $5.576 million is DeepSeek’s estimate of GPU rental for V3’s pretraining, context extension and post-training at $2 per H800-hour, excluding earlier research and ablations | Put the exact figure and what it measures on V3; on R1 say it was an estimate for V3 | DeepSeek-V3 technical report, section 1 |
| `opus5` | SWE-bench Verified “had stood near 50 percent two years earlier” | Verified was published in August 2024, so “two years earlier” (July 2024) predates it | Name the comparison: upgraded Claude 3.5 Sonnet, 49.0%, October 2024 | Anthropic, 22 October 2024; OpenAI’s Verified post, August 2024 |
| `f-moore` (forecast card text) | “the number of components on the cheapest chip to make” | Moore forecast the component count at minimum *cost per component*, then judged it by the complexity of the most advanced chip | Give the original criterion; Astra suggests “Moore judged the complexity projection met”. Keep the verdict | Moore (1965) p. 115; Moore (1975) |

### Group B: right, with a nuance

| Card | Point | Note |
|---|---|---|
| `gpt1` | “thousands of unpublished books” | “Unpublished” is the GPT-1 paper’s own word (“over 7,000 unique unpublished books”), so the card repeats OpenAI’s description, not an error of its own. Astra’s point still stands: the BookCorpus books were self-published on Smashwords, where the collectors got them. Worth saying on the card. Open Radford et al. (2018) §4.1 and Zhu et al. (2015). |
| `f-turing` | “The machine arrived about 25 years after Turing’s date” | Astra: drop the sentence. A 2014 test claimed Eugene Goostman crossed the 30 percent threshold, though that was contested; the 2025 preregistered study is stronger evidence but not the first claimed crossing. Keep the verdict and the 73 percent. |
| `macy` | “Ten small meetings in New York” | Astra: nine in New York, the tenth at the Nassau Inn, Princeton, April 1953. The session thought this right but could not confirm it. Open the American Society for Cybernetics’ list of the conferences. |

### Group C: claims after the model’s training data, not checkable from memory

| Card | Astra’s point | Open |
|---|---|---|
| `unitdistance` | **Astra’s first priority.** The `o` says the model was one “nobody had pointed at it”, and `x` says it was “not … aimed at the problem”. Astra says the proof paper prints the prompt: the model was given the problem, as part of an evaluation on a collection of Erdős problems. What stands is that a general-purpose model, not a purpose-built search system, produced the proof. Check whether OpenAI’s announcement said “not aimed at”; if the paper prints the prompt, rewrite both lines. | The proof paper and companion paper; OpenAI’s announcement |
| `fable5` | “Anthropic’s first Mythos-tier models” contradicts `mythospreview`, already on the spiral; Astra says Anthropic called Mythos 5 an update to the Preview. “For everyone” overstates Fable access: the launch named paid plans and the API. Astra: “the first Mythos-class model Anthropic made generally available”. The contradiction with `mythospreview` is certain from the page itself. | Anthropic’s 9 June 2026 announcement |
| `frontiermath`, `gpt55` | Epoch’s table gives Fable 5 (max) 87.8%, GPT-5.5 (xhigh) 72.5% and GPT-5.5 Pro (xhigh) 78.0%; the card says 88 against “roughly 75”. Use exact model and setting on both cards. The card’s current source is a news report (AI Weekly), so this would also raise its sourcing. | Epoch AI, FrontierMath Tier 4 table |
| `f-survey-2024` | “1,580 AI researchers” is the whole survey; 537 got the HLMI question in one framing and 471 in the other (1,008 in all). Astra: “2024 survey of 1,580 AI researchers; 1,008 received the HLMI question”. 2027 and 2042 are right. The `who` and `say` come from the paper’s title, so check the denominator in the methods section. | AI Impacts, ESPAI 2024 PDF (the card’s source) |
| `dartmouth` / `f-dartmouth` | Astra says McCarthy’s 2006 retrospective also credits the meeting with establishing AI as a branch of science. If his words can be quoted verbatim, consider adding them to the forecast card, as the other side of the dispute. | McCarthy, 2006 slides (the card’s source) |

## What Astra checked and would keep

The Mercator bearing (about 8.3° north of west for a 2.5-fold contraction per turn, which matches `loxodrome_check.py`’s 81.70° off north); the Antikythera card crediting the planetary gearing to the 2021 reconstruction; the 1999 date of Digital Hyperstition; Microsoft’s FY2024–26 cash additions and Ireland’s 6,973 → 7,663 GWh; and the Fable 5.2 figures (1,000 agents, 30 hours, a proof seven times shorter), which the 11 November session had also read in Anthropic’s announcement.

## How to finish

1. Run the session start in `CLAUDE.md`, from a place that can reach the sources above.
2. Work through Groups A–C: open the source, edit the card if it holds, and note here what was changed, what was not, and why. Group C items that don’t hold up are dropped with a line saying so.
3. Rebuild and run the full checks; recheck hand-written prose that the edits touch.
4. Ask SVL, then commit, republish Vanishing Point (it also brings in the 11 November scout cards and the note) and move `artifacts-live`.
5. Update the “Kit updated” line and the line about this file in `CLAUDE.md`.
