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

#include "project.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Project::Project() :
    p_currentMap(nullptr),
    p_gameDatas(nullptr),
    m_treeMapDatas(nullptr),
    m_langsDatas(nullptr),
    m_scriptsDatas(nullptr),
    m_picturesDatas(nullptr),
    m_keyBoardDatas(nullptr)
{

}

Project::~Project()
{
    delete m_langsDatas;
    delete p_gameDatas;
    delete m_treeMapDatas;
    delete m_scriptsDatas;
    delete m_picturesDatas;
    delete m_keyBoardDatas;
}

// Gets

QString Project::pathCurrentProject() const{ return p_pathCurrentProject; }

void Project::setPathCurrentProject(QString s){ p_pathCurrentProject = s; }

Map* Project::currentMap() const{ return p_currentMap; }

void Project::setCurrentMap(Map* m) { p_currentMap = m; }

GameDatas* Project::gameDatas() const { return p_gameDatas; }

TreeMapDatas* Project::treeMapDatas() const { return m_treeMapDatas; }

LangsDatas* Project::langsDatas() const { return m_langsDatas; }

ScriptsDatas* Project::scriptsDatas() const { return m_scriptsDatas; }

PicturesDatas* Project::picturesDatas() const { return m_picturesDatas; }

KeyBoardDatas* Project::keyBoardDatas() const { return m_keyBoardDatas; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Project::setDefault(){
    m_langsDatas = new LangsDatas;
    m_langsDatas->setDefault();
    m_keyBoardDatas = new KeyBoardDatas;
    m_keyBoardDatas->setDefaultGame();
    m_picturesDatas = new PicturesDatas;
    m_picturesDatas->setDefault();
    p_gameDatas = new GameDatas;
    p_gameDatas->setDefault();
    m_treeMapDatas = new TreeMapDatas;
    m_treeMapDatas->setDefault();
    m_scriptsDatas = new ScriptsDatas;
    m_scriptsDatas->setDefault();
}

// -------------------------------------------------------

void Project::saveCurrentMap(){
    p_currentMap->save(p_currentMap);
    p_currentMap->setSaved(true);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Project::read(QString path){
    setPathCurrentProject(path);
    readLangsDatas();
    readKeyBoardDatas();
    readPicturesDatas();
    readGameDatas();
    readTreeMapDatas();
    readScriptsDatas();
    p_currentMap = nullptr;
}

// -------------------------------------------------------

void Project::readGameDatas(){
    if (p_gameDatas != nullptr)
        delete p_gameDatas;
    p_gameDatas = new GameDatas;
    p_gameDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readLangsDatas(){
    if (m_langsDatas != nullptr)
        delete m_langsDatas;
    m_langsDatas = new LangsDatas;
    m_langsDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readTreeMapDatas(){
    if (m_treeMapDatas != nullptr)
        delete m_treeMapDatas;
    m_treeMapDatas = new TreeMapDatas;
    m_treeMapDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readScriptsDatas(){
    if (m_scriptsDatas != nullptr)
        delete m_scriptsDatas;
    m_scriptsDatas = new ScriptsDatas;
    m_scriptsDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readKeyBoardDatas(){
    if (m_keyBoardDatas != nullptr)
        delete m_keyBoardDatas;
    m_keyBoardDatas = new KeyBoardDatas;
    m_keyBoardDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readPicturesDatas(){
    if (m_picturesDatas != nullptr)
        delete m_picturesDatas;
    m_picturesDatas = new PicturesDatas;
    m_picturesDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::write(QString path){
    setPathCurrentProject(path);
    writeLangsDatas();
    writeKeyBoardDatas();
    writePicturesDatas();
    writeGameDatas();
    writeTreeMapDatas();
    writeScriptsDatas();
}

// -------------------------------------------------------

void Project::writeGameDatas(){
    p_gameDatas->write(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::writeLangsDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathLangs), *m_langsDatas);
}

// -------------------------------------------------------

void Project::writeTreeMapDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathTreeMap), *m_treeMapDatas);
}

// -------------------------------------------------------

void Project::writeScriptsDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathScripts), *m_scriptsDatas);
}

// -------------------------------------------------------

void Project::writeKeyBoardDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathKeyBoard), *m_keyBoardDatas);
}

// -------------------------------------------------------

void Project::writePicturesDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathPicturesDatas),
                     *m_picturesDatas);
}
