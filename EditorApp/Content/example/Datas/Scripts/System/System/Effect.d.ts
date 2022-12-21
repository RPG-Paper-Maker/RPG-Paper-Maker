import { Base } from "./Base.js";
import { Enum } from "../Common/index.js";
import EffectKind = Enum.EffectKind;
import DamagesKind = Enum.DamagesKind;
import EffectSpecialActionKind = Enum.EffectSpecialActionKind;
import { System, EventCommand } from "../index.js";
/** @class
 *  An effect of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  effect
 */
declare class Effect extends Base {
    kind: EffectKind;
    damageKind: DamagesKind;
    damageStatisticID: System.DynamicValue;
    damageCurrencyID: System.DynamicValue;
    damageVariableID: number;
    damageFormula: System.DynamicValue;
    isDamagesMinimum: boolean;
    damagesMinimumFormula: System.DynamicValue;
    isDamagesMaximum: boolean;
    damagesMaximumFormula: System.DynamicValue;
    isDamageElement: boolean;
    damageElementID: System.DynamicValue;
    isDamageVariance: boolean;
    damageVarianceFormula: System.DynamicValue;
    isDamageCritical: boolean;
    damageCriticalFormula: System.DynamicValue;
    isDamagePrecision: boolean;
    damagePrecisionFormula: System.DynamicValue;
    isDamageStockVariableID: boolean;
    damageStockVariableID: number;
    isAddStatus: boolean;
    statusID: System.DynamicValue;
    statusPrecisionFormula: System.DynamicValue;
    isAddSkill: boolean;
    addSkillID: System.DynamicValue;
    performSkillID: System.DynamicValue;
    commonReaction: EventCommand.CallACommonReaction;
    specialActionKind: EffectSpecialActionKind;
    scriptFormula: System.DynamicValue;
    isTemporarilyChangeTarget: boolean;
    temporarilyChangeTargetFormula: System.DynamicValue;
    skillItem: System.CommonSkillItem;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the effect.
     *  @param {Record<string, any>} - json Json object describing the effect
     */
    read(json: Record<string, any>): void;
    /**
     *  Execute the effect.
     *  @returns {boolean}
     */
    execute(): boolean;
    /**
     *  Check if the effect is animated.
     *  @returns {boolean}
     */
    isAnimated(): boolean;
    /**
     *  Get the string representation of the effect.
     *  @returns {string}
     */
    toString(): string;
}
export { Effect };
