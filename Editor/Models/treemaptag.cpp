/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "treemaptag.h"
#include "rpm.h"
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
    return Map::generateMapName(id());
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

        if (!tag->isDir()){
            QString mapName =
                    Map::generateMapName(tag->id());
            QString pathMaps = Common::pathCombine(
                        RPM::get()->project()->pathCurrentProject(),
                        RPM::PATH_MAPS);
            QString pathMapsTemp = Common::pathCombine(
                        pathMaps, RPM::FOLDER_TEMP_MAP);
            QString pathMapSource = Common::pathCombine(pathMaps, mapName);
            QString pathMapTarget = Common::pathCombine(pathMapsTemp, "copy");
            QDir(pathMapsTemp).mkdir("copy");

            // Copy content
            Common::copyPath(pathMapSource, pathMapTarget);

            // Remove temp
            QDir(Common::pathCombine(
                     pathMapTarget,
                     RPM::FOLDER_TEMP_MAP)).removeRecursively();
            QDir(Common::pathCombine(
                     pathMapTarget,
                     RPM::FOLDER_UNDO_REDO_TEMP_MAP)).removeRecursively();
            QDir(pathMapTarget).mkdir(RPM::FOLDER_TEMP_MAP);
            QDir(pathMapTarget).mkdir(RPM::FOLDER_UNDO_REDO_TEMP_MAP);
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
        if (!tag->isDir()){
            QString pathMaps = Common::pathCombine(
                        RPM::get()->project()->pathCurrentProject(),
                        RPM::PATH_MAPS);
            QString pathMapsTemp =
                    Common::pathCombine(pathMaps, RPM::FOLDER_TEMP_MAP);
            QString pathMap =
                    Common::pathCombine(pathMapsTemp, "copy");
            int newId = Map::generateMapId();
            QString newMapName = Map::generateMapName(newId);
            MapProperties properties(pathMap);
            properties.setId(newId);
            QDir(pathMaps).mkdir(newMapName);
            copyTag->setId(newId);
            QString newPathMap = Common::pathCombine(pathMaps, newMapName);
            Common::copyPath(pathMap, newPathMap);
            RPM::writeJSON(Common::pathCombine(newPathMap,
                                                RPM::FILE_MAP_INFOS),
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
