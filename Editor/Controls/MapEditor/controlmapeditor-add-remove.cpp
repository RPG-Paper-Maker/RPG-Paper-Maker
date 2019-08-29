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
#include "common.h"

// -------------------------------------------------------

void ControlMapEditor::addRemove(MapEditorSelectionKind selection,
    MapEditorSubSelectionKind subSelection, DrawKind drawKind, bool layerOn,
    QRect &tileset, int specialID, int widthSquares, double widthPixels, int
    heightSquares, double heightPixels, QRect &defaultFloorRect)
{
    if (drawKind == DrawKind::Translate || drawKind == DrawKind::Rotate ||
        drawKind == DrawKind::Scale)
    {
        return;
    }

    Position p;
    bool b;
    MapElement *element = getPositionSelected(p, selection, subSelection,
        layerOn, b);

    if (subSelection == MapEditorSubSelectionKind::SpritesWall) {
        if (!m_isDrawingWall && !m_isDeletingWall) {
            m_beginWallIndicator->setPosition(m_positionOnPlaneWallIndicator,
                m_map->mapProperties()->length(), m_map->mapProperties()->width());
        }
    } else {
        if (m_map->isInGrid(p, 500)) {
            if (m_isDeleting)
                remove(element, selection, drawKind, p);
            else {
                add(selection, subSelection, drawKind, layerOn,
                    tileset, specialID, widthSquares, widthPixels, heightSquares
                    , heightPixels, defaultFloorRect, p);
            }
        }
    }

    // Avoid pointing to a deleted element before the next raycasting
    m_elementOnLand = nullptr;
    m_elementOnSprite = nullptr;
    m_elementOnObject3D = nullptr;
    m_elementOnMountain = nullptr;
}

// -------------------------------------------------------

