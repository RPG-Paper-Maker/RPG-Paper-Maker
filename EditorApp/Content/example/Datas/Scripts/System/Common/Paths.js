/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Platform } from "./Platform.js";
/**
 * The static class containing all the files paths.
 *
 * @class Paths
 */
class Paths {
    constructor() {
        throw new Error("This is a static class");
    }
}
Paths.ROOT_DIRECTORY_LOCAL = ".";
Paths.FILES = "file:///";
Paths.DATAS = Platform.ROOT_DIRECTORY + "/Content/Datas/";
Paths.TEST = Platform.ROOT_DIRECTORY + "/Test/";
Paths.FILE_MAPS = Paths.DATAS + "Maps/";
Paths.FILE_MAP_INFOS = "/infos.json";
Paths.FILE_MAP_OBJECTS = "/objects.json";
Paths.FILE_PICTURES = Paths.DATAS + "pictures.json";
Paths.FILE_VIDEOS = Paths.DATAS + "videos.json";
Paths.FILE_FONTS = Paths.DATAS + "fonts.json";
Paths.FILE_SONGS = Paths.DATAS + "songs.json";
Paths.FILE_SHAPES = Paths.DATAS + "shapes.json";
Paths.FILE_COMMON_EVENTS = Paths.DATAS + "commonEvents.json";
Paths.FILE_ITEMS = Paths.DATAS + "items.json";
Paths.FILE_SKILLS = Paths.DATAS + "skills.json";
Paths.FILE_WEAPONS = Paths.DATAS + "weapons.json";
Paths.FILE_ARMORS = Paths.DATAS + "armors.json";
Paths.FILE_HEROES = Paths.DATAS + "heroes.json";
Paths.FILE_MONSTERS = Paths.DATAS + "monsters.json";
Paths.FILE_TROOPS = Paths.DATAS + "troops.json";
Paths.FILE_BATTLE_SYSTEM = Paths.DATAS + "battleSystem.json";
Paths.FILE_TITLE_SCREEN_GAME_OVER = Paths.DATAS + "titlescreenGameover.json";
Paths.FILE_KEYBOARD = Paths.DATAS + "keyBoard.json";
Paths.FILE_SYSTEM = Paths.DATAS + "system.json";
Paths.FILE_CLASSES = Paths.DATAS + "classes.json";
Paths.FILE_TILESETS = Paths.DATAS + "tilesets.json";
Paths.FILE_SPECIAL_ELEMENTS = Paths.DATAS + "specialElements.json";
Paths.FILE_VARIABLES = Paths.DATAS + "variables.json";
Paths.FILE_SETTINGS = Paths.DATAS + "settings.json";
Paths.FILE_DLCS = Paths.DATAS + "dlcs.json";
Paths.FILE_ANIMATIONS = Paths.DATAS + "animations.json";
Paths.FILE_STATUS = Paths.DATAS + "status.json";
Paths.FILE_SCRIPTS = Paths.DATAS + "scripts.json";
Paths.FILE_LANGS = Paths.DATAS + "langs.json";
Paths.FILE_PROTECT = Platform.ROOT_DIRECTORY + "/.protect";
Paths.FILE_TEST = Paths.TEST + "test.json";
Paths.FILE_PLUGIN_CODE = "code.js";
Paths.FILE_PLUGIN_DETAILS = "details.json";
Paths.PICTURES = "/Content/Images";
Paths.VIDEOS = "/Content/Videos";
Paths.FONTS = "/Content/Fonts";
Paths.HUD = Paths.PICTURES + "/HUD/";
Paths.TEXTURES2D = Paths.PICTURES + "/Textures2D/";
Paths.BARS = Paths.HUD + "Bars";
Paths.FACESETS = Paths.HUD + "Facesets";
Paths.ICONS = Paths.HUD + "Icons";
Paths.WINDOW_SKINS = Paths.HUD + "WindowSkins";
Paths.TITLE_SCREEN = Paths.HUD + "TitleScreen";
Paths.GAME_OVER = Paths.HUD + "GameOver";
Paths.HUD_PICTURES = Paths.HUD + "Pictures";
Paths.ANIMATIONS = Paths.HUD + "Animations";
Paths.AUTOTILES = Paths.TEXTURES2D + "Autotiles";
Paths.CHARACTERS = Paths.TEXTURES2D + "Characters";
Paths.TILESETS = Paths.TEXTURES2D + "Tilesets";
Paths.WALLS = Paths.TEXTURES2D + "Walls";
Paths.BATTLERS = Paths.TEXTURES2D + "Battlers";
Paths.OBJECTS_3D = Paths.TEXTURES2D + "Objects3D";
Paths.MOUNTAINS = Paths.TEXTURES2D + "Mountains";
Paths.SKYBOXES = Paths.TEXTURES2D + "SkyBoxes";
Paths.PARTICLES = Paths.TEXTURES2D + "Particles";
Paths.SONGS = "/Content/Songs/";
Paths.MUSICS = Paths.SONGS + "Musics";
Paths.BACKGROUND_SOUNDS = Paths.SONGS + "BackgroundSounds";
Paths.SOUNDS = Paths.SONGS + "Sounds";
Paths.MUSIC_EFFECTS = Paths.SONGS + "MusicEffects";
Paths.SHAPES = "/Content/Shapes/";
Paths.OBJ = Paths.SHAPES + "OBJ";
Paths.MTL = Paths.SHAPES + "MTL";
Paths.OBJ_COLLISIONS = Paths.SHAPES + "Collisions";
Paths.SCRIPTS = Paths.DATAS + "Scripts/";
Paths.PLUGINS = Paths.SCRIPTS + "Plugins/";
Paths.SYSTEM = Paths.SCRIPTS + "System/";
Paths.SHADERS = Paths.SCRIPTS + "Shaders/";
Paths.SAVES = Paths.DATAS + "Saves";
export { Paths };
