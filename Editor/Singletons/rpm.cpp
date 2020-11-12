/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include <QJsonObject>
#include <QJsonDocument>
#include <QDebug>
#include <QStandardPaths>
#include <QDirIterator>
#include <cmath>
#include "rpm.h"
#include "common.h"
#include "systemcommonreaction.h"

// COLORS
const QColor RPM::COLOR_GRAY_SELECTION_DARKER = QColor(60, 60, 60);
const QColor RPM::COLOR_GRAY_SELECTION = QColor(80, 80, 80);
const QColor RPM::COLOR_GRAY_SELECTION_LIGHTER = QColor(220, 220, 220);
const QColor RPM::COLOR_GRAY_SELECTION_BACKGROUND = QColor(80, 80, 80, 75);
const QColor RPM::COLOR_GRAY_HOVER_BACKGROUND = QColor(50, 50, 50, 75);
const QColor RPM::COLOR_PURPLE_SELECTION = QColor(134, 29, 226);
const QColor RPM::COLOR_PURPLE_SELCTION_BACKGROUND = QColor(134, 29, 226, 75);
const QColor RPM::COLOR_ALMOST_WHITE = QColor(245, 245, 245);
const QColor RPM::COLOR_ALMOST_BLACK = QColor(25, 25, 25);
const QColor RPM::COLOR_ALMOST_TRANSPARENT = QColor(0, 0, 0, 20);
const QColor RPM::COLOR_FORTY_TRANSPARENT = QColor(0, 0, 0, 40);
const QColor RPM::COLOR_GREY = QColor(90, 90, 90);
const QColor RPM::COLOR_MENU_SELECTION_BLUE = QColor(47, 139, 196);
const QColor RPM::COLOR_CURSOR_SELECTION = QColor(100, 130, 170, 100);
const QColor RPM::COLOR_COMMAND_COMMENT = QColor(18, 135, 90);

// COMMON JSON
const QString RPM::JSON_KEY = "k";
const QString RPM::JSON_VALUE = "v";

// EXTENSIONS
const QString RPM::EXTENSION_JSON = ".json";
const QString RPM::EXTENSION_QSS = ".qss";
const QString RPM::EXTENSION_RPM = ".rpm";
const QString RPM::EXTENSION_PNG = ".png";
const QString RPM::EXTENSION_JPG = ".jpg";
const QString RPM::EXTENSION_JS = ".js";
const QString RPM::EXTENSION_HTML = ".html";

// STRING SYMBOLS
const QString RPM::DASH = "-";
const QString RPM::SLASH = "/";
const QString RPM::COLON = ":";
const QString RPM::DOT = ".";
const QString RPM::DOT_DOT_DOT = "...";
const QString RPM::SPACE = " ";
const QString RPM::COMMA = ",";
const QString RPM::NEW_LINE = "\n";
const QString RPM::PARENTHESIS_LEFT = "(";
const QString RPM::PARENTHESIS_RIGHT = ")";
const QString RPM::BRACKET_LEFT = "[";
const QString RPM::BRACKET_RIGHT = "]";
const QString RPM::EQUAL = "=";
const QString RPM::PLUS = "+";
const QString RPM::MINUS = "-";
const QString RPM::TIMES = "*";
const QString RPM::DIVIDED_BY = "/";
const QString RPM::MODULO = "%";
const QString RPM::TRUE_BOOL_STRING = "1";
const QString RPM::FALSE_BOOL_STRING = "0";
const QString RPM::TAG_OPEN_STRONG = "<strong>";
const QString RPM::TAG_CLOSE_STRONG = "</strong>";
const QString RPM::TAG_OPEN_A = "<a href=\"";
const QString RPM::TAG_MIDDLE_A = "\" style=\"color: tomato;\">";
const QString RPM::TAG_CLOSE_A = "</a>";

