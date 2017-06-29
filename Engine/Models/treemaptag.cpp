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

#include "treemaptag.h"
#include "widgettreelocalmaps.h"
#include "wanok.h"
#include <QDir>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TreeMapTag::TreeMapTag() :
    TreeMapTag(1, "")
{

}

TreeMapTag::TreeMapTag(int i, QString n) :
    SuperListItem(i,n),
    m_position(new QVector3D)
{

}

TreeMapTag* TreeMapTag::createDir(QString name){
    return new TreeMapTag(-1, name);
}

TreeMapTag* TreeMapTag::createMap(QString name, int id){
    return new TreeMapTag(id, name);
}

TreeMapTag::~TreeMapTag(){
    delete m_position;
}

bool TreeMapTag::isDir() const { return p_id == -1; }

QString TreeMapTag::realName() const {
    return WidgetTreeLocalMaps::generateMapName(id());
}

QVector3D* TreeMapTag::position() const { return m_position; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void TreeMapTag::copyItem(const QStandardItem* from,
                                   QStandardItem* to)
{
    // Copy the current row
    TreeMapTag* tag = (TreeMapTag*) from->data().value<quintptr>();
    if (tag != nullptr){
        TreeMapTag* copyTag = new TreeMapTag;
        copyTag->setCopy(*tag);
        to->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(copyTag)));
        to->setText(from->text());
        QString iconName = copyTag->isDir() ? "dir" : "map";
        to->setIcon(QIcon(":/icons/Ressources/" + iconName + ".png"));

        if (!copyTag->isDir()){
            QString mapName =
                    WidgetTreeLocalMaps::generateMapName(copyTag->id());
            QString pathMaps = Wanok::pathCombine(
                        Wanok::get()->project()->pathCurrentProject(),
                        Wanok::pathMaps);
            QString pathMapsTemp = Wanok::pathCombine(
                        pathMaps, Wanok::TEMP_MAP_FOLDER_NAME);
            QString pathMapSource = Wanok::pathCombine(pathMaps, mapName);
            QString pathMapTarget = Wanok::pathCombine(pathMapsTemp, mapName);
            QDir(pathMapsTemp).mkdir(mapName);

            // Copy content
            Wanok::copyPath(pathMapSource, pathMapTarget);

            // Remove temp
            QDir(Wanok::pathCombine(
                     pathMapTarget,
                     Wanok::TEMP_MAP_FOLDER_NAME)).removeRecursively();
            QDir(Wanok::pathCombine(
                     pathMapTarget,
                     Wanok::TEMP_UNDOREDO_MAP_FOLDER_NAME)).removeRecursively();
            QDir(pathMapTarget).mkdir(Wanok::TEMP_MAP_FOLDER_NAME);
            QDir(pathMapTarget).mkdir(Wanok::TEMP_UNDOREDO_MAP_FOLDER_NAME);
        }
    }

    // Copy children
    for (int i = 0; i < from->rowCount(); i++){
        to->appendRow(new QStandardItem);
        copyItem(from->child(i), to->child(i));
    }
}

void TreeMapTag::copyTree(const QStandardItem* from, QStandardItem* to){

    // Copy the current row
    TreeMapTag* tag = (TreeMapTag*) from->data().value<quintptr>();
    if (tag != nullptr){
        TreeMapTag* copyTag = new TreeMapTag;
        copyTag->setCopy(*tag);
        to->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(copyTag)));
        to->setText(from->text());
        QString iconName = copyTag->isDir() ? "dir" : "map";
        to->setIcon(QIcon(":/icons/Ressources/" + iconName + ".png"));

        // Paste content
        if (!copyTag->isDir()){
            QString pathMaps = Wanok::pathCombine(
                        Wanok::get()->project()->pathCurrentProject(),
                        Wanok::pathMaps);
            QString pathMapsTemp =
                    Wanok::pathCombine(pathMaps, Wanok::TEMP_MAP_FOLDER_NAME);
            QString pathMap =
                    Wanok::pathCombine(pathMapsTemp,
                                       WidgetTreeLocalMaps::generateMapName(
                                           copyTag->id()));
            int newId = WidgetTreeLocalMaps::generateMapId();
            QString newMapName = WidgetTreeLocalMaps::generateMapName(newId);
            MapProperties properties(pathMap);
            properties.setId(newId);
            QDir(pathMaps).mkdir(newMapName);
            copyTag->setId(newId);
            QString newPathMap = Wanok::pathCombine(pathMaps, newMapName);
            Wanok::copyPath(pathMap, newPathMap);
            Wanok::writeJSON(Wanok::pathCombine(newPathMap,
                                                Wanok::fileMapInfos),
                             properties);
        }
    }

    // Copy children
    for (int i = 0; i < from->rowCount(); i++){
        to->appendRow(new QStandardItem);
        copyTree(from->child(i), to->child(i));
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void TreeMapTag::read(const QJsonObject &json){
    SuperListItem::read(json);
}

// -------------------------------------------------------

void TreeMapTag::TreeMapTag::write(QJsonObject &json) const{
    SuperListItem::write(json);
}
