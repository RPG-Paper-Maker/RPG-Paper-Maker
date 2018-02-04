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

void ControlMapEditor::updatePreviewElements(
        MapEditorSelectionKind kind, MapEditorSubSelectionKind subKind,
        DrawKind drawKind, bool layerOn, QRect& tileset, int specialID)
{
    if (drawKind == DrawKind::Pin || (m_isDeleting && !m_isDeletingWall) ||
        m_isCtrlPressed)
    {
        return;
    }

    Position position;
    getPositionSelected(position, kind, subKind, layerOn);
    bool up = m_camera->cameraUp();
    bool front = m_camera->cameraFront(m_ray.direction(), position.angle());
    int xOffset = m_positionRealOnSprite.x() - position.x();
    int yOffset = m_positionRealOnSprite.y() - position.y();
    int zOffset = m_positionRealOnSprite.z() - position.z();
    m_positionPreviousPreview = position;

    // Remove previous
    removePreviewElements();

    // Add new previous
    if (kind == MapEditorSelectionKind::Land)
        updatePreviewLands(kind, subKind, up, layerOn, tileset, specialID,
                           position);
    else if (subKind == MapEditorSubSelectionKind::SpritesWall) {
        if (m_isDrawingWall || m_isDeletingWall)
            updatePreviewWallSprites(specialID);
    }
    else
        updatePreviewOthers(kind, subKind, front, layerOn, tileset,
                            xOffset, yOffset, zOffset);
}

// -------------------------------------------------------

void ControlMapEditor::removePreviewElements() {
    QSet<MapPortion*>::iterator i;
    for (i = m_portionsPreviousPreview.begin();
         i != m_portionsPreviousPreview.end(); i++)
    {
        MapPortion* mapPortion = *i;
        m_portionsToUpdate += mapPortion;
        mapPortion->clearPreview();
    }

    m_portionsPreviousPreview.clear();
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewLands(MapEditorSelectionKind kind,
                                          MapEditorSubSelectionKind subKind,
                                          bool up, bool layerOn,
                                          QRect &tileset, int specialID,
                                          Position &position)
{
    for (int i = 0; i < tileset.width(); i++){
        if (position.x() + i > m_map->mapProperties()->length())
            break;

        for (int j = 0; j < tileset.height(); j++){
            if (position.z() + j > m_map->mapProperties()->width())
                break;

            Position shortPosition(position.x() + i, 0, 0, position.z() + j,
                                   position.layer());
            Portion shortPortion;
            m_map->getLocalPortion(shortPosition, shortPortion);
            if (m_map->isInGrid(shortPosition) &&
                m_map->isInPortion(shortPortion))
            {
                int layer = getLayer(m_map->mapPortion(shortPortion),
                                     m_distanceLand, shortPosition, layerOn,
                                     kind);
                shortPosition.setLayer(layer);
                QRect* rect = new QRect(tileset.x() + i, tileset.y() + j, 1, 1);

                switch (subKind) {
                case MapEditorSubSelectionKind::Floors:
                {
                    FloorDatas* element = new FloorDatas(rect, up);
                    updatePreviewElement(shortPosition, shortPortion, element);
                    break;
                }
                case MapEditorSubSelectionKind::Autotiles:
                {
                    if (specialID == -1)
                        break;
                    AutotileDatas* element = new AutotileDatas(specialID, rect,
                                                               up);
                    updatePreviewElement(shortPosition, shortPortion, element);
                    break;
                }
                default:
                    break;
                }
                MapPortion* mapPortion = m_map->mapPortion(shortPortion);
                mapPortion->updateAutotiles(shortPosition,
                                            m_portionsToUpdate,
                                            m_portionsToSave,
                                            m_portionsPreviousPreview);
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewWallSprites(int specialID) {
    QList<Position> positions;
    getWallSpritesPositions(positions);

    for (int i = 0; i < positions.size(); i++)
        updatePreviewWallSprite(positions[i], specialID);
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewWallSprite(Position &position,
                                               int specialID)
{
    Portion portion;
    m_map->getLocalPortion(position, portion);

    if (m_map->isInGrid(position) && m_map->isInPortion(portion)) {
        MapElement* element = m_isDeletingWall ? nullptr
                                               : new SpriteWallDatas(specialID);
        updatePreviewElementGrid(position, portion, element);
    }
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewOthers(MapEditorSelectionKind kind,
        MapEditorSubSelectionKind subKind, bool front,
        bool layerOn, QRect& tileset, int xOffset, int yOffset, int zOffset)
{
    MapElement* element = nullptr;
    Portion portion;
    m_map->getLocalPortion(m_positionPreviousPreview, portion);
    if (m_map->isInGrid(m_positionPreviousPreview) &&
        m_map->isInPortion(portion))
    {
        int layer = getLayer(m_map->mapPortion(portion), m_distanceSprite,
                             m_positionPreviousPreview, layerOn, kind);
        m_positionPreviousPreview.setLayer(layer);

        switch (kind) {
        case MapEditorSelectionKind::Sprites:
            element = getCompleteSprite(subKind, xOffset, yOffset, zOffset,
                                        tileset, front, layerOn);
            break;
        default:
            break;
        }

        if (element != nullptr) {
            updatePreviewElement(m_positionPreviousPreview, portion,
                                 element);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewElement(Position &p, Portion& portion,
                                            MapElement* element)
{
    MapPortion* mapPortion = m_map->mapPortion(portion);

    if (mapPortion != nullptr) {
        mapPortion->addPreview(p, element);
        m_portionsToUpdate += mapPortion;
        m_portionsPreviousPreview += mapPortion;
    }
    else
        delete element;
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewElementGrid(Position &p, Portion &portion,
                                                MapElement* element)
{
    MapPortion* mapPortion = m_map->mapPortion(portion);
    if (element == nullptr)
        mapPortion->addPreviewDelete(p);
    else
        mapPortion->addPreview(p, element);
    m_portionsToUpdate += mapPortion;
    m_portionsPreviousPreview += mapPortion;
}
