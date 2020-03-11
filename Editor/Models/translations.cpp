/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPushButton>
#include <QMessageBox>
#include "translations.h"
#include "rpm.h"
#include "common.h"

const QString Translations::JSON_NAMES = "names";
const QString Translations::JSON_SHORT = "short";
const QString Translations::JSON_TRANSLATIONS = "translations";
const QString Translations::OK = "ok";
const QString Translations::CANCEL = "cancel";
const QString Translations::NEW_PROJECT = "new.project";
const QString Translations::NEW_PROJECT_TOOL = "new.project.tool";
const QString Translations::SELECT_A_LOCATION = "select.a.location";
const QString Translations::LOCATION = "location";
const QString Translations::PROJECT_NAME = "project.name";
const QString Translations::DIRECTORY_NAME = "directory.name";
const QString Translations::AUTO_GENERATE = "auto.generate";
const QString Translations::FILE = "file";
const QString Translations::EDITION = "edition";
const QString Translations::MANAGEMENT = "management";
const QString Translations::SPECIAL_ELEMENTS = "special.elements";
const QString Translations::OPTIONS = "options";
const QString Translations::DISPLAY = "display";
const QString Translations::TEST = "test";
const QString Translations::HELP = "help";
const QString Translations::OPEN_PROJECT = "open.project";
const QString Translations::OPEN_PROJECT_TOOL = "open.project.tool";
const QString Translations::BROWSE = "browse";
const QString Translations::SAVE = "save";
const QString Translations::SAVE_TOOL = "save.tool";
const QString Translations::SAVE_ALL = "save.all";
const QString Translations::SAVE_ALL_TOOL = "save.all.tool";
const QString Translations::EXPORT_STANDALONE = "export.standalone";
const QString Translations::CLOSE_PROJECT = "close.project";
const QString Translations::QUIT = "quit";
const QString Translations::UNDO = "undo";
const QString Translations::REDO = "redo";
const QString Translations::HEIGHT_UP = "height.up";
const QString Translations::HEIGHT_PLUS_UP = "height.plus.up";
const QString Translations::HEIGHT_DOWN = "height.down";
const QString Translations::HEIGHT_PLUS_DOWN = "height.plus.down";
const QString Translations::DATAS_MANAGER = "datas.manager";
const QString Translations::DATAS_MANAGER_TOOL = "datas.manager.tool";
const QString Translations::SYSTEMS_MANAGER = "systems.manager";
const QString Translations::SYSTEMS_MANAGER_TOOL = "systems.manager.tool";
const QString Translations::VARIABLES_MANAGER = "variables.manager";
const QString Translations::VARIABLES_MANAGER_TOOL = "variables.manager.tool";
const QString Translations::COLLISIONS_MANAGER = "collisions.manager";
const QString Translations::COLLISIONS_MANAGER_TOOL = "collisions.manager.tool";
const QString Translations::KEYBOARD_CONTROLS = "keyboard.controls";
const QString Translations::KEYBOARD_CONTROLS_TOOL = "keyboard.controls.tool";
const QString Translations::SCRIPTS_MANAGER = "scripts.manager";
const QString Translations::SCRIPTS_MANAGER_TOOL = "scripts.manager.tool";
const QString Translations::PICTURES_MANAGER = "pictures.manager";
const QString Translations::PICTURES_MANAGER_TOOL = "pictures.manager.tool";
const QString Translations::SONGS_MANAGER = "songs.manager";
const QString Translations::SONGS_MANAGER_TOOL = "songs.manager.tool";
const QString Translations::SHAPES_MANAGER = "shapes.manager";
const QString Translations::SHAPES_MANAGER_TOOL = "shapes.manager.tool";
const QString Translations::AUTOTILES = "autotiles";
const QString Translations::AUTOTILES_TOOL = "autotiles.tool";
const QString Translations::ANIMATED_AUTOTILES = "animated.autotiles";
const QString Translations::ANIMATED_AUTOTILES_TOOL = "animated.autotiles.tool";
const QString Translations::THREED_OBJECTS = "threed.objects";
const QString Translations::THREED_OBJECTS_TOOL = "threed.objects.tool";
const QString Translations::MOUNTAINS = "mountains";
const QString Translations::MOUNTAINS_TOOL = "mountains.tool";
const QString Translations::SET_BR_PATH_FOLDER = "set.br.path.folder";
const QString Translations::DEBUG_OPTIONS = "debug.options";
const QString Translations::GENERAL_OPTIONS = "general.options";
const QString Translations::SHOW_HIDE_GRID = "show.hide.grid";
const QString Translations::SHOW_HIDE_SQUARE_INFORMATION = "show.hide.square.information";
const QString Translations::PLAY = "play";
const QString Translations::PLAY_TOOL = "play.tool";
const QString Translations::ABOUT = "about";
const QString Translations::AUTO_DISPLAY_UPDATER = "auto.display.updater";
const QString Translations::RECENT_PROJECTS = "recent.projects";
const QString Translations::TILESETS = "tilesets";
const QString Translations::CHARACTERS = "characters";
const QString Translations::WALLS = "walls";
const QString Translations::WALLS_TOOL = "walls.tool";
const QString Translations::COLLISIONS = "collisions";
const QString Translations::NONE = "none";
const QString Translations::PERFECT = "perfect";
const QString Translations::SIMPLIFIED = "simplified";
const QString Translations::CUSTOM = "custom";
const QString Translations::DEFAULT = "default";
const QString Translations::ACCORDING_HEIGHT_ANGLE = "according.height.angle";
const QString Translations::FORCE_ALWAYS_COLLIDES = "force.always.collides";
const QString Translations::FORCE_NEVER_COLLIDES = "force.never.collides";
const QString Translations::SET_MAX = "set.max";
const QString Translations::SHOW_TEXT = "show.text";
const QString Translations::CHANGE_VARIABLES = "change.variables";
const QString Translations::END_GAME = "end.game";
const QString Translations::WHILE = "while";
const QString Translations::WHILE_BREAK = "while.break";
const QString Translations::INPUT_NUMBER = "input.number";
const QString Translations::CONDITION = "condition";
const QString Translations::OPEN_MAIN_MENU = "open.main.menu";
const QString Translations::OPEN_SAVES_MENU = "open.saves.menu";
const QString Translations::MODIFY_INVENTORY = "modify.inventory";
const QString Translations::MODIFY_TEAM = "modify.team";
const QString Translations::START_BATTLE = "start.battle";
const QString Translations::CHANGE_STATE = "change.state";
const QString Translations::SEND_EVENT = "send.event";
const QString Translations::TELEPORT_OBJECT = "teleport.object";
const QString Translations::MOVE_OBJECT = "move.object";
const QString Translations::WAIT = "wait";
const QString Translations::MOVE_CAMERA = "move.camera";
const QString Translations::PLAY_MUSIC = "play.music";
const QString Translations::STOP_MUSIC = "stop.music";
const QString Translations::PLAY_BACKGROUND_SOUND = "play.background.sound";
const QString Translations::STOP_BACKGROUND_SOUND = "stop.background.sound";
const QString Translations::PLAY_A_SOUND = "play.a.sound";
const QString Translations::PLAY_MUSIC_EFFECT = "play.music.effect";
const QString Translations::CHANGE_PROPERTY = "change.property";
const QString Translations::DISPLAY_CHOICES = "display.choices";
const QString Translations::SCRIPT = "script";
const QString Translations::DISPLAY_A_PICTURE = "display.a.picture";
const QString Translations::SET_MOVE_TURN_A_PICTURE = "set.move.turn.a.picture";
const QString Translations::REMOVE_A_PICTURE = "remove.a.picture";
const QString Translations::SET_DIALOG_BOX_OPTIONS = "set.dialog.box.options";
const QString Translations::TITLE_SCREEN = "title.screen";
const QString Translations::CHANGE_SCREEN_TONE = "change.screen.tone";
const QString Translations::REMOVE_OBJECT_FROM_MAP = "remove.object.from.map";
const QString Translations::STOP_REACTION = "stop.reaction";
const QString Translations::ALLOW_FORBID_SAVES = "allow.forbid.saves";
const QString Translations::ALLOW_FORBID_MAIN_MENU = "allow.forbid.main.menu";
const QString Translations::CALL_A_COMMON_REACTION = "call.a.common.reaction";
const QString Translations::COMMANDS = "commands";
const QString Translations::STATES = "states";
const QString Translations::CLASSES = "classes";
const QString Translations::HEROES = "heroes";
const QString Translations::MONSTERS = "monsters";
const QString Translations::TROOPS = "troops";
const QString Translations::ITEMS = "items";
const QString Translations::WEAPONS = "weapons";
const QString Translations::ARMORS = "armors";
const QString Translations::SKILLS = "skills";
const QString Translations::ANIMATIONS = "animations";
const QString Translations::STATUS = "status";
const QString Translations::MONSTERS_LIST = "monsters.list";
const QString Translations::PICTURE = "picture";
const QString Translations::POSITION = "position";
const QString Translations::FRAMES = "frames";
const QString Translations::GRAPHICS = "graphics";
const QString Translations::SOUND_EFFECTS_FLASHS = "sound.effects.flashs";
const QString Translations::CHANGE_BATTLER = "change.battler";
const QString Translations::COPY_FRAMES = "copy.frames";
const QString Translations::CLEAR_FRAMES = "clear.frames";
const QString Translations::CREATE_TRANSITION = "create.transition";
const QString Translations::APPLY_TEXTURE = "apply.texture";
const QString Translations::PLAY_HIT = "play.hit";
const QString Translations::PLAY_MISS = "play.miss";
const QString Translations::PLAY_CRIT = "play.crit";
const QString Translations::ROWS = "rows";
const QString Translations::COLUMNS = "columns";
const QString Translations::CHOOSE = "choose";
const QString Translations::SHOW_COLLISIONS_BB = "show.collisions.bb";
const QString Translations::TYPE_EXPORT = "type.export";
const QString Translations::DEPLOY_DESKTOP = "deploy.desktop";
const QString Translations::OS = "os";
const QString Translations::PROTECT_DATAS = "protect.datas";
const QString Translations::DEPLOY_WEB = "deploy.web";
const QString Translations::VERSION = "version";
const QString Translations::MAJOR = "major";
const QString Translations::MINOR = "minor";
const QString Translations::FIRST_LAUNCH_1 = "first.launch.1";
const QString Translations::FIRST_LAUNCH_2 = "first.launch.2";
const QString Translations::FIRST_LAUNCH_3 = "first.launch.3";
const QString Translations::FIRST_LAUNCH_4 = "first.launch.4";
const QString Translations::FIRST_LAUNCH_5 = "first.launch.5";
const QString Translations::FIRST_LAUNCH_6 = "first.launch.6";
const QString Translations::HERE = "here";
const QString Translations::THEME = "theme";
const QString Translations::NEED_RESTART = "need.restart";
const QString Translations::DARK = "dark";
const QString Translations::WHITE = "white";
const QString Translations::ENGINE_CONTROLS = "engine.controls";
const QString Translations::GAME_CONTROLS = "game.controls";
const QString Translations::MENU_CONTROLS = "menu.controls";
const QString Translations::ACTION = "action";
const QString Translations::UP = "up";
const QString Translations::DOWN = "down";
const QString Translations::LEFT = "left";
const QString Translations::RIGHT = "right";
const QString Translations::AUTO = "auto";
const QString Translations::NAME = "name";
const QString Translations::LENGTH = "length";
const QString Translations::WIDTH = "width";
const QString Translations::HEIGHT = "height";
const QString Translations::DEPTH = "depth";
const QString Translations::MUSIC = "music";
const QString Translations::BACKGROUND_SOUND = "background.sound";
const QString Translations::CAMERA_PROP = "camera.prop";
const QString Translations::SKY = "sky";
const QString Translations::COLOR = "color";
const QString Translations::SKYBOX = "skybox";
const QString Translations::MAP_STARTUP_REACTIONS = "map.startup.reactions";
const QString Translations::BATTLES = "battles";
const QString Translations::WELCOME_FIRST_LAUNCH = "welcome.first.launch";
const QString Translations::CHOOSE_LOCATION = "choose.location";
const QString Translations::MAP_PROPERTIES = "map.properties";
const QString Translations::OBJECT = "object";
const QString Translations::SELECT_PICTURE = "select.picture";
const QString Translations::SELECT_RECT = "select.rect";
const QString Translations::X = "x";
const QString Translations::Y = "y";
const QString Translations::PX = "px";
const QString Translations::SELECT_MAP_POSITION = "select.map.position";
const QString Translations::SET_MAXIMUM = "set.maximum";
const QString Translations::MAXIMUM = "maximum";
const QString Translations::SELECT_SHAPE = "select.shape";
const QString Translations::SYSTEM = "system";
const QString Translations::GAME_NAME = "game.name";
const QString Translations::GAME_NATIVE_RESOLUTION = "game.native.resolution";
const QString Translations::DISPLAY_CONSOLE = "display.console";
const QString Translations::SQUARE_SIZE = "square.size";
const QString Translations::IN_PX = "in.px";
const QString Translations::RAY_PORTIONS = "ray.portions";
const QString Translations::EDITOR = "editor";
const QString Translations::INGAME = "ingame";
const QString Translations::MOUNTAIN_COLLISION_HEIGHT_LIMIT_1 = "mountain.collision.height.limit.1";
const QString Translations::MOUNTAIN_COLLISION_HEIGHT_LIMIT_2 = "mountain.collision.height.limit.2";
const QString Translations::MOUNTAIN_COLLISION_ANGLE_LIMIT_1 = "mountain.collision.angle.limit.1";
const QString Translations::MOUNTAIN_COLLISION_ANGLE_LIMIT_2 = "mountain.collision.angle.limit.2";
const QString Translations::ANIMATION_FRAMES = "animation.frames";
const QString Translations::GLOBAL_SOUNDS = "global.sounds";
const QString Translations::CURSOR = "cursor";
const QString Translations::CONFIRMATION = "confirmation";
const QString Translations::IMPOSSIBLE = "impossible";
const QString Translations::OTHER_OPTIONS = "other.options";
const QString Translations::DEFAULT_DIALOG_BOX_OPTIONS = "default.dialog.box.options";
const QString Translations::SELECT = "select";
const QString Translations::MAX_NUMBER_SAVE_SLOTS = "max.number.save.slots";
const QString Translations::PRICE_SOLD_ITEM = "price.sold.item";
const QString Translations::OF_DEFAULT_PRICE = "of.default.price";
const QString Translations::FONT_SIZES = "font.sizes";
const QString Translations::FONT_NAMES = "font.names";
const QString Translations::COLORS = "colors";
const QString Translations::WINDOW_SKINS = "window.skins";
const QString Translations::CURRENCIES = "currencies";
const QString Translations::SPEEDS = "speeds";
const QString Translations::DETECTIONS = "detections";
const QString Translations::CAMERA_PROPERTIES = "camera.properties";
const QString Translations::FREQUENCIES = "frequencies";
const QString Translations::STATISTIC_ASSOCIATED_LEVEL = "statistic.associated.level";
const QString Translations::STATISTIC_ASSOCIATED_EXP = "statistic.associated.exp";
const QString Translations::FORMULAS = "formulas";
const QString Translations::IS_DEAD = "is.dead";
const QString Translations::CRITICAL_INFLUENCE = "critical.influence";
const QString Translations::MUSICS = "musics";
const QString Translations::BATTLE = "battle";
const QString Translations::LEVEL_UP = "level.up";
const QString Translations::VICTORY = "victory";
const QString Translations::BATTLE_MAPS = "battle.maps";
const QString Translations::ELEMENTS = "elements";
const QString Translations::COMMON_STATISTICS = "common.statistics";
const QString Translations::WEAPONS_KIND = "weapons.kind";
const QString Translations::COMMON_BATTLE_COMMANDS = "common.battle.commands";
const QString Translations::COMMON_EQUIPMENTS = "common.equipments";
const QString Translations::ARMORS_KIND = "armors.kind";
const QString Translations::BACKGROUND = "background";
const QString Translations::IMAGE = "image";
const QString Translations::VIDEO = "video";
const QString Translations::MENU_COMMANDS = "menu.commands";
const QString Translations::SETTINGS_CONFIGURATION = "settings.configuration";
const QString Translations::ITEMS_TYPES = "items.types";
const QString Translations::EVENTS = "events";
const QString Translations::PARAMETERS = "parameters";
const QString Translations::BATTLE_SYSTEM = "battle.system";
const QString Translations::TITLE_SCREEN_GAME_OVER = "title.screen.game.over";
const QString Translations::MAIN_MENU = "main.menu";
const QString Translations::EVENTS_STATES = "events.states";
const QString Translations::COMMON_REACTIONS = "common.reactions";
const QString Translations::BLOCK_HERO_WHEN_REACTION = "block.hero.when.reaction";
const QString Translations::MODELS = "models";
const QString Translations::SELECT_TILESET_RECT = "select.tileset.rect";
const QString Translations::VARIABLES = "variables";
const QString Translations::SELECT_VIDEO = "select.video";
const QString Translations::FROM = "from";
const QString Translations::TO = "to";
const QString Translations::FRAMES_TO_COPY = "frames.to.copy";
const QString Translations::PASTE_FROM_FRAME = "paste.from.frame";
const QString Translations::ELEMENTS_INDEX = "elements.index";
const QString Translations::ZOOM = "zoom";
const QString Translations::ANGLE = "angle";
const QString Translations::OPACITY = "opacity";
const QString Translations::ALLOW = "allow";
const QString Translations::COMMON_REACTION = "common.reaction";
const QString Translations::PARAMETER_VALUES = "parameter.values";
const QString Translations::SELECTION = "selection";
const QString Translations::PROPERTY_ID = "property.id";
const QString Translations::OPERATION = "operation";
const QString Translations::VALUE = "value";
const QString Translations::NEW_VALUE = "new.value";
const QString Translations::EQUALS = "equals";
const QString Translations::PLUS = "plus";
const QString Translations::MINUS = "minus";
const QString Translations::TIMES = "times";
const QString Translations::DIVIDED_BY = "divided.by";
const QString Translations::MODULO = "modulo";
const QString Translations::RED = "red";
const QString Translations::GREEN = "green";
const QString Translations::BLUE = "blue";
const QString Translations::GREY = "grey";
const QString Translations::ADDING_COLOR_ID = "adding.color.id";
const QString Translations::WAIT_END_CHANGE_BEFORE_NEXT_COMMAND = "wait.end.change.before.next.command";
const QString Translations::TIME = "time";
const QString Translations::SECONDS = "seconds";
const QString Translations::STATE_ID = "state.id";
const QString Translations::REPLACE = "replace";
const QString Translations::ADD = "add";
const QString Translations::REMOVE = "remove";
const QString Translations::ONE_VARIABLE = "one.variable";
const QString Translations::RANGE = "range";
const QString Translations::TO_SMALL = "to.small";
const QString Translations::NUMBER = "number";
const QString Translations::RANDOM_NUMBER = "random.number";
const QString Translations::MESSAGE = "message";
const QString Translations::SWITCH = "switch";
const QString Translations::AN_OBJECT_IN_MAP = "an.object.in.map";
const QString Translations::VARIABLES_PARAM_PROP = "variables.param.prop";
const QString Translations::POSSESSIONS = "possessions";
const QString Translations::OTHERS = "others";
const QString Translations::THIS = "this";
const QString Translations::IS = "is";
const QString Translations::ADD_ELSE_CONDITIONS_NOT_APPLY = "add.else.conditions.not.apply";
const QString Translations::HERO_MAYBE_MORE = "hero.maybe.more";
const QString Translations::IN = "in";
const QString Translations::ARE_NAMED = "are.named";
const QString Translations::ARE_IN = "are.in";
const QString Translations::ARE_ABLE_SKILL_ID = "are.able.skill.id";
const QString Translations::ARE_EQUIPED_WITH = "are.equiped.with";
const QString Translations::WEAPON_ID = "weapon.id";
const QString Translations::ARMOR_ID = "armor.id";
const QString Translations::ARE_UNDER_EFFECT_STATUS_ID = "are.under.effect.status.id";
const QString Translations::HAVE_STATISTIC_ID = "have.statistic.id";
const QString Translations::CURRENCY_ID = "currency.id";
const QString Translations::ITEM_ID = "item.id";
const QString Translations::NUMBER_IN_INVENTORY_IS = "number.in.inventory.is";
const QString Translations::CHECK_WEAPONS_EQUIPED_TOO = "check.weapons.equiped.too";
const QString Translations::CHECK_ARMORS_EQUIPED_TOO = "check.armors.equiped.too";
const QString Translations::KEY_ID = "key.id";
const QString Translations::IMAGE_ID = "image.id";
const QString Translations::INDEX = "index";
const QString Translations::ORIGIN = "origin";
const QString Translations::COORDINATES = "coordinates";
const QString Translations::EFFECTS = "effects";
const QString Translations::CHOICES = "choices";
const QString Translations::CANCEL_AUTO_INDEX = "cancel.auto.index";
const QString Translations::VARIABLE_ASSIGNMENT = "variable.assignment";
const QString Translations::CREATE_NEW_INSTANCE_WITH_LEVEL = "create.new.instance.with.level";
const QString Translations::HERO = "hero";
const QString Translations::MONSTER_ID = "monster.id";
const QString Translations::OF = "of";
const QString Translations::STOCK_INSTANCE_ID_IN = "stock.instance.id.in";
const QString Translations::CAMERA_TARGET = "camera.target";
const QString Translations::UNCHANGED = "unchanged";
const QString Translations::OBJECT_ID = "object.id";
const QString Translations::MOVE = "move";
const QString Translations::TARGET_OFFSET = "target.offset";
const QString Translations::TAKE_ACCOUNT_CAMERA_ORIENTATION = "take.account.camera.orientation";
const QString Translations::Z = "Z";
const QString Translations::ROTATION = "rotation";
const QString Translations::HORIZONTAL = "horizontal";
const QString Translations::VERTICAL = "vertical";
const QString Translations::DISTANCE = "distance";
const QString Translations::WAIT_END_MOVE_BEFORE_NEXT_COMMAND = "wait.end.move.before.next.command";
const QString Translations::IGNORE_IF_IMPOSSIBLE = "ignore.if.impossible";
const QString Translations::WAIT_END_MOVES = "wait.end.moves";
const QString Translations::WITH_CAMERA_ORIENTATION = "with.camera.orientation";
const QString Translations::MOVES = "moves";
const QString Translations::STEP_SQUARE_MOVES = "step.square.moves";
const QString Translations::ONE_TO_NORTH = "1.to.north";
const QString Translations::ONE_TO_SOUTH = "1.to.south";
const QString Translations::ONE_TO_WEST = "1.to.west";
const QString Translations::ONE_TO_EAST = "1.to.east";
const QString Translations::ONE_TO_NORTH_WEST = "1.to.north.west";
const QString Translations::ONE_TO_NORTH_EAST = "1.to.north.east";
const QString Translations::ONE_TO_SOUTH_WEST = "1.to.south-west";
const QString Translations::ONE_TO_SOUTH_EAST = "1.to.south-east";
const QString Translations::ONE_TO_RANDOME = "1.to.random";
const QString Translations::ONE_TO_HERO = "1.to.hero";
const QString Translations::ONE_OPPOSITE_TO_HERO = "1.opposite.to.hero";
const QString Translations::ONE_IN_FRONT = "1.in.front";
const QString Translations::ONE_BACK = "1.back";
const QString Translations::CHANGE_DIRECTION = "change.direction";
const QString Translations::CHANGE_OBJECT_PROPERTIES = "change.object.properties";
const QString Translations::SELECT_SONG_ID = "select.song.id";
const QString Translations::IMAGE_INDEX = "image.index";
const QString Translations::USE_DYNAMIC = "use.dynamic";
const QString Translations::TARGET = "target";
const QString Translations::ALL = "all";
const QString Translations::DETECTION_ID = "detection.id";
const QString Translations::SENDER_CANT_RECEIVE = "sender.cant.receive";
const QString Translations::WINDOW_SKIN_ID = "window.skin.id";
const QString Translations::TRANSFORM = "transform";
const QString Translations::PADDING = "padding";
const QString Translations::FACESET = "faceset";
const QString Translations::TEXT = "text";
const QString Translations::OUTLINE = "outline";
const QString Translations::COLOR_ID = "color.id";
const QString Translations::SIZE_ID = "size.id";
const QString Translations::FONT_ID = "font.id";
const QString Translations::SET = "set";
const QString Translations::MOVE_VERB = "move.verb";
const QString Translations::TURN_VERB = "turn.verb";
const QString Translations::WAIT_END_ACTIONS_BEFORE_NEXT_COMMAND = "wait.end.actions.before.next.command";
const QString Translations::INTERLOCUTOR = "interlocutor";
const QString Translations::FONT_SIZE = "font.size";
const QString Translations::FONT_NAME = "font.name";
const QString Translations::TEXT_COLOR = "text.color";
const QString Translations::BACK_COLOR = "back.color";
const QString Translations::OUTLINE_COLOR = "outline.color";
const QString Translations::VARIABLE = "variable";
const QString Translations::PARAMETER = "parameter";
const QString Translations::PROPERTY = "property";
const QString Translations::HERO_NAME = "hero.name";
const QString Translations::ICON = "icon";
const QString Translations::TROOP_ID = "troop.id";
const QString Translations::ID = "ID";
const QString Translations::RANDOM = "random";
const QString Translations::IN_MAP_PROPERTY = "in.map.property";
const QString Translations::BATTLE_MAP = "battle.map";
const QString Translations::MAP_ID = "map.id";
const QString Translations::Y_PLUS = "y.plus";
const QString Translations::ALLOW_ESCAPE = "allow.escape";
const QString Translations::DEFEAT_CAUSES_GAME_OVER = "defeat.causes.game.over";
const QString Translations::TRANSITION = "transition";
const QString Translations::START = "start";
const QString Translations::END = "end";
const QString Translations::DISAPPEAR_WITH_TIME = "disappear.with.time";
const QString Translations::DIRECTION = "direction";
const QString Translations::SHADING_BEFORE = "shading.before";
const QString Translations::SHADING_AFTER = "shading.after";
const QString Translations::FOR_TILESET = "for.tileset";
const QString Translations::COMPLETE_LIST = "compelte.list";
const QString Translations::SHAPE = "shape";
const QString Translations::MTL = "mtl";
const QString Translations::TEXTURE = "texture";
const QString Translations::SCALE = "scale";
const QString Translations::SIZE = "size";
const QString Translations::SQUARE_S = "square.s";
const QString Translations::PIXEL_S = "pixel.s";
const QString Translations::SET_ANIMATION_EFFECT = "set.aniamtion.effect";
const QString Translations::SOUND_EFFECT = "sound.effect";
const QString Translations::FLASH = "flash";
const QString Translations::EDIT = "edit";
const QString Translations::EDIT_ANIMATION_ELEMENT = "edit.animation.element";
const QString Translations::FLIP_VERTICALY = "flip.verticaly";
const QString Translations::SET_BATTLE_COMMAND = "set.battle.command";
const QString Translations::SKILL_ID = "skill.id";
const QString Translations::SET_BATTLE_MAP = "set.battle.map";
const QString Translations::CAMERA_PROPERTIES_ID = "camera.properties.id";
const QString Translations::SET_CAMERA_PROPERTIES = "set.camera.properties";
const QString Translations::HORIZONTAL_ANGLE = "horizontal.angle";
const QString Translations::VERTICAL_ANGLE = "vertical.angle";
const QString Translations::FIELD_OF_VIEW = "field.of.view";
const QString Translations::NEAR = "near";
const QString Translations::FAR = "far";
const QString Translations::SET_CHARACTERISTIC = "set.characteristic";
const QString Translations::BUFF = "buff";
const QString Translations::CHARACTER_SPECIFIC = "character.specific";
const QString Translations::OTHER = "other";
const QString Translations::SET_SKILL_LEARN = "set.skill.learn";
const QString Translations::LEVEL = "level";
const QString Translations::SET_COLOR = "set.color";
const QString Translations::CHANGE_COLOR = "change.color";
const QString Translations::SET_COST = "set.cost";
const QString Translations::APPLY_COST_ON = "apply.cost.on";
const QString Translations::WITH_VALUE = "with.value";
const QString Translations::SET_PARAMETER = "set.parameter";
const QString Translations::DEFAULT_VALUE = "default.value";
const QString Translations::SET_CURRENCY = "set.currency";
const QString Translations::SET_DETECTION = "set.detection";
const QString Translations::FIELD = "field";
const QString Translations::TOP = "top";
const QString Translations::BOT = "bot";
const QString Translations::NEW_BOX_HEIGHT = "new.box.height";
const QString Translations::BIG_SQUARE_S = "big.square.s";
const QString Translations::BIG_PIXEL_S = "big.pixel.s";
const QString Translations::AUTOMATIC = "automatic";
const QString Translations::RADIUS = "radius";
const QString Translations::GENERATE = "generate";
const QString Translations::DETECTION_DESCRIPTION = "detection.description";
const QString Translations::SET_EFFECT = "set.effect";
const QString Translations::DAMAGES_ON = "damages.on";
const QString Translations::WITH_FORMULA = "with.formula";
const QString Translations::MINIMUM = "minimum";
const QString Translations::ELEMENT_ID = "element.id";
const QString Translations::VARIANCE = "variance";
const QString Translations::CRITICAL = "critical";
const QString Translations::PRECISION = "precision";
const QString Translations::SPECIAL_ACTION = "special.action";
const QString Translations::SET_ELEMENT = "set.element";
const QString Translations::EFFICIENCY = "efficiency";
const QString Translations::SET_FONT_NAME = "set.font.name";
const QString Translations::FONT = "font";
const QString Translations::SET_FONT_SIZE = "set.font.size";
const QString Translations::SET_SHORTCUTS = "set.shortcuts";
const QString Translations::REMOVE_LAST = "remove.last";
const QString Translations::REMOVE_ALL = "remove.all";
const QString Translations::SET_KEYBOARD = "set.keyboard";
const QString Translations::ABBREVIATION_JS = "abbreviation.js";
const QString Translations::DESCRIPTION = "description";
const QString Translations::SHORTCUT = "shortcut";
const QString Translations::CHANGE = "change";
const QString Translations::SET_NAME = "set.name";
const QString Translations::SET_LOOT = "set.loot";
const QString Translations::PROBABILITY = "probability";
const QString Translations::LEVEL_BETWEEN = "level.between";
const QString Translations::AND = "and";
const QString Translations::LOOT = "loot";
const QString Translations::SET_MONSTER_TROOP = "set.monster.troop";
const QString Translations::SET_EVENT = "set.event";
const QString Translations::SET_PARAMETER_VALUE = "set.parameter.value";
const QString Translations::SET_PROPERTY = "set.property";
const QString Translations::INITIAL_VALUE = "initial.value";
const QString Translations::SELECT_A_STATE = "select.a.state";
const QString Translations::UPDATE_COMPLETE_LIST = "update.complete.list";
const QString Translations::SET_STATISTIC = "set.statistic";
const QString Translations::SCRIPT_ABBREVIATION = "script.abbreviation";
const QString Translations::PROPERTIES = "properties";
const QString Translations::FIX = "fix";
const QString Translations::BAR = "bar";
const QString Translations::SET_STATISTIC_PROGRESSION = "set.statistic.progression";
const QString Translations::INFORMATION = "information";
const QString Translations::STATISTIC_ID = "statistic.id";
const QString Translations::MAXIMUM_VALUE = "maximum.value";
const QString Translations::RANDOM_VARIATION = "random.variation";
const QString Translations::FORMULA = "formula";
const QString Translations::SET_TITLE_COMMAND = "set.title.command";
const QString Translations::TYPE_OF_COMMAND = "type.of.command";
const QString Translations::SET_KIND = "set.kind";
const QString Translations::SET_WINDOW_SKIN = "set.window.skin";
const QString Translations::SIDE_BORDERS = "side.borders";
const QString Translations::BORDERS = "borders";
const QString Translations::ARROWS = "arrows";
const QString Translations::TEXTS = "texts";
const QString Translations::CLASS = "class";
const QString Translations::BATTLER = "battler";
const QString Translations::EXPERIENCE = "experience";
const QString Translations::TO_NEXT_LEVEL = "to.next.level";
const QString Translations::TOTAL = "total";
const QString Translations::INITIAL_LEVEL = "initial.level";
const QString Translations::BASE = "base";
const QString Translations::MAX_LEVEL = "max.level";
const QString Translations::INFLATION = "inflation";
const QString Translations::RESET = "reset";
const QString Translations::SET_TO_CLASS_VALUES = "set.to.class.values";
const QString Translations::CHARACTERISTICS = "characteristics";
const QString Translations::STATISTICS_PROGRESSION = "statistics.progression";
const QString Translations::SKILLS_TO_LEARN = "skills.to.learn";
const QString Translations::TYPE = "type";
const QString Translations::CONSOMABLE = "consomable";
const QString Translations::ONE_HAND = "one.hand";
const QString Translations::CONDITION_FORMULA = "condition.formula";
const QString Translations::TARGET_CONDITIONS_FORMULA = "target.conditions.formula";
const QString Translations::AVAILABLE = "available";
const QString Translations::SOUND_MAIN_MENU = "sound.main.menu";
const QString Translations::USER_ANIMATION_ID = "user.animation.id";
const QString Translations::TARGET_ANIMATION_ID = "target.animation.id";
const QString Translations::PRICE = "price";
const QString Translations::COSTS = "costs";
const QString Translations::REWARDS = "rewards";
const QString Translations::LOOTS = "loots";
const QString Translations::ACTIONS = "actions";
const QString Translations::ONLY_ONE_EVENT_PER_FRAME = "only.one.event.per.frame";
const QString Translations::DETECTION = "detection";
const QString Translations::MOVING = "moving";
const QString Translations::EDIT_ROUTE = "edit.route";
const QString Translations::SPEED = "speed";
const QString Translations::FREQ = "freq";
const QString Translations::MOVE_ANIMATION = "move.animation";
const QString Translations::THOUGH = "through";
const QString Translations::STOP_ANIMATION = "stop.animation";
const QString Translations::SET_WITH_CAMERA = "set.with.camera";
const QString Translations::CLIMB_ANIMATION = "climb.animation";
const QString Translations::PIXEL_OFFSET = "pixel.offset";
const QString Translations::DIRECTION_FIX = "direction.fix";
const QString Translations::KEEP_POSITION = "keep.position";
const QString Translations::EVENT_SYSTEM = "event.system";
const QString Translations::EVENT_USER = "event.user";
const QString Translations::SHOW_AVAILABLE_CONTENT = "show.available.content";
const QString Translations::REFRESH = "refresh";
const QString Translations::TABLE = "table";
const QString Translations::GRAPH = "graph";
const QString Translations::VOLUME = "volume";
const QString Translations::APPLY_ON_LEFT_RIGHT_CLICK = "apply.on.left.right.click";
const QString Translations::UPDATE_LIST = "update.list";
const QString Translations::SELECTED_OBJECT = "selected.object";
const QString Translations::FLOOR = "floor";
const QString Translations::AUTOTILE = "autotile";
const QString Translations::ANIMATED_AUTOTILE = "animated.autotile";
const QString Translations::FACE_SPRITE = "face.sprite";
const QString Translations::FIX_SPRITE = "fix.sprite";
const QString Translations::DOUBLE_SPRITE = "double.sprite";
const QString Translations::QUADRA_SPRITE = "quadra.sprite";
const QString Translations::WALL = "wall";
const QString Translations::MOUNTAIN = "mountain";
const QString Translations::THREED_OBJECT = "threed.object";
const QString Translations::TOP_FLOOR = "top.floor";
const QString Translations::BORDER_WIDTH = "border.width";
const QString Translations::ENTER = "enter";
const QString Translations::SLOW = "slow";
const QString Translations::LINEAR = "linear";
const QString Translations::FAST = "fast";
const QString Translations::PRATICABLE = "praticable";
const QString Translations::DIRECTIONS = "directions";
const QString Translations::REPEAT = "repeat";
const QString Translations::STATISTIC = "statistic";
const QString Translations::CURRENCY = "currency";
const QString Translations::APPLY_WEAPON_EFFECTS = "apply.weapon.effects";
const QString Translations::OPEN_SKILLS_CHOICE = "open.skills.choice";
const QString Translations::OPEN_ITEMS_CHOICE = "open.items.choice";
const QString Translations::ESCAPE = "escape";
const QString Translations::END_TURN = "end.turn";
const QString Translations::STATISTIC_VALUE = "statistic.value";
const QString Translations::ELEMENT_RESISTANCE = "element.resistance";
const QString Translations::STATUS_RESISTANCE = "status.resistance";
const QString Translations::EXPERIENCE_GAIN = "experience.gain";
const QString Translations::CURRENCY_GAIN = "currency.gain";
const QString Translations::SKILL_COST = "skill.cost";
const QString Translations::TEAM = "team";
const QString Translations::RESERVE = "reserve";
const QString Translations::HIDDEN = "hidden";
const QString Translations::EQUAL_TO = "equal.to";
const QString Translations::NOT_EQUAL_TO = "not.equal.to";
const QString Translations::GREATER_THAN_OR_EQUAL_TO = "greater.than.or.equal.to";
const QString Translations::LESSER_THAN_OR_EQUAL_TO = "lesser.than.or.equal.to";
const QString Translations::GREATER_THAN = "greater.than";
const QString Translations::LESSER_THAN = "lesser.than";
const QString Translations::KEYBOARD_ASSIGNMENTS = "keyboard.assignments";
const QString Translations::ALL_HEROES = "all.heroes";
const QString Translations::NONE_OF_HEROES = "none.of.heroes";
const QString Translations::AT_LEAST_ONE_HERO = "at.least.one.hero";
const QString Translations::HERO_WITH_INSTANCE_ID = "hero.with.instance.id";
const QString Translations::X_SQUARE_POSITION = "x.square.position";
const QString Translations::Y_SQUARE_POSITION = "y.square.position";
const QString Translations::Z_SQUARE_POSITION = "z.square.position";
const QString Translations::X_PIXEL_POSITION = "x.pixel.position";
const QString Translations::Y_PIXEL_POSITION = "y.pixel.position";
const QString Translations::Z_PIXEL_POSITION = "z.pixel.position";
const QString Translations::ORIENTATION = "orientation";
const QString Translations::MIDDLE = "middle";
const QString Translations::BOTTOM = "bottom";
const QString Translations::SCREEN_CENTER = "screen.center";
const QString Translations::HIT = "hit";
const QString Translations::MISS = "miss";
const QString Translations::USER = "user";
const QString Translations::AN_ENEMY = "an.enemy";
const QString Translations::AN_ALLY = "an.ally";
const QString Translations::ALL_ENEMIES = "all.enemies";
const QString Translations::ALL_ALLIES = "all.allies";
const QString Translations::BATTLE_ONLY = "battle.only";
const QString Translations::MAIN_MENU_ONLY = "main.menu.only";
const QString Translations::ALWAYS = "always";
const QString Translations::NEVER = "never";
const QString Translations::ROUTE = "route";
const QString Translations::TOP_LEFT = "top.left";
const QString Translations::CENTER = "center";
const QString Translations::SQUARE = "square";
const QString Translations::STEP = "step";
const QString Translations::BEHIND = "behind";
const QString Translations::ABOVE = "above";
const QString Translations::YES = "yes";
const QString Translations::NO = "no";
const QString Translations::FADE_IN = "fade.in";
const QString Translations::ZOOM_IN = "zoom.in";
const QString Translations::FADE_OUT = "fade.out";
const QString Translations::ZOOM_OUT = "zoom.out";
const QString Translations::BOX = "box";
const QString Translations::SPHERE = "sphere";
const QString Translations::CYLINDER = "cylinder";
const QString Translations::CONE = "cone";
const QString Translations::CAPSULE = "capsule";
const QString Translations::STRETCH = "stretch";
const QString Translations::PERFECT_SIZE = "perfect.size";
const QString Translations::INCREASE = "increase";
const QString Translations::DECREASE = "decrease";
const QString Translations::SPECIFIC = "specific";
const QString Translations::CIRCLE = "circle";
const QString Translations::RECTANGLE = "rectangle";
const QString Translations::STAGING = "staging";
const QString Translations::STRUCTURE = "structure";
const QString Translations::DIALOGS = "dialogs";
const QString Translations::VISUAL_EFFECTS = "visual.effects";
const QString Translations::MOVES_ANIMATIONS_CAMERA = "moves.animations.camera";
const QString Translations::MEDIA = "media";
const QString Translations::MENUS = "menus";
const QString Translations::MUSICS_SOUNDS = "musics.sounds";
const QString Translations::OBJETS_INTERACTIONS = "objects.interactions";
const QString Translations::SYSTEM_PARAMETERS = "system.parameters";
const QString Translations::HEROES_ENEMIES = "heroes.enemies";
const QString Translations::SYNTAX = "syntax";
const QString Translations::ADVANCED = "advanced";
const QString Translations::SLOPES = "slopes";
const QString Translations::CLOSE = "close";
const QString Translations::WINDOW = "window";
const QString Translations::FULL_SCREEN = "full.screen";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Translations::Translations()
{
    QFile file(RPM::PATH_TRANSLATIONS_CURRENT_LANGUAGE);
    if(!file.open(QIODevice::ReadOnly)) {
        QMessageBox::information(nullptr, "Error", file.errorString());
    }
    QTextStream in(&file);
    m_currentLanguage = in.readLine();
    file.close();
}

