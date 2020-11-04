/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "controlmapeditor.h"
#include "rpm.h"

// -------------------------------------------------------

void ControlMapEditor::updatePreviewElements(MapEditorSelectionKind kind,
    MapEditorSubSelectionKind subKind, DrawKind drawKind, bool layerOn,
    QRect &tileset, int specialID, int widthSquares, double widthPixels, int
    heightSquares, double heightPixels, QRect &defaultFloorRect)
{
    if (drawKind == DrawKind::Translate || drawKind == DrawKind::Rotate ||
        drawKind == DrawKind::Scale || drawKind == DrawKind::Pin || (
        m_isDeleting && !m_isDeletingWall) || m_isCtrlPressed)
    {
        return;
    }

    Position position;
    bool b;
    getPositionSelected(position, kind, subKind, layerOn, b);
    bool up = m_camera->cameraUp();
    bool front = m_camera->cameraFront(m_ray.direction(), position.angleY());
    int xOffset = m_positionRealOnSprite.x() - position.x();
    int yOffset = m_positionRealOnSprite.y() - position.y();
    int zOffset = m_positionRealOnSprite.z() - position.z();
    m_positionPreviousPreview = position;

    // Remove previous
    removePreviewElements();

    // Add new previous
    if (kind == MapEditorSelectionKind::Land) {
        updatePreviewLands(kind, subKind, up, layerOn, tileset, specialID,
            position);
    } else if (subKind == MapEditorSubSelectionKind::SpritesWall) {
        if (m_isDrawingWall || m_isDeletingWall)
            updatePreviewWallSprites(specialID);
    } else {
        updatePreviewOthers(kind, subKind, front, layerOn, tileset,
            xOffset, yOffset, zOffset, specialID, widthSquares, widthPixels,
            heightSquares, heightPixels, defaultFloorRect);
    }
}

// -------------------------------------------------------

