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

## Checked on 11 November (second session)

A claude.ai session opened the sources below and edited 22 milestone cards and four forecast cards. No milestone was added or removed, so the counts stand at 288 and 20. Every finding held at least in part; none was dropped.

**Group C**

- `unitdistance`. Astra was right. The proof paper (“Planar Point Sets with Many Unit Distances”, on OpenAI’s CDN) prints “the original AI-written prompt given to the internal model”, which asks for Erdős’s bound to be proved or disproved. OpenAI’s announcement does say the proof came from a model not “targeted at the unit distance problem in particular”, in a list about how the system was built, and it also says the model was being evaluated “on a collection of Erdős problems”. So the card’s “aimed at the problem” echoed OpenAI, and the `o`’s “nobody had pointed at it” was wrong. Both lines were rewritten, and the proof paper is now a source.
- `fable5`. Anthropic’s 9 June post calls Fable 5 “a Mythos-class model that we’ve made safe for general use” and says Mythos 5 goes out through Project Glasswing “as an upgrade to Claude Mythos Preview”. The card now says the first Mythos-class model made generally available, on paid plans and the API. The post is now a source.
- `frontiermath`, `gpt55`. Epoch’s own page did not show its table to the fetch tool, so the figures come from LM Council’s table, which credits Epoch’s data (snapshot of 18 August): Fable 5 (max) 87.8%, GPT-5.5 Pro (xhigh) 78.0%, GPT-5.5 (xhigh) 72.5%. Four other trackers give the same three numbers. One, benchleader.com, lists Fable 5 (max) at 90.2%; it was not used. Both cards now carry the exact figures. Something Astra did not raise: these scores are on version 2 of the Tier 4 set (43 problems, released 12 June, per Epoch’s page), and the “under 10 percent in January” was on version 1, so the card now says which is which. The AI Weekly source was replaced with The Decoder’s report.
- `f-survey-2024`. The paper’s section 3.2 gives n = 537 for the fixed-probabilities framing and n = 471 for fixed-years. It does not print the sum, so the card gives the two numbers and “about two thirds”. `who` and `say` are unchanged.
- `f-dartmouth`. McCarthy’s 2006 slides, under “What came out of Dartmouth?”, say the main thing was “the concept of artificial intelligence as a branch of science”. The card quotes those nine words. They were read through the fetch tool twice, not from the raw page, so the quotation is kept to the phrase both reads returned.

**Group A** (source opened in brackets)

- `boole`: classes, 1 the universe, 0 the empty class, addition only for disjoint classes; Shannon’s sentence now says the two-valued algebra descended from it. [Stanford Encyclopedia, “The Algebra of Logic Tradition”; Burris’s papers]
- `frege`: “the first fully formal logic” is now “a formal calculus with quantifiers and variables”; Russell’s letter of June 1902 is placed against the Basic Laws of Arithmetic, whose second volume was in press. “Nested” was left out, since no source opened here used the word. [Stanford Encyclopedia, “Russell’s Paradox”]
- `markov`: vowels and consonants, with Astra’s sentence and no numbers; the `o` now reads “vowel or consonant from the letter before”. [Hayes (2013)]
- `saussure`: a concept and a sound-image, not a name and a thing. [Baskin’s translation, part 1, chapter 1]
- `godel`: “whose axioms can be listed mechanically”, and “neither prove nor refute” in place of “true statements it cannot prove”, which the Stanford entry calls a common misreading. [Stanford Encyclopedia; the card’s Wikipedia source, on true arithmetic]
- `arpanet`: the Stanford Research Institute in Menlo Park. [NPR, 2009; UCLA]
- `openai-lp`: first-round investors, lower caps expected later. [OpenAI, “OpenAI LP”]
- `copilot`: the “first mass-market product” claim is gone; the card gives OpenAI’s count of more than 300 GPT-3 applications in March 2021. [OpenAI, 25 March 2021]
- `dalle2`: OpenAI began inviting a million people in July. [OpenAI, 20 July 2022]
- `mistral7b`: announced on 27 September under Apache 2.0, with the torrent kept. [mistral.ai]
- `llama31`: “Meta’s largest open-weight model, at 405 billion parameters”. Astra suggested “the largest dense open-weight model yet”. Switch-C (1.6 trillion parameters, on Hugging Face under Apache 2.0) confirms the old line was wrong, but nothing opened here proves the narrower superlative, so the card makes neither claim.
- `sonnet35new`: Haiku announced on 22 October and released in November (4 November, per The Decoder). [Anthropic, 22 October 2024]
- `deepseekv3`, `deepseek`: $5.576 million for 2.788 million H800 GPU-hours at $2 an hour, covering pre-training, context extension and post-training, with earlier research and ablations left out. [DeepSeek-V3 Technical Report, table 1]
- `opus5`: the comparison is now the upgraded Claude 3.5 Sonnet’s 49 percent in October 2024. [Anthropic, 22 October 2024]
- `f-moore`: “the number of components per chip at which each component cost least to make”, and the 1975 review “judged it by another measure, the most complex chips made”. The verdict is unchanged. [Moore (1965), p. 115]

**Group B**

- `gpt1`: “some 7,000 self-published books, which its paper called unpublished”. [the GPT-1 paper’s sentence as quoted by Wikipedia and aiwiki; Bandy and Vincent (2021)]
- `f-turing`: the sentence was reworded, not dropped, because the verdict “late” needs the 25 years. The card now says this was not the first claim and names Eugene Goostman’s disputed 33 percent at the Royal Society in 2014. SVL may prefer Astra’s plain deletion. [Wikipedia; Ars Technica, June 2014]
- `macy`: nine in New York and the last in Princeton. The transactions of the tenth conference give “April 22, 23, and 24, 1953, Princeton, N. J.” on the title page. The Nassau Inn was not confirmed and is not on the card. The American Society for Cybernetics’ events list puts the tenth in New York City, against the transactions.

**Not done**

- The live artifact was not compared byte for byte with `artifacts-live`: the read tool in this session returns the page into the conversation, not a saved copy. Its version id is dated 3 November 2026 (update 11), which is the last republish the kit records.

## How to finish

1. Run the session start in `CLAUDE.md`, from a place that can reach the sources above.
2. Work through Groups A–C: open the source, edit the card if it holds, and note here what was changed, what was not, and why. Group C items that don’t hold up are dropped with a line saying so.
3. Rebuild and run the full checks; recheck hand-written prose that the edits touch.
4. Ask SVL, then commit, republish Vanishing Point (it also brings in the 11 November scout cards and the note) and move `artifacts-live`.
5. Update the “Kit updated” line and the line about this file in `CLAUDE.md`.
