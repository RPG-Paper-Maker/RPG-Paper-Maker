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

#ifndef PROJECT_H
#define PROJECT_H

#include "map.h"
#include "gamedatas.h"
#include "treemapdatas.h"
#include "langsdatas.h"
#include "scriptsdatas.h"
#include "picturesdatas.h"
#include "keyboarddatas.h"

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
    KeyBoardDatas* keyBoardDatas() const;
    QString version() const;

    bool read(QString path);
    bool readVersion();
    bool readOS();
    bool copyOSFiles();
    void removeOSFiles();
    void readGameDatas();
    void readLangsDatas();
    void readTreeMapDatas();
    void readScriptsDatas();
    void readKeyBoardDatas();
    void readPicturesDatas();
    void readSystemDatas();
    void write(QString path);
    void writeGameDatas();
    void writeLangsDatas();
    void writeTreeMapDatas();
    void writeScriptsDatas();
    void writeKeyBoardDatas();
    void writePicturesDatas();
    void writeSystemDatas();
    void saveCurrentMap();
    void updatePictures();

private:
    QString p_pathCurrentProject;
    Map* p_currentMap;
    GameDatas* p_gameDatas;
    TreeMapDatas* m_treeMapDatas;
    LangsDatas* m_langsDatas;
    ScriptsDatas* m_scriptsDatas;
    PicturesDatas* m_picturesDatas;
    KeyBoardDatas* m_keyBoardDatas;
    QString m_version;
};

#endif // PROJECT_H