// FILE / FOLDER NAMES
const QString RPM::FILE_MAP_INFOS = "infos" + EXTENSION_JSON;
const QString RPM::FILE_MAP_OBJECTS = "objects" + EXTENSION_JSON;
const QString RPM::FILE_MAIN = "main" + EXTENSION_JS;
const QString RPM::FILE_INDEX = "index" + EXTENSION_HTML;
const QString RPM::FILE_PACKAGE = "package" + EXTENSION_JSON;
const QString RPM::FOLDER_GAMES = "RPG Paper Maker Games";
const QString RPM::FOLDER_DESKTOP = "desktop";
const QString RPM::FOLDER_CONTENT = "Content";
const QString RPM::FOLDER_TEMP_MAP = "temp";
const QString RPM::FOLDER_UNDO_REDO_TEMP_MAP = "tempUndoRedo";
const QString RPM::FOLDER_APP = "app";
#ifdef Q_OS_MACOS
    const QString RPM::FOLDER_RESOURCES = "Resources";
#else
    const QString RPM::FOLDER_RESOURCES = "resources";
#endif
const QString RPM::FOLDER_EXAMPLE = "example";

// PATHS
#ifdef Q_OS_MACOS
    const QString RPM::PATH_RESOURCES = Common::pathCombine(Common::pathCombine("Game.app", "Contents"), FOLDER_RESOURCES);
#else
    const QString RPM::PATH_RESOURCES = FOLDER_RESOURCES;
#endif
const QString RPM::PATH_APP = Common::pathCombine(PATH_RESOURCES, FOLDER_APP);
const QString RPM::PATH_BASIC = Common::pathCombine(FOLDER_CONTENT, "basic");
const QString RPM::PATH_BR = Common::pathCombine(FOLDER_CONTENT, "BR");
const QString RPM::PATH_DATAS = Common::pathCombine(FOLDER_CONTENT, "Datas");
const QString RPM::PATH_MAPS = Common::pathCombine(PATH_DATAS, "Maps");
const QString RPM::PATH_SCRIPTS_DIR = Common::pathCombine(PATH_DATAS, "Scripts");
const QString RPM::PATH_SAVES = Common::pathCombine(PATH_DATAS, "Saves");
const QString RPM::PATH_SCRIPTS_SYSTEM_DIR = Common::pathCombine(
    PATH_SCRIPTS_DIR, "System");
const QString RPM::PATH_SCRIPTS_PLUGINS_DIR = Common::pathCombine(
    PATH_SCRIPTS_DIR, "Plugins");
const QString RPM::PATH_COMMON_EVENTS = Common::pathCombine(PATH_DATAS,
    "commonEvents" + EXTENSION_JSON);
const QString RPM::PATH_VARIABLES = Common::pathCombine(PATH_DATAS,
    "variables" + EXTENSION_JSON);
const QString RPM::PATH_SYSTEM = Common::pathCombine(PATH_DATAS,
    "system" + EXTENSION_JSON);
const QString RPM::PATH_BATTLE_SYSTEM = Common::pathCombine(PATH_DATAS,
    "battleSystem" + EXTENSION_JSON);
const QString RPM::PATH_ITEMS = Common::pathCombine(PATH_DATAS,
    "items" + EXTENSION_JSON);
const QString RPM::PATH_SKILLS = Common::pathCombine(PATH_DATAS,
    "skills" + EXTENSION_JSON);
const QString RPM::PATH_WEAPONS = Common::pathCombine(PATH_DATAS,
    "weapons" + EXTENSION_JSON);
const QString RPM::PATH_ARMORS = Common::pathCombine(PATH_DATAS,
    "armors" + EXTENSION_JSON);
const QString RPM::PATH_HEROES = Common::pathCombine(PATH_DATAS,
    "heroes" + EXTENSION_JSON);
const QString RPM::PATH_MONSTERS = Common::pathCombine(PATH_DATAS,
    "monsters" + EXTENSION_JSON);
const QString RPM::PATH_TROOPS = Common::pathCombine(PATH_DATAS,
    "troops" + EXTENSION_JSON);
const QString RPM::PATH_CLASSES = Common::pathCombine(PATH_DATAS,
    "classes" + EXTENSION_JSON);
const QString RPM::PATH_TILESETS_DATAS = Common::pathCombine(PATH_DATAS,
    "tilesets" + EXTENSION_JSON);
const QString RPM::PATH_ANIMATIONS = Common::pathCombine(PATH_DATAS,
    "animations" + EXTENSION_JSON);
