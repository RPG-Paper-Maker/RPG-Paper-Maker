/*
The MIT License (MIT)
copyright © 2021 Nio Kasgami
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the “Software”), to deal in the Software without restriction, including without 
limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of 
the Software, and to permit persons to whom the Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT 
SHALL THE AUTHORS OR NIO KASGAMI BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
OR OTHER DEALINGS IN THE SOFTWARE.
*/

//==========================================================================
// Parameters
//==========================================================================

import { RPM } from "../path.js"
const Align = RPM.Common.Enum.Align;
const pluginName = "RPM_MainMenuCommandIcon";
const inject = RPM.Manager.Plugins.inject;

/** @type {RPM.System.DynamicValue[]} */
const param = RPM.Manager.Plugins.getParameter(pluginName, "icons");


//==========================================================================
// Code
//==========================================================================

// We overwrite here as we need to edit a specific section of the function "createCommandWindow".

inject(RPM.Scene.Menu, "createCommandWindow", function () {
    
    /** @type {RPM.Graphic.TextIcon[]} */
    let graphics = [];
    /** @type {Function[]} */
    let actions = [];
    /** @type {RPM.System.MainMenuCommand} */
    let command;

    for (let i = 0, l = RPM.Datas.Systems.mainMenuCommands.length; i < l; i++) {
        command = RPM.Datas.Systems.mainMenuCommands[i];
        graphics[i] = new RPM.Graphic.TextIcon(command.name(), param[i].getValue(), { align: Align.Center })
        actions[i] = command.getCallback();
    }
    const rect = new RPM.Core.Rectangle(20, 20, 150, RPM.Core.WindowBox.MEDIUM_SLOT_HEIGHT);
    const options = {
        nbItemsMax: Math.min(8, graphics.length),
        listCallbacks: actions,
        padding: [0, 0, 0, 0]
    };
    this.windowChoicesCommands = new RPM.Core.WindowChoices(rect.x, rect.y, rect.width, rect.height, graphics, options)

}, false, true);
//==========================================================================
// END OF FILE
//==========================================================================
