const pluginName = 'Model Load on Map Load';
const inject = Manager.Plugins.inject;

// Start code here
const DLemonMapLoad = Scene.Map.prototype.load;
Scene.Map.prototype.load = function () {
	DLemonMapLoad.apply(this, arguments);
	// console.log("This should activate on map load");
	//console.log(Scene);
};

const DLemonMapObject = Core.MapObject.prototype.initializeProperties;
Core.MapObject.prototype.initializeProperties = function () {
	DLemonMapObject.apply(this, arguments);
	//console.log(this.system);
	if (this.system.hasOwnProperty('name')) {
		if (this.system.name.trim().toLowerCase().includes('<model:')) {
			var nameString = this.system.name.trim().toLowerCase();
			nameString = nameString.replace('<model:', '');
			nameString = nameString.replace('>', '');
			// console.log(nameString);

			var id = this.system.id;
			var modelPlugin = Manager.Plugins.fetch('JSON Model Loader');
			var pluginID = modelPlugin.id;
			Manager.Plugins.executeCommand(pluginID, 1, [id, nameString]);
		}
	} else {
	}
};