void ControlMapEditor::removePreviewElements() {
    QSet<MapPortion *>::iterator i;
    for (i = m_portionsPreviousPreview.begin(); i !=
         m_portionsPreviousPreview.end(); i++)
    {
        MapPortion *mapPortion = *i;
        m_portionsToUpdate += mapPortion;
        mapPortion->clearPreview();
    }

    m_portionsPreviousPreview.clear();
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewLands(MapEditorSelectionKind kind,
    MapEditorSubSelectionKind subKind, bool up, bool layerOn, QRect &tileset,
    int specialID, Position &position)
{
    for (int i = 0; i < tileset.width(); i++) {
        if (position.x() + i > m_map->mapProperties()->length())
            break;

        for (int j = 0; j < tileset.height(); j++) {
            if (position.z() + j > m_map->mapProperties()->width())
                break;

            Position shortPosition(position.x() + i, position.y(), position
                .yPlus(), position.z() + j, position.layer());
            Portion shortPortion;
            m_map->getLocalPortion(shortPosition, shortPortion);

            if (m_map->isInGrid(shortPosition) && m_map->isInPortion(
                shortPortion) && (m_firstMouseCoords.x() == -500 || (
                m_firstMouseCoords.y() == position.y() && qFuzzyCompare(
                m_firstMouseCoords.yPlus(), position.yPlus()))))
            {
                int layer = getLayer(m_map->mapPortion(shortPortion),
                    m_distanceLand, shortPosition, layerOn, kind);
                shortPosition.setLayer(layer);
                QRect *rect = new QRect(tileset.x() + i, tileset.y() + j, 1, 1);

                switch (subKind) {
                case MapEditorSubSelectionKind::Floors:
                {
                    FloorDatas *element = new FloorDatas(rect, up);
                    updatePreviewElement(shortPosition, shortPortion, element);
                    break;
                }
                case MapEditorSubSelectionKind::Autotiles:
                {
                    if (specialID == -1)
                        break;
                    AutotileDatas *element = new AutotileDatas(specialID, rect,
                        up);
                    updatePreviewElement(shortPosition, shortPortion, element);
                    break;
                }
                default:
                    break;
                }
                MapPortion* mapPortion = m_map->mapPortion(shortPortion);
                mapPortion->updateAutotiles(shortPosition, m_portionsToUpdate,
                    m_portionsToSave, m_portionsPreviousPreview);
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

void ControlMapEditor::updatePreviewWallSprite(Position &position, int specialID)
{
    // If on border, change position center to draw at extremity
    if (position.x() == m_map->mapProperties()->length())
    {
        position.setX(position.x() - 1);
        position.setCenterX(100);
    }
    if (position.z() == m_map->mapProperties()->width())
    {
        position.setZ(position.z() - 1);
        position.setCenterZ(100);
    }

    // Get portion
    Portion portion;
    m_map->getLocalPortion(position, portion);

    // Update wall preview
    if (m_map->isInGrid(position) && m_map->isInPortion(portion) && (
        m_firstMouseCoords.x() == -500 || (m_firstMouseCoords.y() == position
        .y() && qFuzzyCompare(m_firstMouseCoords.yPlus(), position.yPlus()))))
    {
        MapElement *element = m_isDeletingWall ? nullptr : new SpriteWallDatas(
            specialID);
        updatePreviewElementGrid(position, portion, element);
    }
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewOthers(MapEditorSelectionKind kind,
    MapEditorSubSelectionKind subKind, bool front, bool layerOn, QRect &tileset,
    int xOffset, int yOffset, int zOffset, int specialID, int widthSquares,
    double widthPixels, int heightSquares, double heightPixels, QRect
    &defaultFloorRect)
{
    MapElement *element = nullptr;
    Portion portion, topPortion;
    MapPortion *mapPortion;
    Position topPosition;
    double yPlus;
    FloorDatas *topFloor;

    m_map->getLocalPortion(m_positionPreviousPreview, portion);
    if (m_map->isInGrid(m_positionPreviousPreview) && m_map->isInPortion(
        portion) && (m_firstMouseCoords.x() == -500 || (m_firstMouseCoords.y()
        == m_positionPreviousPreview.y() && qFuzzyCompare(m_firstMouseCoords
        .yPlus(), m_positionPreviousPreview.yPlus()))))
    {
        int layer = getLayer(m_map->mapPortion(portion), m_distanceSprite,
            m_positionPreviousPreview, layerOn, kind);
        m_positionPreviousPreview.setLayer(layer);

        switch (kind) {
        case MapEditorSelectionKind::Sprites:
            element = getCompleteSprite(subKind, xOffset, yOffset, zOffset,
                tileset, front, layerOn);
            break;
        case MapEditorSelectionKind::Objects3D:
            if (specialID == -1) {
                break;
            }
            element = Object3DDatas::instanciate(reinterpret_cast<
                SystemObject3D *>(SuperListItem::getById(RPM::get()->project()
                ->specialElementsDatas()->model(PictureKind::Object3D)
                ->invisibleRootItem(), specialID)));
            break;
        case MapEditorSelectionKind::Mountains:
            if (specialID == -1) {
                break;
            }
            element = new MountainDatas(specialID, widthSquares, widthPixels,
                heightSquares, heightPixels);

            // Top floor adding
            topPosition = m_positionPreviousPreview;
            yPlus = m_positionPreviousPreview.yPlus() + heightPixels;
            topPosition.setY(m_positionPreviousPreview.y() + heightSquares +
                static_cast<int>(yPlus / 100));
            topPosition.setYPlus(std::fmod(yPlus, 100));
            topFloor = new FloorDatas(new QRect(defaultFloorRect));
            m_map->getLocalPortion(topPosition, topPortion);
            updatePreviewElement(topPosition, topPortion, topFloor);
            break;
        default:
            break;
        }

        if (element != nullptr) {
            updatePreviewElement(m_positionPreviousPreview, portion, element);

            if (kind == MapEditorSelectionKind::Mountains) {
                mapPortion = m_map->mapPortion(portion);
                mapPortion->updateMountains(m_positionPreviousPreview,
                    m_portionsToUpdate, m_portionsToSave,
                    m_portionsPreviousPreview);
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewElement(Position &p, Portion &portion,
    MapElement *element)
{
    MapPortion *mapPortion = m_map->mapPortion(portion);

    if (mapPortion != nullptr) {
        mapPortion->addPreview(p, element);
        m_portionsToUpdate += mapPortion;
        m_portionsPreviousPreview += mapPortion;
    } else {
        delete element;
    }
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewElementGrid(Position &p, Portion &portion,
    MapElement *element)
{
    MapPortion *mapPortion = m_map->mapPortion(portion);
    if (element == nullptr)
        mapPortion->addPreviewDelete(p);
    else
        mapPortion->addPreview(p, element);
    m_portionsToUpdate += mapPortion;
    m_portionsPreviousPreview += mapPortion;
}
