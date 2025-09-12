# Discord Rich Presence Plugin for RPG Paper Maker

## Overview

This plugin integrates Discord Rich Presence into RPG Paper Maker. It displays your current map/location and a custom status on your Discord profile, with optional elapsed playtime.

## Features

- **Automatic status updates**: Shows current map/location and session time
- **Custom status messages**: Set your own details line
- **Auto-initialize**: Starts on game load (can also be started manually)
- **Safe clear/disconnect**: Clear presence without it reappearing; clean disconnect handling

## Requirements

- Discord desktop app running (Rich Presence uses IPC)

## Setup

### 1) Discord application

1. Open the Discord Developer Portal (`https://discord.com/developers/applications`)
2. Create an application and note the **Application ID** (Client ID)
3. In Rich Presence > Art Assets, upload images and note their keys:
   - Large image (e.g., `game_logo`)
   - Small image (e.g., `player_icon`)

### 2) Configure plugin parameters in RPG Paper Maker

Set these parameters for the plugin `DiscordRichPresence`:

- **DISCORD_CLIENT_ID**: Your Discord Application ID
- **UPDATE_INTERVAL**: Update rate in seconds (e.g., `5`)
- **LARGE_IMAGE_KEY**: Key from Discord assets (e.g., `game_logo`)
- **SMALL_IMAGE_KEY**: Key from Discord assets (e.g., `player_icon`)

No code edits are required; the plugin reads these at runtime.

## Usage

The plugin auto-initializes a few seconds after load if configuration is valid. You can also control it via plugin commands:

### Initialize Rich Presence
```javascript
RPM.Manager.Plugins.callCommand("DiscordRichPresence", "Initialize Rich Presence");
```

### Set Custom Status
```javascript
RPM.Manager.Plugins.callCommand("DiscordRichPresence", "Set Custom Status", "Exploring the forest");
```

### Update Rich Presence (manual)
```javascript
RPM.Manager.Plugins.callCommand("DiscordRichPresence", "Update Rich Presence");
```

### Clear Rich Presence
```javascript
RPM.Manager.Plugins.callCommand("DiscordRichPresence", "Clear Rich Presence");
// Auto-updates are paused so presence won't reappear until you set status or re-init
```

### Disconnect Rich Presence
```javascript
RPM.Manager.Plugins.callCommand("DiscordRichPresence", "Disconnect Rich Presence");
// Stops the client and removes presence; call Initialize to reconnect
```

## How it works

- Loads `discord-rpc` using multiple resolution strategies (works under Electron)
- Connects over IPC to the Discord desktop client
- Builds an activity with:
  - details: custom status or default "Adventuring"
  - state: current map/location (best-effort detection)
  - startTimestamp: session start time
  - large/small image keys and texts
- Updates on an interval (configurable)
- `Clear` pauses updates and clears activity; `Set Custom Status` resumes updates
- `Disconnect` stops updates, clears listeners, and destroys the client

## Troubleshooting

<!-- - **Module not found / require unavailable**
  - Ensure `window.require` is available (Electron with `nodeIntegration` or a preload that exposes `require`)
  - Verify `discord-rpc` exists at `Scripts/Plugins/DiscordRichPresence/node_modules/discord-rpc`
  - The loader logs attempted paths in the console to help locate issues -->

- **connection closed** when disconnecting
  - This is handled; the client is torn down safely and updates are stopped
  - If you see errors, make sure no custom scripts call update after disconnect

- **Images not showing**
  - Match `LARGE_IMAGE_KEY` and `SMALL_IMAGE_KEY` to keys in Discord Developer Portal assets
  - Assets can take a few minutes to propagate

- **Presence doesn’t update**
  - Check Discord is running
  - Confirm your Client ID parameter
  - Verify the update interval (try `5000`)

## Notes

- The plugin is designed for the RPG Paper Maker Electron runtime, not a regular browser
- Presence appears only while the Discord desktop client is running

## License

This plugin is provided as-is for personal and educational use.
