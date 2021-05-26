/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "map.h"
#include "rpm.h"
#include "common.h"
#include "systemmapobject.h"
#include <QDir>

// -------------------------------------------------------

void Map::save(){
    QString pathTemp = Common::pathCombine(m_pathMap,
                                          RPM::FOLDER_TEMP);
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
    SystemMapObject super(1, RPM::translate(Translations::HERO), position);
    super.write(json);
    jsonObject.append(json);
    properties.setIsSkyColor(false);
    properties.setIsSkyImage(false);
    properties.skyboxID()->setNumberValue(1);
    QString pathMap = writeMap(path, properties, jsonObject);

    // Portion
    Portion globalPortion(0, 0, 0);
    MapPortion mapPortion(globalPortion);
    mapPortion.fillWithFloor(&properties);
    SystemCommonObject* o = new SystemCommonObject(1, RPM::translate(
        Translations::HERO), false, false, 2, new QStandardItemModel, new
        QStandardItemModel, new QStandardItemModel);
    QJsonObject previous;
    MapEditorSubSelectionKind previousType;
    mapPortion.addObject(position, o, previous, previousType);
    RPM::writeJSON(Common::pathCombine(pathMap, getPortionPathMap(0, 0, 0)),
        mapPortion);
}

// -------------------------------------------------------

int Map::writeDefaultBattleMap(QString path) {
    MapProperties properties;
    properties.setId(Map::generateMapId());
    properties.setName(RPM::translate(Translations::DEFAULT));
    properties.cameraProperties()->setNumberValue(2);
    QJsonArray jsonObject;
    properties.setIsSkyColor(false);
    properties.setIsSkyImage(false);
    properties.skyboxID()->setNumberValue(1);
    QString pathMap = writeMap(path, properties, jsonObject);
    Portion globalPortion(0, 0, 0);
    MapPortion mapPortion(globalPortion);
    mapPortion.fillWithFloor(&properties);
    RPM::writeJSON(Common::pathCombine(pathMap, getPortionPathMap(0, 0, 0)),
        mapPortion);

    return properties.id();
}

// -------------------------------------------------------

