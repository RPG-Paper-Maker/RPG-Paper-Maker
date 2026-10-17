# Quick Time Battle - Full Instructions

## How it works

When a hero uses Attack or a damaging skill, a challenge starts on the attacker's slash frame. Finish it and the
grade sets the damage multiplier. Healing skills scale the same way. Skills with no damage (buffs, status cures)
get no challenge unless you tag them (see Skill tags).

Grades: **Oops, Good, Great, Excellent, Perfect.** Default multipliers: 0.5, 1, 1.25, 1.5, 2.
A Perfect also forces a critical hit.

Dodging: when an enemy attacks, press any of W A S D or Enter shortly before the hit lands. Targeted heroes
sidestep and the hit misses. Pressing too early does nothing. Pressing just after the hit shows "LATE!".
Status effects cannot be dodged. If one of your attacks misses (by the engine's own hit chance), the enemy
sidesteps the same way.

## Parameters

Open Plugins > Quick Time Battle to edit these.

### General
- **Multipliers** - five numbers, comma separated: Oops, Good, Great, Excellent, Perfect.
- **Fail On Miss** - on: an Oops makes the attack really miss. Off: an Oops only uses the first multiplier.
- **Perfect Crit** - a Perfect forces a critical hit.
- **Damage At Slash Frame** - damage lands on the attacker's slash frame instead of after the whole animation.
- **Tiering** - skills whose names end in 1, 2, 3 (or I, II, III) get harder: shorter time, smaller zones,
  longer sequences, more mashes.
- **Popup Linger** - milliseconds that damage and heal numbers stay on screen.

### Look and sound
- **UI Style** - `pixel` (chunky, hard edges, bitmap font; default) or `polished` (smooth).
- **Pixel Size** - screen pixels per UI pixel in pixel style. 0 = automatic. Bigger is chunkier.
- **UI Scale** - size of the prompts. 1 = default.
- **Prompts Over Head** - prompts float above the active hero. Off: mid-screen.
- **Hint Uses** - the text hint above a prompt fades after this many uses of each challenge type. 0 = never show.
- **Beat Pulse** - the prompt bubble pulses with each tick sound.
- **Impact Freeze Scale** - length of the freeze on the slash frame. 0 = off, 2 = double.
- **Effects Scale** - size of particles and bursts.
- **Sound** - synthesized sounds on or off.
- **Volume** - 0 to 1.

### Dodge
- **Defense Enabled** - the dodge feature on or off.
- **Defense Window Frames** - how many frames (60 per second) before the hit a press counts. Bigger is easier. Default 12 (0.2 s). Existing settings keep their saved value.
- **Defense Cooldown** - seconds before another dodge press is accepted (stops key mashing).
- **Defense Slide Distance** - how far heroes (and dodging enemies) sidestep.
- **Defense Slide Duration** - seconds the sidestep takes.

### Ranged Hero 1 to 8
Heroes that should never run up to the enemy, even when the skill has Run on Attack (for long-range animations).
Each slot takes a **Variable**: the variable that holds that hero's ID, for example `0001 Lucas ID`. Both the hero's
database ID and its instance ID work. Leave unused slots empty (variable 0). Slots are read during battle, so
the variables must be filled before then.

### Challenge tables (JSON)
Which challenge a skill gets is decided in this order, first match wins:
1. Hero Challenges: that hero's `skills` entry
2. Class Challenges: that class's `skills` entry
3. Skill Challenges
4. Hero Challenges: that hero's `default`
5. Class Challenges: that class's `default`
6. Default Challenge

Steps 4 to 6 only apply to skills that deal damage or heal.

- **Default Challenge** - for example `{"type":"timing"}`.
- **Class Challenges** - `{"3":{"default":{"type":"crosshair"},"skills":{"12":{"type":"mash"}}}}` (class 3).
- **Hero Challenges** - same shape, keyed by hero ID.
- **Skill Challenges** - `{"12":{"type":"sequence","length":3},"20":false}` (`false` = no challenge).
- **Element Themes** - element ID to theme: `{"1":"fire","2":"ice"}`. Themes: plain, fire, lightning, ice, water,
  earth, wind, light, shadow, heal.
- **Name Themes** - `[{"match":"heal|cure","theme":"heal"}]`. A regex on the skill name, used when the skill
  has no element.
- **Advanced Overrides** - JSON merged over everything else, using the plugin's internal setting names.

### Logging
- **Debug** - extra detail in the battle log.
- **Battle Log** - keeps a rolling log of recent challenges and dodge presses in `Saves/qtb-log.json`.
- **Battle Log Entries** - how many entries to keep.

## Challenge types

Use these as `"type"` in the tables or in a skill tag. All numbers are optional.

| type | what the player does | options (default) |
| --- | --- | --- |
| `timing` | Enter while the marker is in the zone | `duration` (1.2 s), `zone` (0.16), `center` (0.75) |
| `greenlight` | wait while orbs show an X; Enter the moment a green GO! shows (early = Oops, faster = better) | `window` (1.0 s to react), `minWait` (0.7), `maxWait` (2.0) |
| `sequence` | press the shown keys in order | `length` (4), `duration` (2.2), `keys` (e.g. `["W","A","S"]`) |
| `mash` | press a key as many times as possible | `count` goal (8), `duration` (2.5), `key` (ENTER), `overload` (none) |
| `hold` | hold Enter, release in the zone | `duration` (1.5), `zone` (0.16), `center` (0.8) |
| `aim` | hold Enter to raise an arc, release when it lands on the enemy | `duration` (1.75), `tolerance` (0.1) |
| `combo` | several rings in a row; grade is the average | `count` (3), `duration` (0.6), `tolerance` (0.12) |
| `crosshair` | Enter when the sight locks on the enemy | `duration` (1.1), `tolerance` (0.1) |

`ring` (older name) still works in saved settings; `crosshair` is the same game and looks better.
Every type also accepts `"theme"` (for example `"theme":"fire"`) to force a look.
`overload` on `mash` is a multiple of the goal: pressing more than that many times ruins the attack.

## Skill tags

For one-off changes, add a **Script** effect to the skill (Skills > Effects) and put a comment in it:

```
// qtb hold
// qtb crosshair theme=fire tolerance=0.08
// qtb {"type":"sequence","length":5}
// qtb off
// qtb
```

- A type name picks that challenge. `name=value` pairs set options.
- `off` removes the challenge from this skill.
- A bare `// qtb` turns the challenge on using the defaults, which is how you add one to a buff or cure skill.
- A tag beats every table above.

## Command

**Set enabled** - to turn the plugin off mid-game (for cutscene battles): Run a Command > Structure > Plugin >
Quick Time Battle > Set enabled, value OFF. Set it back to ON afterwards. This stops both the challenges and the dodge.

## Tester

`Tester.html` runs the plugin's real `code.js` on a mock battle. It changes nothing until you save.

1. Open `Tester.html` in Chrome or Edge. Click **Open project folder** and pick your RPG Paper Maker project folder (the one with `heroes.json`). Browsers cannot look up folders on their own, so this is asked once; after that the tester reconnects by itself (or with one click).
2. **Characters tab**: pick a Character (fills their class, which you can change). Each has a Default option: *Everyone* and *Any class* edit the global settings.
   - **Character section**: the minigame for that character's basic attacks.
   - **Class section**: the minigame for every skill the class can learn. Shows who else shares the class.
   - **Additional skills**: any other skill the character uses.
   - Each minigame list has *Default (inherit)* and *No minigame*. *Same as...* copies the section above and keeps following it.
3. **Skills tab**: pick one skill. Set its minigame, settings and look (theme). Shows the database element. A skill's own setting applies to every character and replaces per-character settings for that skill. *Look for each element* sets the theme per element.
4. Click a section to run it on the stage. Use *Preview skill* to pick which skill of that section runs. Change anything and the stage re-runs. Play with W A S D / Enter. **Dodge test** runs an enemy attack against your dodge settings.
5. **Settings tab**: every other plugin setting. Ranged Hero slots: enter the hero ID the variable holds, then preview a skill with Run on Attack.
6. **Save to plugin** writes `details.json` and keeps `details.backup.json`. Then close the plugin window in the editor without pressing OK, reopen it, and restart the engine.

The last change wins when two places set the same skill. The tester warns before a change overrides other settings.

**Undo** (or Ctrl+Z) steps back one change. **Revert** drops all unsaved changes. The Settings tab has **Reset all settings to the defaults**; Undo still works after it.

Without Chrome or Edge, use **Load details.json** and **Download details.json** instead (IDs are typed in).

## Ranged characters

In the Tester, tick **Ranged Character** under a character's name. That character never runs up to the enemy, even for skills with Run on Attack. It is saved as `"ranged": true` in Hero Challenges. The older Ranged Hero variable slots (Settings) still work. To keep them in sync with the checkbox, pick the character's **Instance ID variable** (the Variable chosen when they join the party; Lucas is Variable 1) from the popup under the checkbox. The checkbox then reads and updates those slots too.

## Updating

Settings live in `details.json`, so copying a whole new folder over yours resets them. To update safely, replace only `code.js` (and `Tester.html`, `README.md`, `FULL_INSTRUCTIONS.md`). If a new version adds settings, open the plugin window or the Tester: missing settings use their defaults. The Tester saves a `details.backup.json` before each save.

## Notes

- Enemy attacks are never challenges; they use the dodge.
- A confused hero who attacks a teammate gets no challenge (no bonus damage to allies). Healing skills aimed at allies still get one.
- A hero set as ranged still plays their normal attack animation, just without running to the enemy.
- If something looks wrong, turn on **Debug** and check `Saves/qtb-log.json`.
