# SVL's pages: Numogram Lab, Time-Sorcery, Vanishing Point, Codex

**Kit updated 3 November 2026 (update 10, then the move to GitHub).** Updates 9 and 10 reached GitHub together in commit `528e495`, since update 9 had never been pushed. The kit then moved into the repo under `kit/` (see "Where the source lives"), and the tag `artifacts-live` marks that commit. The hand-off now commits and pushes once SVL approves (step 5). The daily scout opens one pull request per candidate milestone, and merging one is SVL's approval (see "Scout pull requests"). `build.py` now writes LF line endings on every OS, matching the repo. Update 10 added one milestone SVL chose from the 2 November scout: Anthropic’s first drug-development results with Claude (`claude-drugs`, Learning, 27 October; from Anthropic’s post and The Next Web, worded as company-reported, preclinical and not peer reviewed; linked to `wetlab`). Leads left out: Meta’s equity raise (up to $97.5bn, of which $37.5bn sold now; SVL unsure, and a card would turn on Meta’s first negative free cash flow in a decade and chipmakers buying in, not the headline size) and Canada’s stake of up to C$1.6bn in Cohere. Vanishing Point is at artifact version 16 (the others unchanged) and now has 285 milestones (59 key, 93 model releases, 37 before 1900) and 20 forecasts. Update 9 (28 October): Vanishing Point was at artifact version 15, Numogram Lab at version 16, Time-Sorcery at version 6 and Codex at version 2. Update 9 added three milestones SVL chose from a shortlist of 24–28 October news: Anthropic’s S-1 (`anthropic-s1`, Capital, 26 October; figures from the filing on EDGAR, linked to Pacioli), the four models in the S-1’s risk factors that reached real third-party systems through a misconfigured evaluation (`s1-breakout`, Hyperstition; worded from the filing, which says pre-training was *delayed*, not halted as some press said; linked to `hfincident`), and Gemini 4 Carbon (`gemini4carbon`, 28 October; released first only to cyber defenders through Google’s Fairwind Program, like GPT-6 Astra’s limited release). Gemini 4 Argon was already on the spiral as generally available on 13 October. Leads left out: Genie 4 (no DeepMind primary found), GPT-6.1 Terra (leaks only), OpenAI’s 26 October proofs (verified as claimed, but SVL did not pick them). Vanishing Point now has 284 milestones (59 key, 93 model releases, 37 before 1900) and 20 forecasts. On Windows, run `test.py` with `PYTHONUTF8=1` (otherwise node’s UTF-8 output fails to decode) and preinstall axe-core into `out/.axe` with npm (`subprocess` cannot launch bare `npm`); there the Numogram Lab phone pair-card check measured 733 of 732 px with Numogram Lab unchanged, a rendering difference to recheck on Linux. Update 8 added a fourth page, Codex (`codex/`; its section below has the files, definitions, checks and decisions): a word’s AQ total, read as ten base-3 digits, one for each zone of a 3×3 block, becomes the law of a Life-like cellular automaton, and its letters become the starting shape, which runs beside Conway’s Life, itself 135, like AQ(CONWAY). Its engine passed LifeWiki’s benchmarks, lifelib’s populations through generation 500 for 20 words, a Python decoder on all 59,049 codes and Numogram Lab’s AQ on 26 strings (`node codex/check.js`). SVL asked for Codex to get its own link in the shared header, so the header and footer now name four pages; the other three pages changed only there and in a comment in `shared/svl.css`. Vanishing Point still has 281 milestones (59 key, 92 model releases, 37 before 1900) and 20 forecasts. Update 7 worked through a review of the page by Gemini 4 Argon, checked against the source first: it added five milestones under a rule fixed in advance (a card already leans on it, or it fills the Learning lane’s 2012–19 gap): diffusion (2015), ResNet (2015), the sparsely-gated mixture of experts (2017), Chinchilla (2022) and the US export controls on AI chips (October 2022). It corrected the Transformer card (who the eight authors were, the eight P100s, Shazeer’s return to Google in 2024 and his move to OpenAI in June 2026), gave it links, gave the Fable 5 card a second source for the Commerce Department and its dates, and made “How to read the spiral” say that each turn is drawn two and a half times smaller while it holds ten times the time. `vanishing/UPDATE7.md` has the review checked line by line, the rule and its audit, sources, decisions and the independent read. Vanishing Point now has 281 milestones (59 key, 92 model releases, 37 before 1900), the latest still Kimi K3.1 Pro, and 20 forecasts. Update 6 added seven pre-1900 milestones (Shang oracle bones, Antikythera, Gutenberg, Mercator, Watt’s governor, Evans’s mill, the 1866 Atlantic cable), rescoped the Uruk card, added seven Grok releases and split Grok 4.5’s API and announcement dates; it also added links between cards (`see`, “Elsewhere on the spiral”), a third pre-1900 thread in the notes, and a paragraph tying the spiral to Mercator’s rhumb lines, checked by `vanishing/loxodrome_check.py`. `vanishing/UPDATE6.md` has the sources, decisions and the independent read. Vanishing Point now has 276 milestones (59 key, 92 model releases, 37 before 1900), the latest still Kimi K3.1 Pro, and 20 forecasts. Update 5 gave every demon a two-sentence description, paraphrased from the Pandemonium Matrix and shared by both companion pages (`shared/demons.js`; `DEMONS.md` has where they show, what each draws on and the checks); made Numogram Lab’s cross-cipher note true for phrases with digits and Time-Sorcery’s zone-0 sentence true in the two-digit count, both now written by the code; reworded Vanishing Point’s three “default centre” texts so they hold on either side of 13 November; and ranked candidates for more of the body of the machine (`vanishing/BODY-SHORTLIST.md`; nothing new is drawn yet). Update 5 left Vanishing Point at 262 milestones. Update 4 added “The body of the machine”, a note in Vanishing Point’s Notes with two charts: Microsoft’s cash additions to property and equipment, FY2023–26, from its Forms 10-K, and the electricity used by Ireland’s data centres, 2015–25, from the CSO. Every figure was checked against two primary representations; `vanishing/PANEL.md` has the figures, sources, reconciliation and decisions. It also moved “Qabbala 101” to September 2006 on Numogram Lab and Time-Sorcery (citations, with a link to Urbanomic’s page, and Time-Sorcery’s anchor list, where the year now reads K-106 → zone 7 instead of K-107 → 8), matching Vanishing Point. Update 3 added thirteen milestones (`magnifica`, Truth Terminal, iLands, AlphaEvolve, Tierra, the “spiritual bliss” attractor, `edge-replication`, Agent Pay, `god-golem`, and four releases), moved “Qabbala 101” to its first publication on Vanishing Point, and tightened tmi, rnd26, wetlab, jacobian, navierstokes and stateofai against their primaries; the review’s linked-record labels are still held. Update 2 added the forecasts (`vanishing/FORECASTS.md` has the selection rule, the coded table and the decisions) and fixed two colour-contrast failures. Update 1 (22 October) added IBM Watson, Meltdown’s 2012 limit and the shared header and footer. Update this line whenever the kit changes.