QString Map::writeMap(QString path, MapProperties& properties,
                      QJsonArray& jsonObject)
{
    QString dirMaps = Common::pathCombine(path, RPM::PATH_MAPS);
    QString mapName = properties.realName();
    QDir(dirMaps).mkdir(mapName);
    QString dirMap = Common::pathCombine(dirMaps, mapName);

    // Properties
    RPM::writeJSON(Common::pathCombine(dirMap, RPM::FILE_MAP_INFOS),
                     properties);

    // Portions
    int lx, ld, lh, lz;
    properties.getPortionsNumber(lx, ld, lh, lz);
    for (int i = 0; i <= lx; i++){
        for (int j = -ld; j <= lh; j++){
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
    Common::writeOtherJSON(Common::pathCombine(dirMap, RPM::FILE_MAP_OBJECTS),
                          json);

    QDir(dirMap).mkdir(RPM::FOLDER_TEMP);
    QDir(dirMap).mkdir(RPM::FOLDER_UNDO_REDO_TEMP_MAP);

    return dirMap;
}

// -------------------------------------------------------

void Map::correctMap(QString path, MapProperties& previousProperties,
                     MapProperties& properties)
{
    int portionMaxX, portionMaxD, portionMaxH, portionMaxZ;
    int newPortionMaxX, newPortionMaxD, newPortionMaxH, newPortionMaxZ;
    previousProperties.getPortionsNumber(portionMaxX, portionMaxD, portionMaxH,
        portionMaxZ);
    properties.getPortionsNumber(newPortionMaxX, newPortionMaxD, newPortionMaxH,
        newPortionMaxZ);

    // Write empty portions
    for (int i = portionMaxX + 1; i <= newPortionMaxX; i++) {
        for (int j = -newPortionMaxD; j <= newPortionMaxH; j++) {
            for (int k = 0; k <= newPortionMaxZ; k++) {
                Map::writeEmptyMap(path, i, j, k);
            }
        }
    }
    for (int j = portionMaxD + 1; j <= newPortionMaxD; j++) {
        for (int i = 0; i <= newPortionMaxX; i++) {
            for (int k = 0; k <= newPortionMaxZ; k++) {
                Map::writeEmptyMap(path, i, -j, k);
            }
        }
    }
    for (int j = portionMaxH + 1; j <= newPortionMaxH; j++) {
        for (int i = 0; i <= newPortionMaxX; i++) {
            for (int k = 0; k <= newPortionMaxZ; k++) {
                Map::writeEmptyMap(path, i, j, k);
            }
        }
    }
    for (int k = portionMaxZ + 1; k <= newPortionMaxZ; k++) {
        for (int i = 0; i <= newPortionMaxX; i++) {
            for (int j = -newPortionMaxD; j <= newPortionMaxH; j++) {
                Map::writeEmptyMap(path, i, j, k);
            }
        }
    }

    int difLength = previousProperties.length() - properties.length();
    int difWidth = previousProperties.width() - properties.width();
    int difHeight = previousProperties.height() - properties.height();
    int difDepth = previousProperties.depth() - properties.depth();

    if (difLength > 0 || difWidth > 0 || difHeight > 0 || difDepth > 0) {
        QStandardItemModel* model = new QStandardItemModel;
        QList<int> listDeletedObjectsIDs;
        Map::loadObjects(model, path, false);

        // Complete delete
        for (int i = newPortionMaxX + 1; i <= portionMaxX; i++) {
            for (int j = -portionMaxD; j <= portionMaxH; j++) {
                for (int k = 0; k <= portionMaxZ; k++) {
                    deleteCompleteMap(path, i, j, k);
                }
            }
        }
        deleteObjects(model, newPortionMaxX + 1, portionMaxX, -portionMaxD,
            portionMaxH, 0, portionMaxZ);
        for (int j = newPortionMaxD + 1; j <= portionMaxD; j++) {
            for (int i = 0; i <= portionMaxX; i++) {
                for (int k = 0; k <= portionMaxZ; k++) {
                    deleteCompleteMap(path, i, -j, k);
                }
            }
        }
        deleteObjects(model, 0, portionMaxX, -newPortionMaxD - 1, -portionMaxD,
            0, portionMaxZ);
        for (int j = newPortionMaxH + 1; j <= portionMaxH; j++) {
            for (int i = 0; i <= portionMaxX; i++) {
                for (int k = 0; k <= portionMaxZ; k++) {
                    deleteCompleteMap(path, i, j, k);
                }
            }
        }
        deleteObjects(model, 0, portionMaxX, newPortionMaxH + 1, portionMaxH,
            0, portionMaxZ);
        for (int k = newPortionMaxZ + 1; k <= portionMaxZ; k++) {
            for (int i = 0; i <= portionMaxX; i++) {
                for (int j = -portionMaxD; j <= portionMaxH; j++) {
                    deleteCompleteMap(path, i, j, k);
                }
            }
        }
        deleteObjects(model, 0, portionMaxX, -portionMaxD, portionMaxH,
            newPortionMaxZ + 1, portionMaxZ);

        // Remove only cut items
        for (int i = 0; i <= newPortionMaxX; i++) {
            for (int j = -newPortionMaxD; j <= newPortionMaxH; j++) {
                deleteMapElements(listDeletedObjectsIDs, path, i, j,
                    newPortionMaxZ, properties);
            }
        }
        for (int i = 0; i <= newPortionMaxX; i++) {
            for (int k = 0; k <= newPortionMaxZ; k++) {
                deleteMapElements(listDeletedObjectsIDs, path, i,
                    -newPortionMaxD, k, properties);
                deleteMapElements(listDeletedObjectsIDs, path, i,
                    newPortionMaxH, k, properties);
            }
        }
        for (int k = 0; k <= newPortionMaxZ; k++) {
            for (int j = -newPortionMaxD; j <= newPortionMaxH; j++) {
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

    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        super = ((SystemMapObject*) model->item(i)->data().value<quintptr>());
        if (super->id() > 0)
        {
            Position3D position = super->position();
            int x = position.x() / RPM::PORTION_SIZE;
            int y = position.y() / RPM::PORTION_SIZE;
            int z = position.z() / RPM::PORTION_SIZE;
            if (x >= minI && x < maxI && y >= minJ && y < maxJ && z >= minK &&
                z < maxK)
            {
                delete super;
                list.append(i);
            }
        }
    }
    for (int i = list.size() - 1; i >= 0; i--) {
        model->removeRow(list.at(i));
    }
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
    RPM::readJSON(pathPortion, mapPortion);

    // Removing cut content
    mapPortion.removeLandOut(properties);
    mapPortion.removeSpritesOut(properties);
    mapPortion.removeObjects3DOut(properties);
    mapPortion.removeMountainsOut(properties);
    mapPortion.removeObjectsOut(listDeletedObjectsIDs, properties);

    RPM::writeJSON(pathPortion, mapPortion);
}

// -------------------------------------------------------

void Map::readObjects(){
    Map::loadObjects(m_modelObjects, m_pathMap, true);
}

// -------------------------------------------------------

void Map::loadObjects(QStandardItemModel* model, QString pathMap, bool temp) {
    if (temp)
        pathMap = Common::pathCombine(pathMap, RPM::FOLDER_TEMP);
    QString path = Common::pathCombine(pathMap, RPM::FILE_MAP_OBJECTS);
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
        pathMap = Common::pathCombine(pathMap, RPM::FOLDER_TEMP);
    QString path = Common::pathCombine(pathMap, RPM::FILE_MAP_OBJECTS);
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
    QHash<int, SystemMapObject *> objects;
    int i, l, max;

    Map::setModelObjects(model);
    max = 1;
    for (i = 0, l = tab.size(); i < l; i++) {
        super = new SystemMapObject;
        super->read(tab.at(i).toObject());
        if (max < super->id()) {
            max = super->id();
        }
        objects.insert(super->id(), super);
    }
    for (i = 1; i <= max; i++) {
        super = objects.value(i);
        if (super != nullptr) {
            item = new QStandardItem;
            item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
            item->setText(super->toString());
            model->appendRow(item);
        }
    }
}

// -------------------------------------------------------

void Map::writeJSONArray(QStandardItemModel *model, QJsonArray & tab) {
    SystemMapObject* super;

    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++){
        QJsonObject obj;
        super = ((SystemMapObject*) model->item(i)->data()
                 .value<quintptr>());
        if (super->id() > 0)
        {
            super->write(obj);
            tab.append(obj);
        }
    }
}
