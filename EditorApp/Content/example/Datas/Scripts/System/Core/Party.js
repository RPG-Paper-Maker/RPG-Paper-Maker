import { Scene } from "../index.js";
import { Enum } from "../Common/index.js";
/**
 * The class who handles the heroes party.
 *
 * @class Party
 */
class Party {
    constructor() {
    }
    /**
     * Return all members of the team. (including hidden and reserve)
     *
     * @return {*}  {Player[]}
     * @memberof Party
     */
    allMembers() {
        let heroes = [];
        return heroes.concat(this.teamHeroes, this.hiddenHeroes, this.reserveHeroes);
    }
    teamMembers() {
        return this.teamHeroes;
    }
    reserveMembers() {
        return this.reserveHeroes;
    }
    hiddenMembers() {
        return this.hiddenHeroes;
    }
    /**
     * Return all the aliveMembers (including hidden and reserve)
     */
    aliveMembers() {
        return this.allMembers().filter(hero => !hero.isDead());
    }
    /**
     * Return all the alive team members.
     *
     * @return {*}  {Player[]}
     * @memberof Party
     */
    aliveTeamMembers() {
        return this.teamHeroes.filter(hero => !hero.isDead());
    }
    /**
     * return all the dead members (including hidden and reserve)
     *
     * @return {*}  {Player[]}
     * @memberof Party
     */
    deadMembers() {
        return this.allMembers().filter(hero => hero.isDead());
    }
    teamDeadMembers() {
        return this.teamHeroes.filter(hero => hero.isDead());
    }
    reserveDeadMembers() {
        return this.reserveHeroes.filter(hero => hero.isDead());
    }
    hiddenDeadMembers() {
        return this.hiddenHeroes.filter(hero => hero.isDead());
    }
    /**
     * Return the first member of the battle party.
     */
    leader() {
        return this.teamHeroes[0];
    }
    /**
     * Return the max number of members a party can be
     * @todo make the max party size increasable in editor?
     * @return {*}  {number}
     * @memberof Party
     */
    maxMembers() {
        return 4;
    }
    addToParty(id, kind) {
    }
    removeFromParty(id, kind) { }
    swapTeam(teamA, teamB) {
        let a = this.allocateTeamGroup(teamA.team)[teamA.id];
        let b = this.allocateTeamGroup(teamB.team)[teamB.id];
        this.allocateTeamGroup(teamA.team)[teamA.id] = b;
        this.allocateTeamGroup(teamB.team)[teamB.id] = a;
    }
    allocateTeamGroup(team) {
        switch (team) {
            case Enum.GroupKind.Team:
                return this.teamHeroes;
                break;
            case Enum.GroupKind.Reserve:
                return this.reserveHeroes;
                break;
            case Enum.GroupKind.Hidden:
                return this.hiddenHeroes;
            case Enum.GroupKind.Troop:
                return Scene.Map.current.players[Enum.CharacterKind.Monster];
            default:
                throw new Error("The team is unspecified");
                break;
        }
    }
    /**
     * Return all the currencies that a party has.
     *
     * @return {*}  {number}
     * @memberof Party
     */
    currencies() {
        return 10;
    }
    /**
     * return a specific currency.
     * @param id
     */
    currency(id) {
        return 10;
    }
    /**
     * Return the maximum currency that a party can have.
     * @todo work with the new currencies system?
     *
     * @return {*}  {number}
     * @memberof Party
     */
    maxCurrencies() {
        return 9999999999;
    }
}
export { Party };
