/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "controlmapeditor.h"
#include "rpm.h"
#include "dialogobject.h"

// -------------------------------------------------------

void ControlMapEditor::setCursorObjectPosition(Position &p){
    m_cursorObject->setX(p.x());
    m_cursorObject->setY(p);
    m_cursorObject->setZ(p.z());

    Portion portion;
    m_map->getLocalPortion(p, portion);
    if (m_map->isInPortion(portion)){
        m_selectedObject = nullptr;
        MapObjects *mapObjects = m_map->objectsPortion(portion);

        // Generate object informations
        if (mapObjects != nullptr) {
            m_selectedObject = mapObjects->getObjectAt(p);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::setStartPosition(Position3D &p) {
    m_cursorStart->setX(p.x());
    m_cursorStart->setY(p);
    m_cursorStart->setZ(p.z());
}

// -------------------------------------------------------

void ControlMapEditor::showObjectMenuContext(){
    bool isEmpty = m_selectedObject == nullptr;

    // Edit possible actions
    m_contextMenu->canNew(isEmpty);
    m_contextMenu->canEdit(!isEmpty);
    m_contextMenu->canCopy(!isEmpty);
    m_contextMenu->canPaste(m_copiedObject != nullptr);
    m_contextMenu->canDelete(!isEmpty);
    m_contextMenu->canHero(!isEmpty);

    // Show menu context
    m_contextMenu->showContextMenu(m_mouse);
}

// -------------------------------------------------------

void ControlMapEditor::defineAsHero() {
    SystemDatas *datas = RPM::get()->project()->gameDatas()->systemDatas();
    datas->setIdMapHero(m_map->mapProperties()->id());
    datas->setIdObjectHero(m_selectedObject->id());
    RPM::get()->project()->writeSystemDatas();

    // Update cursor position
    Position3D position;
    m_cursorObject->getPosition3D(position);
    setStartPosition(position);
}

// -------------------------------------------------------

void ControlMapEditor::addHero(SystemCommonObject *object, Position3D &position)
{
    SystemDatas *datas;

    datas = RPM::get()->project()->gameDatas()->systemDatas();

    // If hero, remove start cursor
    if (object->id() == datas->idObjectHero() && m_map->mapProperties()->id() ==
        datas->idMapHero())
    {
        datas->setIdMapHero(m_map->mapProperties()->id());
        datas->setIdObjectHero(object->id());
        RPM::get()->project()->writeSystemDatas();
        setStartPosition(position);
    }
}

// -------------------------------------------------------

void ControlMapEditor::removeHero(SystemCommonObject *object) {
    SystemDatas *datas;

    datas = RPM::get()->project()->gameDatas()->systemDatas();

    // If hero, remove start cursor
    if (object->id() == datas->idObjectHero() && m_map->mapProperties()->id() ==
        datas->idMapHero())
    {
        Position3D position(-1, 0, 0, -1);
        datas->setIdMapHero(-1);
        datas->setIdObjectHero(-1);
        RPM::get()->project()->writeSystemDatas();
        setStartPosition(position);
    }
}

// -------------------------------------------------------

void ControlMapEditor::copyObject() {
    if (m_selectedObject != nullptr) {
        if (m_copiedObject != nullptr) {
            delete m_copiedObject;
        }
        m_copiedObject = new SystemCommonObject;
        m_copiedObject->setCopy(*m_selectedObject);
    }
}

// -------------------------------------------------------

void ControlMapEditor::pasteObject() {
    if (m_copiedObject != nullptr) {
        Position position;

        // If paste on hero, remove start cursor
        if (m_selectedObject != nullptr) {
            removeHero(m_selectedObject);
        }

        // Copy object
        m_selectedObject = new SystemCommonObject;
        m_selectedObject->setCopy(*m_copiedObject);
        m_selectedObject->setId(m_map->generateObjectId());

        // Add the object on the map
        m_cursorObject->getPosition3D(position);
        stockObject(position, m_selectedObject);
        m_controlUndoRedo.addState(m_map->mapProperties()->id(), m_changes);
    }
}

// -------------------------------------------------------

void ControlMapEditor::addObject(Position &p) {
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
    RPM::isInObjectConfig = true;
    DialogObject dialog(object);
    int result = dialog.exec();
    RPM::isInObjectConfig = false;
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

    addHero(object, p);

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
            // If hero, update start cursor position
            if (!move) {
                removeHero(object);
            }

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
            if (m_map->mapProperties()->id() == RPM::get()->project()
                ->gameDatas()->systemDatas()->idMapHero() && object->id() == RPM
                ::get()->project()->gameDatas()->systemDatas()->idObjectHero())
            {
                setStartPosition(p);
            }
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
    position.setY(cursorObject()->getSquareY());
    position.setYPlus(cursorObject()->getPercentYPlus());
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
