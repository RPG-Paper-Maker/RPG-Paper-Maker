import { RPM } from "../path.js"

const pluginName = "Custom Cursor";

var path =  RPM.Common.Paths.PLUGINS + pluginName;
// changing all back-slash to forward-slash
path = path.replace(/\\/g, '/')

// Start code here
document.body.style.cursor = `url("${path}/cursor.png"), default`;
