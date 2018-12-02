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
#include "wanok.h"
#include "qbox3d.h"
#include <cmath>
#include <QTime>

// -------------------------------------------------------

void ControlMapEditor::updateRaycasting(bool layerOn){
    QList<Portion> portions;

    // Raycasting plane
    QMatrix4x4 projection = m_camera->projection();
    QMatrix4x4 view = m_camera->view();
    QVector3D rayDirection = getRayWorld(m_mouse, projection, view);
    int height = 0;
    m_distancePlane = (height - m_camera->positionY()) / rayDirection.y();
    getCorrectPositionOnRay(m_positionOnPlane, rayDirection, m_distancePlane);
    getCorrectPositionOnRay(m_positionOnPlaneWallIndicator, rayDirection,
                            m_distancePlane, true);
    QVector3D cameraPosition(m_camera->positionX(), m_camera->positionY(),
                             m_camera->positionZ());
    m_ray.setOrigin(cameraPosition);
    m_ray.setDirection(rayDirection);
    getPortionsInRay(portions);

    // Others
    m_distanceLand = 0;
    m_distanceSprite = 0;
    m_elementOnLand = nullptr;
    m_elementOnSprite = nullptr;
    for (int i = portions.size() - 1; i >= 0; i--) {
        Portion portion = portions.at(i);
        MapPortion* mapPortion = m_map->mapPortion(portion);
        if (mapPortion == nullptr) {
            Portion globalPortion = m_map->getGlobalFromLocalPortion(portion);
            m_map->mapProperties()->updateRaycastingOverflowSprites(
                        globalPortion, m_distanceSprite, m_positionOnSprite,
                        m_ray, m_camera->horizontalAngle());
        }
        else {
            if (m_elementOnLand == nullptr)
                updateRaycastingLand(mapPortion);
            if (m_elementOnSprite == nullptr)
                updateRaycastingSprites(mapPortion, layerOn);
        }
    }

    if (m_distanceLand == 0)
        m_positionOnLand = m_positionOnPlane;

    if (m_distanceSprite == 0) {
        m_positionOnSprite = m_positionOnPlane;
        m_positionRealOnSprite = m_positionOnPlane;
    }
    else {
        Position positionLayerZero(m_positionOnSprite);
        Portion portion;
        m_map->getLocalPortion(positionLayerZero, portion);
        MapPortion* mapPortion = m_map->mapPortion(portion);
        MapElement* element = nullptr;
        int layer = 0;
        while (element == nullptr) {
            positionLayerZero.setLayer(layer++);
            element = mapPortion->getMapElementAt(
                        positionLayerZero, MapEditorSelectionKind::Sprites,
                        MapEditorSubSelectionKind::None);
        }
        if (element->getSubKind() == MapEditorSubSelectionKind::SpritesWall) {
            m_distanceSprite = ((SpriteWallDatas*) element)->intersectionPlane(
                        positionLayerZero.angle(), m_ray);
        }
        else {
            m_distanceSprite = ((SpriteDatas*) element)->intersectionPlane(
                        positionLayerZero.angle(), m_ray);
        }
        getCorrectPositionOnRay(m_positionRealOnSprite, rayDirection,
                                m_distanceSprite);
    }
}

// -------------------------------------------------------

void ControlMapEditor::getPortionsInRay(QList<Portion>& portions) {
    QVector3D direction = m_ray.direction();

    // Getting here the portion were is positioned the camera first
    Position positionCamera;
    getCorrectPositionOnRay(positionCamera, direction, 0);
    Portion portionCamera;
    m_map->getLocalPortion(positionCamera, portionCamera);

    // If camera is inside the portions, ok !
    if (m_map->isInPortion(portionCamera))
        portions.append(portionCamera);
    // Else, we need to find te nearest portion the camera is looking at
    else {

        // Getting the box including all the drawable portions
        Portion leftBotPortion = m_currentPortion;
        Portion rightTopPortion = m_currentPortion;
        leftBotPortion.addAll(-m_map->portionsRay() + 1);
        rightTopPortion.addAll(m_map->portionsRay());
        QVector3D leftBotCorner(leftBotPortion.x(), leftBotPortion.y(),
                                leftBotPortion.z());
        QVector3D rightTopCorner(rightTopPortion.x(), rightTopPortion.y(),
                                 rightTopPortion.z());
        leftBotCorner *= Wanok::portionSize * m_map->squareSize();
        rightTopCorner *= Wanok::portionSize * m_map->squareSize();
        rightTopCorner.setX(rightTopCorner.x() - 1);
        rightTopCorner.setY(rightTopCorner.y() - 1);
        rightTopCorner.setZ(rightTopCorner.z() - 1);

        // creating the box
        QBox3D box(leftBotCorner, rightTopCorner);

        // Testing intersection
        float distance = box.intersection(m_ray);
        if (std::isnan(distance))
            return;
        else {
            getCorrectPositionOnRay(positionCamera, direction, distance);
            m_map->getLocalPortion(positionCamera, portionCamera);
            portions.append(portionCamera);
        }
    }

    // Getting adjacent portions to check according to ray
    QList<Portion> adjacents;
    if (direction.x() > 0)
        adjacents << Portion(1, 0, 0);
    else
        adjacents << Portion(-1, 0, 0);
    if (direction.y() > 0)
        adjacents << Portion(0, 1, 0);
    else
        adjacents << Portion(0, -1, 0);
    if (direction.z() > 0)
        adjacents << Portion(0, 0, 1);
    else
        adjacents << Portion(0, 0, -1);

    // Update the portions ray with adjacent portions
    updatePortionsInRay(portions, adjacents);
}

