/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef RPM_H
#define RPM_H

#include <QString>
#include <QKeyEvent>
#include <QJsonDocument>
#include "singleton.h"
#include "project.h"
#include "map.h"
#include "enginesettings.h"
#include "oskind.h"
#include "translations.h"

// -------------------------------------------------------
//
//  CLASS RPM
//
//  RPM is a special class (singleton) containing the current project, and
//  some other engine settings.
//
// -------------------------------------------------------

class RPM : public Singleton<RPM>
{
public:
    // COLORS
    static const QColor COLOR_GRAY_SELECTION_DARKER;
    static const QColor COLOR_GRAY_SELECTION;
    static const QColor COLOR_GRAY_SELECTION_LIGHTER;
    static const QColor COLOR_GRAY_SELECTION_BACKGROUND;
    static const QColor COLOR_GRAY_HOVER_BACKGROUND;
    static const QColor COLOR_PURPLE_SELECTION;
    static const QColor COLOR_PURPLE_SELCTION_BACKGROUND;
    static const QColor COLOR_ALMOST_WHITE;
    static const QColor COLOR_ALMOST_BLACK;
    static const QColor COLOR_ALMOST_TRANSPARENT;
    static const QColor COLOR_FORTY_TRANSPARENT;
    static const QColor COLOR_GREY;
    static const QColor COLOR_MENU_SELECTION_BLUE;
    static const QColor COLOR_CURSOR_SELECTION;

    // COMMON JSON
    static const QString JSON_KEY;
    static const QString JSON_VALUE;

    // EXTENSIONS
    static const QString EXTENSION_JSON;
    static const QString EXTENSION_QSS;
    static const QString EXTENSION_RPM;
    static const QString EXTENSION_PNG;
    static const QString EXTENSION_JPG;

    // STRING SYMBOLS
    static const QString DASH;
    static const QString SLASH;
    static const QString COLON;
    static const QString DOT;
    static const QString DOT_DOT_DOT;
    static const QString SPACE;
    static const QString NEW_LINE;
    static const QString PARENTHESIS_LEFT;
    static const QString PARENTHESIS_RIGHT;
    static const QString BRACKET_LEFT;
    static const QString BRACKET_RIGHT;
    static const QString EQUAL;
    static const QString PLUS;
    static const QString MINUS;
    static const QString TIMES;
    static const QString DIVIDED_BY;
    static const QString MODULO;
    static const QString TRUE_BOOL_STRING;
    static const QString FALSE_BOOL_STRING;

    // FILE / FOLDER NAMES
    static const QString FILE_MAP_INFOS;
    static const QString FILE_MAP_OBJECTS;
    static const QString FOLDER_GAMES;
    static const QString FOLDER_DESKTOP;
    static const QString FOLDER_CONTENT;
    static const QString FOLDER_TEMP_MAP;
    static const QString FOLDER_UNDO_REDO_TEMP_MAP;

    // PATHS
    static const QString PATH_BASIC;
    static const QString PATH_BR;
    static const QString PATH_DATAS;
    static const QString PATH_MAPS;
    static const QString PATH_SCRIPTS_DIR;
    static const QString PATH_SCRIPTS_SYSTEM_DIR;
    static const QString PATH_SCRIPTS_PLUGINS_DIR;
    static const QString PATH_COMMON_EVENTS;
    static const QString PATH_VARIABLES;
    static const QString PATH_SYSTEM;
    static const QString PATH_BATTLE_SYSTEM;
    static const QString PATH_ITEMS;
    static const QString PATH_SKILLS;
    static const QString PATH_WEAPONS;
    static const QString PATH_ARMORS;
    static const QString PATH_HEROES;
    static const QString PATH_MONSTERS;
    static const QString PATH_TROOPS;
    static const QString PATH_CLASSES;
    static const QString PATH_TILESETS_DATAS;
    static const QString PATH_ANIMATIONS;
    static const QString PATH_STATUS;
    static const QString PATH_SPECIAL_ELEMENTS;
    static const QString PATH_TITLE_SCREEN_GAME_OVER;
    static const QString PATH_TREE_MAP;
    static const QString PATH_LANGS;
    static const QString PATH_SCRIPTS;
    static const QString PATH_KEYBOARD;
    static const QString PATH_PICTURES_DATAS;
    static const QString PATH_VIDEOS_DATAS;
    static const QString PATH_SONGS_DATAS;
    static const QString PATH_SHAPES_DATAS;
    static const QString PATH_SAVES;
    static const QString PATH_PICTURES;
    static const QString PATH_HUD;
    static const QString PATH_TEXTURES_2D;
    static const QString PATH_BARS;
    static const QString PATH_ICONS;
    static const QString PATH_FACESETS;
    static const QString PATH_WINDOW_SKINS;
    static const QString PATH_TITLE_SCREEN;
    static const QString PATH_HUD_ANIMATIONS;
    static const QString PATH_HUD_PICTURES;
    static const QString PATH_AUTOTILES;
    static const QString PATH_CHARACTERS;
    static const QString PATH_TILESETS;
    static const QString PATH_SPRITE_WALLS;
    static const QString PATH_RELIEFS;
    static const QString PATH_MOUNTAINS;
    static const QString PATH_TEXTURES_OBJECT_3D;
    static const QString PATH_BATTLERS;
    static const QString PATH_SKY_BOXES;
    static const QString PATH_VIDEOS;
    static const QString PATH_SONGS;
    static const QString PATH_MUSICS;
    static const QString PATH_BACKGROUND_SOUNDS;
    static const QString PATH_SOUNDS;
    static const QString PATH_MUSIC_EFFECTS;
    static const QString PATH_SHAPES;
    static const QString PATH_OBJ;
    static const QString PATH_MTL;
    static const QString PATH_COLLISIONS;
    static const QString PATH_ENGINE_SETTINGS;
    static const QString PATH_TRANSLATIONS;
    static const QString PATH_TRANSLATIONS_LANGUAGES;
    static const QString PATH_TRANSLATIONS_CURRENT_LANGUAGE;
    static const QString PATH_PATREON;
    static const QString PATH_GAMES;
    static const QString PATH_TEXTURE_MISSING;

