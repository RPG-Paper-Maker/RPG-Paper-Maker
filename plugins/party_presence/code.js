const pluginName = 'party_presence';
const inject = Manager.Plugins.inject;
const Game = Core.Game;
const Interpreter = Common.Interpreter;
const Platform = Common.Platform;
const Position = Core.Position;
const CharacterKind = Common.CHARACTER_KIND;
const Battler = Core.Battler;

// Start code here

inject(
	Scene.BattleInitialize,
	'initializeAlliesBattlers',
	function () {
		let max = Manager.Plugins.getParameter(pluginName, 'Battle Party Size');

		let l = Game.current.teamHeroes.length;
		if (l > max) l = max;

		console.log('Works!');

		this.battle.battlers[CharacterKind.HERO] = new Array(l);
		this.battle.players[CharacterKind.HERO] = new Array(l);
		this.battle.graphicPlayers[CharacterKind.HERO] = new Array(l);
		let position, player, battler, center, offset;
		for (let i = 0; i < l; i++) {
			// Battlers
			center = Interpreter.evaluate(Data.BattleSystems.heroesBattlersCenterOffset.getValue());
			if (!(center instanceof THREE.Vector3)) {
				Platform.showErrorMessage('Heroes battlers center offset incorrect return: ' + center);
			}
			offset = Interpreter.evaluate(Data.BattleSystems.heroesBattlersOffset.getValue(), {
				additionalName: 'i',
				additionalValue: i,
			});
			if (!(offset instanceof THREE.Vector3)) {
				Platform.showErrorMessage('Heroes battlers offset incorrect return: ' + center);
			}
			position = Game.current.heroBattle.position.clone().add(center).add(offset);
			player = Game.current.teamHeroes[i];
			battler = new Battler(player, false, Position.createFromVector3(position), position, this.battle.camera);
			battler.updateDead(false);
			player.battler = battler;
			battler.updateHidden(false);
			this.battle.battlers[CharacterKind.HERO][i] = battler;
			this.battle.players[CharacterKind.HERO][i] = player;
			// Graphic player
			this.battle.graphicPlayers[CharacterKind.HERO][i] = new Graphic.Player(player);
		}
	},
	false,
	true,
	false,
);
