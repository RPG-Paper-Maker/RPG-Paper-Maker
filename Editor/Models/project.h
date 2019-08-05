/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PROJECT_H
#define PROJECT_H

#include "map.h"
#include "gamedatas.h"
#include "treemapdatas.h"
#include "langsdatas.h"
#include "scriptsdatas.h"
#include "picturesdatas.h"
#include "songsdatas.h"
#include "shapesdatas.h"
#include "keyboarddatas.h"
#include "specialelementsdatas.h"
#include "oskind.h"

// -------------------------------------------------------
//
//  CLASS Project
//
//  All the datas of a project.
//
// -------------------------------------------------------

class Project
{

public:
    Project();
    virtual ~Project();
    static const QString ENGINE_VERSION;
    static const QString LAST_BUILD_DATE;
    static const int MAX_PROJECTS_NUMBER;
    void setDefault();
    QString pathCurrentProject() const;
    void setPathCurrentProject(QString s);
    Map* currentMap(bool force = false) const;
    void setCurrentMap(Map* m);
    GameDatas* gameDatas() const;
    TreeMapDatas* treeMapDatas() const;
    LangsDatas* langsDatas() const;
    ScriptsDatas* scriptsDatas() const;
    PicturesDatas* picturesDatas() const;
    SongsDatas* songsDatas() const;
    ShapesDatas * shapesDatas() const;
    KeyBoardDatas* keyBoardDatas() const;
    SpecialElementsDatas* specialElementsDatas() const;
    QString version() const;

    static bool getSubVersions(QString &version, int &m, int &f, int &b);
    static int versionDifferent(QString projectVersion, QString otherVersion);

    bool read(QString path);
    bool readVersion();
    bool readOS();
    OSKind getProjectOS();
    static OSKind getComputerOS();
    bool copyOSFiles();
    void removeOSFiles();
    void readGameDatas();
    void readLangsDatas();
    void readTreeMapDatas();
    void readScriptsDatas();
    void readKeyBoardDatas();
    void readPicturesDatas();
    void readSongsDatas();
    void readShapesDatas();
    void readSpecialsDatas();
    void readSystemDatas();
    void readTilesetsDatas();
    void readCommonEvents();
    void write(QString path);
    void writeGameDatas();
    void writeLangsDatas();
    void writeTreeMapDatas();
    void writeScriptsDatas();
    void writeKeyBoardDatas();
    void writePicturesDatas();
    void writeSongsDatas();
    void writeShapesDatas();
    void writeSpecialsDatas();
    void writeSystemDatas();
    void writeTilesetsDatas();
    void writeCommonEvents();
    void saveCurrentMap();

    QString createRPMFile();
    bool isHeroDefined() const;

private:
    QString p_pathCurrentProject;
    Map* p_currentMap;
    Map* p_currentMapConfig;
    GameDatas* p_gameDatas;
    TreeMapDatas* m_treeMapDatas;
    LangsDatas* m_langsDatas;
    ScriptsDatas* m_scriptsDatas;
    PicturesDatas* m_picturesDatas;
    SongsDatas* m_songsDatas;
    ShapesDatas * m_shapesDatas;
    KeyBoardDatas* m_keyBoardDatas;
    SpecialElementsDatas* m_specialElementsDatas;
    QString m_version;
};

#endif // PROJECT_H