These are four single-file interactive pages about Nick Land, the Ccru, gematria, cellular automata and the history of AI, built by SVL with Claude in October 2026. Each page is built from this kit in two versions: a claude.ai artifact, and a standalone file for SVL's GitHub Pages site.

**Where the source lives.** Since 3 November 2026 the kit lives in the public repo `SodiumVaporLamp/HyperstitionLab`, under `kit/`. The repo's root holds the four built site pages that GitHub Pages serves, plus SVL's README, LICENSE and PANEL.md. Start every session by cloning the repo. `kit/build.py` writes the site pages to `kit/site/`, which git ignores; copy them to the repo root to publish them. The tag `artifacts-live` marks the commit whose kit built the live claude.ai artifacts. The zip from `build.py --zip` is now only a backup. A `svl-pages-kit.zip` that is newer than the repo's `kit/` means someone worked offline, so ask SVL before using either one.

| Page | Source | Artifact (always republish to this one) | GitHub file |
|---|---|---|---|
| Numogram Lab | `numolab/` | https://claude.ai/artifact/1u4CmPQFRszxxz2beVf3Ae | `index.html` |
| Time-Sorcery | `timesorcery/` | https://claude.ai/artifact/QHHN95PKtW8xcd5neG5txY | `time-sorcery.html` |
| Vanishing Point | `vanishing/` | https://claude.ai/artifact/3BpZc1MADJBMPu4YpdctVj | `vanishing-point.html` |
| Codex | `codex/` | https://claude.ai/artifact/JEiyxZC7ir6Kb9L84dinv4 | `codex.html` |

