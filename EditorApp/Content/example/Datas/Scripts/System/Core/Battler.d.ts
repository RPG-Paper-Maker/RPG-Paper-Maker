import { Player } from "./Player.js";
import { Enum } from "../Common/index.js";
import { Frame } from "./Frame.js";
import { ProgressionTable } from "../System/index.js";
import { Camera } from "./Camera.js";
import { Position } from "./Position.js";
import { Vector3 } from "./Vector3.js";
import { Vector2 } from "./Vector2.js";
import { Status } from "./Status.js";
import { Animation } from "./Animation.js";
import { Rectangle } from "./Rectangle.js";
/** @class
 *  A battler in a battle (ally or ennemy).
 *  @param {Player} player - The character properties
 *  @param {Vector3} position - The battler position
 *  @param {Camera} camera - the camera associated to the battle
 */
declare class Battler {
    static OFFSET_SELECTED: number;
    static TIME_MOVE: number;
    static TOTAL_TIME_DAMAGE: number;
    player: Player;
    position: Vector3;
    arrowPosition: Vector2;
    damagePosition: Vector2;
    topPosition: Vector2;
    midPosition: Vector2;
    botPosition: Vector2;
    active: boolean;
    frame: Frame;
    frameAttacking: Frame;
    frameArrow: Frame;
    step: Enum.BattlerStep;
    lastStep: Enum.BattlerStep;
    width: number;
    height: number;
    selected: boolean;
    lastCommandIndex: number;
    lastCommandOffset: number;
    lastSkillIndex: number;
    lastSkillOffset: number;
    lastItemIndex: number;
    lastItemOffset: number;
    itemsNumbers: any[];
    progressionAllyFront: ProgressionTable;
    progressionAllyBack: ProgressionTable;
    progressionEnemyFront: ProgressionTable;
    progressionEnemyBack: ProgressionTable;
    timerMove: number;
    timeDamage: number;
    mesh: THREE.Mesh;
    topLeftPosition: Vector3;
    botRightPosition: Vector3;
    upPosition: Vector3;
    halfPosition: Vector3;
    rect: Rectangle;
    moving: boolean;
    attacking: boolean;
    damages: number;
    isDamagesMiss: boolean;
    isDamagesCritical: boolean;
    currentStatusAnimation: Animation;
    lastStatus: Status;
    lastStatusHealed: Status;
    lastTarget: Battler;
    constructor(player: Player, position?: Position, vect?: Vector3, camera?: Camera);
    /**
     *  Check at least one affected status contains the following restriction.
     *  @param {Enum.StatusRestrictionsKind} restriction - The kind of restriction
     *  @returns {boolean}
     */
    containsRestriction(restriction: Enum.StatusRestrictionsKind): boolean;
    /**
     *  Check if mouse is inside the battler rectangle.
     *  @param {number} x
     *  @param {number} y
     *  @returns {boolean}
     */
    isInside(x: number, y: number): boolean;
    /**
     *  Set the selected state.
     *  @param {boolean} selected - Indicate if the battler is selected
     */
    setSelected(selected: boolean): void;
    /**
     *  Set the active state.
     *  @param {boolean} active - Indicate if the battler is active
     */
    setActive(active: boolean): void;
    /**
     *  Set battler step as attacking.
     */
    setAttacking(): void;
    /**
     *  Check if the battler is attacking (or skill, item, escape).
     *  @returns {boolean}
     */
    isStepAttacking(): boolean;
    /**
     *  Check if the battler is attacking and the frames is currently run.
     *  @returns {boolean}
     */
    isAttacking(): boolean;
    /**
     *  Set battler step as using a skill.
     */
    setUsingSkill(): void;
    /**
     *  Set battler step as using an item.
     */
    setUsingItem(): void;
    /**
     *  Set battler step as escaping.
     */
    setEscaping(): void;
    /**
     *  Set battler step as victory.
     */
    setVictory(): void;
    /**
     *  Update battler step if is dead, attacked if attacked.
     *  @param {boolean} attacked - Indicate if the battler is attacked
     *  @param {Player} user - The attack / skill / item user
     */
    updateDead(attacked: boolean, user?: Player): void;
    /**
     *  Update the battler.
     */
    update(angle: number): void;
    /**
     *  Update the selected move progress.
     */
    updateSelected(): void;
    /**
     *  Update the frame.
     */
    updateFrame(): void;
    /**
     *  Update the frame.
     */
    updateArrow(): void;
    /**
     *  Update the damages position.
     */
    updateDamages(): void;
    /**
     *  Update attacking step frame.
     */
    updateAttacking(): void;
    /**
     *  Update positions to screen.
     */
    updatePositions(): void;
    /**
     *  Update the arrow position.
     */
    updateArrowPosition(camera: Camera): void;
    /**
     *  Update current status animation.
     *  @param {Core.Status} previousFirst - The previous status animation.
     */
    updateAnimationStatus(previousFirst?: Status): void;
    /**
     *  Add the battler to scene.
     */
    addToScene(): void;
    /**
     *  Remove battler from scene.
     */
    removeFromScene(): void;
    /**
     *  Update the UVs coordinates according to frame and orientation.
     */
    updateUVs(): void;
    /**
     *  Add a new status and check if already in.
     *  @param {number} id - The status id to add
     *  @returns {Core.Status}
     */
    addStatus(id: number): Status;
    /**
     *  Remove the status.
     *  @param {number} id - The status id to remove
     *  @returns {Core.Status}
     */
    removeStatus(id: number): Status;
    /**
     *  Update status step (first priority status displayed).
     */
    updateStatusStep(): void;
    /**
     *  Draw the arrow to select this battler.
     */
    drawArrow(): void;
    /**
     *  Draw the damages on top of the battler.
     */
    drawDamages(): void;
    /**
     *  Draw the status on top of the battler.
     */
    drawStatus(): void;
    /**
     *  Draw the status animation
     */
    drawStatusAnimation(): void;
    /**
     *  Draw the HUD specific to battler.
     */
    drawHUD(): void;
}
export { Battler };
