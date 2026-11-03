# Demon descriptions on Numogram Lab and Time-Sorcery

**Status.** Built in update 5 (23 October 2026). Every one of the 45 demons has a two-sentence description in `shared/demons.js`, which `build.py` puts in front of both pages’ scripts. `shared/check.js` checks the file (test.py runs it, and also runs it on broken copies to show it bites).

## Where they show

| Place | What it shows |
|---|---|
| Numogram Lab, Zones tab, the pair card | the first sentence (`t`) only, in the card’s small type, between the demon’s name and its mesh line |
| Numogram Lab, Demons tab, the selected demon | both sentences, the Matrix’s other names (`nm`, `aka`, leaving out the one on screen) and a link to the Matrix with the mesh number |
| Time-Sorcery, step 6 | both sentences, then why the demon appears (“It stands between zone 6, your phrase’s, and zone 4, your year’s”), its class, the other names and the link |

The pair card can never show a demon with a zero in its net-span (Lurgo, Duoddod, Ixix, Krako, Tokhatto, Tchu, Puppo, Minommo, Uttunul): a digital root runs from 1 to 9, so no phrase lands in zone 0. Those nine appear only on the Demons tab and in Time-Sorcery’s readings (where 1900, and in two digits every year ending in 00, is K-00 → zone 0).

## How they were written

- **Source.** The Pandemonium Matrix as mirrored at dataswamp.org (the page both companion pages already cite), read on 23 October 2026. Before writing, the 45 entries were checked against the pages’ own tables: names, net-spans, mesh numbers, classes and all 75 published rite paths agree. The only difference is 8::1, which the Matrix heads “Mur Mur” (with Murrumur and Mu(mu) in brackets) and the Lab defaults to the Glossary’s Murrumur; that is the spelling experiment on the Demons tab, and it is untouched.
- **What each draws on.** Every description uses its entry’s epithet, its class phrase and the description of every rite, in rite order. The nine demons of zone 0 (net-span x::0) each hold one of the Matrix’s nine doors, and each description names its door by number (first for Lurgo through ninth for Uttunul). Every entry carries a pitch tag; only Tchattuk’s is glossed, Cth-7 (Lowermost), so it is the only one mentioned (“pitched lowest of all”). Tokhatto’s “angel of the cards” is in its entry. Djynxx’s and Uttunul’s “whose region is the Warp/Plex” comes from the Glossary’s entries for Warp and Plex.
- **Paraphrase, not quotation.** The sentences are this page’s own wording of what the Matrix lists, and the pages say so where they appear. Odd Ccru coinages are kept where there is no plain word for them (sphinx-time, subnothingness, mirroracle, anorganism).
- **Where the Matrix gives no route.** Ixix, Tchu, Ununuttix and Unnutchi have Rt-0:[?]. Their descriptions say the Matrix marks the rite with a question mark in place of a route, and `check.js` keeps that sentence tied to the data.
- **No names inside.** A description never names a demon, so neither spelling of 8::1 can leak into a result, and nothing in the file feeds the arithmetic.

**Sol’s starter list.** Two of its four paraphrases needed changing. Mur Mur’s “aquatic, ancestral body” has no “ancestral” in the Matrix. Tchu’s “its rite remains unspecified” is half right: the route is a question mark, but the rite’s meaning is given (“cosmic deletions and real impossibilities”). Lurgo and Tchakki matched.

## Checks

- `node shared/check.js`: 45 entries in mesh order; net-spans match both pages’ tables; both sentences end in a full stop, have no straight quotes, no common American spellings and no demon names; `t` is at most 100 characters and `r` at most 175; the question-mark sentence appears exactly where the Matrix has Rt-0:[?].
- `python3 test.py`: the pair card and the inputs fit under the sticky tab rail on a 375 × 812 phone for the example pairs and for all 36 demons the card can show with long phrase names (worst case 732 of 734 px when this was built); the card, the Demons tab and step 6 show the text and the source.
- **Independent read.** A separate agent compared all 45 descriptions with the Matrix without seeing how they were written; its findings and what changed are recorded below.

The independent read (23 October 2026) passed 38 of the 45 descriptions and flagged 7. Each flag was checked against a fresh reading of the Matrix, and all seven were changed:

| Mesh | Matrix | Was | Now |
|---|---|---|---|
| 00 | Spinal-voyage (fate line), programming | a voyage down the spine, read as a fate line and as programming | the spinal voyage, glossed as a fate line, and programming |
| 11 | Optimal maturation … Rapid deterioration (putrefaction, catabolism) | slow ripening … rapid rot | optimal maturation … rapid decay and putrefaction |
| 12 | Maintaining balance (calendric conservatism) | keep the calendar in balance | maintain balance by keeping to the calendar |
| 20 | Pitch Cth-7 (Lowermost), a position tag | demon … of the lowest pitch of all | pitched lowest of all |
| 25 | Purifications, amphibious cycles (and healing of wounds) | heal wounds through amphibious cycles | purifications, amphibious cycles and the healing of wounds |
| 30 | Emergences (and things washed-up on beaches) | wash strange things up on beaches | bring emergences and things washed up on beaches |
| 33 | oppressive tension (protection during monsoon) | before the monsoon | oppressive tension and protection during the monsoon |

Three lines it passed as fair were tightened anyway: 02 (“a slow pull into stillness and protection from drowning”, two items as the Matrix lists them), 08 (“switching crazes”, dropping an added “and pass”) and 42 (“an asymmetric poise between a pair”, not “twins”). It also noticed that only four of the nine doors were named; the fetch made to check its flags showed that every x::0 entry has one, so all nine are now named. Everything else it confirmed: the four question-mark rites, the five [X] crossings, the one-rite and several-rite wording, and the Glossary’s Warp and Plex.

## Decisions (SVL can overrule any of them)

1. **Two sentences, split.** The pair card carries only the first, because the card has to stay on one phone screen; the rites belong where rites are walked.
2. **Small type on the card.** The description is set in the card’s smaller size as a subtitle under the name. The syzygy line now runs on in the mesh paragraph instead of starting its own, which saved the few pixels the worst case needed.
3. **Other names** are shown on the Demons tab and in Time-Sorcery, not on the card.
4. **No rite-by-rite labels.** Time-Sorcery’s published-rite buttons still show only the path and direction; the description covers the rites in order. Labelling each of the 75 rites would be the next step if SVL wants it.

## Editing a description

Change `t` or `r` in `shared/demons.js`, run `node shared/check.js`, then `python3 test.py numolab timesorcery` (the card-fit check fails if a longer `t` pushes the card off a phone screen). Keep to the Matrix entry for that mesh, and never put a demon’s name in the text.