const QString RPM::PATH_STATUS = Common::pathCombine(PATH_DATAS,
    "status" + EXTENSION_JSON);
const QString RPM::PATH_SPECIAL_ELEMENTS = Common::pathCombine(PATH_DATAS,
    "specialElements" + EXTENSION_JSON);
const QString RPM::PATH_TITLE_SCREEN_GAME_OVER = Common::pathCombine(PATH_DATAS,
    "titlescreenGameover" + EXTENSION_JSON);
const QString RPM::PATH_TREE_MAP = Common::pathCombine(PATH_DATAS,
    "treeMap" + EXTENSION_JSON);
const QString RPM::PATH_LANGS = Common::pathCombine(PATH_DATAS,
    "langs" + EXTENSION_JSON);
const QString RPM::PATH_SCRIPTS = Common::pathCombine(PATH_DATAS,
    "scripts" + EXTENSION_JSON);
const QString RPM::PATH_KEYBOARD = Common::pathCombine(PATH_DATAS,
    "keyBoard" + EXTENSION_JSON);
const QString RPM::PATH_DLCS_DATAS = Common::pathCombine(PATH_DATAS,
    "dlcs" + EXTENSION_JSON);
const QString RPM::PATH_PICTURES_DATAS = Common::pathCombine(PATH_DATAS,
    "pictures" + EXTENSION_JSON);
const QString RPM::PATH_VIDEOS_DATAS = Common::pathCombine(PATH_DATAS,
    "videos" + EXTENSION_JSON);
const QString RPM::PATH_SONGS_DATAS = Common::pathCombine(PATH_DATAS,
    "songs" + EXTENSION_JSON);
const QString RPM::PATH_SHAPES_DATAS = Common::pathCombine(PATH_DATAS,
    "shapes" + EXTENSION_JSON);
const QString RPM::PATH_PICTURES = Common::pathCombine(FOLDER_CONTENT,
    "Images");
const QString RPM::PATH_HUD = Common::pathCombine(PATH_PICTURES,
    "HUD");
const QString RPM::PATH_TEXTURES_2D = Common::pathCombine(PATH_PICTURES,
    "Textures2D");
const QString RPM::PATH_BARS = Common::pathCombine(PATH_HUD,
    "Bars");
const QString RPM::PATH_ICONS = Common::pathCombine(PATH_HUD,
    "Icons");
const QString RPM::PATH_FACESETS = Common::pathCombine(PATH_HUD,
    "Facesets");
const QString RPM::PATH_WINDOW_SKINS = Common::pathCombine(PATH_HUD,
    "WindowSkins");
const QString RPM::PATH_TITLE_SCREEN = Common::pathCombine(PATH_HUD,
    "TitleScreen");
const QString RPM::PATH_HUD_ANIMATIONS = Common::pathCombine(PATH_HUD,
    "Animations");
const QString RPM::PATH_HUD_PICTURES = Common::pathCombine(PATH_HUD,
    "Pictures");
const QString RPM::PATH_AUTOTILES = Common::pathCombine(PATH_TEXTURES_2D,
    "Autotiles");
const QString RPM::PATH_CHARACTERS = Common::pathCombine(PATH_TEXTURES_2D,
    "Characters");
const QString RPM::PATH_TILESETS = Common::pathCombine(PATH_TEXTURES_2D,
    "Tilesets");
const QString RPM::PATH_SPRITE_WALLS = Common::pathCombine(PATH_TEXTURES_2D,
    "Walls");
const QString RPM::PATH_RELIEFS = Common::pathCombine(PATH_TEXTURES_2D,
    "Reliefs");
const QString RPM::PATH_MOUNTAINS = Common::pathCombine(PATH_TEXTURES_2D,
    "Mountains");
const QString RPM::PATH_TEXTURES_OBJECT_3D = Common::pathCombine(PATH_TEXTURES_2D,
    "Objects3D");
const QString RPM::PATH_BATTLERS = Common::pathCombine(PATH_TEXTURES_2D,
    "Battlers");
const QString RPM::PATH_SKY_BOXES = Common::pathCombine(PATH_TEXTURES_2D,
    "SkyBoxes");
const QString RPM::PATH_VIDEOS = Common::pathCombine(FOLDER_CONTENT,
    "Videos");