void ControlMapEditor::add(MapEditorSelectionKind selection,
    MapEditorSubSelectionKind subSelection, DrawKind drawKind, bool layerOn,
    QRect &tileset, int specialID, int widthSquares, double widthPixels, int
    heightSquares, double heightPixels, QRect &defaultFloorRect, Position &p)
{
    if (tileset.width() != 0 && tileset.height() != 0) {
        switch (selection) {
        case MapEditorSelectionKind::Land:
            addLand(p, subSelection, drawKind, layerOn, tileset, specialID);
            break;
        case MapEditorSelectionKind::Sprites:
            addSprite(p, subSelection, drawKind, layerOn, tileset);
            break;
        case MapEditorSelectionKind::Objects3D:
            addObject3D(p, specialID);
            break;
        case MapEditorSelectionKind::Mountains:
            addMountain(p, specialID, widthSquares, widthPixels, heightSquares,
                heightPixels, defaultFloorRect);
            break;
        default:
            break;
        }
    }
    if (selection == MapEditorSelectionKind::Objects) {
        Portion portion;
        m_map->getLocalPortion(p, portion);
        if (m_map->isInSomething(p, portion)) {
            if (m_selectedObject != nullptr)
                moveObject(p);
            setCursorObjectPosition(m_previousMouseCoords);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::remove(MapElement *element, MapEditorSelectionKind
    selection, DrawKind drawKind, Position &p)
{
    switch (selection){
    case MapEditorSelectionKind::Land:
        removeLand(p, drawKind);
        break;
    case MapEditorSelectionKind::Sprites:
        if (element != nullptr && element->getSubKind() !=
            MapEditorSubSelectionKind::SpritesWall)
        {
            removeSprite(p, drawKind);
        }
        break;
    case MapEditorSelectionKind::Objects3D:
        if (element != nullptr) {
            removeObject3D(p);
        }
        break;
    case MapEditorSelectionKind::Mountains:
        if (element != nullptr) {
            removeMountain(p);
        }
        break;
    case MapEditorSelectionKind::Objects:
    {
        Portion portion;
        m_map->getLocalPortion(p, portion);
        if (m_map->isInSomething(p, portion)) {
            setCursorObjectPosition(p);
            showObjectMenuContext();
        }
        break;
    }
    default:
        break;
    }
}

// -------------------------------------------------------
//
//  LANDS
//
// -------------------------------------------------------

void ControlMapEditor::addLand(Position &p, MapEditorSubSelectionKind kind,
    DrawKind drawKind, bool layerOn, QRect &tileset, int specialID)
{
    if (kind == MapEditorSubSelectionKind::Autotiles && specialID == -1)
        return;

    LandDatas *land = nullptr;
    QRect *shortTexture;
    bool up = m_camera->cameraUp();

    // Pencil
    switch (drawKind) {
    case DrawKind::Pencil:
    {
        if (tileset.width() == 1 && tileset.height() == 1) {
            QList<Position> positions;
            traceLine(m_previousMouseCoords, p, positions);
            for (int i = 0; i < positions.size(); i++) {
                QRect *rect = new QRect(tileset.x(), tileset.y(), tileset.width(),
                    tileset.height());
                switch (kind) {
                case MapEditorSubSelectionKind::Floors:
                    land = new FloorDatas(rect, up);
                    break;
                case MapEditorSubSelectionKind::Autotiles:
                    land = new AutotileDatas(specialID, rect, up);
                    break;
                default:
                    break;
                }
                stockLand(positions[i], land, kind, layerOn);
            }
        }
        for (int i = 0; i < tileset.width(); i++) {
            if (p.x() + i > m_map->mapProperties()->length())
                break;

            for (int j = 0; j < tileset.height(); j++) {
                if (p.z() + j > m_map->mapProperties()->width())
                    break;

                Position shortPosition(p.x() + i, p.y(), p.yPlus(), p.z() + j, p
                    .layer());
                shortTexture = new QRect(tileset.x() + i, tileset.y() + j, 1, 1);
                switch (kind) {
                case MapEditorSubSelectionKind::Floors:
                    land = new FloorDatas(shortTexture, up);
                    break;
                case MapEditorSubSelectionKind::Autotiles:
                    land = new AutotileDatas(specialID, shortTexture, up);
                    break;
                default:
                    break;
                }
                stockLand(shortPosition, land, kind, layerOn);
            }
        }
        break;
    }
    case DrawKind::Rectangle:
        break; // TODO
    case DrawKind::Pin:
        paintPinLand(p, kind, specialID, tileset, up);
        break;
    default:
        break;
    }

    m_previousMouseCoords = p;
}

// -------------------------------------------------------

void ControlMapEditor::paintPinLand(Position &p, MapEditorSubSelectionKind kindAfter,
    int specialIDAfter, QRect &textureAfter, bool up)
{
    if (m_map->isInGrid(p)){
        Portion portion;
        m_map->getLocalPortion(p, portion);
        if (m_map->isInPortion(portion)) {
            LandDatas *landBefore = getLand(portion, p);
            MapEditorSubSelectionKind kindBefore = MapEditorSubSelectionKind::None;
            QRect textureBefore;
            if (landBefore != nullptr){
                kindBefore = landBefore->getSubKind();
                getLandTexture(textureBefore, landBefore);
            }
            QRect textureAfterReduced;
            getFloorTextureReduced(textureAfter, textureAfterReduced, 0, 0);

            // If the texture is different, start the algorithm
            if (!areLandsEquals(landBefore, textureAfterReduced, kindAfter)) {
                QList<Position> tab;
                tab.push_back(p);
                if (kindAfter == MapEditorSubSelectionKind::None)
                    eraseLand(p);
                else {
                    stockLand(p, getLandAfter(kindAfter, specialIDAfter,
                        textureAfterReduced, up), kindAfter, false);
                }
                while(!tab.isEmpty()) {
                    QList<Position> adjacent;
                    Position firstPosition = tab.at(0);
                    int x = firstPosition.x();
                    int y = firstPosition.y();
                    double yPlus = firstPosition.yPlus();
                    int z = firstPosition.z();
                    int layer = firstPosition.layer();

                    // Getting all the adjacent squares
                    adjacent << Position(x - 1, y, yPlus, z, layer);
                    adjacent << Position(x + 1, y, yPlus, z, layer);
                    adjacent << Position(x, y, yPlus, z + 1, layer);
                    adjacent << Position(x, y, yPlus, z - 1, layer);

                    tab.removeAt(0);
                    for (int i = 0; i < adjacent.size(); i++) {
                        Position adjacentPosition = adjacent.at(i);
                        int localX = adjacentPosition.x() - p.x();
                        int localZ = adjacentPosition.z() - p.z();
                        getFloorTextureReduced(textureAfter, textureAfterReduced,
                            localX, localZ);
                        if (m_map->isInGrid(adjacentPosition)) {
                            m_map->getLocalPortion(adjacentPosition, portion);
                            if (m_map->isInPortion(portion)) {
                                LandDatas *landHere = getLand(portion,
                                    adjacentPosition);
                                if (areLandsEquals(landHere, textureBefore,
                                    kindBefore))
                                {
                                    if (kindAfter == MapEditorSubSelectionKind::None)
                                        eraseLand(adjacentPosition);
                                    else {
                                        stockLand(adjacentPosition, getLandAfter(
                                            kindAfter, specialIDAfter,
                                            textureAfterReduced, up), kindAfter,
                                            false);
                                    }
                                    tab.push_back(adjacentPosition);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::stockLand(Position &p, LandDatas *landDatas,
    MapEditorSubSelectionKind kind, bool layerOn, bool undoRedo, bool force)
{
    if (force || (m_map->isInGrid(p) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == p.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), p.yPlus())))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {

            // Update layer
            if (!undoRedo) {
                m_currentLayer = getLayer(mapPortion, m_distanceLand, p, layerOn,
                    MapEditorSelectionKind::Land);
                p.setLayer(m_currentLayer);
            }

            // Add the land
            QJsonObject previous;
            MapEditorSubSelectionKind previousType = MapEditorSubSelectionKind::None;
            bool changed = mapPortion->addLand(p, landDatas, previous,
                previousType, m_portionsToUpdate, m_portionsToSave);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(m_changes, previous,
                        previousType, landDatas, kind, p);
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }
            }

            return;
        }
    }

    delete landDatas;
}

// -------------------------------------------------------

void ControlMapEditor::removeLand(Position &p, DrawKind drawKind) {
    QList<Position> positions;

    if (m_currentLayer == -1)
        m_currentLayer = p.layer();

    if (m_currentLayer == p.layer()) {

        // Pencil
        switch (drawKind) {
        case DrawKind::Pencil:
            traceLine(m_previousMouseCoords, p, positions);
            for (int i = 0; i < positions.size(); i++)
                eraseLand(positions[i]);
            eraseLand(p);
            break;
        case DrawKind::Rectangle:
            break;
        case DrawKind::Pin: {
            QRect tileset(0, 0, 1, 1);
            paintPinLand(p, MapEditorSubSelectionKind::None, -1, tileset,
                m_camera->cameraUp());
            break;
        }
        default:
            break;
        }

        m_previousMouseCoords = p;
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseLand(Position &p, bool undoRedo, bool force) {
    if (force || (m_map->isInGrid(p) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == p.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), p.yPlus())))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {
            QList<QJsonObject> previous;
            QList<MapEditorSubSelectionKind> previousType;
            QList<Position> positions;
            bool changed = mapPortion->deleteLand(p, previous, previousType,
                positions, m_portionsToUpdate, m_portionsToSave);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    for (int i = 0; i < previous.size(); i++) {
                        m_controlUndoRedo.updateJsonList(m_changes, previous.at(i),
                            previousType.at(i), nullptr,
                            MapEditorSubSelectionKind::None, positions.at(i));
                    }
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }
            }
        }
    }
}

// -------------------------------------------------------
//
//  SPRITES
//
// -------------------------------------------------------

void ControlMapEditor::addSprite(Position &p, MapEditorSubSelectionKind kind,
    DrawKind drawKind, bool layerOn, QRect &tileset)
{
    QList<Position> positions;
    bool front = m_camera->cameraFront(m_ray.direction(), p.angleY());
    int xOffset = m_positionRealOnSprite.x() - p.x();
    int yOffset = m_positionRealOnSprite.y() - p.y();
    int zOffset = m_positionRealOnSprite.z() - p.z();
    SpriteDatas *sprite = nullptr;

    // Pencil
    switch (drawKind) {
    case DrawKind::Pencil:
        sprite = getCompleteSprite(kind, xOffset, yOffset, zOffset, tileset,
            front, layerOn);
        stockSprite(p, sprite, kind, layerOn);
        traceLine(m_previousMouseCoords, p, positions);
        for (int i = 0; i < positions.size(); i++) {
            sprite = getCompleteSprite(kind, xOffset, yOffset, zOffset, tileset,
                front, layerOn);
            stockSprite(positions[i], sprite, kind, layerOn);
        }
        break;
    case DrawKind::Pin:
        break;
    case DrawKind::Rectangle:
        break;
    default:
        break;
    }

    m_previousMouseCoords = p;
}

// -------------------------------------------------------

void ControlMapEditor::addSpriteWall(DrawKind drawKind, int specialID)
{
    if (specialID == -1)
        return;

    QList<Position> positions;

    // Pencil
    switch (drawKind) {
    case DrawKind::Pencil:
        getWallSpritesPositions(positions);
        for (int i = 0; i < positions.size(); i++)
            stockSpriteWall(positions[i], new SpriteWallDatas(specialID));
        removePreviewElements();
        break;
    case DrawKind::Pin:
        break;
    case DrawKind::Rectangle:
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void ControlMapEditor::stockSprite(Position &p, SpriteDatas *sprite,
    MapEditorSubSelectionKind kind, bool layerOn, bool undoRedo)
{
    if (m_map->isInGrid(p) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == p.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), p.yPlus()))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {

            // Update layer
            if (!undoRedo) {
                m_currentLayer = getLayer(mapPortion, m_distanceSprite, p, layerOn,
                    MapEditorSelectionKind::Sprites);
                p.setLayer(m_currentLayer);
            }

            // Add the sprite
            QSet<Portion> portionsOverflow;
            QJsonObject previous;
            MapEditorSubSelectionKind previousType = MapEditorSubSelectionKind::None;
            bool changed = mapPortion->addSprite(portionsOverflow, p, sprite,
                previous, previousType);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(m_changes, previous,
                        previousType, sprite, kind, p);
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }

                m_needMapInfosToSave = true;
                updatePortionsToSaveOverflow(portionsOverflow);
            }

            return;
        }
    }

    delete sprite;
}

// -------------------------------------------------------

void ControlMapEditor::stockSpriteWall(Position &position, SpriteWallDatas* sprite,
    bool undoRedo)
{
    if (m_map->isInGrid(position) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == position.y() && qFuzzyCompare(
        m_firstMouseCoords.yPlus(), position.yPlus()))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(position, portion, undoRedo);

        if (mapPortion != nullptr) {
            QJsonObject previous;
            MapEditorSubSelectionKind previousType = MapEditorSubSelectionKind::None;
            bool changed = mapPortion->addSpriteWall(position, sprite, previous,
                previousType);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(m_changes, previous,
                        previousType, sprite, MapEditorSubSelectionKind::SpritesWall,
                        position);
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }
            }

            return;
        }
    }

    delete sprite;
}

