#include "controlmapeditor.h"

// -------------------------------------------------------

void ControlMapEditor::setCursorObjectPosition(Position& p){
    m_cursorObject->setX(p.x());
    m_cursorObject->setZ(p.z());

    Portion portion;
    m_map->getLocalPortion(p, portion);
    if (m_map->isInPortion(portion)){
        m_selectedObject = nullptr;
        MapObjects* mapObjects = m_map->objectsPortion(portion);

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
    SystemDatas* datas = Wanok::get()->project()->gameDatas()->systemDatas();
    datas->setIdMapHero(m_map->mapProperties()->id());
    datas->setIdObjectHero(m_selectedObject->id());
    Wanok::get()->project()->writeGameDatas();
}

// -------------------------------------------------------

void ControlMapEditor::addObject(Position& p){
    SystemCommonObject* object = new SystemCommonObject;

    if (m_selectedObject != nullptr)
        object->setCopy(*m_selectedObject);
    else{
        object->setDefault();
        int id = m_map->generateObjectId();
        object->setId(id);
        object->setName(Map::generateObjectName(id));
    }

    // Open the dialog box
    Wanok::isInConfig = true;
    DialogObject dialog(object);
    int result = dialog.exec();
    Wanok::isInConfig = false;
    if (result == QDialog::Accepted) {
        stockObject(p, object);
        m_controlUndoRedo.addState(m_map->mapProperties()->id(), m_changes);
    }
    else
        delete object;
}

// -------------------------------------------------------

void ControlMapEditor::stockObject(Position& p, SystemCommonObject* object,
                                   bool undoRedo)
{
    Portion portion;
    m_map->getLocalPortion(p, portion);
    MapPortion* mapPortion = getMapPortion(p, portion, undoRedo);

    if (mapPortion != nullptr) {
        QJsonObject previous;
        MapEditorSubSelectionKind previousType =
                MapEditorSubSelectionKind::None;
        if (m_map->addObject(p, mapPortion, object, previous, previousType) &&
            m_map->saved())
        {
            setToNotSaved();
        }

        if (!undoRedo) {
            m_controlUndoRedo.updateJsonList(
                       m_changes, previous, previousType,
                       object, MapEditorSubSelectionKind::Object, p);
        }

        if (m_cursorObject->getSquareX() == p.x() &&
            m_cursorObject->getSquareY() == p.y() &&
            m_cursorObject->getSquareZ() == p.z())
        {
            m_selectedObject = object;
        }
        m_map->writeObjects(true);
        m_map->savePortionMap(mapPortion);
        m_needMapObjectsUpdate = true;

        return;
    }

    delete object;
}

// -------------------------------------------------------

void ControlMapEditor::removeObject(Position& p){
    if (m_map->isInGrid(p)) {
        eraseObject(p);
        m_controlUndoRedo.addState(m_map->mapProperties()->id(), m_changes);
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseObject(Position& p, bool undoRedo) {
    Portion portion;
    m_map->getLocalPortion(p, portion);
    MapPortion* mapPortion = getMapPortion(p, portion, undoRedo);

    if (mapPortion != nullptr) {
        MapObjects* mapObjects = m_map->objectsPortion(portion);
        SystemCommonObject* object;
        if (mapObjects != nullptr)
            object = mapObjects->getObjectAt(p);

        if (object != nullptr){
            QJsonObject previous;
            MapEditorSubSelectionKind previousType =
                    MapEditorSubSelectionKind::None;
            if (m_map->deleteObject(p, mapPortion, object, previous,
                                    previousType) &&
                m_map->saved())
            {
                setToNotSaved();
            }

            if (!undoRedo) {
                m_controlUndoRedo.updateJsonList(
                           m_changes, previous, previousType,
                           nullptr, MapEditorSubSelectionKind::None, p);
            }

            m_map->writeObjects(true);
            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::moveObject(Position& p) {
    m_isMovingObject = true;
    if (m_previousMouseCoords != p) {
        SystemCommonObject* object =
                (SystemCommonObject*) m_selectedObject->createCopy();
        eraseObject(m_previousMouseCoords);
        stockObject(p, object);

        m_previousMouseCoords = p;
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMapObjects() {
    m_map->updateMapObjects();
}
