import { Enum } from "../Common/index.js";
import { Player } from "./Player.js";
/**
 * The class who handles the heroes party.
 *
 * @class Party
 */
declare class Party {
    /**
     * the heros who are in the party and are used in battle.
     *
     * @private
     * @type {Player[]}
     * @memberof Party
     */
    private teamHeroes;
    /**
     * The heros who temporally left the party.
     *
     * @private
     * @type {Player[]}
     * @memberof Party
     */
    private hiddenHeroes;
    /**
     * the heros who are in the reserve party (not in battle).
     *
     * @private
     * @type {Player[]}
     * @memberof Party
     */
    private reserveHeroes;
    constructor();
    /**
     * Return all members of the team. (including hidden and reserve)
     *
     * @return {*}  {Player[]}
     * @memberof Party
     */
    allMembers(): Player[];
    teamMembers(): Player[];
    reserveMembers(): Player[];
    hiddenMembers(): Player[];
    /**
     * Return all the aliveMembers (including hidden and reserve)
     */
    aliveMembers(): Player[];
    /**
     * Return all the alive team members.
     *
     * @return {*}  {Player[]}
     * @memberof Party
     */
    aliveTeamMembers(): Player[];
    /**
     * return all the dead members (including hidden and reserve)
     *
     * @return {*}  {Player[]}
     * @memberof Party
     */
    deadMembers(): Player[];
    teamDeadMembers(): Player[];
    reserveDeadMembers(): Player[];
    hiddenDeadMembers(): Player[];
    /**
     * Return the first member of the battle party.
     */
    leader(): Player;
    /**
     * Return the max number of members a party can be
     * @todo make the max party size increasable in editor?
     * @return {*}  {number}
     * @memberof Party
     */
    maxMembers(): number;
    addToParty(id: number, kind: Enum.GroupKind): void;
    removeFromParty(id: number, kind: Enum.GroupKind): void;
    swapTeam(teamA: structSwap, teamB: structSwap): void;
    private allocateTeamGroup;
    /**
     * Return all the currencies that a party has.
     *
     * @return {*}  {number}
     * @memberof Party
     */
    currencies(): number;
    /**
     * return a specific currency.
     * @param id
     */
    currency(id: string): number;
    /**
     * Return the maximum currency that a party can have.
     * @todo work with the new currencies system?
     *
     * @return {*}  {number}
     * @memberof Party
     */
    maxCurrencies(): number;
}
interface structSwap {
    id: number;
    team: Enum.GroupKind;
}
export { Party };
