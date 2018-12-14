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

#include "controlmapeditor.h"
#include "rpm.h"
#include "dialogobject.h"

// -------------------------------------------------------

void ControlMapEditor::setCursorObjectPosition(Position &p){
    m_cursorObject->setX(p.x());
    m_cursorObject->setZ(p.z());

    Portion portion;
    m_map->getLocalPortion(p, portion);
    if (m_map->isInPortion(portion)){
        m_selectedObject = nullptr;
        MapObjects *mapObjects = m_map->objectsPortion(portion);

        // Generate object informations
        if (mapObjects != nullptr)
            m_selectedObject = mapObjects->getObjectAt(p);
    }
}

// -------------------------------------------------------

void ControlMapEditor::showObjectMenuContext(){
    bool isEmpty = m_selectedObject == nullptr;

    // Edit possible actions
    m_contextMenu->canNew(isEmpty);
    m_contextMenu->canEdit(!isEmpty);
    m_contextMenu->canCopy(false);
    m_contextMenu->canPaste(false);
    m_contextMenu->canDelete(!isEmpty);
    m_contextMenu->canHero(!isEmpty);

    // Show menu context
    m_contextMenu->showContextMenu(m_mouse);
}

// -------------------------------------------------------

void ControlMapEditor::defineAsHero(){
    SystemDatas *datas = RPM::get()->project()->gameDatas()->systemDatas();
    datas->setIdMapHero(m_map->mapProperties()->id());
    datas->setIdObjectHero(m_selectedObject->id());
    RPM::get()->project()->writeGameDatas();
}

// -------------------------------------------------------

void ControlMapEditor::addObject(Position &p){
    SystemCommonObject *object = new SystemCommonObject;

    if (m_selectedObject != nullptr)
        object->setCopy(*m_selectedObject);
    else {
        object->setDefault();
        int id = m_map->generateObjectId();
        object->setId(id);
        object->setName(Map::generateObjectName(id));
    }

    // Open the dialog box
    RPM::isInConfig = true;
    DialogObject dialog(object);
    int result = dialog.exec();
    RPM::isInConfig = false;
    if (result == QDialog::Accepted) {
        stockObject(p, object);
        m_controlUndoRedo.addState(m_map->mapProperties()->id(), m_changes);
    } else
        delete object;
}

// -------------------------------------------------------

void ControlMapEditor::stockObject(Position &p, SystemCommonObject *object,
    bool undoRedo, bool move)
{
    Portion portion;
    m_map->getLocalPortion(p, portion);
    MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

    if (mapPortion != nullptr) {
        QJsonObject previous;
        MapEditorSubSelectionKind previousType = MapEditorSubSelectionKind::None;
        if (m_map->addObject(p, mapPortion, object, previous, previousType) &&
            m_map->saved())
        {
            setToNotSaved();
        }

        if (!undoRedo) {
            m_controlUndoRedo.updateJsonList(m_changes, previous, previousType,
                object, MapEditorSubSelectionKind::Object, p, move);
        }

        if (isObjectInCursor(p))
            m_selectedObject = object;

        updateObjectEdition(mapPortion);

        return;
    }

    delete object;
}

// -------------------------------------------------------

void ControlMapEditor::removeObject(Position &p){
    if (m_map->isInGrid(p)) {
        eraseObject(p);
        m_controlUndoRedo.addState(m_map->mapProperties()->id(), m_changes);
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseObject(Position &p, bool undoRedo, bool move) {
    Portion portion;
    m_map->getLocalPortion(p, portion);
    MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

    if (mapPortion != nullptr) {
        MapObjects *mapObjects = mapPortion->mapObjects();
        SystemCommonObject *object = mapObjects->getObjectAt(p);

        if (object != nullptr) {
            QJsonObject previous;
            MapEditorSubSelectionKind previousType = MapEditorSubSelectionKind::None;
            if (m_map->deleteObject(p, mapPortion, previous, previousType) &&
                m_map->saved())
            {
                setToNotSaved();
            }

            if (!undoRedo) {
                m_controlUndoRedo.updateJsonList(m_changes, previous, previousType,
                    nullptr, MapEditorSubSelectionKind::None, p, move);
            }

            if (isObjectInCursor(p))
                m_selectedObject = nullptr;

            updateObjectEdition(mapPortion);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::moveObject(Position &p) {
    m_isMovingObject = true;
    if (m_previousMouseCoords != p) {
        Portion portion;
        m_map->getLocalPortion(p, portion);
        MapPortion *mapPortion = getMapPortion(p, portion, false);
        if (mapPortion != nullptr &&
            mapPortion->mapObjects()->getObjectAt(p) == nullptr)
        {
            SystemCommonObject *object = reinterpret_cast<SystemCommonObject *>(
                m_selectedObject->createCopy());
            eraseObject(m_previousMouseCoords, false, true);
            stockObject(p, object, false, true);

            m_previousMouseCoords = p;
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMapObjects() {
    m_map->updateMapObjects();
}

// -------------------------------------------------------

void ControlMapEditor::setObjectPosition(Position &position){
    position.setX(cursorObject()->getSquareX());
    position.setZ(cursorObject()->getSquareZ());
}

// -------------------------------------------------------

bool ControlMapEditor::isCursorObjectVisible() {
    Position position;
    setObjectPosition(position);

    return isVisible(position);
}

// -------------------------------------------------------

bool ControlMapEditor::isObjectInCursor(Position3D &p) {
    return (m_cursorObject->getSquareX() == p.x() && m_cursorObject->getSquareY()
            == p.y() && m_cursorObject->getSquareZ() == p.z());
}

// -------------------------------------------------------

void ControlMapEditor::updateObjectEdition(MapPortion *mapPortion) {
    m_map->writeObjects(true);
    m_map->savePortionMap(mapPortion);
    m_needMapObjectsUpdate = true;
}