// -------------------------------------------------------

void ControlMapEditor::removeSprite(Position &p, DrawKind drawKind) {
    QList<Position> positions;

    if (m_currentLayer == -1)
        m_currentLayer = p.layer();

    if (m_currentLayer == p.layer()) {

        // Pencil
        switch (drawKind) {
        case DrawKind::Pencil:
        case DrawKind::Pin:
            traceLine(m_previousMouseCoords, p, positions);
            for (int i = 0; i < positions.size(); i++)
                eraseSprite(positions[i]);
            eraseSprite(p);
            break;
        case DrawKind::Rectangle:
            break;
        default:
            break;
        }

        m_previousMouseCoords = p;
    }
}

// -------------------------------------------------------

void ControlMapEditor::removeSpriteWall(DrawKind drawKind) {
    QList<Position> positions;

    // Pencil
    switch (drawKind) {
    case DrawKind::Pencil:
        getWallSpritesPositions(positions);
        for (int i = 0; i < positions.size(); i++)
            eraseSpriteWall(positions[i]);
        break;
    case DrawKind::Pin:
        break;
    case DrawKind::Rectangle:
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseSprite(Position &p, bool undoRedo) {
    if (m_map->isInGrid(p) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == p.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), p.yPlus()))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {
            QSet<Portion> portionsOverflow;
            QList<QJsonObject> previous;
            QList<MapEditorSubSelectionKind> previousType;
            QList<Position> positions;
            bool changed = mapPortion->deleteSprite(portionsOverflow, p, previous,
                previousType, positions);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    for (int i = 0; i < previous.size(); i++) {
                        m_controlUndoRedo.updateJsonList(m_changes, previous.at(i),
                            previousType.at(i), nullptr,
                            MapEditorSubSelectionKind::None, positions.at(i));
                    }
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }

                m_needMapInfosToSave = true;
                updatePortionsToSaveOverflow(portionsOverflow);
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseSpriteWall(Position &position, bool undoRedo) {
    if (m_map->isInGrid(position) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == position.y() && qFuzzyCompare(
        m_firstMouseCoords.yPlus(), position.yPlus()))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(position, portion, undoRedo);

        if (mapPortion != nullptr) {
            QJsonObject previous;
            MapEditorSubSelectionKind previousType = MapEditorSubSelectionKind::None;
            bool changed = mapPortion->deleteSpriteWall(position, previous,
                previousType);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(m_changes, previous, previousType,
                        nullptr, MapEditorSubSelectionKind::None, position);
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }
            }

            return;
        }
    }
}

