/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum } from '../Common/index.js';
import { ReactionInterpreter } from '../Core/index.js';
// -------------------------------------------------------
//
//  CLASS BattleEndTurn
//
// -------------------------------------------------------
class BattleEndTurn {
    constructor(battle) {
        this.step = 0;
        this.indexTroopReaction = 0;
        this.interpreter = null;
        this.battle = battle;
    }
    /**
     *  Initialize step.
     */
    initialize() {
        // Each end turn troop reaction
        if (this.step === 0) {
            let reactions = this.battle.troop.reactions;
            let reaction, l;
            for (l = reactions.length; this.indexTroopReaction < l; this
                .indexTroopReaction++) {
                reaction = reactions[this.indexTroopReaction];
                if (reaction.frequency === Enum.TroopReactionFrequencyKind.EachTurnEnd) {
                    // Check conditions
                    if (!reaction.conditions.isValid()) {
                        continue;
                    }
                    this.interpreter = new ReactionInterpreter(null, reaction, null, null);
                    return;
                }
            }
            this.interpreter = null;
            this.step++;
        }
        // End
        if (this.step === 1) {
            this.step = 0;
            this.indexTroopReaction = 0;
            this.battle.activeGroup();
            this.battle.switchAttackingGroup();
            this.battle.changeStep(Enum.BattleStep.StartTurn);
        }
    }
    /**
     *  Update the battle.
     */
    update() {
        // Troop reactions
        if (this.step === 0) {
            this.interpreter.update();
            if (this.interpreter.isFinished()) {
                this.indexTroopReaction++;
                this.initialize();
                return;
            }
        }
    }
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressedStep(key) {
        if (this.interpreter) {
            this.interpreter.onKeyPressed(key);
        }
    }
    /**
     *  Handle key released.
     *  @param {number} key - The key ID
     */
    onKeyReleasedStep(key) {
        if (this.interpreter) {
            this.interpreter.onKeyReleased(key);
        }
    }
    /**
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key) {
        if (this.interpreter) {
            return this.interpreter.onKeyPressedRepeat(key);
        }
        return true;
    }
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeatStep(key) {
        if (this.interpreter) {
            return this.interpreter.onKeyPressedAndRepeat(key);
        }
        return true;
    }
    /**
     *  @inheritdoc
     */
    onMouseDownStep(x, y) {
        if (this.interpreter) {
            this.interpreter.onMouseDown(x, y);
        }
    }
    /**
     *  @inheritdoc
     */
    onMouseMoveStep(x, y) {
        if (this.interpreter) {
            this.interpreter.onMouseMove(x, y);
        }
    }
    /**
     *  @inheritdoc
     */
    onMouseUpStep(x, y) {
        if (this.interpreter) {
            this.interpreter.onMouseUp(x, y);
        }
    }
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep() {
        this.battle.windowTopInformations.draw();
        if (this.interpreter) {
            this.interpreter.drawHUD();
        }
    }
}
export { BattleEndTurn };