## A session, start to finish

1. **Check the kit before changing anything.** Run `python3 build.py && node vanishing/check.js && python3 test.py`, and all of it should pass. (`test.py` also runs `node shared/check.js` for the companion pages and `node codex/check.js` for Codex, which takes about a minute and a half. It installs axe-core with npm into `out/.axe` the first time, for the accessibility scan.) Then read the live artifact for each page you will change, using the Artifact tool's read action with the artifact's `url` and no `path`. The tool requires that read before you republish an artifact made in another conversation. The read result names a saved copy; run `python3 build.py --live <saved copy>`. A mismatch is expected when scout pull requests were merged after the last republish, since merging changes GitHub but not the artifacts. In that case, check out `artifacts-live` in a second worktree, build it, and rerun `--live` there. If that matches, the gap is only the merged PRs, so carry on. The step 4 republish brings the artifact up to date. If it still doesn't match, the published page has moved on from the repo, so stop and ask SVL. Also list the open pull requests (`gh pr list`). Open scout PRs can conflict with your change, so mention them to SVL.
2. **Make the change.** For new milestones, research and verify them first (see the rules below).
3. **Rebuild and test.** Run `python3 build.py && node vanishing/check.js && python3 test.py --vp <new ids, comma-separated>`. Then open the screenshots in `out/shots/` and look at them: the new marks, their labels and their cards, on desktop and on phone.
4. **Publish.** Publish `out/<page>.html` with the Artifact tool, with `url` set to that page's artifact. Never publish without `url`: that creates a second artifact with a new link, and the pages' links to each other go stale. Leave `icon` out. A short `label` such as "Add PHP2Shell" is fine.
5. **Hand off.**
   - Update the "Kit updated" line above.
   - **Commit to GitHub, but only once SVL approves.** Propose the commit first: which files changed in `kit/` and which site pages at the root, a one-line summary of each, the commit message, and the new milestone and forecast counts (`check.js` prints both). Then ask SVL with AskUserQuestion, and wait. Don't commit or push on anything short of a yes in this conversation. An earlier approval, or a scheduled task, doesn't count.
   - Once SVL says yes, work in the clone (`gh` is signed in as SodiumVaporLamp). First run `git config core.autocrlf false`, which should really be the first thing after cloning (see line endings below). Then set the identity in that clone only: `git config user.name SodiumVaporLamp` and `git config user.email varsity.gothic.1z@icloud.com`. Never use the machine's global git identity, which isn't SVL's. Copy `kit/site/*.html` to the repo root, byte for byte. Then commit the kit changes and the root pages together on `main`, with no real names anywhere, and push. If you republished in step 4, also move the tag: `git tag -f artifacts-live && git push -f origin artifacts-live`. Report the commit hash. GitHub Pages serves the new files within a few minutes.
   - Line endings: the repo stores LF, and `build.py` writes LF on every OS, so the built pages should match the root byte for byte. Git for Windows ships with `core.autocrlf true`, which turns files into CRLF on checkout. That's why `git config core.autocrlf false` has to come before any comparison. If a fresh clone already has CRLF files, run `git checkout -- .` after setting it.
   - The README quotes the milestone count and is SVL's own text, so leave it unchanged unless SVL asks you to change it.
   - Close any open scout PR that this session's change makes redundant, with a comment saying why. Ask SVL first if it isn't obvious.

Keep one batch of changes to a conversation. Long conversations get compacted and lose detail.

Run the commands in this file from `kit/`. The site pages are copied from `kit/site/` to the repo root, one level up.

## Scout pull requests

A daily routine, the Vanishing Point timeline scout, looks for candidate milestones in the last 48 hours of news. It proposes each one as a pull request. SVL approves a candidate by merging its PR and turns it down by closing it. The scout follows every rule in this file except where this section changes it.