const QString RPM::PATH_SONGS = Common::pathCombine(FOLDER_CONTENT,
    "Songs");
const QString RPM::PATH_MUSICS = Common::pathCombine(PATH_SONGS,
    "Musics");
const QString RPM::PATH_BACKGROUND_SOUNDS = Common::pathCombine(PATH_SONGS,
    "BackgroundSounds");
const QString RPM::PATH_SOUNDS = Common::pathCombine(PATH_SONGS,
    "Sounds");
const QString RPM::PATH_MUSIC_EFFECTS = Common::pathCombine(PATH_SONGS,
    "MusicEffects");
const QString RPM::PATH_SHAPES = Common::pathCombine(FOLDER_CONTENT,
    "Shapes");
const QString RPM::PATH_OBJ = Common::pathCombine(PATH_SHAPES,
    "OBJ");
const QString RPM::PATH_MTL = Common::pathCombine(PATH_SHAPES,
    "MTL");
const QString RPM::PATH_COLLISIONS = Common::pathCombine(PATH_SHAPES,
    "Collisions");
const QString RPM::PATH_ENGINE_SETTINGS = Common::pathCombine(FOLDER_CONTENT,
    "engineSettings" + EXTENSION_JSON);
const QString RPM::PATH_TRANSLATIONS = Common::pathCombine(FOLDER_CONTENT,
    "translations");
const QString RPM::PATH_TRANSLATIONS_LANGUAGES = Common::pathCombine(RPM
    ::PATH_TRANSLATIONS, "languages" + EXTENSION_JSON);
const QString RPM::PATH_TRANSLATIONS_CURRENT_LANGUAGE = Common::pathCombine(RPM
    ::PATH_TRANSLATIONS, "current-language");
const QString RPM::PATH_PATREON = Common::pathCombine(FOLDER_CONTENT, "patreon"
    + EXTENSION_JSON);
const QString RPM::PATH_GAMES = Common::pathCombine(QStandardPaths
    ::writableLocation(QStandardPaths::StandardLocation::DocumentsLocation),
    FOLDER_GAMES);
const QString RPM::PATH_TEXTURE_MISSING = ":/textures/Ressources/missing.png";
const QString RPM::PATH_MAIN = Common::pathCombine(PATH_APP, FILE_MAIN);
const QString RPM::PATH_INDEX = Common::pathCombine(PATH_APP, FILE_INDEX);
const QString RPM::PATH_PACKAGE = Common::pathCombine(PATH_APP, FILE_PACKAGE);
const QString RPM::PATH_DLCS = Common::pathCombine(FOLDER_CONTENT, "DLCs");
const QString RPM::PATH_ICON_GREEN = ":/icons/Ressources/point_g.png";
const QString RPM::PATH_EXAMPLE = Common::pathCombine(FOLDER_CONTENT,
    FOLDER_EXAMPLE);
const QString RPM::PATH_EXAMPLE_GAME = Common::pathCombine(PATH_EXAMPLE,
    "Example");
const QString RPM::PATH_EXAMPLE_DATAS = Common::pathCombine(PATH_EXAMPLE,
    "Datas");

// INTEGERS
const int RPM::PORTION_SIZE = 16;
const int RPM::BASIC_SQUARE_SIZE = 32;
const int RPM::MAX_PIXEL_SIZE = 4096;
const int RPM::SCREEN_BASIC_WIDTH = 640;
const int RPM::SCREEN_BASIC_HEIGHT = 480;