Translations::~Translations()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Translations::read()
{
    // Define all existing languages
    this->readLanguages();

    // Read translations for current language only
    this->readTranslations();
}

// -------------------------------------------------------

void Translations::readLanguages()
{
    QJsonDocument doc;
    QJsonObject obj;
    QJsonArray tab;
    int i, l;

    Common::readOtherJSON(RPM::PATH_TRANSLATIONS_LANGUAGES, doc);
    obj = doc.object();
    tab = obj[JSON_NAMES].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_languagesNames << tab.at(i).toString();
    }
    tab = obj[JSON_SHORT].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        m_languagesShort << tab.at(i).toString();
    }
}

// -------------------------------------------------------

void Translations::readTranslations()
{
    QJsonDocument doc;
    QJsonObject obj;
    QStringList keys;
    QString key;
    int i, l;

    Common::readOtherJSON(Common::pathCombine(RPM::PATH_TRANSLATIONS,
        Translations::JSON_TRANSLATIONS + RPM::DASH + m_currentLanguage + RPM
        ::EXTENSION_JSON), doc);
    obj = doc.object();
    keys = obj.keys();
    for (i = 0, l = keys.size(); i < l; i++) {
        key = keys.at(i);
        m_translations.insert(key, obj[key].toString());
    }
}

// -------------------------------------------------------

QString Translations::get(const QString &key)
{
    return m_translations.value(key);
}

// -------------------------------------------------------

void Translations::translateButtonBox(QDialogButtonBox *buttonBox)
{
    buttonBox->button(QDialogButtonBox::Ok)->setText(RPM::translate(Translations
        ::OK));
    buttonBox->button(QDialogButtonBox::Cancel)->setText(RPM::translate(
        Translations::CANCEL));
}
