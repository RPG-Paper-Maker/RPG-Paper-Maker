import { RPM } from "../path.js"

const pluginName = "Model Load on Map Load";
const inject = RPM.Manager.Plugins.inject;

// Start code here
    const DLemonMapLoad = RPM.Scene.Map.prototype.load;
    RPM.Scene.Map.prototype.load = function(){
        DLemonMapLoad.apply(this,arguments);
       // console.log("This should activate on map load");
        //console.log(RPM.Scene);
}
    
    
    const DLemonMapObject = RPM.Core.MapObject.prototype.initializeProperties;
    RPM.Core.MapObject.prototype.initializeProperties =  function(){
        DLemonMapObject.apply(this,arguments);
        //console.log(this.system);
        if (this.system.hasOwnProperty("name")){
            if (this.system.name.trim().toLowerCase().includes("<model:"))
            {
                var nameString = this.system.name.trim().toLowerCase();
                nameString = nameString.replace("<model:","");
                nameString = nameString.replace(">","");
               // console.log(nameString);
                
                var id = this.system.id;
                var modelPlugin = RPM.Manager.Plugins.fetch("JSON Model Loader");
                var pluginID = modelPlugin.id;
                RPM.Manager.Plugins.executeCommand(pluginID,1,[id,nameString]);
            }
        }else{
            
        }
    }
 