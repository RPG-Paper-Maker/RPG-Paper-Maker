/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    void setDefault();
    QString pathCurrentProject() const;
    void setPathCurrentProject(QString s);
    Map* currentMap() const;
    void setCurrentMap(Map* m);
    GameDatas* gameDatas() const;
    TreeMapDatas* treeMapDatas() const;
    LangsDatas* langsDatas() const;
    ScriptsDatas* scriptsDatas() const;
    PicturesDatas* picturesDatas() const;
    SongsDatas* songsDatas() const;
    KeyBoardDatas* keyBoardDatas() const;
    SpecialElementsDatas* specialElementsDatas() const;
    QString version() const;

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
    void readSpecialsDatas();
    void readSystemDatas();
    void readTilesetsDatas();
    void write(QString path);
    void writeGameDatas();
    void writeLangsDatas();
    void writeTreeMapDatas();
    void writeScriptsDatas();
    void writeKeyBoardDatas();
    void writePicturesDatas();
    void writeSongsDatas();
    void writeSpecialsDatas();
    void writeSystemDatas();
    void writeTilesetsDatas();
    void saveCurrentMap();
    QString createRPMFile();

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
    KeyBoardDatas* m_keyBoardDatas;
    SpecialElementsDatas* m_specialElementsDatas;
    QString m_version;
};

#endif // PROJECT_H
