# Quick Time Battle

A plugin for RPG Paper Maker 3.0 that adds Paper Mario-style timing challenges to battles.

- Hero attacks and damaging skills run a short challenge (keyboard only: **W A S D** and **Enter**).
- The grade (Oops, Good, Great, Excellent, Perfect) scales the damage. Perfect forces a critical hit.
- Press any of W A S D / Enter just before an enemy's hit lands to dodge it.
- Each skill can use a different challenge, and each element has its own look and sounds.
- Pixel-art style by default; a smooth style is one setting away.
- No image or sound files. Everything is drawn and synthesized in code.

## Install

1. Copy this folder into your project's `Plugins` folder (it should end up as `Plugins/Quick Time Battle`).
2. Open the project, then Plugins and add Quick Time Battle.
3. Run a battle.

Settings are in the plugin's parameter list. See **FULL_INSTRUCTIONS.md** for every setting, skill tag and command.

## License

MIT (c) Wood (Skinnywoodplank). See LICENSE.

## Changelog

- 1.0.0 Release cleanup, full instructions, generic default tables.
- 0.10.9 Ranged heroes also match the variable's instance ID.
- 0.10.8 Empty Ranged Hero slots no longer cause an error.
- 0.10.7 Plugin command description reworded.
- 0.10.4 Ranged Hero slots 1-8 take a variable.
- 0.10.3 Ranged heroes skip Run on Attack.
- 0.10.2 Enemies dodge missed attacks. Worst grade reads "OOPS...".
- 0.10.1 Easier Perfect on key sequences, bigger ring targets, dodge slide default 1.
- 0.10.0 Pixel UI style (default) and Pixel Size setting.
- 0.9.4 Reticles no longer scale with the beat pulse (jitter fix).
- 0.9.3 Reticles follow the enemy smoothly.
- 0.9.2 "LATE!" notice on a late dodge press.
- 0.9.1 Slower arrow arc, wider dodge window.
- 0.9.0 Redesigned prompts: speech bubbles, arrow keys, confetti.
- 0.8.2 and earlier: challenges, themes, dodge, battle log, prompts over heads.