// ENUMS TO STRING
QStringList RPM::ENUM_TO_STRING_DAMAGES_KIND = {};
QStringList RPM::ENUM_TO_STRING_EFFECT_SPECIAL_ACTION_KIND = {};
QStringList RPM::ENUM_TO_STRING_INCREASE_DECREASE_KIND = {};
QStringList RPM::ENUM_TO_STRING_OS_KIND = {};
QStringList RPM::ENUM_TO_STRING_TEAM = {};
QStringList RPM::ENUM_TO_STRING_OPERATION = {};
QStringList RPM::ENUM_TO_STRING_OPERATION_SIMPLE = {};
QStringList RPM::ENUM_TO_STRING_FORMULA_STAT = {};
QStringList RPM::ENUM_TO_STRING_TITLE_SETTINGS = {};
QStringList RPM::ENUM_TO_STRING_AXIS_KIND = {};
QStringList RPM::ENUM_TO_STRING_CONDITION_HEROES = {};
QStringList RPM::ENUM_TO_STRING_VARIABLE_MAP_OBJECT_CHARACTERISTIC = {};
QStringList RPM::ENUM_TO_STRING_ANIMATION_POSITION_KIND = {};
QStringList RPM::ENUM_TO_STRING_ANIMATION_CONDITION_KIND = {};
QStringList RPM::ENUM_TO_STRING_MOUNTAIN_COLLISION_KIND = {};
QStringList RPM::ENUM_TO_STRING_OBJECT_COLLISION_KIND = {};
QStringList RPM::ENUM_TO_STRING_EVENT_COMMAND_KIND = {};
QStringList RPM::ENUM_TO_STRING_TARGET_KIND = {};
QStringList RPM::ENUM_TO_STRING_AVAILABLE_KIND = {};
QStringList RPM::ENUM_TO_STRING_OBJECT_MOVING_KIND = {};
QStringList RPM::ENUM_TO_STRING_SHAPE_KIND = {};
QStringList RPM::ENUM_TO_STRING_TITLE_COMMAND_KIND = {};
QStringList RPM::ENUM_TO_STRING_MONSTER_ACTION_TARGET_KIND = {};
QStringList RPM::ENUM_TO_STRING_PLUGIN_CATEGORY = {};

// OTHER STATIC VALUES
QSet<int> RPM::mapsToSave;
QSet<int> RPM::mapsUndoRedo;
QString RPM::shadersExtension = "-3.0";
bool RPM::isInConfig = false;
bool RPM::isInObjectConfig = false;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

RPM::RPM() :
    m_project(nullptr),
    m_engineSettings(new EngineSettings),
    m_translations(new Translations)
{

}

RPM::~RPM() {
    if (m_project != nullptr) {
        delete m_project;
        m_project = nullptr;
    }
    delete m_engineSettings;
    delete m_translations;
    this->clearCommands();
}

Project* RPM::project() const {
    return m_project;
}

EngineSettings* RPM::engineSettings() const {
    return m_engineSettings;
}

Translations * RPM::translations() const {
    return m_translations;
}

void RPM::setProject(Project *p) {
    m_project = p;
}

QStandardItem * RPM::copiedCommandAt(int i) const {
    return m_copiedCommands.at(i);
}

int RPM::copiedCommandsCount() const {
    return m_copiedCommands.size();
}

void RPM::copiedCommandsAppend(QStandardItem *item) {
    m_copiedCommands.append(item);
}

SuperListItem * RPM::selectedMonster() const
{
    return m_selectedMonster;
}