- **One PR per candidate.** At most three a day, on a branch named `scout/<YYYY-MM-DD>-<milestone id>`, labelled `scout`. Each PR changes only what the card needs: the entry in `kit/vanishing/data.js`, any `see` links that point to it, and the rebuilt `vanishing-point.html` at the root. It never touches CLAUDE.md, the README, the other pages or the `artifacts-live` tag. The next chat session records merged scout milestones in the "Kit updated" line.
- **Same bar as a chat session.** Verify every fact with web search, and put one to three sources on the card. Treat roundups as leads, not sources. Attribute claims only the claimant vouches for. Follow house style. Leave `q` and `qc` empty unless the words were fetched verbatim from a text named under "Whose words". A scout PR never adds a Land quotation from memory.
- **Checks.** Run `python3 build.py` and `node vanishing/check.js`. Also run `python3 test.py --vp <id>` if Playwright and Chromium are available. The PR body lists which checks ran and which couldn't. Never open a PR whose build or `check.js` fails.
- **The PR body is the proposal.** Open it with the card as it will read: date, lane, title, text and sources. Then say why it clears the bar, what was left out or uncertain, and the checks. End with: “Merge to put this live on GitHub Pages; close to drop it. The claude.ai artifact catches up the next time you run /svl-pages.” Use SVL, never a real name, in branches, commits and PR text. Commit as SodiumVaporLamp, as in step 5.
- **Keep open PRs current.** Merging one PR changes `data.js` and the built page, so the other open scout PRs then conflict. At the start of each run, handle every open `scout` PR. If main already has its milestone, close it with a comment. Otherwise, if it conflicts or is behind main, re-apply its card to a fresh branch from main, rebuild, rerun the checks and force-push its branch. Close scout PRs older than 14 days with a comment.
- **Never merge, push to `main`, republish an artifact or move the tag.** Those are SVL's, or a chat session's once SVL approves.
- **GitHub from a cloud session:** GraphQL is blocked, so `gh pr create` and `gh pr list` fail there. Use the REST API through `gh api`. For example, `gh api repos/SodiumVaporLamp/HyperstitionLab/pulls -f title=… -f head=scout/… -f base=main -F body=@pr.md` opens a PR, and `gh api 'repos/SodiumVaporLamp/HyperstitionLab/pulls?state=open'` lists them. Labels go on through `repos/…/issues/<n>/labels`.

## Ground rules for all four pages

- **Credit.** The credit line is "Built by SVL with Claude, October 2026." It is written once, as `CREDIT` in `build.py`, and the shared footer carries it on all four pages. SVL is a pseudonym, so never put SVL's real name in anything public: pages, commit messages or file names.
- **Shared header and footer.** All four pages open with the same navigation line (Numogram Lab · Time-Sorcery · Vanishing Point · Codex, the current page unlinked) and end with the same footer line (the credit, then the other three pages and Cyphers). Each `body.html` marks their places with `{{NAV}}` and `{{FOOT}}`; `nav()` and `foot()` in `build.py` write the markup and `shared/svl.css` styles it. In the artifact versions the links point at the claude.ai artifacts and open in a new tab; in the site versions they point at the sibling files. Change them there, never in a page's own files. `test.py` checks every page's links, and `build.py` stops if a placeholder is left unfilled.
- **Provenance.**
  - `q` holds words Land or the Ccru actually wrote, copied exactly from a text you have checked in this session. `qc` gives the work, the year and the page or section.
  - `o` ("This page" on the card) is the page's own reading, and it is never attributed to Land.
  - Where a reader would expect a link to Land that isn't in the texts checked, the card says so. The Dutch East India Company card is the model for this.
  - The texts checked so far are listed under "Whose words" in `vanishing/body.html`. Constants for the most-cited ones (`Q101`, `MELTDOWN`, `GLOSSARY`, `CRYPTO`) are at the top of `vanishing/data.js`.
- **Verify before adding.** Check every new fact with web search: dates, names, numbers and who did what. Prefer primary sources and established outlets. Cards usually carry one to three sources, and up to five for a messy breaking story. When sources disagree, use the best-supported version and tell SVL which one you chose. When only the claimant vouches for something, attribute it ("OpenAI said …").
- **Roundups are leads.** News roundups SVL pastes in, including ones written by other AI models, are not sources. Check each item, and expect some details to be wrong.
- **SVL decides what goes in.** Mention possible additions in a line, but don't add milestones he didn't ask for. A scout pull request is a proposal, so it counts as added only once SVL merges it.
- **House style.**
  - British spelling (centre, analyse, formalise), except in names and titles.
  - Curly quotes and apostrophes (’ “ ”).
  - En dashes in ranges and paired names (Navier–Stokes).
  - Plain past-tense prose with no hype.
  - `check.js` flags straight quotes and common American spellings.

