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

// -------------------------------------------------------
//
//  CLASS RPM
//
//  RPM is a special class (singleton) containing the current project,
//  and also a set of static functions (utils).
//
// -------------------------------------------------------

class RPM : public Singleton<RPM>
{
public:
    RPM();
    virtual ~RPM();
    Project* project() const;
    EngineSettings* engineSettings() const;
    void setProject(Project* p);
    void setEngineSettings(EngineSettings* e);
    void saveEngineSettings() const;
    void loadEngineSettings();
    int getPortionsRay() const;
    int getSquareSize() const;
    static QSet<int> mapsToSave;
    static QSet<int> mapsUndoRedo;
    static bool isInConfig;
    static bool isInObjectConfig;
    static QString shadersExtension;

    // COMMON JSON
    const static QString JSON_KEY;
    const static QString JSON_VALUE;

    // COLORS
    const static QColor colorGraySelectionDarker;
    const static QColor colorGraySelection;
    const static QColor colorGraySelectionLighter;
    const static QColor colorGraySelectionBackground;
    const static QColor colorPurpleSelection;
    const static QColor colorPurpleSelectionBackground;
    const static QColor colorGrayHoverBackground;
    const static QColor colorAlmostWhite;
    const static QColor colorAlmostBlack;
    const static QColor colorAlmostTransparent;
    const static QColor colorFortyTransparent;
    const static QColor colorGrey;
    const static QColor colorMenuSelectionBlue;

    // PATHS
    const static QString pathBasic;
    const static QString pathBR;
    const static QString pathDatas;
    const static QString pathMaps;
    const static QString pathScriptsDir;
    const static QString pathScriptsSystemDir;
    const static QString pathScriptsPluginsDir;
    const static QString pathCommonEvents;
    const static QString pathVariables;
    const static QString pathSystem;
    const static QString pathBattleSystem;
    const static QString pathItems;
    const static QString pathSkills;
    const static QString pathWeapons;
    const static QString pathArmors;
    const static QString pathHeroes;
    const static QString pathMonsters;
    const static QString pathTroops;
    const static QString pathClasses;
    const static QString PATH_TILESETS;
    const static QString PATH_ANIMATIONS;
    const static QString PATH_STATUS;
    const static QString PATH_SPECIAL_ELEMENTS;
    const static QString PATH_TITLE_SCREEN_GAME_OVER;
    const static QString pathTreeMap;
    const static QString pathLangs;
    const static QString pathScripts;
    const static QString pathKeyBoard;
    const static QString pathPicturesDatas;
    const static QString pathSongsDatas;
    const static QString PATH_SHAPES_DATAS;
    const static QString pathSaves;
    const static QString pathPictures;
    const static QString pathHUD;
    const static QString pathTextures2D;
    const static QString pathBars;
    const static QString pathIcons;
    const static QString PATH_FACESETS;
    const static QString PATH_WINDOW_SKINS;
    const static QString PATH_TITLE_SCREEN;
    const static QString pathAutotiles;
    const static QString pathCharacters;
    const static QString pathReliefs;
    const static QString pathTilesets;
    const static QString PATH_SPRITE_WALLS;
    const static QString PATH_RELIEFS;
    const static QString PATH_MOUNTAINS;
    const static QString PATH_TEXTURES_OBJECT_3D;
    const static QString PATH_BATTLERS;
    const static QString PATH_SONGS;
    const static QString PATH_MUSICS;
    const static QString PATH_BACKGROUND_SOUNDS;
    const static QString PATH_SOUNDS;
    const static QString PATH_MUSIC_EFFECTS;
    const static QString PATH_SHAPES;
    const static QString PATH_OBJ;
    const static QString PATH_MTL;
    const static QString PATH_COLLISIONS;
    const static QString pathEngineSettings;
    const static QString fileMapInfos;
    const static QString fileMapObjects;
    const static QString gamesFolderName;
    const static QString TEMP_MAP_FOLDER_NAME;
    const static QString TEMP_UNDOREDO_MAP_FOLDER_NAME;
    const static QString dirGames;
    const static QString dirDesktop;

    // INTEGERS
    const static int portionSize;
    const static int BASIC_SQUARE_SIZE;
    const static int MAX_PIXEL_SIZE;

    // METHODS
    static void writeJSON(QString path, const Serializable &obj);
    static void readJSON(QString path, Serializable &obj);
    static void writeRect(QJsonArray &json, const QRect& rect);
    static void readRect(QJsonArray &json, QRect& rect);
    static void writeRectF(QJsonArray &json, const QRectF& rect);
    static void readRectF(QJsonArray &json, QRectF &rect);
    static QKeySequence getKeySequence(QKeyEvent *event);
    static QString keyToString(int keyInt);
    static int mod(int x, int m);
    static float coefSquareSize();
    static float coefReverseSquareSize();
    static QString osToString(OSKind os);
    static bool getMinDistance(float &finalDistance, float newDistance);
    static bool isMapIdExisting(int id);
    static int generateMapId();
    static QString generateMapName(int id);
    static bool isPressingEnter(QKeyEvent* event);
    static PictureKind subSelectionToPictureKind(
            MapEditorSubSelectionKind subKind);

protected:
    Project* p_project;
    EngineSettings* m_engineSettings;
};

#endif // RPM_H
