/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

class Paths {
	public static readonly ROOT_DIRECTORY_LOCAL = '.';
	public static readonly FILES = 'file:///';
	public static readonly DATAS = 'Datas';
	public static readonly MAPS = 'Maps';
	public static readonly PICTURES = 'Images';
	public static readonly VIDEOS = 'Videos';
	public static readonly FONTS = 'Fonts';
	public static readonly HUD = Paths.PICTURES + '/HUD';
	public static readonly TEXTURES2D = Paths.PICTURES + '/Textures2D';
	public static readonly BARS = Paths.HUD + '/Bars';
	public static readonly FACESETS = Paths.HUD + '/Facesets';
	public static readonly ICONS = Paths.HUD + '/Icons';
	public static readonly WINDOW_SKINS = Paths.HUD + '/WindowSkins';
	public static readonly TITLE_SCREEN = Paths.HUD + '/TitleScreen';
	public static readonly GAME_OVER = Paths.HUD + '/GameOver';
	public static readonly HUD_PICTURES = Paths.HUD + '/Pictures';
	public static readonly ANIMATIONS = Paths.HUD + '/Animations';
	public static readonly AUTOTILES = Paths.TEXTURES2D + '/Autotiles';
	public static readonly CHARACTERS = Paths.TEXTURES2D + '/Characters';
	public static readonly TILESETS = Paths.TEXTURES2D + '/Tilesets';
	public static readonly WALLS = Paths.TEXTURES2D + '/Walls';
	public static readonly BATTLERS = Paths.TEXTURES2D + '/Battlers';
	public static readonly OBJECTS_3D = Paths.TEXTURES2D + '/Objects3D';
	public static readonly MOUNTAINS = Paths.TEXTURES2D + '/Mountains';
	public static readonly SKYBOXES = Paths.TEXTURES2D + '/SkyBoxes';
	public static readonly PARTICLES = Paths.TEXTURES2D + '/Particles';
	public static readonly SONGS = 'Songs';
	public static readonly MUSICS = Paths.SONGS + '/Musics';
	public static readonly BACKGROUND_SOUNDS = Paths.SONGS + '/BackgroundSounds';
	public static readonly SOUNDS = Paths.SONGS + '/Sounds';
	public static readonly MUSIC_EFFECTS = Paths.SONGS + '/MusicEffects';
	public static readonly SHAPES = 'Shapes';
	public static readonly OBJ = Paths.SHAPES + '/OBJ';
	public static readonly MTL = Paths.SHAPES + '/MTL';
	public static readonly OBJ_COLLISIONS = Paths.SHAPES + '/Collisions';
	public static readonly SCRIPTS = Paths.DATAS + '/Scripts';
	public static readonly PLUGINS = Paths.SCRIPTS + '/Plugins';
	public static readonly SYSTEM = Paths.SCRIPTS + '/System';
	public static readonly SHADERS = Paths.SCRIPTS + '/Shaders';
	public static readonly SAVES = Paths.DATAS + '/Saves';
	public static readonly TEMP = Paths.DATAS + '/temp';
	public static readonly TEMP_UNDO_REDO = Paths.DATAS + '/temp-undo-redo';
	public static readonly FILE_MAP_INFOS = '/infos.json';
	public static readonly FILE_MAP_OBJECTS = '/objects.json';
	public static readonly FILE_PICTURES = Paths.DATAS + '/pictures.json';
	public static readonly FILE_VIDEOS = Paths.DATAS + '/videos.json';
	public static readonly FILE_FONTS = Paths.DATAS + '/fonts.json';
	public static readonly FILE_SONGS = Paths.DATAS + '/songs.json';
	public static readonly FILE_SHAPES = Paths.DATAS + '/shapes.json';
	public static readonly FILE_COMMON_EVENTS = Paths.DATAS + '/commonEvents.json';
	public static readonly FILE_ITEMS = Paths.DATAS + '/items.json';
	public static readonly FILE_SKILLS = Paths.DATAS + '/skills.json';
	public static readonly FILE_WEAPONS = Paths.DATAS + '/weapons.json';
	public static readonly FILE_ARMORS = Paths.DATAS + '/armors.json';
	public static readonly FILE_HEROES = Paths.DATAS + '/heroes.json';
	public static readonly FILE_MONSTERS = Paths.DATAS + '/monsters.json';
	public static readonly FILE_TROOPS = Paths.DATAS + '/troops.json';
	public static readonly FILE_BATTLE_SYSTEM = Paths.DATAS + '/battleSystem.json';
	public static readonly FILE_TITLE_SCREEN_GAME_OVER = Paths.DATAS + '/titlescreenGameover.json';
	public static readonly FILE_KEYBOARD = Paths.DATAS + '/keyBoard.json';
	public static readonly FILE_SYSTEM = Paths.DATAS + '/system.json';
	public static readonly FILE_CLASSES = Paths.DATAS + '/classes.json';
	public static readonly FILE_TILESETS = Paths.DATAS + '/tilesets.json';
	public static readonly FILE_SPECIAL_ELEMENTS = Paths.DATAS + '/specialElements.json';
	public static readonly FILE_VARIABLES = Paths.DATAS + '/variables.json';
	public static readonly FILE_SETTINGS = Paths.DATAS + '/settings.json';
	public static readonly FILE_DLCS = Paths.DATAS + '/dlcs.json';
	public static readonly FILE_ANIMATIONS = Paths.DATAS + '/animations.json';
	public static readonly FILE_STATUS = Paths.DATAS + '/status.json';
	public static readonly FILE_SCRIPTS = Paths.DATAS + '/scripts.json';
	public static readonly FILE_LANGS = Paths.DATAS + '/langs.json';
	public static readonly FILE_PROTECT = '/.protect';
	public static readonly FILE_PLUGIN_CODE = '/code.js';
	public static readonly FILE_PLUGIN_DETAILS = '/details.json';

	public static getContent() {
		return '/Content'; // Different for web and desktop
	}
}

export { Paths };
