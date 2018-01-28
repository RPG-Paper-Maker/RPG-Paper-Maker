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

#include "controlmapeditor.h"

// -------------------------------------------------------

void ControlMapEditor::addRemove(MapEditorSelectionKind selection,
                                 MapEditorSubSelectionKind subSelection,
                                 DrawKind drawKind, bool layerOn,
                                 QRect& tileset, int specialID)
{
    Position p;
    MapElement* element = getPositionSelected(p, selection, subSelection,
                                              layerOn);

    if (subSelection == MapEditorSubSelectionKind::SpritesWall) {
        if (!m_isDrawingWall && !m_isDeletingWall) {
            m_beginWallIndicator->setPosition(m_positionOnPlaneWallIndicator,
                                              m_map->mapProperties()->length(),
                                              m_map->mapProperties()->width());
        }
    }
    else {
        if (m_map->isInGrid(p, 500)) {
            if (m_isDeleting)
                remove(element, selection, drawKind, p, layerOn);
            else {
                add(selection, subSelection, drawKind, layerOn,
                    tileset, specialID, p);
            }
        }
    }

    // Avoid pointing to a deleted element before the next raycasting
    m_elementOnLand = nullptr;
    m_elementOnSprite = nullptr;
}

// -------------------------------------------------------

void ControlMapEditor::add(MapEditorSelectionKind selection,
                           MapEditorSubSelectionKind subSelection,
                           DrawKind drawKind, bool layerOn,
                           QRect& tileset, int specialID,
                           Position& p)
{
    if (tileset.width() != 0 && tileset.height() != 0) {
        switch (selection){
        case MapEditorSelectionKind::Land:
            addLand(p, subSelection, drawKind, layerOn, tileset, specialID);
            break;
        case MapEditorSelectionKind::Sprites:
            addSprite(p, subSelection, drawKind, layerOn, tileset);
        case MapEditorSelectionKind::Objects:
        {
            Portion portion;
            m_map->getLocalPortion(p, portion);
            if (m_map->isInSomething(p, portion)) {
                if (m_selectedObject != nullptr)
                    moveObject(p);
                setCursorObjectPosition(p);
            }
            break;
        }
        default:
            break;
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::remove(MapElement* element,
                              MapEditorSelectionKind selection,
                              DrawKind drawKind, Position& p, bool layerOn)
{
    switch (selection){
    case MapEditorSelectionKind::Land:
        removeLand(p, drawKind, layerOn);
        break;
    case MapEditorSelectionKind::Sprites:
        if (element != nullptr &&
            element->getSubKind() != MapEditorSubSelectionKind::SpritesWall)
        {
            removeSprite(p, drawKind);
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

void ControlMapEditor::addLand(Position& p, MapEditorSubSelectionKind kind,
                               DrawKind drawKind, bool layerOn, QRect &tileset,
                               int specialID)
{
    LandDatas* land;
    QRect* shortTexture;
    bool up = m_camera->cameraUp();

    // Pencil
    switch (drawKind) {
    case DrawKind::Pencil:
    {
        if (tileset.width() == 1 && tileset.height() == 1) {
            QList<Position> positions;
            traceLine(m_previousMouseCoords, p, positions);
            for (int i = 0; i < positions.size(); i++) {
                QRect* rect = new QRect(tileset.x(),
                                        tileset.y(),
                                        tileset.width(),
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

                Position shortPosition(p.x() + i, 0, 0, p.z() + j, p.layer());
                shortTexture = new QRect(tileset.x() + i, tileset.y() + j,
                                         1, 1);
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
        paintPinLand(p, kind, tileset, layerOn);
        break;
    }

    m_previousMouseCoords = p;
}

// -------------------------------------------------------

void ControlMapEditor::paintPinLand(Position& p,
                                    MapEditorSubSelectionKind kindAfter,
                                    QRect& textureAfter, bool layerOn)
{
    if (m_map->isInGrid(p)){
        Portion portion;
        m_map->getLocalPortion(p, portion);
        if (m_map->isInPortion(portion)){
            LandDatas* landBefore = getLand(portion, p);
            MapEditorSubSelectionKind kindBefore =
                    MapEditorSubSelectionKind::None;
            QRect textureBefore;
            if (landBefore != nullptr){
                kindBefore = landBefore->getSubKind();
                getLandTexture(textureBefore, landBefore);
            }

            // If it's floor, we need to reduce to square * square size texture
            QRect textureAfterReduced;
            if (kindAfter == MapEditorSubSelectionKind::Floors)
                getFloorTextureReduced(textureAfter, textureAfterReduced, 0, 0);

            // If the texture à different, start the algorithm
            if (!areLandsEquals(landBefore, textureAfterReduced, kindAfter)){
                QList<Position> tab;
                tab.push_back(p);
                if (kindAfter == MapEditorSubSelectionKind::None)
                    eraseLand(p);
                else
                    stockLand(p, getLandAfter(kindAfter, textureAfterReduced),
                              kindAfter, layerOn);

                while(!tab.isEmpty()){
                    QList<Position> adjacent;
                    Position firstPosition = tab.at(0);
                    int x = firstPosition.x();
                    int y = firstPosition.y();
                    int yPlus = firstPosition.yPlus();
                    int z = firstPosition.z();
                    int layer = firstPosition.layer();

                    // Getting all the adjacent squares
                    adjacent << Position(x - 1, y, yPlus, z, layer);
                    adjacent << Position(x + 1, y, yPlus, z, layer);
                    adjacent << Position(x, y, yPlus, z + 1, layer);
                    adjacent << Position(x, y, yPlus, z - 1, layer);

                    tab.removeAt(0);
                    for (int i = 0; i < adjacent.size(); i++){
                        Position adjacentPosition = adjacent.at(i);
                        int localX = adjacentPosition.x() - p.x();
                        int localZ = adjacentPosition.z() - p.z();
                        getFloorTextureReduced(textureAfter,
                                               textureAfterReduced,
                                               localX, localZ);
                        if (m_map->isInGrid(adjacentPosition)){
                            m_map->getLocalPortion(adjacentPosition, portion);
                            if (m_map->isInPortion(portion)){
                                LandDatas* landHere = getLand(portion,
                                                              adjacentPosition);
                                if (areLandsEquals(landHere, textureBefore,
                                                   kindBefore))
                                {
                                    if (kindAfter ==
                                            MapEditorSubSelectionKind::None)
                                        eraseLand(adjacentPosition);
                                    else
                                        stockLand(adjacentPosition,
                                                  getLandAfter(
                                                      kindAfter,
                                                      textureAfterReduced),
                                                  kindAfter, layerOn);
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

void ControlMapEditor::stockLand(Position& p, LandDatas *landDatas,
                                 MapEditorSubSelectionKind kind, bool layerOn,
                                 bool undoRedo)
{
    if (m_map->isInGrid(p)) {
        Portion portion;
        MapPortion* mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {

            // Update layer
            if (!undoRedo) {
                m_currentLayer = getLayer(mapPortion, m_distanceLand, p,
                                          layerOn, MapEditorSelectionKind::Land,
                                          kind);
                p.setLayer(m_currentLayer);
            }

            // Add the land
            QJsonObject previous;
            MapEditorSubSelectionKind previousType =
                    MapEditorSubSelectionKind::None;
            bool changed = mapPortion->addLand(p, landDatas, previous,
                                               previousType);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(
                               m_changes, previous, previousType, landDatas,
                               kind, p);
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

void ControlMapEditor::removeLand(Position& p, DrawKind drawKind, bool layerOn)
{
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
        case DrawKind::Rectangle:
            break;
        case DrawKind::Pin:
            QRect tileset(0, 0, 1, 1);
            paintPinLand(p, MapEditorSubSelectionKind::None, tileset, layerOn);
            break;
        }

        m_previousMouseCoords = p;
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseLand(Position& p, bool undoRedo){
    if (m_map->isInGrid(p)) {
        Portion portion;
        MapPortion* mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {
            QList<QJsonObject> previous;
            QList<MapEditorSubSelectionKind> previousType;
            QList<Position> positions;
            bool changed = mapPortion->deleteLand(p, previous, previousType,
                                                  positions);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    for (int i = 0; i < previous.size(); i++) {
                        m_controlUndoRedo.updateJsonList(
                                  m_changes, previous.at(i), previousType.at(i),
                                  nullptr, MapEditorSubSelectionKind::None,
                                  positions.at(i));
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
//  Sprites
//
// -------------------------------------------------------

void ControlMapEditor::addSprite(Position& p, MapEditorSubSelectionKind kind,
        DrawKind drawKind, bool layerOn, QRect& tileset)
{
    QList<Position> positions;
    bool front = m_camera->cameraFront(m_ray.direction(), p.angle());
    int xOffset = m_positionRealOnSprite.x() - p.x();
    int yOffset = m_positionRealOnSprite.y() - p.y();
    int zOffset = m_positionRealOnSprite.z() - p.z();
    SpriteDatas* sprite;

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
    }
}

// -------------------------------------------------------

void ControlMapEditor::stockSprite(Position& p, SpriteDatas* sprite,
                                   MapEditorSubSelectionKind kind, bool layerOn,
                                   bool undoRedo)
{
    if (m_map->isInGrid(p)){
        Portion portion;
        MapPortion* mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {

            // Update layer
            if (!undoRedo) {
                m_currentLayer = getLayer(
                            mapPortion, m_distanceSprite, p, layerOn,
                            MapEditorSelectionKind::Sprites, kind);
                p.setLayer(m_currentLayer);
            }

            // Add the sprite
            QSet<Portion> portionsOverflow;
            QJsonObject previous;
            MapEditorSubSelectionKind previousType =
                    MapEditorSubSelectionKind::None;
            bool changed = mapPortion->addSprite(portionsOverflow, p, sprite,
                                                 previous, previousType);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(
                               m_changes, previous, previousType, sprite,
                               kind, p);
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

void ControlMapEditor::stockSpriteWall(Position &position,
                                       SpriteWallDatas* sprite, bool undoRedo)
{
    if (m_map->isInGrid(position)) {
        Portion portion;
        MapPortion* mapPortion = getMapPortion(position, portion, undoRedo);

        if (mapPortion != nullptr) {
            QJsonObject previous;
            MapEditorSubSelectionKind previousType =
                    MapEditorSubSelectionKind::None;
            bool changed = mapPortion->addSpriteWall(
                        position, sprite, previous, previousType);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(
                               m_changes, previous, previousType, sprite,
                               MapEditorSubSelectionKind::SpritesWall,
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

void ControlMapEditor::removeSprite(Position& p, DrawKind drawKind) {
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
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseSprite(Position& p, bool undoRedo) {
    if (m_map->isInGrid(p)){
        Portion portion;
        MapPortion* mapPortion = getMapPortion(p, portion, undoRedo);

        if (mapPortion != nullptr) {
            QSet<Portion> portionsOverflow;
            QList<QJsonObject> previous;
            QList<MapEditorSubSelectionKind> previousType;
            QList<Position> positions;
            bool changed = mapPortion->deleteSprite(
                       portionsOverflow, p, previous, previousType, positions);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    for (int i = 0; i < previous.size(); i++) {
                        m_controlUndoRedo.updateJsonList(
                                  m_changes, previous.at(i), previousType.at(i),
                                  nullptr, MapEditorSubSelectionKind::None,
                                  positions.at(i));
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
    if (m_map->isInGrid(position)) {
        Portion portion;
        MapPortion* mapPortion = getMapPortion(position, portion, undoRedo);

        if (mapPortion != nullptr) {
            QJsonObject previous;
            MapEditorSubSelectionKind previousType =
                    MapEditorSubSelectionKind::None;
            bool changed = mapPortion->deleteSpriteWall(position, previous,
                                                        previousType);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                if (!undoRedo) {
                    m_controlUndoRedo.updateJsonList(
                               m_changes, previous, previousType,
                               nullptr, MapEditorSubSelectionKind::None,
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
}