void RPM::setSelectedMonster(SuperListItem *si)
{
    m_selectedMonster = si;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void RPM::writeJSON(QString path, const Serializable &obj) {
    QJsonObject gameObject;
    obj.write(gameObject);
    Common::writeOtherJSON(path, gameObject);
}

// -------------------------------------------------------

void RPM::readJSON(QString path, Serializable &obj) {
    QJsonDocument loadDoc;
    Common::readOtherJSON(path, loadDoc);
    obj.read(loadDoc.object());
}

// -------------------------------------------------------

float RPM::coefSquareSize() {
    return RPM::get()->getSquareSize() / (static_cast<float>(RPM
        ::BASIC_SQUARE_SIZE));
}

// -------------------------------------------------------

float RPM::coefReverseSquareSize() {
    return static_cast<float>(RPM::BASIC_SQUARE_SIZE) / RPM::get()
        ->getSquareSize();
}

// -------------------------------------------------------

int RPM::getPortionsRay() {
    return RPM::get()->project()->gameDatas()->systemDatas()->portionsRay();
}

// -------------------------------------------------------

int RPM::getSquareSize() {
    return RPM::get()->project()->gameDatas()->systemDatas()->squareSize();
}

// -------------------------------------------------------

void RPM::readEngineSettings() {
    QFile fileSettings(Common::pathCombine(QDir::currentPath(), RPM
        ::PATH_ENGINE_SETTINGS));

    if (fileSettings.exists()) {
        RPM::get()->engineSettings()->read();
    } else {
        RPM::get()->engineSettings()->setDefault();
        RPM::get()->engineSettings()->write();
    }
}

// -------------------------------------------------------

void RPM::readTranslations() {
    RPM::get()->translations()->read();

    // Construct RPM::ENUMs
    RPM::ENUM_TO_STRING_DAMAGES_KIND = QStringList({
        RPM::translate(Translations::STATISTIC),
        RPM::translate(Translations::CURRENCY),
        RPM::translate(Translations::VARIABLE)
    });
    RPM::ENUM_TO_STRING_EFFECT_SPECIAL_ACTION_KIND = QStringList({
        RPM::translate(Translations::APPLY_WEAPON_EFFECTS),
        RPM::translate(Translations::OPEN_SKILLS_CHOICE),
        RPM::translate(Translations::OPEN_ITEMS_CHOICE),
        RPM::translate(Translations::ESCAPE),
        RPM::translate(Translations::END_TURN)
    });
    RPM::ENUM_TO_STRING_INCREASE_DECREASE_KIND = QStringList({
        RPM::translate(Translations::STATISTIC_VALUE),
        RPM::translate(Translations::ELEMENT_RESISTANCE),
        RPM::translate(Translations::STATUS_RESISTANCE),
        RPM::translate(Translations::CURRENCY_GAIN),
        RPM::translate(Translations::SKILL_COST),
        RPM::translate(Translations::VARIABLE)
    });
    RPM::ENUM_TO_STRING_OS_KIND = QStringList({
        "Windows", "Linux", "Mac"
    });

    RPM::ENUM_TO_STRING_TEAM = QStringList({
        RPM::translate(Translations::TEAM),
        RPM::translate(Translations::RESERVE),
        RPM::translate(Translations::HIDDEN)
    });
    RPM::ENUM_TO_STRING_OPERATION_SIMPLE = QStringList({
        "=", "!=", ">=", "<=", ">", "<"
    });
    RPM::ENUM_TO_STRING_OPERATION = QStringList({
        RPM::ENUM_TO_STRING_OPERATION_SIMPLE.at(0) + " " + RPM::PARENTHESIS_LEFT +
            RPM::translate(Translations::EQUAL_TO) + RPM::PARENTHESIS_RIGHT,
        RPM::ENUM_TO_STRING_OPERATION_SIMPLE.at(1) + " " + RPM::PARENTHESIS_LEFT +
            RPM::translate(Translations::NOT_EQUAL_TO) + RPM::PARENTHESIS_RIGHT,
        RPM::ENUM_TO_STRING_OPERATION_SIMPLE.at(2) + " " + RPM::PARENTHESIS_LEFT +
            RPM::translate(Translations::GREATER_THAN_OR_EQUAL_TO) + RPM
            ::PARENTHESIS_RIGHT,
        RPM::ENUM_TO_STRING_OPERATION_SIMPLE.at(3) + " " + RPM::PARENTHESIS_LEFT +
            RPM::translate(Translations::LESSER_THAN_OR_EQUAL_TO) + RPM
            ::PARENTHESIS_RIGHT,
        RPM::ENUM_TO_STRING_OPERATION_SIMPLE.at(4) + " " + RPM::PARENTHESIS_LEFT +
            RPM::translate(Translations::GREATER_THAN) + RPM::PARENTHESIS_RIGHT,
        RPM::ENUM_TO_STRING_OPERATION_SIMPLE.at(5) + " " + RPM::PARENTHESIS_LEFT +
            RPM::translate(Translations::LESSER_THAN) + RPM::PARENTHESIS_RIGHT,
    });
    RPM::ENUM_TO_STRING_FORMULA_STAT = QStringList({
        RPM::translate(Translations::STATISTIC),
        RPM::translate(Translations::CURRENCY),
        RPM::translate(Translations::VARIABLE)
    });
    RPM::ENUM_TO_STRING_TITLE_SETTINGS = QStringList({
        RPM::translate(Translations::KEYBOARD_ASSIGNMENTS)
    });
    RPM::ENUM_TO_STRING_AXIS_KIND = QStringList({
        RPM::translate(Translations::X),
        RPM::translate(Translations::Y),
        RPM::translate(Translations::Z)
    });
    RPM::ENUM_TO_STRING_CONDITION_HEROES = QStringList({
        RPM::translate(Translations::ALL_HEROES),
        RPM::translate(Translations::NONE_OF_HEROES),
        RPM::translate(Translations::AT_LEAST_ONE_HERO),
        RPM::translate(Translations::HERO_WITH_INSTANCE_ID)
    });
    RPM::ENUM_TO_STRING_VARIABLE_MAP_OBJECT_CHARACTERISTIC = QStringList({
        RPM::translate(Translations::X_SQUARE_POSITION),
        RPM::translate(Translations::Y_SQUARE_POSITION),
        RPM::translate(Translations::Z_SQUARE_POSITION),
        RPM::translate(Translations::X_PIXEL_POSITION),
        RPM::translate(Translations::Y_PIXEL_POSITION),
        RPM::translate(Translations::Z_PIXEL_POSITION),
        RPM::translate(Translations::ORIENTATION)
    });
    RPM::ENUM_TO_STRING_ANIMATION_POSITION_KIND = QStringList({
        RPM::translate(Translations::TOP),
        RPM::translate(Translations::MIDDLE),
        RPM::translate(Translations::BOTTOM),
        RPM::translate(Translations::SCREEN_CENTER)
    });
    RPM::ENUM_TO_STRING_ANIMATION_CONDITION_KIND = QStringList({
        RPM::translate(Translations::NONE),
        RPM::translate(Translations::HIT),
        RPM::translate(Translations::MISS),
        RPM::translate(Translations::CRITICAL)
    });
    RPM::ENUM_TO_STRING_MOUNTAIN_COLLISION_KIND = QStringList({
        RPM::translate(Translations::DEFAULT) + " (" + RPM::translate(
            Translations::ACCORDING_HEIGHT_ANGLE) + ")",
        RPM::translate(Translations::FORCE_ALWAYS_COLLIDES),
        RPM::translate(Translations::FORCE_NEVER_COLLIDES)
    });
    RPM::ENUM_TO_STRING_OBJECT_COLLISION_KIND = QStringList({
        RPM::translate(Translations::NONE),
        RPM::translate(Translations::PERFECT),
        RPM::translate(Translations::SIMPLIFIED),
        RPM::translate(Translations::CUSTOM)
    });
    RPM::ENUM_TO_STRING_EVENT_COMMAND_KIND = QStringList({
        RPM::translate(Translations::NONE),
        RPM::translate(Translations::PERFECT),
        RPM::translate(Translations::SIMPLIFIED),
        RPM::translate(Translations::CUSTOM)
    });
    RPM::ENUM_TO_STRING_EVENT_COMMAND_KIND = QStringList({
        "",
        RPM::translate(Translations::SHOW_TEXT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::CHANGE_VARIABLES) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::END_GAME),
        RPM::translate(Translations::WHILE),
        "",
        RPM::translate(Translations::WHILE_BREAK),
        RPM::translate(Translations::INPUT_NUMBER) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::CONDITION) + RPM::DOT_DOT_DOT,
        "",
        "",
        RPM::translate(Translations::OPEN_MAIN_MENU),
        RPM::translate(Translations::OPEN_SAVES_MENU),
        RPM::translate(Translations::MODIFY_INVENTORY) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::MODIFY_TEAM) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::START_BATTLE) + RPM::DOT_DOT_DOT,
        "",
        "",
        RPM::translate(Translations::CHANGE_STATE) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::SEND_EVENT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::TELEPORT_OBJECT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::MOVE_OBJECT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::WAIT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::MOVE_CAMERA) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::PLAY_MUSIC) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::STOP_MUSIC) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::PLAY_BACKGROUND_SOUND) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::STOP_BACKGROUND_SOUND) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::PLAY_A_SOUND) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::PLAY_MUSIC_EFFECT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::CHANGE_PROPERTY) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::DISPLAY_CHOICES) + RPM::DOT_DOT_DOT,
        "",
        "",
        RPM::translate(Translations::SCRIPT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::DISPLAY_A_PICTURE) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::SET_MOVE_TURN_A_PICTURE) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::REMOVE_A_PICTURE) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::SET_DIALOG_BOX_OPTIONS) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::TITLE_SCREEN),
        RPM::translate(Translations::CHANGE_SCREEN_TONE) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::REMOVE_OBJECT_FROM_MAP) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::STOP_REACTION),
        RPM::translate(Translations::ALLOW_FORBID_SAVES) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::ALLOW_FORBID_MAIN_MENU) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::CALL_A_COMMON_REACTION) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::LABEL) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::JUMP_TO_LABEL) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::COMMENT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::CHANGE_A_STATISTIC) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::CHANGE_A_SKILL) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::CHANGE_NAME) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::CHANGE_EQUIPMENT) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::MODIFY_CURRENCY) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::DISPLAY_AN_ANIMATION) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::SHAKE_SCREEN) + RPM::DOT_DOT_DOT,
        RPM::translate(Translations::FLASH_SCREEN) + RPM::DOT_DOT_DOT,
        ""
    });
    RPM::ENUM_TO_STRING_TARGET_KIND = QStringList({
        RPM::translate(Translations::NONE),
        RPM::translate(Translations::USER),
        RPM::translate(Translations::AN_ENEMY),
        RPM::translate(Translations::AN_ALLY),
        RPM::translate(Translations::ALL_ENEMIES),
        RPM::translate(Translations::ALL_ALLIES)
    });
    RPM::ENUM_TO_STRING_AVAILABLE_KIND = QStringList({
        RPM::translate(Translations::BATTLE_ONLY),
        RPM::translate(Translations::MAIN_MENU_ONLY),
        RPM::translate(Translations::ALWAYS),
        RPM::translate(Translations::NEVER)
    });
    RPM::ENUM_TO_STRING_OBJECT_MOVING_KIND = QStringList({
        RPM::translate(Translations::FIX),
        RPM::translate(Translations::RANDOM),
        RPM::translate(Translations::ROUTE)
    });
    RPM::ENUM_TO_STRING_SHAPE_KIND = QStringList({
        RPM::translate(Translations::BOX),
        RPM::translate(Translations::SPHERE),
        RPM::translate(Translations::CYLINDER),
        RPM::translate(Translations::CONE),
        RPM::translate(Translations::CAPSULE),
        RPM::translate(Translations::CUSTOM)
    });
    RPM::ENUM_TO_STRING_TITLE_COMMAND_KIND = QStringList({
        RPM::translate(Translations::NEW_GAME),
        RPM::translate(Translations::LOAD_GAME),
        RPM::translate(Translations::SETTINGS),
        RPM::translate(Translations::EXIT),
        RPM::translate(Translations::SCRIPT)
    });
    RPM::ENUM_TO_STRING_MONSTER_ACTION_TARGET_KIND = QStringList({
        RPM::translate(Translations::RANDOM),
        RPM::translate(Translations::WEAK_ENEMIES)
    });
    RPM::ENUM_TO_STRING_PLUGIN_CATEGORY = QStringList({
        "Battle",
        "Menus",
        "Map",
        "Others"
    });
}

// -------------------------------------------------------

void RPM::saveEngineSettings() {
    RPM::get()->engineSettings()->write();
}

// -------------------------------------------------------

QString RPM::translate(const QString &key) {
    return RPM::get()->translations()->get(key);
}

// -------------------------------------------------------

QString RPM::boolToString(const bool b) {
    return b ? TRUE_BOOL_STRING : FALSE_BOOL_STRING;
}

// -------------------------------------------------------

bool RPM::stringToBool(const QString &s) {
    return s == TRUE_BOOL_STRING;
}

// -------------------------------------------------------

void RPM::loadEngineSettings() {
    delete m_engineSettings;

    m_engineSettings = new EngineSettings;
    m_engineSettings->read();
}

// -------------------------------------------------------

void RPM::clearCommands() {
    QStandardItem *copiedCommand;
    int i, l;

    for (i = 0, l = this->copiedCommandsCount(); i < l; i++) {
        copiedCommand = this->copiedCommandAt(i);
        SystemCommonReaction::deleteCommands(copiedCommand);
        delete copiedCommand;
    }
    m_copiedCommands.clear();
}
