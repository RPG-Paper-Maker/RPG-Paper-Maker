const pluginName = 'Autosave';
const inject = Manager.Plugins.inject;

const saveSlot = Manager.Plugins.getParameter(pluginName, 'Slot');
const canOverwrite = Manager.Plugins.getParameter(pluginName, 'Overwrite Autosave');

// Check if the game allows saving.
function allowSaves() {
	return Manager.Plugins.getParameter(pluginName, 'SaveWhenForbid') || Scene.Map.allowSaves;
}

// Autosave in intervals
setInterval(
	async function () {
		if (allowSaves()) {
			if (
				Manager.Plugins.getParameter(pluginName, 'Autosave Method') === 'Interval' ||
				Manager.Plugins.getParameter(pluginName, 'Autosave Method') === 'All'
			) {
				// Don't save when the title screen is open.
				if (!(Manager.Stack.top instanceof Scene.TitleScreen)) {
					// Save the game to the specified slot.
					await Core.Game.current.save(saveSlot);
				}
			}
		}
	},
	Manager.Plugins.getParameter(pluginName, 'Interval') * 1000,
);

// Autosave when teleporting
inject(EventCommand.TeleportObject, 'drawHUD', async function () {
	if (allowSaves()) {
		if (
			Manager.Plugins.getParameter(pluginName, 'Autosave Method') === 'Teleport' ||
			Manager.Plugins.getParameter(pluginName, 'Autosave Method') === 'All'
		) {
			await Core.Game.current.save(saveSlot);
		}
	}
});

// Autosave when closing the menu
inject(Scene.Menu, 'close', async function () {
	if (allowSaves()) {
		if (
			Manager.Plugins.getParameter(pluginName, 'Autosave Method') === 'Menu Close' ||
			Manager.Plugins.getParameter(pluginName, 'Autosave Method') === 'All'
		) {
			await Core.Game.current.save(saveSlot);
		}
	}
	Manager.Stack.isInMainMenu = false;
});

// Manual Autosave
Manager.Plugins.registerCommand(pluginName, 'Autosave', async function () {
	if (allowSaves()) {
		if (Manager.Plugins.getParameter(pluginName, 'Autosave Method') === 'Manual') {
			await Core.Game.current.save(saveSlot);
		}
	}
});

// Stops player from overwrting the autosave slot
inject(
	Scene.SaveGame,
	'action',
	async function (isKey, options) {
		if (saveSlot == this.windowChoicesSlots.currentSelectedIndex + 1 && !canOverwrite) {
			Data.Systems.soundImpossible.playSound();
		} else {
			// If action, save in the selected slot
			if (Scene.MenuBase.checkActionMenu(isKey, options)) {
				Data.Systems.soundConfirmation.playSound();
				Manager.Stack.push(
					new Scene.Confirm(() => {
						this.save();
					}),
				);
			}
		}
	},
	false,
	true,
	false,
);