    // INTEGERS
    static const int PORTION_SIZE;
    static const int BASIC_SQUARE_SIZE;
    static const int MAX_PIXEL_SIZE;
    static const int SCREEN_BASIC_WIDTH;
    static const int SCREEN_BASIC_HEIGHT;

    // ENUM TO STRING
    static QStringList ENUM_TO_STRING_DAMAGES_KIND;
    static QStringList ENUM_TO_STRING_EFFECT_SPECIAL_ACTION_KIND;
    static QStringList ENUM_TO_STRING_INCREASE_DECREASE_KIND;
    static QStringList ENUM_TO_STRING_OS_KIND;
    static QStringList ENUM_TO_STRING_TEAM;
    static QStringList ENUM_TO_STRING_OPERATION;
    static QStringList ENUM_TO_STRING_OPERATION_SIMPLE;
    static QStringList ENUM_TO_STRING_FORMULA_STAT;
    static QStringList ENUM_TO_STRING_TITLE_SETTINGS;
    static QStringList ENUM_TO_STRING_AXIS_KIND;
    static QStringList ENUM_TO_STRING_CONDITION_HEROES;
    static QStringList ENUM_TO_STRING_VARIABLE_MAP_OBJECT_CHARACTERISTIC;
    static QStringList ENUM_TO_STRING_ANIMATION_POSITION_KIND;
    static QStringList ENUM_TO_STRING_ANIMATION_CONDITION_KIND;
    static QStringList ENUM_TO_STRING_MOUNTAIN_COLLISION_KIND;
    static QStringList ENUM_TO_STRING_OBJECT_COLLISION_KIND;
    static QStringList ENUM_TO_STRING_EVENT_COMMAND_KIND;
    static QStringList ENUM_TO_STRING_TARGET_KIND;
    static QStringList ENUM_TO_STRING_AVAILABLE_KIND;
    static QStringList ENUM_TO_STRING_OBJECT_MOVING_KIND;
    static QStringList ENUM_TO_STRING_SHAPE_KIND;
    static QStringList ENUM_TO_STRING_TITLE_COMMAND_KIND;
    static QStringList ENUM_TO_STRING_MONSTER_ACTION_TARGET_KIND;

    // OTHER STATIC VALUES
    static QSet<int> mapsToSave;
    static QSet<int> mapsUndoRedo;
    static QString shadersExtension;
    static bool isInConfig;
    static bool isInObjectConfig;

    RPM();
    virtual ~RPM();

    Project * project() const;
    EngineSettings * engineSettings() const;
    Translations * translations() const;
    void setProject(Project *p);
    QStandardItem * copiedCommandAt(int i) const;
    int copiedCommandsCount() const;
    void copiedCommandsAppend(QStandardItem *item);
    SuperListItem * selectedMonster() const;
    void setSelectedMonster(SuperListItem *si);

    static void writeJSON(QString path, const Serializable &obj);
    static void readJSON(QString path, Serializable &obj);
    static float coefSquareSize();
    static float coefReverseSquareSize();
    static int getPortionsRay();
    static int getSquareSize();
    static void readEngineSettings();
    static void readTranslations();
    static void saveEngineSettings();
    static QString translate(const QString &key);
    static QString boolToString(const bool b);
    static bool stringToBool(const QString &s);

    void loadEngineSettings();
    void clearCommands();

protected:
    Project *m_project;
    EngineSettings *m_engineSettings;
    Translations *m_translations;
    QList<QStandardItem *> m_copiedCommands;
    SuperListItem *m_selectedMonster;
};

#endif // RPM_H