// -------------------------------------------------------
//
//  OBJECTS 3D
//
// -------------------------------------------------------

void ControlMapEditor::addObject3D(Position &p, int specialID) {
    if (specialID == -1) {
        return;
    }

    QList<Position> positions;
    Object3DDatas *object3D;
    SystemObject3D *special;

    special = m_detection == nullptr ? reinterpret_cast<SystemObject3D *>(
        SuperListItem::getById(RPM::get()->project()->specialElementsDatas()
        ->model(PictureKind::Object3D)->invisibleRootItem(), specialID)) :
        m_detection->instanciateObject();
    object3D = Object3DDatas::instanciate(special);
    stockObject3D(p, object3D);
    if (m_detection == nullptr) {
        traceLine(m_previousMouseCoords, p, positions);
        for (int i = 0; i < positions.size(); i++) {
            object3D = Object3DDatas::instanciate(special);
            stockObject3D(positions[i], object3D);
        }
    }
    m_previousMouseCoords = p;
}

// -------------------------------------------------------

void ControlMapEditor::stockObject3D(Position &p, Object3DDatas *object3D, bool
    undoRedo)
{
    if (m_map->isInGrid(p) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == p.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), p.yPlus()))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {

            // Add the 3D object
            QSet<Portion> portionsOverflow;
            QJsonObject previous;
            MapEditorSubSelectionKind previousType = MapEditorSubSelectionKind
                ::None;
            bool changed = mapPortion->addObject3D(portionsOverflow, p, object3D
                , previous, previousType);
            if (m_detection != nullptr) {
                m_detection->addObject(p, object3D->datas());
            }
            if (changed && m_map->saved()) {
                setToNotSaved();
            }
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(m_changes, previous,
                        previousType, object3D, MapEditorSubSelectionKind
                        ::Object3D, p);
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }

                m_needMapInfosToSave = true;
                updatePortionsToSaveOverflow(portionsOverflow);
            }

            return;
        }
    }

    if (m_detection != nullptr) {
        delete object3D->datas();
    }
    delete object3D;
}

