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

#include "map.h"
#include "wanok.h"
#include "common.h"
#include "systemmapobject.h"
#include <QDir>

// -------------------------------------------------------

void Map::save(){
    QString pathTemp = Common::pathCombine(m_pathMap,
                                          Wanok::TEMP_MAP_FOLDER_NAME);
    Common::copyAllFiles(pathTemp, m_pathMap);
    Common::deleteAllFiles(pathTemp);
}

// -------------------------------------------------------

void Map::writeNewMap(QString path, MapProperties& properties){
    QJsonArray jsonObject;
    writeMap(path, properties, jsonObject);
}

// -------------------------------------------------------

void Map::writeDefaultMap(QString path){
    MapProperties properties;
    QJsonArray jsonObject;
    QJsonObject json;

    Position position(7, 0, 0, 7, 0);
    SystemMapObject super(1, "Hero", position);
    super.write(json);
    jsonObject.append(json);
    QString pathMap = writeMap(path, properties, jsonObject);

    // Portion
    Portion globalPortion(0, 0, 0);
    MapPortion mapPortion(globalPortion);
    mapPortion.fillWithFloor();
    SystemCommonObject* o = new SystemCommonObject(1, "Hero", 2,
        new QStandardItemModel, new QStandardItemModel);
    QJsonObject previous;
    MapEditorSubSelectionKind previousType;
    mapPortion.addObject(position, o, previous, previousType);
    Wanok::writeJSON(Common::pathCombine(pathMap, getPortionPathMap(0, 0, 0)),
        mapPortion);
}

// -------------------------------------------------------

void Map::writeDefaultBattleMap(QString path){
    MapProperties properties;
    properties.setId(Wanok::generateMapId());
    QJsonArray jsonObject;
    QString pathMap = writeMap(path, properties, jsonObject);
    Portion globalPortion(0, 0, 0);
    MapPortion mapPortion(globalPortion);
    mapPortion.fillWithFloor();
    Wanok::writeJSON(Common::pathCombine(pathMap, getPortionPathMap(0, 0, 0)),
        mapPortion);
}

// -------------------------------------------------------

QString Map::writeMap(QString path, MapProperties& properties,
                      QJsonArray& jsonObject)
{
    QString dirMaps = Common::pathCombine(path, Wanok::pathMaps);
    QString mapName = properties.realName();
    QDir(dirMaps).mkdir(mapName);
    QString dirMap = Common::pathCombine(dirMaps, mapName);

    // Properties
    Wanok::writeJSON(Common::pathCombine(dirMap, Wanok::fileMapInfos),
                     properties);

    // Portions
    int lx = (properties.length() - 1) / Wanok::portionSize;
    int ly = (properties.depth() + properties.height() - 1) /
            Wanok::portionSize;;
    int lz = (properties.width() - 1) / Wanok::portionSize;
    for (int i = 0; i <= lx; i++){
        for (int j = 0; j <= ly; j++){
            for (int k = 0; k <= lz; k++){
                QJsonObject obj;
                Common::writeOtherJSON(
                            Common::pathCombine(dirMap,
                                               getPortionPathMap(i, j, k)),
                            obj);
            }
        }
    }

    // Objects
    QJsonObject json;
    json["objs"] = jsonObject;
    Common::writeOtherJSON(Common::pathCombine(dirMap, Wanok::fileMapObjects),
                          json);

    QDir(dirMap).mkdir(Wanok::TEMP_MAP_FOLDER_NAME);
    QDir(dirMap).mkdir(Wanok::TEMP_UNDOREDO_MAP_FOLDER_NAME);

    return dirMap;
}

// -------------------------------------------------------

void Map::correctMap(QString path, MapProperties& previousProperties,
                     MapProperties& properties)
{
    int portionMaxX, portionMaxY, portionMaxZ;
    int newPortionMaxX, newPortionMaxY, newPortionMaxZ;
    previousProperties.getPortionsNumber(portionMaxX, portionMaxY, portionMaxZ);
    properties.getPortionsNumber(newPortionMaxX,
                                 newPortionMaxY,
                                 newPortionMaxZ);

    // Write empty portions
    for (int i = portionMaxX + 1; i <= newPortionMaxX; i++) {
        for (int j = 0; j <= newPortionMaxY; j++) {
            for (int k = 0; k <= newPortionMaxZ; k++)
                Map::writeEmptyMap(path, i, j, k);
        }
    }
    for (int j = portionMaxY + 1; j <= newPortionMaxY;j++) {
        for (int i = 0; i <= newPortionMaxX; i++) {
            for (int k = 0; k <= newPortionMaxZ; k++)
                Map::writeEmptyMap(path, i, j, k);
        }
    }
    for (int k = portionMaxZ + 1; k <= newPortionMaxZ; k++) {
        for (int i = 0; i <= newPortionMaxX; i++) {
            for (int j = 0; j <= newPortionMaxY; j++)
                Map::writeEmptyMap(path, i, j, k);
        }
    }

    int difLength = previousProperties.length() - properties.length();
    int difWidth = previousProperties.width() - properties.width();
    int difHeight = previousProperties.height() - properties.height();

    if (difLength > 0 || difWidth > 0 || difHeight > 0) {
        QStandardItemModel* model = new QStandardItemModel;
        QList<int> listDeletedObjectsIDs;
        Map::loadObjects(model, path, false);

        // Complete delete
        for (int i = newPortionMaxX + 1; i <= portionMaxX; i++) {
            for (int j = 0; j <= portionMaxY; j++) {
                for (int k = 0; k <= portionMaxZ; k++)
                    deleteCompleteMap(path, i, j, k);
            }
        }
        deleteObjects(model, newPortionMaxX + 1, portionMaxX, 0, portionMaxY, 0,
                      portionMaxZ);
        for (int k = newPortionMaxZ + 1; k <= portionMaxZ; k++) {
            for (int i = 0; i <= portionMaxX; i++) {
                for (int j = 0; j <= portionMaxY; j++)
                    deleteCompleteMap(path, i, j, k);
            }
        }
        deleteObjects(model, 0, portionMaxX, 0, portionMaxY, newPortionMaxZ + 1,
                      portionMaxZ);

        // Remove only cut items
        for (int i = 0; i <= newPortionMaxX; i++) {
            for (int j = 0; j <= newPortionMaxY; j++) {
                deleteMapElements(listDeletedObjectsIDs, path, i, j,
                                  newPortionMaxZ, properties);
            }
        }
        for (int k = 0; k <= newPortionMaxZ; k++) {
            for (int j = 0; j <= newPortionMaxY; j++) {
                deleteMapElements(listDeletedObjectsIDs, path, newPortionMaxX,
                                  j, k, properties);
            }
        }
        deleteObjectsByID(model, listDeletedObjectsIDs);

        // Save
        Map::saveObjects(model, path, false);

        SuperListItem::deleteModel(model);
    }
}