## Vanishing Point

**Files**

- `data.js`: lanes, labs and `EVENTS`.
- `forecasts.js`: `FORECASTS`, the dated forecasts; the header comment defines every field.
- `logic.js`: date parsing, log time, lane layout, and forecast dates and statuses (`fcTimes`, `fcStatus`, `fcHorizon`).
- `ui.js`: canvas drawing, cards, the forecast list, filters, controls and the turn-round at the floor; `window.__vanishing` is the test hook.
- `style.css`
- `body.html`: the page text, with `{{CSS}}`, `{{DATA}}`, `{{FORECASTS}}`, `{{LOGIC}}`, `{{UI}}`, `{{NAV}}` and `{{FOOT}}` placeholders (`{{LAB_LINK}}` and `{{TS_LINK}}` still work if a page needs a link in its own text).
- `codebook.js`: prints the forecasts as one coded table (and CSV with `--csv FILE`); paste it into FORECASTS.md after changing forecasts.
- `PANEL.md`: “The body of the machine” in the Notes: the two series (`BODY` at the end of `data.js`, drawn by `renderBody` in `ui.js`), every figure with its two primary sources, the revisions and release-date oddity found, decisions, and how to add next year’s filing and release. `panel-sources/` keeps the CSO quarterly table as read.
- `BODY-SHORTLIST.md`: candidates for more of the body of the machine, ranked in update 5 (NVIDIA’s Data Center revenue first, then Dominion Energy Virginia’s data centres under contract against billed demand), with a scorecard and what was not verified. Nothing is drawn yet. `panel-sources/body-candidates-2026-10-23.md` keeps the research notes behind it.
- `UPDATE6.md`: update 6 (seven pre-1900 milestones, Grok, links between cards): what each card turns on, what changed from the handoff, decisions, and the independent read. `loxodrome_check.py` checks the Mercator card’s and the notes’ claim that a constant-bearing course is this page’s spiral.
- `UPDATE7.md`: update 7 (the Gemini review, five milestones, the Transformer card): the review’s claims checked against the page, the inclusion rule and its audit, what was added and changed, decisions, and the independent read.
- `FORECASTS.md`: forecasts as built: the selection rule, the coded table, horizons and skew, the turn-round at the floor, decisions, a reader test, and what could not be verified. Read it before adding or resolving a forecast.

**Geometry**

- Position along the spiral is log₁₀ of the time left before the centre: one turn is one decade of log time, and the radius shrinks by `GROW` = 2.5 each turn (`rOf` in `ui.js`), so it is the log of the distance from the centre that is linear in log time. Zooming in is the same as turning. The note “How to read the spiral” gives both numbers, ten and two and a half, because a reviewer in update 7 read the tenfold time as a tenfold radius.
- The centre defaults to Doomsday, 13 November 2026 (von Foerster, Mora and Amiot, *Science*, 1960). The other centres are "now" and 2045.
- Looking ahead reverses the tunnel: today at the centre, log of the time *ahead*, the spiral mirrored. Log time stops one day either side of today (`FLOOR` in `logic.js`); centred on now, travel past that floor turns the spiral round (FORECASTS.md, section 4).
- Milestones in the same lane that fall closer together than 0.011 decades (0.007 for model releases) are nudged apart. The cards keep the true dates.
- Adding `#id` to the URL opens that milestone's card.

**Milestone fields**

The header comment in `data.js` defines each field: `id d dl t short th lab org w f x q qc o s tag`. `check.js` enforces them.

**Forecasts**

- A forecast goes in only if it passes the selection rule in FORECASTS.md, section 1. SVL delegated the choice under that rule; list any candidate it admits or excludes for him to overrule.
- `say` is verbatim from the original (the paper, the forecaster's own post, the lab's PDF, a transcript), with page, section or timestamp in `sayc`, and the sources include an archived copy. `q`/`qc` stay reserved for Land and the Ccru, on milestones.
- Statuses come from the reader's clock. When a forecast's date passes, record its `outcome` with who judged it; `node vanishing/check.js --now YYYY-MM-DD` shows what will close without one.
- Forecast ids start `f-` and work as `#f-…` links, like milestone ids.

