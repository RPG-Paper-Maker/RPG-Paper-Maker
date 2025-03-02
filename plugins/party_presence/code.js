import { RPM } from "../path.js"

const pluginName = "party_presence";
const inject = RPM.Manager.Plugins.inject;
const Game = RPM.Core.Game;
const Core = RPM.Core;
const Interpreter = RPM.Common.Interpreter;
const Platform = RPM.Common.Platform;
const Datas = RPM.Datas;
const Position = RPM.Core.Position;
const CharacterKind = RPM.Common.Enum.CharacterKind;
const Battler = RPM.Core.Battler;
const Graphic = RPM.Graphic;

// Start code here

inject(RPM.Scene.BattleInitialize,"initializeAlliesBattlers",function(){


    let max = RPM.Manager.Plugins.getParameter(pluginName, "Battle Party Size");

    let l = Game.current.teamHeroes.length;
    if(l > max)
        l = max;

    console.log("Works!")

    this.battle.battlers[CharacterKind.Hero] = new Array(l);
    this.battle.players[CharacterKind.Hero] = new Array(l);
    this.battle.graphicPlayers[CharacterKind.Hero] = new Array(l);
    let position, player, battler, center, offset;
    for (let i = 0; i < l; i++) {
        // Battlers
        center = Interpreter.evaluate(Datas.BattleSystems.heroesBattlersCenterOffset
            .getValue());
        if (!(center instanceof Core.Vector3)) {
            Platform.showErrorMessage("Heroes battlers center offset incorrect return: " + center);
        }
        offset = Interpreter.evaluate(Datas.BattleSystems.heroesBattlersOffset
            .getValue(), { additionalName: "i", additionalValue: i });
        if (!(offset instanceof Core.Vector3)) {
            Platform.showErrorMessage("Heroes battlers offset incorrect return: " + center);
        }
        position = Game.current.heroBattle.position.clone().add(center).add(offset);
        player = Game.current.teamHeroes[i];
        battler = new Battler(player, false, Position.createFromVector3(position), position, this.battle.camera);
        battler.updateDead(false);
        player.battler = battler;
        battler.updateHidden(false);
        this.battle.battlers[CharacterKind.Hero][i] = battler;
        this.battle.players[CharacterKind.Hero][i] = player;
        // Graphic player
        this.battle.graphicPlayers[CharacterKind.Hero][i] = new Graphic
            .Player(player);

        
    }

},false,true,false);