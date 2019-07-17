/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <cmath>
#include <QTime>
#include <QtMath>
#include "controlmapeditor.h"
#include "rpm.h"
#include "qbox3d.h"
#include "common.h"

// -------------------------------------------------------

void ControlMapEditor::updateRaycasting(bool layerOn) {
    QList<Portion> portions;
    QMatrix4x4 projection, view;
    QVector3D rayDirection, cameraPosition;
    Portion portion, globalPortion;
    Position positionLayerZero;
    MapPortion *mapPortion;
    MapElement *element;
    int height, yGrid, layer;

    // Raycasting plane
    projection = m_camera->projection();
    view = m_camera->view();
    rayDirection = getRayWorld(m_mouse, projection, view);
    height = m_firstMouseCoords.x() == -500 ? static_cast<int>(this->cursor()
        ->getY()) : m_firstMouseCoords.getY(RPM::get()->getSquareSize());
    m_distancePlane = (height - m_camera->positionY()) / rayDirection.y();
    getCorrectPositionOnRay(m_positionOnPlane, rayDirection, static_cast<int>(
        m_distancePlane));
    cameraPosition = QVector3D(m_camera->positionX(), m_camera->positionY(),
        m_camera->positionZ());
    m_ray.setOrigin(cameraPosition);
    m_ray.setDirection(rayDirection);
    getPortionsInRay(portions);

    // Initializing distances and elements to 0
    m_distanceLand = 0;
    m_distanceSprite = 0;
    m_distanceObject3D = 0;
    m_distanceMountain = 0;
    m_distanceObject = 0;
    m_elementOnLand = nullptr;
    m_elementOnSprite = nullptr;
    m_elementOnObject3D = nullptr;
    m_elementOnMountain = nullptr;
    m_elementOnObject = nullptr;

    for (int i = portions.size() - 1; i >= 0; i--) {
        portion = portions.at(i);
        mapPortion = m_map->mapPortion(portion);
        if (mapPortion == nullptr) {
            globalPortion = m_map->getGlobalFromLocalPortion(portion);
            if (m_elementOnSprite == nullptr) {
                m_elementOnSprite = m_map->mapProperties()
                    ->updateRaycastingOverflowSprites(globalPortion,
                    m_distanceSprite, m_positionOnSprite, m_ray, m_camera
                    ->horizontalAngle());
            }
            if (m_elementOnObject3D == nullptr) {
                m_elementOnObject3D = m_map->mapProperties()
                    ->updateRaycastingOverflowObjects3D(globalPortion,
                    m_distanceObject3D, m_positionOnObject3D, m_ray);
            }
        }
        else {
            if (m_elementOnLand == nullptr) {
                updateRaycastingLand(mapPortion);
            }
            if (m_elementOnSprite == nullptr) {
                updateRaycastingSprites(mapPortion, layerOn);
            }
            if (m_elementOnObject3D == nullptr) {
                updateRaycastingObjects3D(mapPortion);
            }
            if (m_elementOnMountain == nullptr) {
                updateRaycastingMountains(mapPortion);
            }
            if (m_elementOnObject == nullptr) {
                updateRaycastingObjects(mapPortion);
            }
        }
    }

    yGrid = m_positionOnPlane.getY(RPM::get()->getSquareSize());
    if (m_distanceLand == 0.0f || m_positionOnLand.getY(RPM::get()
        ->getSquareSize()) < yGrid)
    {
        m_positionOnLand = m_positionOnPlane;
        m_elementOnLand = nullptr;
    }

    if (m_distanceSprite == 0.0f || m_positionOnSprite.getY(RPM::get()
        ->getSquareSize()) < yGrid)
    {
        m_positionOnSprite = m_positionOnLand;
        m_positionRealOnSprite = m_positionOnLand;
        m_elementOnSprite = nullptr;
    } else {
        positionLayerZero = Position(m_positionOnSprite);
        m_map->getLocalPortion(positionLayerZero, portion);
        mapPortion = m_map->mapPortion(portion);
        element = nullptr;
        layer = 0;
        while (element == nullptr) {
            positionLayerZero.setLayer(layer++);
            element = mapPortion->getMapElementAt(positionLayerZero,
                MapEditorSelectionKind::Sprites, MapEditorSubSelectionKind
                ::None);
        }
        if (element->getSubKind() == MapEditorSubSelectionKind::SpritesWall) {
            m_distanceSprite = reinterpret_cast<SpriteWallDatas *>(element)
                ->intersectionPlane(positionLayerZero.angle(), m_ray);
        }
        else {
            m_distanceSprite = reinterpret_cast<SpriteDatas *>(element)
                ->intersectionPlane(positionLayerZero.angle(), m_ray);
        }
        getCorrectPositionOnRay(m_positionRealOnSprite, rayDirection,
            static_cast<int>(m_distanceSprite));
    }

    m_positionOnPlaneWallIndicator = m_positionOnLand;

    if (m_distanceObject3D == 0.0f) {
        m_positionOnObject3D = m_positionOnLand;

        // Temp : by default position of objects center 0
        m_positionOnObject3D.setCenterX(0);
        m_positionOnObject3D.setCenterZ(0);
    }
    if (m_distanceObject == 0.0f) {
        m_positionOnObject = m_positionOnLand;
    }
}

