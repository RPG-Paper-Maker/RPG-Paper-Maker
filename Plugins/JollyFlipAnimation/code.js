import { RPM } from "../path.js";

const pluginName = "JollyFlipAnimation";
const inject = RPM.Manager.Plugins.inject;

// Using the FlippableAnimations parameter, add functionality to AnimationFrameElements associated with those Animations.
inject(RPM.Scene.TitleScreen, "load", async function() {
    const flippableAnimations = RPM.Manager.Plugins.getParameter(pluginName, "FlippableAnimations");
    for(const anim of flippableAnimations) {
        for(const frame of anim.frames) {
            if(!frame) continue;
            for(const element of frame.elements) {
                if(!element) continue;
                // The following will only be added to Animation frames associated with animations in the FlippableAnimations parameter.
                // Easy add of a function to allow us to know if the current animation played is targetting an ally.
                // This means that Animations that target allies used by allies will be flipped if they are in the parameter!
                // not really injectable, nor would I really want it to be, but if someone else adds this function then that add will override this one.
                if(!element.isPartyTarget) element.isPartyTarget = function() {
                    if(this.currentBattler) return !this.currentBattler.isEnemy;
                    return false;
                };
                // Will add a 'getter' and 'setter' with new internal value for 'flip'. Means when 'this.flip' is used, the getter/setter will be called instead.
                // There seemed to be no way to 'inject' such a property. Perhaps inject can be expanded to handle such a case.
                // For now, to maintain some compatibility, I've made the internal value be 'namespaced' and grabbed the current getter/setter or set a default if there is not one.
                const flipGetter = Object.getOwnPropertyDescriptor(element, "flip").get || function() {
                    return this._jollyFlip;
                };
                const flipSetter = Object.getOwnPropertyDescriptor(element, "flip").set || function(value) {
                    this._jollyFlip = value;
                };
                element._jollyFlip = element.flip;
                Object.defineProperty(element, 'flip', {
                    get() {
                        if(this.isPartyTarget()) return !flipGetter.call(this);
                        return flipGetter.call(this);
                    },
                    set(value) {
                        flipSetter.call(this, value);
                    }
                });

                // similarly, let's make a getter/setter for x and rotate it around the center of the battler, coming from the other direction (for arrows for instance)
                const xGetter = Object.getOwnPropertyDescriptor(element, "x").get || function() {
                    return this._jollyX;
                };
                const xSetter = Object.getOwnPropertyDescriptor(element, "x").set || function(value) {
                    this._jollyX = value;
                };
                element._jollyX = element.x;
                Object.defineProperty(element, 'x', {
                    get() {
                        if(this.isPartyTarget()) return -xGetter.call(this);
                        return xGetter.call(this);
                    },
                    set(value) {
                        xSetter.call(this, value);
                    }
                });
            }
        }
    }
}, false, false, true);

// Injecting battler into context for the AnimationFrameElements. Unfortunately, the only way I know to inject such info is by setting as a member variable here.
// I know I could simply overwrite the functions, but then it would end up being incompatible with other plugins based upon order loaded, which we don't want.
inject(RPM.System.Animation, "draw", function(picture, frame, battler) {
    if(this.frames[frame]) this.frames[frame].currentBattler = battler;
}, false, false, false); // inject before running actual function to inject battler into context

inject(RPM.System.AnimationFrame, "draw", function(picture, position, rows, cols) {
    for(const element of this.elements) {
        if(element) element.currentBattler = this.currentBattler;
    }
}, false, false, false); // inject before running actual function to inject battler into context