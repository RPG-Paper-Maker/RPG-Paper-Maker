import { Battler, WindowBox, WindowChoices, Item, Animation, Player, ReactionInterpreter } from "../Core/index.js";
import { Graphic, System, Scene } from "../index.js";
import { Enum } from "../Common/index.js";
import CharacterKind = Enum.CharacterKind;
import EffectSpecialActionKind = Enum.EffectSpecialActionKind;
import MapTransitionKind = Enum.MapTransitionKind;
import BattleStep = Enum.BattleStep;
import { Map } from "./Map.js";
/** @class
 *  A scene for battling.
 *  @extends SceneGame
 *  @param {number} troopID - Current troop ID that the allies are fighting
 *  @param {boolean} canGameOver - Indicate if there is a win/lose node or not
 *  @param {boolean} canEscape - Indicate if the player can escape this battle
 *  @param {SystemBattleMap} battleMap - The System battle map
 *  @param {Enum.MapTransitionKind} transitionStart - The kind of transition for
 *  the battle start
 *  @param {Enum.MapTransitionKind} transitionEnd - The kind of transition for the
 *  battle end
 *  @param {SystemColor} transitionStartColor - The System color for start
 *  transition
 *  @param {SystemColor} transitionEndColor - The System color for end
 *  transition
 */