// -------------------------------------------------------

void ControlMapEditor::removeObject3D(Position &p) {
    QList<Position> positions;

    if (m_detection == nullptr) {
        traceLine(m_previousMouseCoords, p, positions);
        for (int i = 0; i < positions.size(); i++) {
            eraseObject3D(positions[i]);
        }
    }
    eraseObject3D(p);

    m_previousMouseCoords = p;
}

// -------------------------------------------------------

void ControlMapEditor::eraseObject3D(Position &p, bool undoRedo) {
    if (m_map->isInGrid(p) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == p.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), p.yPlus()))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {
            QSet<Portion> portionsOverflow;
            QList<QJsonObject> previous;
            QList<MapEditorSubSelectionKind> previousType;
            QList<Position> positions;
            bool changed = mapPortion->deleteObject3D(portionsOverflow, p,
                previous, previousType, positions);
            if (m_detection != nullptr) {
                m_detection->deleteObject(p);
            }
            if (changed && m_map->saved()) {
                setToNotSaved();
            }
            if (changed) {
                if (!undoRedo) {
                    for (int i = 0; i < previous.size(); i++) {
                        m_controlUndoRedo.updateJsonList(m_changes, previous
                            .at(i), previousType.at(i), nullptr,
                            MapEditorSubSelectionKind::None, positions.at(i));
                    }
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }

                m_needMapInfosToSave = true;
                updatePortionsToSaveOverflow(portionsOverflow);
            }
        }
    }
}

// -------------------------------------------------------
//
//  MOUNTAINS
//
// -------------------------------------------------------

