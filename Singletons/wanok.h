/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef WANOK_H
#define WANOK_H

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
//  CLASS Wanok
//
//  Wanok is a special class (singleton) containing the current project,
//  and also a set of static functions (utils).
//
// -------------------------------------------------------

class Wanok : public Singleton<Wanok>
{
public:
    Wanok();
    virtual ~Wanok();
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
    static QString shadersExtension;

    // COLORS
    const static QColor colorGraySelection;
    const static QColor colorGraySelectionBackground;
    const static QColor colorPurpleSelection;
    const static QColor colorPurpleSelectionBackground;
    const static QColor colorGrayHoverBackground;
    const static QColor colorAlmostWhite;
    const static QColor colorAlmostBlack;
    const static QColor colorAlmostTransparent;
    const static QColor colorFortyTransparent;
    const static QColor colorGrey;

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
    const static QString PATH_SPECIAL_ELEMENTS;
    const static QString pathTreeMap;
    const static QString pathLangs;
    const static QString pathScripts;
    const static QString pathKeyBoard;
    const static QString pathPicturesDatas;
    const static QString pathSongsDatas;
    const static QString pathSaves;
    const static QString pathPictures;
    const static QString pathHUD;
    const static QString pathTextures2D;
    const static QString pathBars;
    const static QString pathIcons;
    const static QString pathAutotiles;
    const static QString pathCharacters;
    const static QString pathReliefs;
    const static QString pathTilesets;
    const static QString PATH_SPRITE_WALLS;
    const static QString PATH_3D_OBJECT;
    const static QString PATH_RELIEFS;
    const static QString PATH_BATTLERS;
    const static QString PATH_SONGS;
    const static QString PATH_MUSICS;
    const static QString PATH_BACKGROUND_SOUNDS;
    const static QString PATH_SOUNDS;
    const static QString PATH_MUSIC_EFFECTS;
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

#endif // WANOK_H