declare class Battle extends Map {
    static TRANSITION_ZOOM_TIME: number;
    static TRANSITION_COLOR_VALUE: number;
    static TRANSITION_COLOR_END_WAIT: number;
    static TIME_END_WAIT: number;
    static TIME_PROGRESSION_XP: number;
    static TIME_LINEAR_MUSIC_END: number;
    static TIME_LINEAR_MUSIC_START: number;
    static TIME_ACTION_ANIMATION: number;
    static TIME_ACTION_NO_ANIMATION: number;
    static CAMERA_TICK: number;
    static CAMERA_OFFSET: number;
    static START_CAMERA_DISTANCE: number;
    static WINDOW_PROFILE_WIDTH: number;
    static WINDOW_PROFILE_HEIGHT: number;
    static COMMANDS_NUMBER: number;
    static WINDOW_COMMANDS_WIDTH: number;
    static WINDOW_COMMANDS_SELECT_X: number;
    static WINDOW_COMMANDS_SELECT_Y: number;
    static WINDOW_COMMANDS_SELECT_WIDTH: number;
    static WINDOW_DESCRIPTIONS_X: number;
    static WINDOW_DESCRIPTIONS_Y: number;
    static WINDOW_DESCRIPTIONS_WIDTH: number;
    static WINDOW_DESCRIPTIONS_HEIGHT: number;
    static WINDOW_EXPERIENCE_X: number;
    static WINDOW_EXPERIENCE_Y: number;
    static WINDOW_EXPERIENCE_WIDTH: number;
    static WINDOW_EXPERIENCE_HEIGHT: number;
    static WINDOW_STATS_X: number;
    static WINDOW_STATS_Y: number;
    static WINDOW_STATS_WIDTH: number;
    static WINDOW_STATS_HEIGHT: number;
    static escapedLastBattle: boolean;
    battleInitialize: Scene.BattleInitialize;
    battleStartTurn: Scene.BattleStartTurn;
    battleSelection: Scene.BattleSelection;
    battleAnimation: Scene.BattleAnimation;
    battleEnemyAttack: Scene.BattleEnemyAttack;
    battleEndTurn: Scene.BattleEndTurn;
    battleVictory: Scene.BattleVictory;
    troop: System.Troop;
    canGameOver: boolean;
    canEscape: boolean;
    winning: boolean;
    loadingStep: boolean;
    finishedXP: boolean;
    all: boolean;
    userTarget: boolean;
    forceEndBattle: boolean;
    forceAnAction: boolean;
    forceAnActionUseTurn: boolean;
    kindSelection: CharacterKind;
    selectedUserIndex: number;
    selectedTargetIndex: number;
    skill: System.CommonSkillItem;
    listSkills: Graphic.Skill[];
    listItems: Graphic.Item[];
    effects: System.Effect[];
    battleCommandKind: EffectSpecialActionKind;
    graphicPlayers: Graphic.Player[][];
    graphicRewardTop: Graphic.RewardsTop;
    battlers: Battler[][];
    players: Player[][];
    time: number;
    timeEnemyAttack: number;
    turn: number;
    currentSkill: System.Skill;
    informationText: string;
    oneTimeTroopReactions: boolean[];
    animationUser: Animation;
    animationTarget: Animation;
    action: System.MonsterAction;
    transitionStart: MapTransitionKind;
    transitionStartColor: System.Color;
    transitionEnd: MapTransitionKind;
    transitionEndColor: System.Color;
    transitionColorAlpha: number;
    transitionColor: boolean;
    /**Whether to zoom during a transition */
    transitionZoom: boolean;
    /**Indicate whether the transition has ended */
    transitionEnded: boolean;
    /** Time Transition time */
    timeTransition: number;
    /**What step (initialization, animation, selection, victory) of battle the game is on */
    step: number;
    subStep: number;
    previousStep: number;
    previousSubStep: number;
    indexTroopReaction: number;
    interpreterTroopReaction: ReactionInterpreter;
    mapCameraDistance: number;
    actionDoNothing: System.MonsterAction;
    cameraStep: number;
    cameraTick: number;
    cameraON: boolean;
    cameraDistance: number;
    cameraOffset: number;
    windowTopInformations: WindowBox;
    windowTargetInformations: WindowBox;
    windowUserInformations: WindowBox;
    windowChoicesBattleCommands: WindowChoices;
    windowChoicesSkills: WindowChoices;
    windowChoicesItems: WindowChoices;
    windowSkillDescription: WindowBox;
    windowItemDescription: WindowBox;
    windowExperienceProgression: WindowBox;
    windowStatisticProgression: WindowBox;
    windowLoots: WindowBox;
    musicMap: System.PlaySong;
    musicMapTime: number;
    sceneMap: Scene.Map;
    loots: Record<string, Item>[];
    currencies: Record<string, any>;
    xp: number;
    battleMap: System.BattleMap;
    currentEffectIndex: number;
    currentTargetIndex: number;
    priorityIndex: number;
    lootsNumber: number;
    attackSkill: System.Skill;
    attackingGroup: CharacterKind;
    constructor(troopID: number, canGameOver: boolean, canEscape: boolean, battleMap: System.BattleMap, transitionStart: number, transitionEnd: number, transitionStartColor: System.Color, transitionEndColor: System.Color);
    /**
     *  Load async stuff.
     */
    load(): Promise<void>;
    /**
     *  Get all the possible targets of a skill.
     *  @param {Enum.TargetKind} targetKind
     *  @returns {Player[]}
     */
    getPossibleTargets(targetKind: Enum.TargetKind): Player[];
    /**
     *  Initialize and correct some camera settings for the battle start
     */
    initializeCamera(): void;
    /**
     *  Make the attacking group all actives.
     */
    activeGroup(): void;
    /**
     *  Check if a player is defined (active and not dead).
     *  @param {CharacterKind} kind - Kind of player
     *  @param {number} index - Index in the group
     *  @param {boolean} target - Indicate if the player is a target
     *  @returns {boolean}
     */
    isDefined(kind: CharacterKind, index: number, target?: boolean): boolean;
    /**
     *  Check if all the heroes or enemies are inactive.
     *  @returns {boolean}
     */
    isEndTurn(): boolean;
    /**
     *  Check if all the heroes or enemies are dead
     *  @param {CharacterKind} group - Kind of player
     *  @returns {boolean}
     */
    isGroupDead(group: CharacterKind): boolean;
    /**
     *  Check if all the enemies are dead.
     *  @returns {boolean}
     */
    isWin(): boolean;
    /**
     *  Check if all the heroes are dead.
     *  @returns {boolean}
     */
    isLose(): boolean;
    /**
     *  Transition to game over scene.
     */
    gameOver(): void;
    /**
     *  Win the battle.
     */
    win(): void;
    /**
     *  Win the battle.
     */
    endBattle(): void;
    /**
     *  Switch attacking group.
     */
    switchAttackingGroup(): void;
    /**
     *  Change the step of the battle.
     *  @param {BattleStep} i - Step of the battle
     */
    changeStep(i: BattleStep): void;
    /**
     *  Initialize the current step.
     */
    initialize(): void;
    /**
     *  Update battle according to step.
     */
    update(): void;
    /**
     *  Do camera standard moves.
     */
    moveStandardCamera(): void;
    /**
     *  Handle battle key pressed according to step.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle battle key released according to step.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  Handle battle key pressed repeat according to step.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  Handle battle key pressed and repeat according to step.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  @inheritdoc
     */
    onMouseDown(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseMove(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  Draw the battle 3D scene.
     */
    draw3D(): void;
    /**
     *  Draw the battle HUD according to step.
     */
    drawHUD(): void;
}
export { Battle };
