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
- **Defense Window Frames** - how many frames (60 per second) before the hit a press counts. Bigger is easier.
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
- **Class Challenges** - `{"3":{"default":{"type":"ring"},"skills":{"12":{"type":"mash"}}}}` (class 3).
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
| `ring` | Enter when the shrinking ring matches the target | `duration` (1.1), `tolerance` (0.1) |
| `sequence` | press the shown keys in order | `length` (4), `duration` (2.2), `keys` (e.g. `["W","A","S"]`) |
| `mash` | press a key as many times as possible | `count` goal (12), `duration` (2), `key` (ENTER), `overload` (none) |
| `hold` | hold Enter, release in the zone | `duration` (1.5), `zone` (0.16), `center` (0.8) |
| `aim` | hold Enter to raise an arc, release when it lands on the enemy | `duration` (1.75), `tolerance` (0.1) |
| `combo` | several rings in a row; grade is the average | `count` (3), `duration` (0.6), `tolerance` (0.12) |
| `crosshair` | Enter when the sight locks on the enemy | `duration` (1.1), `tolerance` (0.1) |

Every type also accepts `"theme"` (for example `"theme":"fire"`) to force a look.
`overload` on `mash` is a multiple of the goal: pressing more than that many times ruins the attack.

## Skill tags

For one-off changes, add a **Script** effect to the skill (Skills > Effects) and put a comment in it:

```
// qtb hold
// qtb ring theme=fire tolerance=0.08
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

## Notes

- Enemy attacks are never challenges; they use the dodge.
- A hero set as ranged still plays their normal attack animation, just without running to the enemy.
- If something looks wrong, turn on **Debug** and check `Saves/qtb-log.json`.