// -------------------------------------------------------

void ControlMapEditor::updatePortionsInRay(QList<Portion>& portions,
                                           QList<Portion>& adjacents)
{
    Portion portion = portions.first();

    // For each adjacent portion... test if the camera ray is crossing
    for (int i = 0; i < adjacents.size(); i++) {
        Portion adjacent = adjacents.at(i);
        adjacent += portion;

        if (m_map->isInPortion(adjacent)) {
            Portion leftBotPortion = m_currentPortion;
            Portion rightTopPortion = m_currentPortion;
            leftBotPortion += adjacent;
            rightTopPortion += adjacent;
            rightTopPortion.addAll(1);
            QVector3D leftBotCorner(leftBotPortion.x(), leftBotPortion.y(),
                                    leftBotPortion.z());
            QVector3D rightTopCorner(rightTopPortion.x(), rightTopPortion.y(),
                                     rightTopPortion.z());
            leftBotCorner *= Wanok::portionSize * m_map->squareSize();
            rightTopCorner *= Wanok::portionSize * m_map->squareSize();
            rightTopCorner.setX(rightTopCorner.x() - 1);
            rightTopCorner.setY(rightTopCorner.y() - 1);
            rightTopCorner.setZ(rightTopCorner.z() - 1);
            QBox3D box(leftBotCorner, rightTopCorner);

            // Testing intersection
            float distance = box.intersection(m_ray);
            if (!std::isnan(distance)) {
                portions.insert(0, adjacent);
                updatePortionsInRay(portions, adjacents);
                return;
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateRaycastingLand(MapPortion* mapPortion)
{
    m_elementOnLand = mapPortion->updateRaycastingLand(
                m_map->squareSize(), m_distanceLand, m_positionOnLand, m_ray);
}

// -------------------------------------------------------

void ControlMapEditor::updateRaycastingSprites(MapPortion* mapPortion,
                                               bool layerOn)
{
    m_elementOnSprite = mapPortion->updateRaycastingSprites(
                m_map->squareSize(), m_distanceSprite, m_positionOnSprite,
                m_ray, m_camera->horizontalAngle(), layerOn);
}

// -------------------------------------------------------

QVector3D ControlMapEditor::transformToNormalizedCoords(const QPoint& mouse){
    float x = (2.0f * mouse.x()) / m_width - 1.0f;
    float y = 1.0f - (2.0f * mouse.y()) / m_height;
    float z = 1.0f;

    return QVector3D(x, y, z);
}

// -------------------------------------------------------

QVector4D ControlMapEditor::transformToHomogeneousClip(QVector3D& normalized){
    return QVector4D(normalized.x(), normalized.y(), -1.0, 1.0);
}

// -------------------------------------------------------

QVector4D ControlMapEditor::transformToEyeCoords(QVector4D& rayClip,
                                                 QMatrix4x4& projection){
    QVector4D rayEye = projection.inverted() * rayClip;

    return QVector4D(rayEye.x(), rayEye.y(), -1.0, 0.0);
}

// -------------------------------------------------------

QVector3D ControlMapEditor::transformToWorldCoords(QVector4D& rayEye,
                                                   QMatrix4x4& view){
    QVector4D rayWorld = view.inverted() * rayEye;

    return QVector3D(rayWorld.x(), rayWorld.y(), rayWorld.z()).normalized();
}

// -------------------------------------------------------

QVector3D ControlMapEditor::getRayWorld(const QPoint& mouse,
                                        QMatrix4x4& projection,
                                        QMatrix4x4& view)
{
    QVector3D normalized = transformToNormalizedCoords(mouse);
    QVector4D homogeneous = transformToHomogeneousClip(normalized);
    QVector4D eye = transformToEyeCoords(homogeneous, projection);

    return transformToWorldCoords(eye, view);
}

// -------------------------------------------------------

QVector3D ControlMapEditor::getPositionOnRay(QVector3D &ray, int distance){
    return QVector3D(
                    ray.x() * distance + m_camera->positionX(),
                    ray.y() * distance + m_camera->positionY(),
                    ray.z() * distance + m_camera->positionZ()
                );
}

// -------------------------------------------------------

void ControlMapEditor::getCorrectPositionOnRay(Position &position,
                                               QVector3D &ray, int distance,
                                               bool accurate)
{
    QVector3D point = getPositionOnRay(ray, distance);
    int x, z;
    int y = ((int) point.y() - 1) / m_map->squareSize();
    int yPlus = (((int) point.y()) % m_map->squareSize() / m_map->squareSize())
            * 100;

    if (accurate) {
        x = qRound((point.x() + 1) / m_map->squareSize());
        z = qRound((point.z() + 1) / m_map->squareSize());
    }
    else {
        x = qRound(point.x() + 1) / m_map->squareSize();
        z = qRound(point.z() + 1) / m_map->squareSize();
        if ((int)point.x() < 0) x--;
        if ((int)point.z() < 0) z--;
    }

    position.setX(x);
    position.setY(y);
    position.setYPlus(yPlus);
    position.setZ(z);
}