// -------------------------------------------------------

void Map::writeEmptyMap(QString path, int i, int j, int k) {
    QString pathPortion = Common::pathCombine(path, getPortionPathMap(i, j, k));
    QJsonObject obj;
    Common::writeOtherJSON(pathPortion, obj);
}

// -------------------------------------------------------

void Map::deleteCompleteMap(QString path, int i, int j, int k) {
    QString pathPortion = Common::pathCombine(path, getPortionPathMap(i, j, k));
    QFile file(pathPortion);
    file.remove();
}

// -------------------------------------------------------

void Map::deleteObjects(QStandardItemModel* model, int minI, int maxI,
                        int minJ, int maxJ, int minK, int maxK)
{
    SystemMapObject* super;
    QList<int> list;

    for (int i = 2; i < model->invisibleRootItem()->rowCount(); i++){
        super = ((SystemMapObject*) model->item(i)->data().value<quintptr>());
        Position3D position = super->position();
        int x = position.x() / Wanok::portionSize;
        int y = position.y() / Wanok::portionSize;
        int z = position.z() / Wanok::portionSize;
        if (x >= minI && x <= maxI && y >= minJ && y <= maxJ && z >= minK &&
            z <= maxK)
        {
            delete super;
            list.push_back(i);
        }
    }

    for (int i = 0; i < list.size(); i++)
        model->removeRow(list.at(i));
}

// -------------------------------------------------------

void Map::deleteObjectsByID(QStandardItemModel* model,
                            QList<int> &listDeletedObjectsIDs)
{
    for (int i = 0; i < listDeletedObjectsIDs.size(); i++) {
        int index = SuperListItem::getIndexById(model->invisibleRootItem(),
                                                listDeletedObjectsIDs.at(i));
        model->removeRow(index);
    }
}

// -------------------------------------------------------

void Map::deleteMapElements(QList<int>& listDeletedObjectsIDs, QString path,
                            int i, int j, int k, MapProperties &properties)
{
    Portion portion(i, j, k);
    QString pathPortion = Common::pathCombine(path, getPortionPathMap(i, j, k));
    MapPortion mapPortion(portion);
    Wanok::readJSON(pathPortion, mapPortion);

    // Removing cut content
    mapPortion.removeLandOut(properties);
    mapPortion.removeSpritesOut(properties);
    mapPortion.removeObjectsOut(listDeletedObjectsIDs, properties);

    Wanok::writeJSON(pathPortion, mapPortion);
}

// -------------------------------------------------------

void Map::readObjects(){
    Map::loadObjects(m_modelObjects, m_pathMap, true);
}

// -------------------------------------------------------

void Map::loadObjects(QStandardItemModel* model, QString pathMap, bool temp) {
    if (temp)
        pathMap = Common::pathCombine(pathMap, Wanok::TEMP_MAP_FOLDER_NAME);
    QString path = Common::pathCombine(pathMap, Wanok::fileMapObjects);
    QJsonDocument loadDoc;
    Common::readOtherJSON(path, loadDoc);
    QJsonObject json = loadDoc.object();
    Map::readJSONArray(model, json["objs"].toArray());
}

// -------------------------------------------------------

void Map::writeObjects(bool temp) const {
    Map::saveObjects(m_modelObjects, m_pathMap, temp);
}

// -------------------------------------------------------

void Map::saveObjects(QStandardItemModel* model, QString pathMap, bool temp) {
    if (temp)
        pathMap = Common::pathCombine(pathMap, Wanok::TEMP_MAP_FOLDER_NAME);
    QString path = Common::pathCombine(pathMap, Wanok::fileMapObjects);
    QJsonObject json;
    QJsonArray portions;
    Map::writeJSONArray(model, portions);
    json["objs"] = portions;
    Common::writeOtherJSON(path, json);
}

// -------------------------------------------------------

void Map::readJSONArray(QStandardItemModel *model, const QJsonArray & tab) {
    QStandardItem* item;
    SystemMapObject* super;

    Map::setModelObjects(model);
    for (int i = 0; i < tab.size(); i++){
        item = new QStandardItem;
        super = new SystemMapObject;
        super->read(tab.at(i).toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setText(super->toString());
        model->appendRow(item);
    }
}

// -------------------------------------------------------

void Map::writeJSONArray(QStandardItemModel *model, QJsonArray & tab) {
    SystemMapObject* super;

    for (int i = 2; i < model->invisibleRootItem()->rowCount(); i++){
        QJsonObject obj;
        super = ((SystemMapObject*) model->item(i)->data()
                 .value<quintptr>());
        super->write(obj);
        tab.append(obj);
    }
}
