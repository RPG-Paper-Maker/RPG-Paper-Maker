import { RPM } from "../path.js"

const pluginName = "Autosave";
const inject = RPM.Manager.Plugins.inject;

const saveSlot = RPM.Manager.Plugins.getParameter(pluginName, "Slot");
const canOverwrite = RPM.Manager.Plugins.getParameter(pluginName, "Overwrite Autosave");

// Check if the game allows saving.
function allowSaves() {
    return RPM.Manager.Plugins.getParameter(pluginName, "SaveWhenForbid") || RPM.Scene.Map.allowSaves;
}

// Autosave in intervals
setInterval(async function () {
    if (allowSaves()) {
        if (RPM.Manager.Plugins.getParameter(pluginName, "Autosave Method") === "Interval" || RPM.Manager.Plugins.getParameter(pluginName, "Autosave Method") === "All") {
            // Don't save when the title screen is open.
            if (!(RPM.Manager.Stack.top instanceof RPM.Scene.TitleScreen)) {
                // Save the game to the specified slot.
                await RPM.Core.Game.current.save(saveSlot);
            }
        }
    };
}, RPM.Manager.Plugins.getParameter(pluginName, "Interval") * 1000);

// Autosave when teleporting
inject(RPM.EventCommand.TeleportObject, "drawHUD", async function () {
    if (allowSaves()) {
        if (RPM.Manager.Plugins.getParameter(pluginName, "Autosave Method") === "Teleport" || RPM.Manager.Plugins.getParameter(pluginName, "Autosave Method") === "All") {
            await RPM.Core.Game.current.save(saveSlot);
        };
    };
})

// Autosave when closing the menu
inject(RPM.Scene.Menu, "close", async function () {
    if (allowSaves()) {
        if (RPM.Manager.Plugins.getParameter(pluginName, "Autosave Method") === "Menu Close" || RPM.Manager.Plugins.getParameter(pluginName, "Autosave Method") === "All") {
            await RPM.Core.Game.current.save(saveSlot);
        }
    };
    RPM.Manager.Stack.isInMainMenu = false;
})

// Manual Autosave
RPM.Manager.Plugins.registerCommand(pluginName, "Autosave", async function () {
    if (allowSaves()) {
        if (RPM.Manager.Plugins.getParameter(pluginName, "Autosave Method") === "Manual") {
            await RPM.Core.Game.current.save(saveSlot);
        }
    }
})

// Stops player from overwrting the autosave slot
inject(RPM.Scene.SaveGame, "action", async function (isKey, options) {
    if ((saveSlot == this.windowChoicesSlots.currentSelectedIndex + 1) && !canOverwrite) {
        RPM.Datas.Systems.soundImpossible.playSound();
    } else {
        // If action, save in the selected slot
        if (RPM.Scene.MenuBase.checkActionMenu(isKey, options)) {
            RPM.Datas.Systems.soundConfirmation.playSound();
            RPM.Manager.Stack.push(new RPM.Scene.Confirm(() => {
                this.save();
            }));
        }
    }
}, false, true, false);