// -------------------------------------------------------

void ControlMapEditor::getPortionsInRay(QList<Portion> &portions) {
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
        leftBotCorner *= RPM::portionSize * m_map->squareSize();
        rightTopCorner *= RPM::portionSize * m_map->squareSize();
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
            getCorrectPositionOnRay(positionCamera, direction, static_cast<int>(
                distance));
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

void ControlMapEditor::updatePortionsInRay(QList<Portion> &portions,
    QList<Portion> &adjacents)
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
            leftBotCorner *= RPM::portionSize * m_map->squareSize();
            rightTopCorner *= RPM::portionSize * m_map->squareSize();
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

void ControlMapEditor::updateRaycastingLand(MapPortion *mapPortion)
{
    m_elementOnLand = mapPortion->updateRaycastingLand(m_map->squareSize(),
        m_distanceLand, m_positionOnLand, m_ray, m_firstMouseCoords);
}

// -------------------------------------------------------

void ControlMapEditor::updateRaycastingSprites(MapPortion *mapPortion, bool layerOn)
{
    m_elementOnSprite = mapPortion->updateRaycastingSprites(m_map->squareSize(),
        m_distanceSprite, m_positionOnSprite, m_ray, m_camera->horizontalAngle(),
        m_isCtrlPressed ? true : layerOn);
}

// -------------------------------------------------------

void ControlMapEditor::updateRaycastingObjects3D(MapPortion *mapPortion) {
    m_elementOnObject3D = mapPortion->updateRaycastingObjects3D(
        m_distanceObject3D, m_positionOnObject3D, m_ray);
}

// -------------------------------------------------------

void ControlMapEditor::updateRaycastingMountains(MapPortion *mapPortion) {
    m_elementOnMountain = mapPortion->updateRaycastingMountains(
        m_distanceMountain, m_positionOnMountain, m_ray);
}

// -------------------------------------------------------

void ControlMapEditor::updateRaycastingObjects(MapPortion *mapPortion) {
    m_elementOnObject = mapPortion->updateRaycastingObjects(m_map->squareSize(),
        m_distanceObject, m_positionOnObject, m_ray);
}

// -------------------------------------------------------

QVector3D ControlMapEditor::transformToNormalizedCoords(const QPoint &mouse) {
    float x = (2.0f * mouse.x()) / m_width - 1.0f;
    float y = 1.0f - (2.0f * mouse.y()) / m_height;
    float z = 1.0f;

    return QVector3D(x, y, z);
}

// -------------------------------------------------------

QVector4D ControlMapEditor::transformToHomogeneousClip(QVector3D &normalized){
    return QVector4D(normalized.x(), normalized.y(), -1.0, 1.0);
}

// -------------------------------------------------------

QVector4D ControlMapEditor::transformToEyeCoords(QVector4D &rayClip,
    QMatrix4x4 &projection)
{
    QVector4D rayEye = projection.inverted() * rayClip;

    return QVector4D(rayEye.x(), rayEye.y(), -1.0, 0.0);
}

// -------------------------------------------------------

QVector3D ControlMapEditor::transformToWorldCoords(QVector4D &rayEye,
    QMatrix4x4 &view)
{
    QVector4D rayWorld = view.inverted() * rayEye;

    return QVector3D(rayWorld.x(), rayWorld.y(), rayWorld.z()).normalized();
}

// -------------------------------------------------------

QVector3D ControlMapEditor::getRayWorld(const QPoint &mouse, QMatrix4x4& projection,
    QMatrix4x4& view)
{
    QVector3D normalized = transformToNormalizedCoords(mouse);
    QVector4D homogeneous = transformToHomogeneousClip(normalized);
    QVector4D eye = transformToEyeCoords(homogeneous, projection);

    return transformToWorldCoords(eye, view);
}

// -------------------------------------------------------

QVector3D ControlMapEditor::getPositionOnRay(QVector3D &ray, int distance) {
    return QVector3D(ray.x() * distance + m_camera->positionX(), ray.y() *
        distance + m_camera->positionY(), ray.z() * distance + m_camera
        ->positionZ());
}

// -------------------------------------------------------

void ControlMapEditor::getCorrectPositionOnRay(Position &position,
    QVector3D &ray, int distance,  bool accurate)
{
    QVector3D point = getPositionOnRay(ray, distance);
    int x, y, z;
    double yPlus;
    y = qFloor(static_cast<qreal>(point.y()) / m_map->squareSize());
    yPlus = Common::modulo(qFloor(static_cast<qreal>(point.y())), m_map
        ->squareSize()) * 100.0 / m_map->squareSize();

    if (accurate) {
        x = qRound((point.x() + 1) / m_map->squareSize());
        z = qRound((point.z() + 1) / m_map->squareSize());
    }
    else {
        x = qRound(point.x() + 1) / m_map->squareSize();
        z = qRound(point.z() + 1) / m_map->squareSize();
        if (static_cast<int>(point.x()) < 0) x--;
        if (static_cast<int>(point.z()) < 0) z--;
    }

    position.setX(x);
    position.setY(y);
    position.setYPlus(yPlus);
    position.setZ(z);
}