**Lanes, from the rim to the centre**

- `model`: releases, drawn as triangles.
  - `lab` is one or more of `openai anthropic google meta china other`; use a list for joint releases.
  - For `china` and `other`, `org` names the maker.
  - These are usually `w: 1` with a one-sentence `x`, one source (Wikipedia or the lab's announcement) and no `o`.
- `cap`: ledgers, companies, chips, money, markets and data centres.
- `reck`: number, logic and computing machines, including AI results in mathematics.
- `learn`: statistics, neural networks and training, including R&D automation and lab robotics.
- `lang`: from counting letters to language models, including chatbots and the people who use them.
- `hyp`: fictions, prophecies, demons, Land and the Ccru. It also holds AI security incidents and agents going off-script (`replit`, `gtg1002`, `hfincident`, `gemini`, `php2shell`), replication tests (`edge-replication`), and agents and personas with money of their own (`truth-terminal`, `ilands`).

**Weights, fates and tags**

- `w`: 3 is a key milestone (it shows in "Key milestones only" and gets a larger mark), 2 is standard, 1 is detail.
- `f: 'road'` marks hand-built knowledge that lost out to learning, such as rule-based language processing and expert systems. It is drawn as a hollow ring and hidden in the Bitter Lesson view.
- `f: 'verdict'` marks a judgement on the field, drawn as a square: ALPAC, Lighthill, *Perceptrons*, the Fields medallists' statement.
- Otherwise leave `f` out.
- `tag: ['demon']` marks the Ccru demon cards.

**Card voice**

- `x` is a plain account with names and numbers, usually 40 to 180 words.
- `o` is one to three dry sentences that tie the event to something else on the spiral (Y2K, de Prony, Hilbert, Swift's Lagado) or to Land's terms. Leave it out when there's nothing to add.
- Add `short` when a title runs past 32 characters, or it gets an ellipsis on the spiral; `check.js` lists those titles.

**Order**

The page sorts milestones by date itself. By convention, keep the other lanes' milestones in date order in the main block, and model releases in their own block at the end of `EVENTS`.

**Computed versus hand-written**

- Computed by the page: the two summary sentences under the body-of-the-machine charts (ratios from `BODY`; `check.js` prints them), the lane and filter counts, the Models and key-milestone numbers in the notes (the `data-count` spans; the numbers written in `body.html` are only fallbacks), the releases-per-year chart and the lab chips.
- Written by hand: prose claims such as "more than twenty in 2025, and 2026 passed that by October". Recheck these whenever you add models.
- Also written by hand: the body-of-the-machine note’s opening, which says the Three Mile Island reactor is “still to be restarted” (the `tmi` card gives mid-2027). Reword it when that changes.
- Also written by hand: “about eight degrees north of due west” in the Mercator card’s `o` and in the note “How to read the spiral”, and the note’s two “two and a half times” (each turn on screen, and the ship’s track closing in). They follow from `GROW = 2.5` in `ui.js` (cot of the bearing = ln GROW / 2π, 81.70° off north); `python3 vanishing/loxodrome_check.py` checks it. Change all of these texts if GROW changes.
- Also written by hand: the pre-1900 threads in “What counts, and how much” (three since update 6) and the Models sentence naming xAI’s main Grok releases. Recheck them when pre-1900 milestones or a lab’s releases are added.

**Links between cards (`see`)**

- A milestone’s `see` lists other milestone ids. The card shows them, and every card that names it, under “Elsewhere on the spiral”, in date order, so write each connection once, on the newer card or the one it explains. `check.js` rejects unknown ids, self-links and a pair written twice, and warns above five links on one card.
- Use it for the connections a card’s text depends on, not for every resemblance. Update 6 used it only on its seven new pre-1900 cards (17 links, shown on 21 cards). Update 7 added it to its five new cards and the Transformer (29 links, shown on 36 cards); the Transformer now shows five, the most before `check.js` warns.

**Coming up: the centre date passes on 13 November 2026**

- After that date the page opens on the "now" centre automatically (the `setCentre` call near the end of `ui.js`). SVL decided on 22 October 2026 that this is the behaviour he wants.
- In the Doomsday view, anything dated after 13 November is squeezed against the centre, and `check.js` warns about it.
- The three texts that called Doomsday the default centre were reworded in update 5 so they hold on either side of the date: the centre note (“The page opens on it until that date arrives, and on “Now” from then on”), the Doomsday card’s `o` (“The spiral can be centred on this date, and opens on it until the date arrives”) and the Macy card’s `o` (“whose date is one of this spiral’s centres”). The switch happens at midnight UTC as 13 November begins. Doomsday stays in the Centre menu, marked “(passed)”. SVL expects to keep iterating on the notes, so avoid wording that dates itself.
- SVL wants the Doomsday card and note otherwise left as they are: an interesting tidbit, with the page’s main focus kept on Land and on AI directly.
- The Doomsday forecast (`f-doomsday`) resolves on its own on 14 November 2026: its outcome is recorded with `after: '2026-11-14'`, and `test.py` checks the page as of that day.

## Numogram Lab and Time-Sorcery

- **Shared by both: `shared/demons.js`** holds `DEMON_LORE`, one description per demon keyed by mesh number, which `build.py` inlines into both pages ahead of their logic. `t` says what the demon is, `r` what its rites do; both are this page’s paraphrase of the Matrix entry, never a quotation and never naming the demon. It is display only: the arithmetic keeps its own name tables, so the Murrumur / Mur Mur experiment is untouched. `shared/check.js` checks it and the rules the pages state. `DEMONS.md` has the ledger and the rules for editing.
- **Rules the pages state are written by the code where the code can compute them.** Numogram Lab’s cross-cipher note works out its GPT6 example with `values()`, and Time-Sorcery’s step 5 lists the zone-0 years for the selected count (1900 alone in the running count; every year ending in 00, 1900–2900, in two digits). `shared/check.js` tests both claims over the whole word list and year range.
- **`numolab/`**
  - `lexicon.js`: word lists for the loop search.
  - `logic.js`: AQ values, zones, loops and the attractor.
  - `ui.js`, `style.css`, and `body.html` with `/*STYLE*/`, `/*SCRIPT*/`, `{{NAV}}` and `{{FOOT}}` placeholders.
  - `node numolab/test.js` prints diagnostic values.
  - The zones tab leads with the pair card (`pairTable` and `between` in `ui.js`), which sits directly under the inputs and above the diagram. It is built to be screenshotted, and people share it:
    - the verdict comes first, then A and B side by side;
    - rows that read the same for both phrases span both columns;
    - cipher values the two phrases share are shaded in their zone's colour and listed in the verdict ("Equal in Ordinal (94)");
    - the demon’s one-sentence description (`t` from `shared/demons.js`) sits under its name in the card’s small type, and the syzygy line runs on in the mesh paragraph.
  - Keep the card compact enough that the inputs and the card fit on one phone screen. `test.py` measures this under the sticky tab rail at 375 × 812 for the example pairs and all 36 demons the card can show, with long names; the worst case was 732 of 734 px in update 5, so a longer `t` will fail it.
- **`timesorcery/`**
  - `data.js`: rites, Land's examples and the Qabbala 101 word list.
  - `logic.js`: tic xenotation, plexing, walks and readings.
  - `ui.js`, `style.css`, and `body.html` with `/*STYLE*/`, `/*SCRIPT*/`, `{{NAV}}`, `{{FOOT}}` and `{{LAB_LINK}}` placeholders.
  - `node timesorcery/test.js` prints diagnostics.
  - `python3 timesorcery/rites_check.py` checks the Ccru's published rites against the Numogram's moves.
- All four pages link to one another through the shared header and footer (see the ground rules above). Time-Sorcery’s own “Elsewhere” list also links the Lab.

## Codex

Type a word: its AQ total becomes the law of a Life-like cellular automaton and its letters become the starting shape, which runs under its own law beside Conway’s. Built in update 8 (25 October 2026), first as a prototype in a conversation of its own and then moved into the kit.

**Files**

- `engine.js`: AQ, the zone code (`decode`, `encode`, `twins`), the word body, a sparse engine on an unbounded plane with Golly’s emulation of B0 rules, and the fate classifier (`Analysis`). No DOM; it defines `CodexEngine`. The page inlines it as `<script id="codex-engine">` and also runs it in a Web Worker made from that script’s text, so fates are worked out off the main thread.
- `ui.js`: the word input, zone card, the two dishes (canvas), playback and the flash guard.
- `style.css`, and `body.html` with `/*STYLE*/`, `/*ENGINE*/`, `/*SCRIPT*/`, `{{NAV}}` and `{{FOOT}}`, plus the odds placeholders (`{{B0SHARE}}`, `{{MEANL}}`, `{{SIXAVG}}`, `{{P6}}`, `{{N6}}`, `{{P1}}`, `{{EXPHITS}}`, `{{NLIFEWORDS}}`, `{{NWORDS}}`, `{{TERMS}}`), which `codex_odds()` in `build.py` fills from `reference.json`.
- `reference.py` (needs numpy and wordfreq) writes `reference.json`: the decoder tested on all 59,049 codes and 512 blocks in Python, a SHA-256 of every code’s B/S pair, the codes for Conway’s Life, the count of distinct physics, the named rules it cannot reach, the odds and a list of AQ test strings.
- `lifelib_pops.py` (needs python-lifelib, which compiles with g++) writes `lifelib_pops.json`: populations at every generation through 500 for 20 word bodies, under their own law and Conway’s, from an independent engine.
- `check.js`: runs the engine as built (from `out/codex.html`) against LifeWiki’s benchmarks, `reference.json`, Numogram Lab’s own `values()` in `numolab/logic.js` and `lifelib_pops.json`. All 15 checks passed in update 8.

**Definitions** (the page’s Rules section states them; change both together)

- AQ as on Numogram Lab: A = 10 to Z = 35, digits at face value, accents dropped.
- The code is the AQ total mod 59,049, read in base 3 with zone 0 as the lowest digit. A cell’s zone is the number of live cells in its 3×3 block, itself included; trit 0 voids it, 1 holds its state, 2 ignites it. Conway’s Life is 135, like AQ(CONWAY), and its twin 136.
- The body: each letter or digit is a row of cells as long as its AQ value, starting at x = −⌊L/2⌋, rows two apart.
- Fates: an exact repeat (still life, cycle, travelling object), or objects thrown off once their surroundings were empty 200 generations earlier and the population has repeated for 600; a run stops at 25,000 cells (explodes), 10,000 generations or 15 seconds of work (unsettled).

**Written by hand, so recheck when the code changes**

- “Totals here stay under 6,561, so zones 8 and 9 always void” holds because the input takes at most 120 characters (120 × 35 = 4,200). Change it if `maxlength` changes.
- The counts in “What the code can’t do” (26,244 physics, 262,144 Life-like rules, one in ten) and the 1701 reading; `check.js` tests each.
- The “Checks” section restates `check.js`’s results (LifeWiki’s numbers, 20 words and 40 runs, the largest at 464,588 cells, 26 AQ strings). Update it if the checks change.
- `test.py` asserts the fates of CONWAY, HYPERSTITION, GLIDER, TIME and MURRUMUR as the page words them, so rewording `fateText` in `ui.js` means updating it too.

**Decisions**

- Codex comes last in the shared header (SVL asked for it to get its own link there on 25 October 2026).
- Flashing: B0 dishes draw only the cells that differ from the background, and playback holds for a third of a second whenever a step changes more than a quarter of a dish, so nothing flashes more than three times a second (WCAG 2.3.1).
- The odds were set up before they were computed: 50 Life terms, chosen in advance, so that CONWAY = 135 could be weighed against chance. A hit somewhere in that list had about a 41 percent chance. Keep the list as it is; the point is that it was chosen first.
- Deferred: the census loop (every few generations the population, read in base 3, becomes the next law), and a “keep growing” option for exploding universes, which stop at 25,000 cells to keep phones responsive. SVL has not asked for either yet.

## If the kit is lost

The live artifacts contain everything:

- Vanishing Point inlines `style.css`, then `data.js`, `forecasts.js`, `logic.js` and `ui.js` as four separate `<script>` blocks.
- Numogram Lab and Time-Sorcery inline one `<style>` and one combined `<script>`.
- Codex inlines one `<style>`, then `engine.js` as `<script id="codex-engine">` and `ui.js` as a second `<script>`. Its Python scripts and JSON data are not in the page; rerun `codex/reference.py` and `codex/lifelib_pops.py` to remake them.

Split them back into files, rebuild, and confirm with `--live` that the output matches before changing anything.
