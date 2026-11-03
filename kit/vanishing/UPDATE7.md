# Update 7: the Gemini review, five milestones and the Transformer card

**Built 23–24 October 2026** from a review of the page by Gemini 4 Argon that SVL brought in, deepened before it was run. The review was treated as leads: its claims about the page were checked against the source first, and additions had to pass a rule fixed before any candidate was looked at. Milestones went from 276 to 281 (Learning 29 → 33, Capital 40 → 41; 59 key and 92 model releases, both unchanged). Forecasts unchanged at 20. Links under “Elsewhere on the spiral” went from 17 on 21 cards to 29 on 36.

## The review, checked against the page

Wrong about the page, and not acted on:

- **The centre menu.** It offers Doomsday, Now and 2045 only. “Transformer” is one of the era jump buttons; “Meltdown” is neither.
- **The palette.** The hex codes it gave (#f0f0f0, #b8860b, #d9534f) are not the page’s (#E9ECEB, #9A7A00, #C23B5A).
- **The TPU.** It said the original Transformer ran on Google’s TPU. The paper (section 6.1): “Training took 3.5 days on 8 P100 GPUs.”
- **The compass bearing.** Its maths is right for a radius that shrinks tenfold per turn, but the drawing shrinks 2.5 times per turn (`GROW`); the tenfold is the time. Its own figure, 8° for ×2.42, agrees with “about eight degrees”.
- **Its confirmations** cite secondary blogs rather than the page’s sources, and its reason for the Amodei forecast being “Disputed” is not the page’s (the page’s judge is Ryan Greenblatt, October 2025).

Right, and acted on: the Transformer card’s “Eight Google researchers” and the missing Shazeer return; the thin Learning lane between AlexNet and the Bitter Lesson; the `fable` card’s “the way chips already were” with no chip-controls card behind it; no `see` links on the Transformer. Its misreading of the bearing also showed that the note never gave the 2.5, so a careful reader could take the tenfold time for a tenfold radius.

Right, and left for SVL: the Models lane’s weighting (OpenAI 33, Anthropic 24, xAI 11, Google 10, Meta 6, Chinese labs 7, others 2) follows the lane’s stated rule. Changing it would mean pruning point releases or adding Mixtral, Flux, Midjourney, RT-2 and π0, which is a separate batch.

## The rule

A candidate went in only if (a) an existing card’s title, `x` or `o` names or leans on it and it has no card of its own, or (b) it fills the Learning lane’s gap between AlexNet (2012) and the Bitter Lesson (2019). A node pass over `EVENTS` checked both:

| Candidate | (a) cards that lean on it | (b) |
|---|---|---|
| ResNet | none | yes: AlexNet → AlphaGo is one of the Learning lane’s three widest gaps 1900–2022 (0.122 decades of log time; AlphaGo → Bitter Lesson, 0.145, is another) |
| Chinchilla | `scaling` (“spend this much, get this much better”; “how much capability a dollar buys”) | no |
| Export controls | `fable` (“the way chips already were”), `fable5` | — |
| Mixture of experts | `deepseekv3` (“mixture-of-experts”) | yes (2017) |
| Diffusion | `dalle2` (“diffusion-based”), `sd` | yes (2015) |
| Ashby, Cybersyn, GANs, LayerNorm, FlashAttention, TSMC, ASML, Mixtral, Flux | none | no |

Two results contradicted the plan: the PaLM card names TPUs (“two TPU v4 pods”) and the Stable Diffusion card names Midjourney, so **TPU v1 and Midjourney both pass rule (a)**. Neither was added, because they were not on the agreed list; both are quick to add if SVL wants them.

## What was added

| id | Date on the spiral | Lane | Weight | The particular each card turns on |
|---|---|---|---|---|
| `diffusion` | 2015-03-12 (arXiv v1) | Learning | 2 | Sohl-Dickstein et al., “inspired by non-equilibrium statistical physics”: destroy structure with noise step by step, learn to reverse it. The DALL·E 2 paper (as [46]) and the Stable Diffusion paper (as [82]) both cite it when introducing diffusion models; Ho, Jain and Abbeel (June 2020) made it work for images |
| `resnet` | 2015-12-10 (arXiv v1) | Learning | 2 | Each block learns a correction F(x) that a shortcut adds back to x; 152 layers, eight times VGG; 3.57 percent error, first at ILSVRC 2015. Eighteen months later the Transformer wraps every sub-layer in the same shortcut |
| `moe` | 2017-01-23 (arXiv v1) | Learning | 2 | A gating network sends each example to a few of up to thousands of experts: more than a thousandfold capacity, up to 137 billion parameters. Shazeer is first author here and a Transformer author; the Transformer cites it (reference 29 in v1); DeepSeek-V3 uses 37 of 671 billion parameters per token |
| `chinchilla` | 2022-03-29 (arXiv v1) | Learning | 2 | Same compute as the 280-billion-parameter Gopher, 70 billion parameters and four times the data, and it won: the large models were “significantly undertrained” |
| `chip-controls` | 2022-10-07 (BIS release; Federal Register 13 October) | Capital | 2 | Nvidia’s A800 and H800 were built to sit under the chip-to-chip test; the October 2023 rule dropped that test; DeepSeek trained V3 on H800s |

## What changed

- **`transformer`.** “Eight Google researchers” became “Eight researchers who did the work at Google Brain and Google Research”: in v1 six authors list Google, Aidan Gomez lists the University of Toronto (“Work performed while at Google Brain”) and Illia Polosukhin lists only a Gmail address; v7 adds “Work performed while at Google Research” for him. Gomez was an undergraduate who took a semester off to work at Google Brain (U of T News, 21 June 2017). “It trained far faster on GPUs” became the particular from section 6.1: three and a half days on eight Nvidia P100 GPUs. Added: Shazeer went back to Google in August 2024 when Google licensed Character.AI’s technology (TechCrunch, 2 August 2024), and announced on X on 17 June 2026 (US time; 18 June in UTC and Asia) that he was leaving for OpenAI (9to5Google; Reuters via The Standard). “All eight later left Google, most of them to found or join AI companies” became “All eight later left Google, to found start-ups or join other companies”, which is what Wikipedia says (from the FT and Bloomberg); no source said “AI”. Its `o` is unchanged. `see`: Attention for translation, GPT, BERT; ResNet and the mixture-of-experts card link to it, so it shows five.
- **“How to read the spiral”.** “Distance from the centre is drawn in log time” became “The spiral is drawn in log time”, and the note now says each turn is two and a half times smaller on screen, and that the ship’s track closes in two and a half times a turn. `CLAUDE.md`’s Geometry line was corrected the same way: position along the spiral is log time, and it is the log of the radius that is linear in it.

- **`fable` (Fable 5 and Mythos 5 suspended): a second source.** Its only source, Anthropic’s statement of 12 June, says the directive came from “the US government” under “national security authorities”; it names no department and has no later update. The card’s “US Department of Commerce” and its 30 June and 1 July dates are supported by Engadget (30 June 2026), quoting Anthropic on X: “We’ve received notice that the Department of Commerce has lifted export controls on Claude Fable 5 and Mythos 5”, and “We’ll begin restoring access tomorrow”. The text is unchanged.

## Decisions SVL can overrule

1. **The Transformer card’s `o` is unchanged** (“scaling up became a matter of buying more chips”); the eight P100s in `x` now carry it.
2. **The diffusion card is the 2015 paper, not DDPM (2020).** Both image-model papers cite 2015 when introducing the method; DALL·E 2’s decoder cites Ho et al. 2020, which is named in `x`.
3. **The export-controls card does not say the A800 and H800 were banned in October 2023.** CSET says the update “removed the interconnect speed parameter … the same parameter around which Nvidia had designed its China-specific chips”, and the card says that; the chips themselves were not checked further.
4. **Not added:** TPU v1 and Midjourney (pass rule (a), not on the list); Cybersyn and Ashby (fail the rule, though Cybersyn pairs with the Hayek card and sits in the Land vein); GANs, LayerNorm, FlashAttention (below the page’s grain, or no card leans on them); TSMC and ASML (no single date; TSMC is already scored in `BODY-SHORTLIST.md`).
5. **No Land quotation on the new cards.** None of the checked texts was searched for a fit this time.

## Other things the audit showed

- The Language lane’s widest gap since 1900 is the Transformer (2017) to Copilot (2021), 0.246 decades of log time, and the Hyperstition lane’s is “Summoning the demon” (2014) to Lemoine (2022), 0.439. Not acted on.
- The existing `deepseekv3` card is dated 26 December 2024 (the release); its technical report’s arXiv v1 is 27 December. Left as it is.

## Checks

- `python3 build.py --live` on the published page before any change: the kit matched it.
- `node vanishing/check.js`: 281 milestones, 37 before 1900, 29 links on 36 cards, no errors or warnings.
- `python3 test.py --vp diffusion,resnet,moe,transformer,chinchilla,chip-controls`: all checks passed; desktop and phone screenshots looked at, light and dark.
- `python3 vanishing/loxodrome_check.py`: unchanged (×2.500000 per turn at 81.7029° off north, 8.2971° north of due west).
- An independent agent checked every claim on the six cards against their listed sources without seeing how they were written (a weaker check than the sources themselves); see below. After its flags were fixed, the build, `check.js` and `test.py` (with `fable` added) were run again and passed.

## Independent read

A separate agent fetched every listed source and checked each claim on the six cards (24 October 2026). All six plotted dates matched their primaries. It worked out the bearing independently: ×2.5 a turn needs arctan(ln 2.5 / 2π) = 8.30° north of due west (×2.42 at 8.0°, ×2.56 at 8.5°), so “about eight degrees” stands, and the track closes inward. It could not see the ECCN 3A090 thresholds on the Federal Register page, and the card gives no threshold figures. It flagged nine things, all changed:

| Card | Flag | Now |
|---|---|---|
| `diffusion` | “The papers behind DALL·E 2 and Stable Diffusion both cite the 2015 paper”: no DALL·E 2 paper listed | DALL·E 2 paper (arXiv 2204.06125) added; its introduction cites Sohl-Dickstein et al. as [46] |
| `diffusion` | “start every image from random noise” not in the sources, and “every” | “Stable Diffusion, further in, makes its pictures by gradually denoising random noise” (Rombach: “gradually denoising a normally distributed variable”) |
| `resnet` | 152 layers is on ImageNet; CIFAR-10 went to 1,000 | “On ImageNet they trained networks built this way up to 152 layers deep” |
| `moe` | “… and Jeff Dean at Google Brain”: Maziarz was at the Jagiellonian University, Cracow | “six of them at Google Brain and Maziarz at the Jagiellonian University in Kraków” (checked in the PDF) |
| `moe` | The Transformer citing this paper is not in this card’s sources; “five months” is 4 months 20 days | Transformer paper added; “which cited this paper that June” |
| `moe` | “with little extra computation” | the abstract’s “with only minor losses in computational efficiency” |
| `transformer` | “most of them to found or join AI companies”: no source says AI | “to found start-ups or join other companies” |
| `chip-controls` | “Less than four years later the same department’s controls reached the models themselves” unsourced | Engadget, 30 June 2026, added (Anthropic: “the Department of Commerce has lifted export controls on Claude Fable 5 and Mythos 5”); this also exposed the `fable` card’s sourcing gap, above |
| `chip-controls` | “help from US persons in producing them” overreaches | “barred US persons from supporting chipmaking at certain plants in China without a licence” |

It also noted that the Transformer card’s `o`, “Nearly every model further in is built on it”, can’t be checked from the sources (Wikipedia: the architecture “underlies most modern large language models”). It is the existing reading and says “nearly”, so it was left.
