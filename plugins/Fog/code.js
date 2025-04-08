const pluginName = 'Fog';
const inject = Manager.Plugins.inject;

Manager.Plugins.registerCommand(pluginName, 'Add fog', (intensity, color) => {
	Scene.Map.current.scene.fog = new THREE.FogExp2(new THREE.Color(color.rgb), intensity);
});
