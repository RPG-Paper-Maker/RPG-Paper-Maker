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
    Portion portion;
    m_map->getLocalPortion(p, portion);
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
    if (result == QDialog::Accepted){
        MapPortion* mapPortion = m_map->mapPortion(portion);
        if (m_map->addObject(p, mapPortion, object) &&
            m_map->saved())
        {
            setToNotSaved();
        }
        m_selectedObject = object;
        m_map->writeObjects(true);
        m_map->savePortionMap(mapPortion);
        m_needMapObjectsUpdate = true;
    }
    else
        delete object;
}

// -------------------------------------------------------

void ControlMapEditor::removeObject(Position& p){
    if (m_map->isInGrid(p)){
        Portion portion;
        m_map->getLocalPortion(p, portion);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            MapObjects* mapObjects = m_map->objectsPortion(portion);
            SystemCommonObject* object;
            if (mapObjects != nullptr)
                object = mapObjects->getObjectAt(p);

            if (object != nullptr){
                if (m_map->deleteObject(p, mapPortion, object) &&
                    m_map->saved())
                {
                    setToNotSaved();
                }

                m_map->writeObjects(true);
                m_portionsToUpdate += mapPortion;
                m_portionsToSave += mapPortion;
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMapObjects() {
    m_map->updateMapObjects();
}
