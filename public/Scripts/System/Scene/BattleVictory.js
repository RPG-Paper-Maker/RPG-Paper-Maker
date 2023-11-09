/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Scene, Graphic, Manager, Datas, System } from "../index.js";
import { Enum, ScreenResolution, Platform } from '../Common/index.js';
var CharacterKind = Enum.CharacterKind;
var LootKind = Enum.LootKind;
import { WindowBox, Item, Game } from '../Core/index.js';
// -------------------------------------------------------
//
//  CLASS BattleVictory
//
//      SubStep 0 : Victory message
//      SubStep 1 : Experience update
//      SubStep 2 : Level up
//      SubStep 3 : End transition
//      SubStep 4 : Defeat message
//
// -------------------------------------------------------
class BattleVictory {
    constructor(battle) {
        this.battle = battle;
    }
    /**
     *  Initialize step.
     */
    initialize() {
        // Remove status if release at end of battles
        let i, l, battler, s;
        for (battler of this.battle.battlers[CharacterKind.Hero]) {
            s = battler.player.status[0];
            battler.player.removeEndBattleStatus();
            battler.updateStatusStep();
            battler.updateAnimationStatus(s);
        }
        // If loosing, directly go to end transition
        if (!this.battle.winning) {
            this.battle.windowTopInformations.content.setText(Datas.Languages.extras.defeat.name());
            this.battle.subStep = 4;
            return;
        }
        // Change information bar content
        this.battle.windowTopInformations.content.setText(Datas.Languages.extras.victory.name());
        // Rewards
        this.prepareRewards();
        let id;
        for (id in this.battle.currencies) {
            Game.current.currencies[id] += this.battle.currencies[id];
            if (this.battle.currencies[id] > 0) {
                Game.current.currenciesEarned[id] += this.battle.currencies[id];
            }
            else {
                Game.current.currenciesUsed[id] -= this.battle.currencies[id];
            }
        }
        for (i = 0, l = this.battle.loots.length; i < l; i++) {
            for (id in this.battle.loots[i]) {
                this.battle.loots[i][id].addItems();
            }
        }
        // Heroes
        let xp;
        for (battler of this.battle.battlers[CharacterKind.Hero]) {
            battler.setVictory();
            xp = this.battle.xp;
            if (battler.player.experienceGain[0]) {
                xp *= battler.player.experienceGain[0].multiplication;
                xp += (this.battle.xp * battler.player.experienceGain[0].addition) / 100;
            }
            battler.player.totalRemainingXP = xp;
        }
        // Time progression settings
        this.battle.time = new Date().getTime();
        this.battle.finishedXP = false;
        this.battle.user = null;
        this.battle.priorityIndex = 0;
        // Music
        if (Game.current.victoryMusic.songID.getValue() !== -1) {
            Game.current.victoryMusic.playMusic();
        }
        // Windows
        let w = 200 + WindowBox.SMALL_PADDING_BOX[0] + WindowBox.SMALL_PADDING_BOX[2];
        let h = this.battle.lootsNumber * 30 + WindowBox.SMALL_PADDING_BOX[1] + WindowBox.SMALL_PADDING_BOX[3];
        this.battle.windowLoots = new WindowBox(ScreenResolution.SCREEN_X - 20 - w, ScreenResolution.SCREEN_Y - 20 - h, w, h, {
            content: new Graphic.Loots(this.battle.loots, this.battle.lootsNumber),
            padding: WindowBox.SMALL_PADDING_BOX,
        });
    }
    /**
     *  Prepare the rewards (xp, currencies, loots).
     */
    prepareRewards() {
        // Experience + currencies + loots
        this.battle.xp = 0;
        this.battle.currencies = {};
        this.battle.loots = [];
        this.battle.loots[LootKind.Item] = {};
        this.battle.loots[LootKind.Weapon] = {};
        this.battle.loots[LootKind.Armor] = {};
        this.battle.lootsNumber = 0;
        let battlers = this.battle.battlers[CharacterKind.Monster];
        // Calculate rewards
        let i, j, l, m, player, id, list, loots, currencies, hero, baseCurrency, currency;
        for (i = 0, l = battlers.length; i < l; i++) {
            player = battlers[i].player;
            this.battle.xp += player.getRewardExperience();
            currencies = player.getRewardCurrencies();
            for (id in currencies) {
                baseCurrency = currencies[id];
                currency = baseCurrency;
                // Get team currency bonus
                for (hero of this.battle.battlers[CharacterKind.Hero]) {
                    if (hero.player.currencyGain[id]) {
                        currency *= hero.player.currencyGain[id].multiplication;
                    }
                }
                for (hero of this.battle.battlers[CharacterKind.Hero]) {
                    if (hero.player.currencyGain[id]) {
                        currency += (baseCurrency * hero.player.currencyGain[id].addition) / 100;
                    }
                }
                if (this.battle.currencies.hasOwnProperty(id)) {
                    this.battle.currencies[id] += currency;
                }
                else {
                    this.battle.currencies[id] = currency;
                }
            }
            list = player.getRewardLoots();
            for (j = 0, m = list.length; j < m; j++) {
                loots = list[j];
                for (id in loots) {
                    if (this.battle.loots[j].hasOwnProperty(id)) {
                        this.battle.loots[j][id].nb += loots[id].nb;
                    }
                    else {
                        this.battle.loots[j][id] = loots[id];
                        this.battle.lootsNumber++;
                    }
                }
            }
        }
        for (i = 0, l = this.battle.loots.length; i < l; i++) {
            for (id in this.battle.loots[i]) {
                this.battle.loots[i][id] = new Item(i, parseInt(id), this.battle.loots[i][id].nb);
            }
        }
        // Prepare graphics
        this.battle.graphicRewardTop = new Graphic.RewardsTop(this.battle.xp, this.battle.currencies);
    }
    /**
     *  Update the team progression xp.
     */
    updateTeamXP() {
        this.battle.finishedXP = true;
        let battler, player, y, h;
        for (let i = this.battle.priorityIndex, l = this.battle.battlers[CharacterKind.Hero].length; i < l; i++) {
            battler = this.battle.battlers[CharacterKind.Hero][i];
            player = battler.player;
            if (!player.isExperienceUpdated()) {
                if (player.updateExperience()) {
                    // Level up
                    this.battle.user = battler;
                    player.levelingUp = true;
                    this.battle.finishedXP = false;
                    this.battle.windowExperienceProgression.content.updateExperience();
                    this.battle.priorityIndex = i + (1 % Game.current.teamHeroes.length);
                    this.pauseTeamXP();
                    this.battle.finishedXP = false;
                    player.stepLevelUp = 0;
                    this.battle.windowStatisticProgression.content = new Graphic.StatisticProgression(this.battle.user.player);
                    h =
                        this.battle.windowStatisticProgression.content.getHeight() +
                            WindowBox.HUGE_PADDING_BOX[0] +
                            WindowBox.HUGE_PADDING_BOX[2];
                    this.battle.windowStatisticProgression.setH(h);
                    Datas.BattleSystems.battleLevelUp.playSound();
                    this.battle.subStep = 2;
                    return;
                }
                this.battle.finishedXP = false;
            }
        }
        this.battle.windowExperienceProgression.content.updateExperience();
        this.battle.priorityIndex = 0;
    }
    /**
     *  Pause the team progression xp.
     */
    pauseTeamXP() {
        for (let battler of this.battle.battlers[CharacterKind.Hero]) {
            battler.player.pauseExperience();
        }
    }
    /**
     *  Unpause the team progression xp.
     */
    unpauseTeamXP() {
        for (let battler of this.battle.battlers[CharacterKind.Hero]) {
            battler.player.unpauseExperience();
        }
        this.battle.user.player.updateRemainingXP(Scene.Battle.TIME_PROGRESSION_XP);
    }
    /**
     *  Play map music.
     */
    playMapMusic() {
        this.battle.musicMap.playMusic(this.battle.musicMapTime, 0);
        Manager.Songs.initializeProgressionMusic(0, this.battle.musicMap.volume.getValue(), 0, Scene.Battle.TIME_LINEAR_MUSIC_START);
    }
    /**
     *  Prepare the end transition.
     */
    prepareEndTransition() {
        this.battle.transitionEnded = false;
        Manager.Songs.initializeProgressionMusic(System.PlaySong.currentPlayingMusic.volume.getValue(), 0, 0, Scene.Battle.TIME_LINEAR_MUSIC_END);
        this.battle.subStep = 3;
        this.battle.time = new Date().getTime();
    }
    /**
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey, options = {}) {
        switch (this.battle.subStep) {
            case 1:
                if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                    if (this.battle.finishedXP) {
                        this.prepareEndTransition();
                    }
                    else {
                        // Pass xp
                        for (let battler of this.battle.battlers[CharacterKind.Hero]) {
                            battler.player.passExperience();
                            battler.player.updateObtainedExperience();
                        }
                    }
                }
                break;
            case 2:
                if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                    if (this.battle.user.player.stepLevelUp === 0) {
                        this.battle.user.player.stepLevelUp = 1;
                        (this.battle.windowStatisticProgression.content).updateStatisticProgression();
                    }
                    else {
                        this.battle.user.player.levelingUp = false;
                        this.unpauseTeamXP();
                        this.battle.subStep = 1;
                    }
                    Manager.Stack.requestPaintHUD = true;
                }
                break;
            case 4:
                this.prepareEndTransition();
                if (!this.battle.winning) {
                    this.battle.gameOver();
                }
                break;
        }
    }
    /**
     *  Update the battle.
     */
    update() {
        switch (this.battle.subStep) {
            case 0:
                if (new Date().getTime() - this.battle.time >= Scene.Battle.TIME_END_WAIT) {
                    this.battle.time = new Date().getTime();
                    this.battle.windowTopInformations.content = this.battle.graphicRewardTop;
                    for (let battler of this.battle.battlers[CharacterKind.Hero]) {
                        battler.player.updateRemainingXP(Scene.Battle.TIME_PROGRESSION_XP);
                    }
                    Manager.Stack.requestPaintHUD = true;
                    this.battle.subStep = 1;
                }
                break;
            case 1:
                this.updateTeamXP();
                Manager.Stack.requestPaintHUD = true;
                break;
            case 2:
                break;
            case 3:
                Manager.Stack.requestPaintHUD = true;
                if (Manager.Songs.isProgressionMusicEnd && this.battle.transitionEnded) {
                    if (this.battle.winning) {
                        this.battle.win();
                    }
                    else {
                        this.battle.endBattle();
                    }
                    if (Platform.MODE_TEST === Platform.MODE_TEST_BATTLE_TROOP) {
                        Platform.quit();
                    }
                }
                // Transition None
                if (this.battle.transitionEnd === 0) {
                    this.battle.sceneMap.updateBackgroundColor();
                }
                // Transition zoom
                if (this.battle.transitionEnd === 2) {
                    let offset;
                    if (!this.battle.transitionZoom) {
                        offset =
                            (Scene.Battle.START_CAMERA_DISTANCE / this.battle.cameraDistance) *
                                Scene.Battle.TRANSITION_ZOOM_TIME;
                        this.battle.camera.distance =
                            (1 -
                                (new Date().getTime() - this.battle.time - offset) /
                                    (Scene.Battle.TRANSITION_ZOOM_TIME - offset)) *
                                this.battle.cameraDistance;
                        if (this.battle.camera.distance <= Scene.Battle.START_CAMERA_DISTANCE) {
                            this.battle.camera.distance = Scene.Battle.START_CAMERA_DISTANCE;
                            this.battle.transitionZoom = true;
                            this.battle.sceneMap.updateBackgroundColor();
                            this.playMapMusic();
                            this.battle.time = new Date().getTime();
                        }
                        this.battle.camera.update();
                        return;
                    }
                    if (this.battle.sceneMap.camera.distance < this.battle.mapCameraDistance) {
                        offset =
                            (Scene.Battle.START_CAMERA_DISTANCE / this.battle.mapCameraDistance) *
                                Scene.Battle.TRANSITION_ZOOM_TIME;
                        this.battle.sceneMap.camera.distance =
                            ((new Date().getTime() - this.battle.time - offset) /
                                (Scene.Battle.TRANSITION_ZOOM_TIME - offset)) *
                                this.battle.mapCameraDistance;
                        if (this.battle.sceneMap.camera.distance >= this.battle.mapCameraDistance) {
                            this.battle.sceneMap.camera.distance = this.battle.mapCameraDistance;
                        }
                        else {
                            this.battle.sceneMap.camera.update();
                            return;
                        }
                        this.battle.sceneMap.camera.update();
                    }
                }
                // Transition fade
                if (this.battle.transitionEnd === 1) {
                    if (!this.battle.transitionColor) {
                        this.battle.transitionColorAlpha += Scene.Battle.TRANSITION_COLOR_VALUE;
                        if (this.battle.transitionColorAlpha >= 1) {
                            this.battle.transitionColorAlpha = 1;
                            this.battle.transitionColor = true;
                            this.battle.timeTransition = new Date().getTime();
                            this.battle.sceneMap.updateBackgroundColor();
                        }
                        return;
                    }
                    if (new Date().getTime() - this.battle.timeTransition < Scene.Battle.TRANSITION_COLOR_END_WAIT) {
                        return;
                    }
                    else {
                        if (this.battle.timeTransition !== -1) {
                            this.battle.timeTransition = -1;
                            this.playMapMusic();
                        }
                    }
                    if (this.battle.transitionColorAlpha > 0) {
                        this.battle.transitionColorAlpha -= Scene.Battle.TRANSITION_COLOR_VALUE;
                        if (this.battle.transitionColorAlpha <= 0) {
                            this.battle.transitionColorAlpha = 0;
                        }
                        return;
                    }
                }
                this.battle.transitionEnded = true;
                break;
        }
    }
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressedStep(key) {
        this.action(true, { key: key });
    }
    /**
     *  Handle key released.
     *  @param {number} key - The key ID
     */
    onKeyReleasedStep(key) { }
    /**
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key) {
        return true;
    }
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     */
    onKeyPressedAndRepeatStep(key) {
        return true;
    }
    /**
     *  @inheritdoc
     */
    onMouseUpStep(x, y) {
        this.action(false, { x: x, y: y });
    }
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep() {
        if (this.battle.subStep !== 3) {
            this.battle.windowTopInformations.draw();
        }
        if (this.battle.subStep === 1 || this.battle.subStep === 2) {
            this.battle.windowExperienceProgression.draw();
            if (this.battle.lootsNumber > 0) {
                this.battle.windowLoots.draw();
            }
        }
        switch (this.battle.subStep) {
            case 2:
                this.battle.windowStatisticProgression.draw();
                break;
            case 3:
                // Transition fade
                if (this.battle.transitionEnd === 1) {
                    Platform.ctx.fillStyle =
                        'rgba(' +
                            this.battle.transitionEndColor.red +
                            ',' +
                            this.battle.transitionEndColor.green +
                            ',' +
                            this.battle.transitionEndColor.blue +
                            ',' +
                            this.battle.transitionColorAlpha +
                            ')';
                    Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
                }
                break;
        }
    }
}
export { BattleVictory };