void ControlMapEditor::addMountain(Position &p, int specialID, int widthSquares,
    double widthPixels, int heightSquares, double heightPixels, QRect
    &defaultFloorRect)
{
    if (specialID == -1) {
        return;
    }

    QList<Position> positions;
    MountainDatas *mountain;
    FloorDatas *topFloor;
    Position positionFloor, positionPreviousFloor;
    bool isAdded;

    positionPreviousFloor = p;
    mountain = new MountainDatas(specialID, widthSquares, widthPixels,
        heightSquares, heightPixels);
    isAdded = stockMountain(p, mountain, positionPreviousFloor);
    topFloor = new FloorDatas(new QRect(defaultFloorRect));
    ControlMapEditor::getMountainTopFloorPosition(positionFloor, p,
        heightSquares, heightPixels);
    eraseLand(positionPreviousFloor, false, isAdded);
    stockLand(positionFloor, topFloor, MapEditorSubSelectionKind::Floors, false,
        false, isAdded);
    traceLine(m_previousMouseCoords, p, positions);
    for (int i = 0; i < positions.size(); i++) {
        mountain = new MountainDatas(specialID, widthSquares, widthPixels,
            heightSquares, heightPixels);
        isAdded = stockMountain(positions[i], mountain, positionPreviousFloor);
        topFloor = new FloorDatas(new QRect(defaultFloorRect));
        ControlMapEditor::getMountainTopFloorPosition(positionFloor, positions[i
            ], heightSquares, heightPixels);
        eraseLand(positionPreviousFloor, false, isAdded);
        stockLand(positionFloor, topFloor, MapEditorSubSelectionKind::Floors,
            false, false, isAdded);
    }
    m_previousMouseCoords = p;
}

// -------------------------------------------------------

bool ControlMapEditor::stockMountain(Position &p, MountainDatas *mountain,
    Position &positionPreviousFloor, bool undoRedo)
{
    if (m_map->isInGrid(p) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == p.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), p.yPlus()))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {

            // Add the mountain and top floor
            QSet<Portion> portionsOverflow;
            QJsonObject previous;
            MapEditorSubSelectionKind previousType = MapEditorSubSelectionKind
                ::None;
            QJsonObject previousFloor;
            bool changed = mapPortion->addMountain(portionsOverflow, p, mountain
                , previous, previousType, m_portionsToUpdate, m_portionsToSave,
                positionPreviousFloor);
            if (changed && m_map->saved()) {
                setToNotSaved();
            }
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(m_changes, previous,
                        previousType, mountain, MapEditorSubSelectionKind
                        ::Mountains, p);
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }

                m_needMapInfosToSave = true;
                updatePortionsToSaveOverflow(portionsOverflow);
            }
        }
        return true;
    }

    delete mountain;

    return false;
}

// -------------------------------------------------------

void ControlMapEditor::removeMountain(Position &p) {
    QList<Position> positions;
    Position positionFloor;
    int heightSquares;
    double heightPixels;
    bool isRemoved;

    heightSquares = reinterpret_cast<MountainDatas *>(m_elementOnMountain)
        ->heightSquares();
    heightPixels = reinterpret_cast<MountainDatas *>(m_elementOnMountain)
        ->heightPixels();
    traceLine(m_previousMouseCoords, p, positions);
    for (int i = 0; i < positions.size(); i++) {
        isRemoved = eraseMountain(positions[i]);
        if (isRemoved) {
            ControlMapEditor::getMountainTopFloorPosition(positionFloor,
                positions[i], heightSquares, heightPixels);
            eraseLand(positionFloor, false, true);
        }
    }
    isRemoved = eraseMountain(p);
    if (isRemoved) {
        ControlMapEditor::getMountainTopFloorPosition(positionFloor, p,
            heightSquares, heightPixels);
        eraseLand(positionFloor, false, true);
    }

    m_previousMouseCoords = p;
}

// -------------------------------------------------------

bool ControlMapEditor::eraseMountain(Position &p, bool undoRedo) {
    if (m_map->isInGrid(p) && (m_firstMouseCoords.x() == -500 || (
        m_firstMouseCoords.y() == p.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), p.yPlus()))))
    {
        Portion portion;
        MapPortion *mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {
            QSet<Portion> portionsOverflow;
            QList<QJsonObject> previous;
            QList<MapEditorSubSelectionKind> previousType;
            QList<Position> positions;
            bool changed = mapPortion->deleteMountain(portionsOverflow, p,
                previous, previousType, positions, m_portionsToUpdate,
                m_portionsToSave);
            if (changed && m_map->saved()) {
                setToNotSaved();
            }
            if (changed) {
                if (!undoRedo) {
                    for (int i = 0; i < previous.size(); i++) {
                        m_controlUndoRedo.updateJsonList(m_changes, previous
                            .at(i), previousType.at(i), nullptr,
                            MapEditorSubSelectionKind::None, positions.at(i));
                    }
                }
                if (m_map->isInPortion(portion, 0)) {
                    m_portionsToUpdate += mapPortion;
                    m_portionsToSave += mapPortion;
                }

                m_needMapInfosToSave = true;
                updatePortionsToSaveOverflow(portionsOverflow);
            }
        }

        return true;
    }

    return false;
}
