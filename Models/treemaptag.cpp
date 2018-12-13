/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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
#include "wanok.h"
#include "common.h"
#include "camera.h"
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
    m_position(new QVector3D),
    m_positionObject(new QVector3D),
    m_cameraDistance(Camera::defaultDistance),
    m_cameraHorizontalAngle(Camera::defaultHAngle),
    m_cameraVerticalAngle(Camera::defaultVAngle)
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
    delete m_positionObject;
}

bool TreeMapTag::isDir() const { return p_id == -1; }

QString TreeMapTag::realName() const {
    return Wanok::generateMapName(id());
}

QVector3D* TreeMapTag::position() const { return m_position; }

QVector3D* TreeMapTag::positionObject() const { return m_positionObject; }

int TreeMapTag::cameraDistance() const { return m_cameraDistance; }

double TreeMapTag::cameraHorizontalAngle() const {
    return m_cameraHorizontalAngle;
}

double TreeMapTag::cameraVerticalAngle() const {
    return m_cameraVerticalAngle;
}
void TreeMapTag::setCameraDistance(int d) { m_cameraDistance = d; }

void TreeMapTag::setCameraHorizontalAngle(double a) {
    m_cameraHorizontalAngle = a;
}

void TreeMapTag::setCameraVerticalAngle(double a) {
    m_cameraVerticalAngle = a;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void TreeMapTag::reset() {
    m_position->setX(0);
    m_position->setY(0);
    m_position->setZ(0);
    m_positionObject->setX(0);
    m_positionObject->setY(0);
    m_positionObject->setZ(0);
}

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
                    Wanok::generateMapName(copyTag->id());
            QString pathMaps = Common::pathCombine(
                        Wanok::get()->project()->pathCurrentProject(),
                        Wanok::pathMaps);
            QString pathMapsTemp = Common::pathCombine(
                        pathMaps, Wanok::TEMP_MAP_FOLDER_NAME);
            QString pathMapSource = Common::pathCombine(pathMaps, mapName);
            QString pathMapTarget = Common::pathCombine(pathMapsTemp, mapName);
            QDir(pathMapsTemp).mkdir(mapName);

            // Copy content
            Common::copyPath(pathMapSource, pathMapTarget);

            // Remove temp
            QDir(Common::pathCombine(
                     pathMapTarget,
                     Wanok::TEMP_MAP_FOLDER_NAME)).removeRecursively();
            QDir(Common::pathCombine(
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

// -------------------------------------------------------

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
            QString pathMaps = Common::pathCombine(
                        Wanok::get()->project()->pathCurrentProject(),
                        Wanok::pathMaps);
            QString pathMapsTemp =
                    Common::pathCombine(pathMaps, Wanok::TEMP_MAP_FOLDER_NAME);
            QString pathMap =
                    Common::pathCombine(pathMapsTemp,
                                       Wanok::generateMapName(
                                           copyTag->id()));
            int newId = Wanok::generateMapId();
            QString newMapName = Wanok::generateMapName(newId);
            MapProperties properties(pathMap);
            properties.setId(newId);
            QDir(pathMaps).mkdir(newMapName);
            copyTag->setId(newId);
            QString newPathMap = Common::pathCombine(pathMaps, newMapName);
            Common::copyPath(pathMap, newPathMap);
            Wanok::writeJSON(Common::pathCombine(newPathMap,
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
