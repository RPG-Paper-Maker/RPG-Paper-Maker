import { RPM } from "../path.js"


/**
 * Discord Rich Presence Plugin for RPG Paper Maker
 * 
 * This plugin integrates Discord Rich Presence functionality into your RPG game,
 * allowing players to show their current game status, location, and activity on Discord.
 * 
 * Features:
 * - Shows current map/location
 * - Shows game time
 * - Custom status messages
 */

// Plugin configuration
const pluginName = "DiscordRichPresence";
const inject = RPM.Manager.Plugins.inject;

// Resolve configuration with safe defaults
const PARAM_CLIENT_ID = RPM.Manager.Plugins.getParameter(pluginName, "DISCORD_CLIENT_ID") || "";
const PARAM_UPDATE_INTERVAL = Number(RPM.Manager.Plugins.getParameter(pluginName, "UPDATE_INTERVAL") || 5000);
const PARAM_LARGE_IMAGE_KEY = RPM.Manager.Plugins.getParameter(pluginName, "LARGE_IMAGE_KEY") || "game_logo";
const PARAM_SMALL_IMAGE_KEY = RPM.Manager.Plugins.getParameter(pluginName, "SMALL_IMAGE_KEY") || "player_icon";

// Discord RPC setup (supports Electron renderer via window.require)
let DiscordRPC;
function loadDiscordRPC() {
    try {
        const req = (typeof window !== "undefined" && window.require) ? window.require : (typeof require !== "undefined" ? require : null);
        if (!req) {
            console.warn("DiscordRichPresence: 'require' is not available (nodeIntegration disabled?)");
            return false;
        }

        // Try normal resolution first
        try {
            DiscordRPC = req("discord-rpc");
            return !!DiscordRPC;
        } catch (_primaryErr) {
            // Continue to fallbacks
        }

        let path, Module;
        try {
            path = req("path");
            Module = req("module");
        } catch (_depsErr) {
            // If we can't load path/module, skip advanced strategies
            return false;
        }

        // Determine plugin directory from several strategies
        const derivePluginDir = () => {
            if (typeof __dirname !== "undefined" && __dirname) {
                return __dirname;
            }
            // Try currentScript
            try {
                if (typeof document !== "undefined") {
                    if (document.currentScript && document.currentScript.src) {
                        const src = document.currentScript.src;
                        if (src) {
                            return src;
                        }
                    }
                    // Scan all scripts for our plugin path segment
                    const scripts = document.getElementsByTagName("script");
                    for (let i = 0; i < scripts.length; i++) {
                        const s = scripts[i];
                        const src = s && s.src ? s.src : "";
                        if (src && src.indexOf("/Scripts/Plugins/DiscordRichPresence/") !== -1) {
                            return src;
                        }
                    }
                }
            } catch (_e) { }
            return null;
        };

        const rawDir = derivePluginDir();
        let baseDir = null;
        if (rawDir && typeof rawDir === "string") {
            if (rawDir.startsWith("file:")) {
                const u = new URL(rawDir);
                let p = u.pathname;
                try { p = decodeURIComponent(p); } catch (_d) { }
                if (/^\/[A-Za-z]:\//.test(p)) { p = p.slice(1); }
                baseDir = path.dirname(p);
            } else {
                baseDir = path.dirname(rawDir);
            }
        }

        // Build candidate plugin directories to try resolving from
        const candidateDirs = [];
        if (baseDir) {
            candidateDirs.push(baseDir);
            // If we detected a higher-level resources dir, try well-known subpaths
            candidateDirs.push(
                path.join(baseDir, "Scripts", "Plugins", "DiscordRichPresence"),
                path.join(baseDir, "Content", "Datas", "Scripts", "Plugins", "DiscordRichPresence"),
                path.join(baseDir, "app", "Content", "Datas", "Scripts", "Plugins", "DiscordRichPresence"),
                path.join(baseDir, "resources", "app", "Content", "Datas", "Scripts", "Plugins", "DiscordRichPresence")
            );
        }

        // Also try deriving from document.location if available
        try {
            if (typeof document !== "undefined" && document.location && document.location.href) {
                const loc = document.location.href;
                if (loc.startsWith("file:")) {
                    const u = new URL(loc);
                    let p = u.pathname;
                    try { p = decodeURIComponent(p); } catch (_d) { }
                    if (/^\/[A-Za-z]:\//.test(p)) { p = p.slice(1); }
                    const locDir = path.dirname(p);
                    candidateDirs.push(
                        path.join(locDir, "Scripts", "Plugins", "DiscordRichPresence"),
                        path.join(locDir, "Content", "Datas", "Scripts", "Plugins", "DiscordRichPresence"),
                        path.join(locDir, "app", "Content", "Datas", "Scripts", "Plugins", "DiscordRichPresence"),
                        path.join(locDir, "resources", "app", "Content", "Datas", "Scripts", "Plugins", "DiscordRichPresence")
                    );
                }
            }
        } catch (_e) { }

        // Deduplicate candidates
        const seen = new Set();
        const dirsToTry = candidateDirs.filter(d => {
            if (!d) return false;
            const key = d.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        if (dirsToTry.length && Module && (Module.createRequire || Module.createRequireFromPath)) {
            const createRequire = Module.createRequire || Module.createRequireFromPath;

            for (let i = 0; i < dirsToTry.length; i++) {
                const pluginDir = dirsToTry[i];
                try {
                    const localRequire = createRequire(path.join(pluginDir, "index.js"));
                    try {
                        DiscordRPC = localRequire("discord-rpc");
                        if (DiscordRPC) return true;
                    } catch (_localErr) {
                        const candidate = path.join(pluginDir, "node_modules", "discord-rpc");
                        try {
                            DiscordRPC = localRequire(candidate);
                            if (DiscordRPC) return true;
                        } catch (_absErr) {
                            try {
                                DiscordRPC = req(candidate);
                                if (DiscordRPC) return true;
                            } catch (_finalErr) {
                                // continue
                            }
                        }
                    }
                } catch (_crErr) {
                    // continue
                }
            }
            console.warn("DiscordRichPresence: Failed to resolve discord-rpc. Tried plugin directories:", dirsToTry);
        }
    } catch (e) {
        console.error("DiscordRichPresence: Error loading discord-rpc module", e);
    }
    return false;
}

// Attempt initial load immediately
loadDiscordRPC();

/**
 * Internal state
 */
let rpcClient = null;
let presenceIntervalId = null;
let startTimestampMs = Date.now();
let customStatusMessage = "";
let currentLocation = "Adventuring"; // default location, can be set via command
let updatesPaused = false; // when true, auto updates are paused (e.g., after clearPresence)
let isConnected = false;  // reflects RPC client's connection state
let isShuttingDown = false; // set during disconnect to guard against late updates

/**
 * Initialize Discord RPC client
 */
function initializeDiscordRPC() {
    if (!DiscordRPC) {
        // Retry loading once more at init time (in case timing differed)
        if (!loadDiscordRPC()) {
            console.warn("DiscordRichPresence: discord-rpc module not found. Ensure it is installed in node_modules.");
            return;
        }
    }

    if (!PARAM_CLIENT_ID || typeof PARAM_CLIENT_ID !== "string" || PARAM_CLIENT_ID.trim().length === 0) {
        console.warn("DiscordRichPresence: Missing DISCORD_CLIENT_ID parameter.");
        return;
    }

    if (rpcClient) {
        return; // already initialized
    }

    try {
        rpcClient = new DiscordRPC.Client({ transport: "ipc" });

        // When the transport connects and the client is ready
        rpcClient.on("ready", () => {
            isConnected = true;
            isShuttingDown = false;
            if (!updatesPaused) {
                updatePresence();
            }
            if (presenceIntervalId) {
                clearInterval(presenceIntervalId);
            }
            if (!updatesPaused) {
                presenceIntervalId = setInterval(() => {
                    updatePresence();
                }, Math.max(2000, PARAM_UPDATE_INTERVAL | 0));
            }
        });

        // When the client disconnects, make sure we stop updates
        rpcClient.on("disconnected", (_evt) => {
            isConnected = false;
            if (presenceIntervalId) {
                clearInterval(presenceIntervalId);
                presenceIntervalId = null;
            }
        });

        rpcClient.login({ clientId: PARAM_CLIENT_ID }).catch((err) => {
            console.error("DiscordRichPresence: Login failed", err);
        });
    } catch (error) {
        console.error("DiscordRichPresence: Initialization error", error);
    }
}

/**
 * Set the current location for Rich Presence display
 * @param {string} location - The location name to display
 */
function setCurrentLocation(location) {
    try {
        currentLocation = String(location ?? "Adventuring");
        // Update presence immediately if connected and not paused
        if (isConnected && !updatesPaused) {
            updatePresence();
        }
    } catch (error) {
        console.error("DiscordRichPresence: setCurrentLocation error", error);
    }
}

/**
 * Build the activity object to send to Discord
 */
function buildActivity() {
    const startTimestamp = Math.floor(startTimestampMs / 1000);

    const details = customStatusMessage && customStatusMessage.trim().length > 0
        ? customStatusMessage.trim()
        : "Playing RPG Paper Maker";

    const state = currentLocation || "Adventuring";

    const activity = {
        details,
        state,
        startTimestamp,
        largeImageKey: PARAM_LARGE_IMAGE_KEY,
        largeImageText: "RPG Paper Maker",
        smallImageKey: PARAM_SMALL_IMAGE_KEY,
        smallImageText: "In-game",
        instance: false
    };
    return activity;
}

/**
 * Push current activity to Discord
 */
function updatePresence() {
    if (updatesPaused || isShuttingDown || !isConnected) {
        return;
    }
    if (!rpcClient || !rpcClient.transport || typeof rpcClient.setActivity !== "function") {
        return;
    }
    try {
        const activity = buildActivity();
        rpcClient.setActivity(activity).catch((err) => {
            // setActivity returns a promise in newer builds
            console.warn("DiscordRichPresence: setActivity warning", err);
        });
    } catch (error) {
        console.error("DiscordRichPresence: updatePresence error", error);
    }
}

/**
 * Set a custom status line (appears as details)
 * @param {string} message
 */
function setCustomStatus(message) {
    try {
        customStatusMessage = String(message ?? "");
        // Setting a custom status implicitly resumes updates
        if (updatesPaused && isConnected) {
            updatesPaused = false;
            if (!presenceIntervalId) {
                presenceIntervalId = setInterval(() => {
                    updatePresence();
                }, Math.max(2000, PARAM_UPDATE_INTERVAL | 0));
            }
        }
        updatePresence();
    } catch (error) {
        console.error("DiscordRichPresence: setCustomStatus error", error);
    }
}

/**
 * Clear the Rich Presence from the user profile
 */
function clearPresence() {
    if (!rpcClient) {
        return;
    }
    try {
        // Pause auto-updates and stop the interval so presence doesn't get set again
        updatesPaused = true;
        if (presenceIntervalId) {
            clearInterval(presenceIntervalId);
            presenceIntervalId = null;
        }
        if (typeof rpcClient.clearActivity === "function") {
            rpcClient.clearActivity().catch(() => { });
        } else {
            // Fallback: set an empty activity
            rpcClient.setActivity({}).catch(() => { });
        }
    } catch (error) {
        console.error("DiscordRichPresence: clearPresence error", error);
    }
}

/**
 * Disconnect and cleanup resources
 */
function disconnect() {
    try {
        isShuttingDown = true;
        updatesPaused = true;
        if (presenceIntervalId) {
            clearInterval(presenceIntervalId);
            presenceIntervalId = null;
        }
        if (rpcClient) {
            try { rpcClient.clearActivity?.().catch?.(() => { }); } catch (_e) { }
            try { rpcClient.removeAllListeners?.(); } catch (_e) { }
            try { rpcClient.destroy?.(); } catch (_e) { }
        }
    } finally {
        rpcClient = null;
        isConnected = false;
    }
}


// Plugin Commands - These are the functions that can be called from the game

/**
 * Initialize Discord Rich Presence
 * Call this command to start the Rich Presence service
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Initialize Rich Presence", () => {
    initializeDiscordRPC();
});

/**
 * Set Custom Status
 * @param {string} message - The custom status message to display
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Set Custom Status", (message) => {
    setCustomStatus(message);
});

/**
 * Set Current Location
 * @param {string} location - The current location to display
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Set Current Location", (location) => {
    setCurrentLocation(location);
});

/**
 * Update Rich Presence
 * Manually trigger an update of the Rich Presence
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Update Rich Presence", () => {
    updatePresence();
});

/**
 * Clear Rich Presence
 * Clear the current Rich Presence status
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Clear Rich Presence", () => {
    clearPresence();
});

/**
 * Disconnect Rich Presence
 * Disconnect from Discord Rich Presence
 */
RPM.Manager.Plugins.registerCommand(pluginName, "Disconnect Rich Presence", () => {
    disconnect();
});

// Auto-initialize when the plugin loads
// This will automatically start Rich Presence when the game loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the game to fully load
    setTimeout(() => {
        initializeDiscordRPC();
    }, 2000);
});

// Clean up when the page is unloaded
window.addEventListener('beforeunload', () => {
    disconnect();
});