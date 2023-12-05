import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Fog";
const inject = RPM.Manager.Plugins.inject;

RPM.Manager.Plugins.registerCommand(pluginName, "Add fog", (intensity, color) => {
    RPM.Scene.Map.current.scene.fog = new THREE.FogExp2(new THREE.Color(color.rgb), intensity);
});