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
#include "dialogobject.h"
#include "wanok.h"
#include "qbox3d.h"
#include <QTime>
#include <math.h>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ControlMapEditor::ControlMapEditor() :
    m_map(nullptr),
    m_grid(nullptr),
    m_beginWallIndicator(nullptr),
    m_endWallIndicator(nullptr),
    m_cursorObject(nullptr),
    m_camera(new Camera),
    m_elementOnLand(nullptr),
    m_elementOnSprite(nullptr),
    m_positionPreviousPreview(-1, 0, 0, -1, 0),
    m_needMapInfosToSave(false),
    m_needMapObjectsUpdate(false),
    m_displayGrid(true),
    m_displaySquareInformations(true),
    m_treeMapNode(nullptr),
    m_isDrawingWall(false),
    m_isDeletingWall(false),
    m_isDeleting(false)
{

}

ControlMapEditor::~ControlMapEditor(){
    deleteMap(false);
    delete m_camera;
}

Map* ControlMapEditor::map() const { return m_map; }

Grid* ControlMapEditor::grid() const { return m_grid; }

Cursor* ControlMapEditor::cursor() const { return m_map->cursor(); }

Cursor* ControlMapEditor::cursorObject() const { return m_cursorObject; }

Camera* ControlMapEditor::camera() const { return m_camera; }

bool ControlMapEditor::displaySquareInformations() const {
    return m_displaySquareInformations;
}

void ControlMapEditor::setContextMenu(ContextMenuList* m){
    m_contextMenu = m;
}

void ControlMapEditor::setTreeMapNode(QStandardItem* item) {
    m_treeMapNode = item;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ControlMapEditor::moveCursorToMousePosition(QPoint point, bool layerOn)
{
    updateMousePosition(point);
    update(MapEditorSubSelectionKind::None, layerOn);

    if (m_map->isInGrid(m_positionOnPlane))
        cursor()->setPositions(m_positionOnPlane);
}

// -------------------------------------------------------

void ControlMapEditor::reLoadTextures(){
    m_map->loadTextures();
}

// -------------------------------------------------------

Map* ControlMapEditor::loadMap(int idMap, QVector3D* position,
                               QVector3D *positionObject, int cameraDistance,
                               double cameraHorizontalAngle,
                               double cameraVerticalAngle)
{
    clearPortionsToUpdate();

    // Map & cursor
    m_map = new Map(idMap);
    Wanok::get()->project()->setCurrentMap(m_map);
    m_map->initializeCursor(position);
    m_map->initializeGL();
    // Update current portion and load all the local portions
    m_currentPortion = cursor()->getPortion();
    m_map->loadPortions(m_currentPortion);

    // Grid
    m_grid = new Grid;
    m_grid->initializeVertices(m_map->mapProperties()->length(),
                               m_map->mapProperties()->width(),
                               m_map->squareSize());
    m_grid->initializeGL();

    // Cursor object
    m_cursorObject = new Cursor(positionObject);
    m_cursorObject->initializeSquareSize(m_map->squareSize());
    Position pos(m_cursorObject->getSquareX(),
                 m_cursorObject->getSquareY(),
                 0,
                 m_cursorObject->getSquareZ(),
                 0);
    setCursorObjectPosition(pos);
    m_cursorObject->setFrameNumber(1);
    m_cursorObject->loadTexture(
                ":/textures/Ressources/object_square_cursor.png");
    m_cursorObject->initialize();

    // Wall indicator
    m_beginWallIndicator = new WallIndicator;
    m_endWallIndicator = new WallIndicator;
    updateWallIndicator();
    m_beginWallIndicator->initializeSquareSize(m_map->squareSize());
    m_beginWallIndicator->initializeVertices();
    m_beginWallIndicator->initializeGL();
    m_endWallIndicator->initializeSquareSize(m_map->squareSize());
    m_endWallIndicator->initializeVertices();
    m_endWallIndicator->initializeGL();

    // Camera
    m_camera->setDistance(cameraDistance * Wanok::coefSquareSize());
    m_camera->setHorizontalAngle(cameraHorizontalAngle);
    m_camera->setVerticalAngle(cameraVerticalAngle);
    m_camera->update(cursor(), m_map->squareSize());

    return m_map;
}

// -------------------------------------------------------

void ControlMapEditor::deleteMap(bool updateCamera){
    clearPortionsToUpdate();
    removePreviewElements();

    // Cursors
    if (m_cursorObject != nullptr){
        delete m_cursorObject;
        m_cursorObject = nullptr;
    }
    if (m_beginWallIndicator != nullptr){
        delete m_beginWallIndicator;
        m_beginWallIndicator = nullptr;
    }
    if (m_endWallIndicator != nullptr){
        delete m_endWallIndicator;
        m_endWallIndicator = nullptr;
    }

    // Grid
    if (m_grid != nullptr){
        delete m_grid;
        m_grid = nullptr;
    }

    // Map
    if (m_map != nullptr){
        delete m_map;
        m_map = nullptr;
    }

    // Update camera node
    if (updateCamera && m_treeMapNode != nullptr) {
        m_camera->setDistance(m_camera->distance() / Wanok::coefSquareSize());
        updateCameraTreeNode();
    }
}

// -------------------------------------------------------

void ControlMapEditor::onResize(int width, int height){
    m_width = width;
    m_height = height;
    m_camera->setProjection(width, height);
}

// -------------------------------------------------------

void ControlMapEditor::updateCameraTreeNode(){
    TreeMapTag* tag = (TreeMapTag*) m_treeMapNode->data().value<quintptr>();
    tag->setCameraDistance(m_camera->distance());
    tag->setCameraHorizontalAngle(m_camera->horizontalAngle());
    tag->setCameraVerticalAngle(m_camera->verticalAngle());
}

// -------------------------------------------------------
//
//  UPDATE
//
// -------------------------------------------------------

void ControlMapEditor::update(MapEditorSubSelectionKind subSelection,
                              bool layerOn)
{
    updateRaycasting(layerOn);

    // Update portions
    updatePortions(subSelection);
    saveTempPortions();
    clearPortionsToUpdate();
    updateMovingPortions();

    // Camera
    m_camera->update(cursor(), m_map->squareSize());

    // Mouse update
    m_mouseBeforeUpdate = m_mouseMove;
}

// -------------------------------------------------------

void ControlMapEditor::updateMouse(QPoint point, bool layerOn) {
    updateMousePosition(point);
    m_mouseMove = point;
    updateRaycasting(layerOn);
    m_mouseBeforeUpdate = m_mouseMove;
}

// -------------------------------------------------------

void ControlMapEditor::updateMousePosition(QPoint point) {
    m_mouse = point;
}

// -------------------------------------------------------

bool ControlMapEditor::mousePositionChanged(QPoint point) {
    return m_mouse != point;
}

// -------------------------------------------------------
//
//  MOUSE RAYCASTING
//
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
            updateRaycastingLand(mapPortion);
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
        positionLayerZero.setLayer(0);
        Portion portion = m_map->getLocalPortion(positionLayerZero);
        MapPortion* mapPortion = m_map->mapPortion(portion);
        MapElement* element = mapPortion->getMapElementAt(
                    positionLayerZero, MapEditorSelectionKind::Sprites,
                    MapEditorSubSelectionKind::None);
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
    portionCamera = m_map->getLocalPortion(positionCamera);

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
        if (isnan(distance))
            return;
        else {
            getCorrectPositionOnRay(positionCamera, direction, distance);
            portionCamera = m_map->getLocalPortion(positionCamera);
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
            if (!isnan(distance)) {
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

// -------------------------------------------------------
//
//  UPDATES
//
// -------------------------------------------------------

void ControlMapEditor::updateWallIndicator() {
    if (!m_isDrawingWall && !m_isDeletingWall) {
        m_beginWallIndicator->setPosition(m_positionOnPlaneWallIndicator,
                                          m_map->mapProperties()->length(),
                                          m_map->mapProperties()->width());
    }
    m_endWallIndicator->setPosition(m_positionOnPlaneWallIndicator,
                                    m_map->mapProperties()->length(),
                                    m_map->mapProperties()->width());
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewElements(
        MapEditorSelectionKind kind, MapEditorSubSelectionKind subKind,
        DrawKind drawKind, bool layerOn, QRect& tileset, int specialID)
{
    if (drawKind == DrawKind::Pin || (m_isDeleting && !m_isDeletingWall))
        return;

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
    if (subKind == MapEditorSubSelectionKind::Floors)
        updatePreviewFloors(kind, subKind, up, layerOn, tileset, position);
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

void ControlMapEditor::updatePreviewFloors(MapEditorSelectionKind kind,
                                           MapEditorSubSelectionKind subKind,
                                           bool up, bool layerOn,
                                           QRect &tileset, Position &position)
{
    for (int i = 0; i < tileset.width(); i++){
        if (position.x() + i > m_map->mapProperties()->length())
            break;

        for (int j = 0; j < tileset.height(); j++){
            if (position.z() + j > m_map->mapProperties()->width())
                break;

            Position shortPosition(position.x() + i, 0, 0, position.z() + j,
                                   position.layer());
            Portion shortPortion = m_map->getLocalPortion(shortPosition);
            if (m_map->isInGrid(shortPosition) &&
                m_map->isInPortion(shortPortion))
            {
                int layer = getLayer(m_map->mapPortion(shortPortion),
                                     m_distanceLand, shortPosition, layerOn,
                                     kind, subKind);
                shortPosition.setLayer(layer);

                MapElement* element = new FloorDatas(
                            new QRect(tileset.x() + i, tileset.y() + j, 1, 1),
                            up);
                updatePreviewElement(shortPosition, shortPortion, element);
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::getWallSpritesPositions(QList<Position> &positions) {
    int x, y, yPlus, z;
    Position3D begin, end;
    m_beginWallIndicator->getPosition(begin);
    m_endWallIndicator->getPosition(end);

    // Can't build a wall if not in the same height
    if (begin.y() != end.y())
        return;
    y = begin.y(), yPlus = begin.yPlus();

    // Vertical
    if (begin.x() == end.x()) {
        x = begin.x();
        int upZ = qMin(begin.z(), end.z());
        int downZ = qMax(begin.z(), end.z());

        for (int i = upZ; i < downZ; i++)
            positions.append(Position(x, y, yPlus, i, 0, 0, 50, 90));
    }

    // Horizontal
    else if (begin.z() == end.z()) {
        z = begin.z();
        int leftX = qMin(begin.x(), end.x());
        int rightX = qMax(begin.x(), end.x());

        for (int i = leftX; i < rightX; i++)
            positions.append(Position(i, y, yPlus, z, 0, 50, 0, 0));
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
    Portion portion = m_map->getLocalPortion(position);

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
    Portion portion = m_map->getLocalPortion(m_positionPreviousPreview);
    if (m_map->isInGrid(m_positionPreviousPreview) &&
        m_map->isInPortion(portion))
    {
        int layer = getLayer(m_map->mapPortion(portion), m_distanceSprite,
                             m_positionPreviousPreview, layerOn, kind, subKind);
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
    mapPortion->addPreview(p, element);
    m_portionsToUpdate += mapPortion;
    m_portionsPreviousPreview += mapPortion;
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

// -------------------------------------------------------

void ControlMapEditor::updatePortions(MapEditorSubSelectionKind subSelection) {
    if (m_needMapObjectsUpdate) {
        m_needMapObjectsUpdate = false;
        m_map->updateMapObjects();
    }

    QSet<MapPortion*>::iterator i;
    for (i = m_portionsToUpdate.begin(); i != m_portionsToUpdate.end(); i++) {
        MapPortion* mapPortion = *i;
        if (subSelection == MapEditorSubSelectionKind::SpritesWall)
            mapPortion->updateSpriteWalls();
        m_map->updatePortion(mapPortion);
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMovingPortions() {
    Portion newPortion = cursor()->getPortion();

    updateMovingPortionsEastWest(newPortion);
    updateMovingPortionsNorthSouth(newPortion);
    updateMovingPortionsUpDown(newPortion);

    m_currentPortion = newPortion;
}

// -------------------------------------------------------

void ControlMapEditor::updateMovingPortionsEastWest(Portion& newPortion){
    int r = m_map->portionsRay();
    if (newPortion.x() > m_currentPortion.x()) {
        int k = 0;
        for (int j = -r; j <= r; j++) {
            bool visible = j != -r && j != r;
            int i = -r;
            removePortion(i, k, j);
            setPortion(i, k, j, i + 1, k, j, false);
            i++;
            for (; i < r; i++)
                setPortion(i, k, j, i + 1, k, j, visible);

            loadPortion(newPortion, r, k, j);
        }
    }
    else if (newPortion.x() < m_currentPortion.x()) {
        int k = 0;
        for (int j = -r; j <= r; j++) {
            bool visible = j != -r && j != r;
            int i = r;
            removePortion(i, k, j);
            setPortion(i, k, j, i - 1, k, j, false);
            i--;
            for (; i > -r; i--)
                setPortion(i, k, j, i - 1, k, j, visible);

            loadPortion(newPortion, -r, k, j);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMovingPortionsNorthSouth(Portion& newPortion){
    int r = m_map->portionsRay();
    if (newPortion.z() > m_currentPortion.z()) {
        int k = 0;
        for (int i = -r; i <= r; i++) {
            bool visible = i != -r && i != r;
            int j = -r;
            removePortion(i, k, j);
            setPortion(i, k, j, i, k, j + 1, false);
            j++;
            for (; j < r; j++)
                setPortion(i, k, j, i, k, j + 1, visible);

            loadPortion(newPortion, i, k, r);
        }
    }
    else if (newPortion.z() < m_currentPortion.z()) {
        int k = 0;
        for (int i = -r; i <= r; i++) {
            bool visible = i != -r && i != r;
            int j = r;
            removePortion(i, k, j);
            setPortion(i, k, j, i, k, j - 1, false);
            j--;
            for (; j > -r; j--)
                setPortion(i, k, j, i, k, j - 1, visible);

            loadPortion(newPortion, i, k, -r);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMovingPortionsUpDown(Portion&){
    // TODO
}

// -------------------------------------------------------

void ControlMapEditor::removePortion(int i, int j, int k){
    MapPortion* mapPortion = m_map->mapPortion(i, j, k);
    if (mapPortion != nullptr)
        delete mapPortion;
}

// -------------------------------------------------------

void ControlMapEditor::setPortion(int i, int j, int k, int m, int n, int o,
                                  bool visible)
{
    Portion previousPortion(i, j, k);
    Portion newPortion(m, n, o);

    m_map->replacePortion(previousPortion, newPortion, visible);
}

// -------------------------------------------------------

void ControlMapEditor::loadPortion(Portion& currentPortion, int i, int j,
                                   int k)
{
    m_map->loadPortion(currentPortion.x() + i, currentPortion.y() + j,
                       currentPortion.z() + k, i, j, k, false);
}

// -------------------------------------------------------

void ControlMapEditor::saveTempPortions(){
    QSet<MapPortion*>::iterator i;
    for (i = m_portionsToSave.begin(); i != m_portionsToSave.end(); i++)
        m_map->savePortionMap(*i);

    // Save file infos
    if (m_needMapInfosToSave) {
        m_map->saveMapProperties();
        m_needMapInfosToSave = false;
    }
}

// -------------------------------------------------------

void ControlMapEditor::clearPortionsToUpdate(){
    m_portionsToUpdate.clear();
    m_portionsToSave.clear();
}

// -------------------------------------------------------

void ControlMapEditor::setToNotSaved(){
    m_map->setSaved(false);
    Wanok::mapsToSave.insert(m_map->mapProperties()->id());
    m_treeMapNode->setText(m_map->mapProperties()->name() + " *");
}

// -------------------------------------------------------

void ControlMapEditor::save(){
    m_treeMapNode->setText(m_map->mapProperties()->name());
}

// -------------------------------------------------------
//
//  ADD / REMOVE
//
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
        if (m_map->isInGrid(p)) {
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

MapElement* ControlMapEditor::getPositionSelected(
        Position& position, MapEditorSelectionKind selection,
        MapEditorSubSelectionKind subSelection, bool layerOn,
        bool isForDisplay) const
{
    switch (selection){
    case MapEditorSelectionKind::Land:
        position = m_positionOnLand;
        return m_elementOnLand;
    case MapEditorSelectionKind::Sprites:
        if ((m_isDeleting && subSelection !=
             MapEditorSubSelectionKind::SpritesWall) || layerOn || isForDisplay)
        {
            position = m_positionOnSprite;
            return m_elementOnSprite;
        }

        position = m_positionOnPlane;
        return nullptr;
    case MapEditorSelectionKind::Objects:
        position = m_positionOnPlane;
        return nullptr;
    default:
        position = m_positionOnPlane;
        return nullptr;
    }
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
            addFloor(p, subSelection, drawKind, layerOn, tileset, specialID);
            break;
        case MapEditorSelectionKind::Sprites:
            addSprite(p, subSelection, drawKind, layerOn, tileset);
        case MapEditorSelectionKind::Objects:
            setCursorObjectPosition(p); break;
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
        setCursorObjectPosition(p);
        showObjectMenuContext();
        break;
    default:
        break;
    }
}

// -------------------------------------------------------
//
//  Floors
//
// -------------------------------------------------------

void ControlMapEditor::addFloor(Position& p, MapEditorSubSelectionKind kind,
                                DrawKind drawKind, bool layerOn, QRect &tileset,
                                int specialID)
{
    FloorDatas* floor;
    QRect* shortTexture;
    bool up = m_camera->cameraUp();

    // Pencil
    switch (drawKind) {
    case DrawKind::Pencil:
        if (tileset.width() == 1 && tileset.height() == 1){
            QList<Position> positions;
            traceLine(m_previousMouseCoords, p, positions);
            for (int i = 0; i < positions.size(); i++){
                QRect* rect = new QRect(tileset.x(),
                                        tileset.y(),
                                        tileset.width(),
                                        tileset.height());
                floor = new FloorDatas(rect, up);
                stockLand(positions[i], floor, kind, layerOn);
            }
        }
        for (int i = 0; i < tileset.width(); i++){
            if (p.x() + i > m_map->mapProperties()->length())
                break;

            for (int j = 0; j < tileset.height(); j++){
                if (p.z() + j > m_map->mapProperties()->width())
                    break;

                Position shortPosition(p.x() + i, 0, 0, p.z() + j, p.layer());
                shortTexture = new QRect(tileset.x() + i, tileset.y() + j,
                                         1, 1);
                floor = new FloorDatas(shortTexture, up);
                stockLand(shortPosition, floor, kind, layerOn);
            }
        }
        break;
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
        Portion portion = m_map->getLocalPortion(p);
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
                            portion = m_map->getLocalPortion(adjacentPosition);
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

LandDatas* ControlMapEditor::getLand(Portion& portion, Position& p){
    MapPortion* mapPortion = m_map->mapPortion(portion);
    if (mapPortion == nullptr)
        return nullptr;
    return mapPortion->getLand(p);
}

// -------------------------------------------------------

void ControlMapEditor::getFloorTextureReduced(QRect& rect, QRect &rectAfter,
                                              int localX, int localZ)
{
    rectAfter.setX(rect.x() + Wanok::mod(localX, rect.width()));
    rectAfter.setY(rect.y() + Wanok::mod(localZ, rect.height()));
    rectAfter.setWidth(1);
    rectAfter.setHeight(1);
}

// -------------------------------------------------------

bool ControlMapEditor::areLandsEquals(LandDatas* landBefore,
                                      QRect& textureAfter,
                                      MapEditorSubSelectionKind kindAfter)
{
    if (landBefore == nullptr)
        return kindAfter == MapEditorSubSelectionKind::None;
    else{
        if (landBefore->getSubKind() == kindAfter){
            switch (kindAfter){
            case MapEditorSubSelectionKind::Floors:
                return (*(((FloorDatas*) landBefore)->textureRect())) ==
                        textureAfter;
            case MapEditorSubSelectionKind::Autotiles:
                return false; // TODO
            case MapEditorSubSelectionKind::Water:
                return false; // TODO
            default:
                return false;
            }
        }
        else
            return false;
    }
}

// -------------------------------------------------------

LandDatas* ControlMapEditor::getLandAfter(MapEditorSubSelectionKind kindAfter,
                                          QRect &textureAfter)
{
    QRect* texture = new QRect(textureAfter.x(),
                               textureAfter.y(),
                               textureAfter.width(),
                               textureAfter.height());
    switch (kindAfter) {
    case MapEditorSubSelectionKind::Floors:
        return new FloorDatas(texture);
    case MapEditorSubSelectionKind::Autotiles:
        return nullptr;
    case MapEditorSubSelectionKind::Water:
        return nullptr;
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

void ControlMapEditor::getLandTexture(QRect& rect, LandDatas* land){
    FloorDatas* floor;

    switch (land->getSubKind()) {
    case MapEditorSubSelectionKind::Floors:
        floor = (FloorDatas*) land;
        rect.setX(floor->textureRect()->x());
        rect.setY(floor->textureRect()->y());
        rect.setWidth(floor->textureRect()->width());
        rect.setHeight(floor->textureRect()->height());
        break;
    case MapEditorSubSelectionKind::Autotiles:
        break;
    case MapEditorSubSelectionKind::Water:
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void ControlMapEditor::stockLand(Position& p, LandDatas *landDatas,
                                 MapEditorSubSelectionKind kind, bool layerOn,
                                 bool undoRedo)
{
    if (m_map->isInGrid(p)){
        Portion portion = m_map->getLocalPortion(p);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);

            // Update layer
            if (!undoRedo) {
                m_currentLayer = getLayer(mapPortion, m_distanceLand, p, layerOn,
                                          MapEditorSelectionKind::Land, kind);
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
                m_portionsToUpdate += mapPortion;
                m_portionsToSave += mapPortion;
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
    if (m_map->isInGrid(p)){
        Portion portion = m_map->getLocalPortion(p);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);

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
                m_portionsToUpdate += mapPortion;
                m_portionsToSave += mapPortion;
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

SpriteDatas* ControlMapEditor::getCompleteSprite(MapEditorSubSelectionKind kind,
        int xOffset, int yOffset, int zOffset, QRect& tileset, bool front,
        bool layerOn) const
{
    SpriteDatas* sprite = new SpriteDatas(kind, new QRect(tileset), front);
    if (layerOn) {
        sprite->setXOffset(xOffset);
        sprite->setYOffset(yOffset);
        sprite->setZOffset(zOffset);
    }

    return sprite;
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
            stockSpriteWall(positions[i], specialID);
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
                                   MapEditorSubSelectionKind kind, bool layerOn)
{
    if (m_map->isInGrid(p)){
        Portion portion = m_map->getLocalPortion(p);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);

            // Update layer
            m_currentLayer = getLayer(mapPortion, m_distanceSprite, p, layerOn,
                                      MapEditorSelectionKind::Sprites, kind);
            p.setLayer(m_currentLayer);

            // Add the sprite
            QSet<Portion> portionsOverflow;
            if (mapPortion->addSprite(portionsOverflow, p, sprite) &&
                m_map->saved())
            {
                setToNotSaved();
            }

            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;
            m_needMapInfosToSave = true;
            updatePortionsToSaveOverflow(portionsOverflow);

            return;
        }
    }

    delete sprite;
}

// -------------------------------------------------------

void ControlMapEditor::stockSpriteWall(Position &position,
                                       int specialID)
{
    if (m_map->isInGrid(position)) {
        Portion portion = m_map->getLocalPortion(position);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            if (mapPortion->addSpriteWall(position, specialID) &&
                m_map->saved())
            {
                setToNotSaved();
            }

            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;
        }
    }
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

void ControlMapEditor::eraseSprite(Position& p){
    if (m_map->isInGrid(p)){
        Portion portion = m_map->getLocalPortion(p);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            QSet<Portion> portionsOverflow;

            /*
            QJsonObject previous;
            MapEditorSubSelectionKind previousType;
            bool changed = mapPortion->deleteSprite(
                        portionsOverflow, p, previous, previousType);
            if (changed && m_map->saved())
                setToNotSaved();
            if (changed) {
                QList<QJsonObject> previouses;
                QList<MapEditorSubSelectionKind> previousTypes;
                QList<Position> positions;
                previouses.append(previous);
                previousTypes.append(previousType);
                previousTypes.append(p);
                updateRemoveLayer(p, previouses, previousTypes, positions);
                for (int i = 0; i < previous.size(); i++) {
                    m_controlUndoRedo.updateJsonList(
                                changes, previous.at(i), previousType.at(i),
                                nullptr, MapEditorSubSelectionKind::None,
                                positions.at(i));
                }
                m_portionsToUpdate += mapPortion;
                m_portionsToSave += mapPortion;
            }

            if (mapPortion->deleteSprite(portionsOverflow, p) && m_map->saved())
                setToNotSaved();
*/
            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;
            m_needMapInfosToSave = true;
            updatePortionsToSaveOverflow(portionsOverflow);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseSpriteWall(Position &position) {
    if (m_map->isInGrid(position)) {
        Portion portion = m_map->getLocalPortion(position);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            if (mapPortion->deleteSpriteWall(position) && m_map->saved())
            {
                setToNotSaved();
            }

            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;
        }
    }
}

// -------------------------------------------------------
//
//  Objects
//
// -------------------------------------------------------

void ControlMapEditor::setCursorObjectPosition(Position& p){
    m_cursorObject->setX(p.x());
    m_cursorObject->setZ(p.z());

    Portion portion = m_map->getLocalPortion(p);
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
    Portion portion = m_map->getLocalPortion(p);
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
        Portion portion = m_map->getLocalPortion(p);
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

// -------------------------------------------------------

void ControlMapEditor::updatePortionsToSaveOverflow(
        QSet<Portion>& portionsOverflow)
{
    for (QSet<Portion>::const_iterator i = portionsOverflow.begin();
         i != portionsOverflow.end(); i++)
    {
        Portion portion = *i;
        MapPortion* newMapPortion = m_map->mapPortionFromGlobal(portion);

        if (newMapPortion != nullptr)
        m_portionsToSave += newMapPortion;
    }

}

// -------------------------------------------------------

void ControlMapEditor::traceLine(Position& previousCoords, Position& coords,
                                 QList<Position>& positions)
{
    if (m_previousMouseCoords.x() == -1)
        return;

    int x1 = previousCoords.x(), x2 = coords.x();
    int y = coords.y();
    int yPlus = coords.yPlus();
    int z1 = previousCoords.z(), z2 = coords.z();
    int l = coords.layer();
    int dx = x2 - x1, dz = z2 - z1;
    bool test = true;

    if (dx != 0){
        if (dx > 0){
            if (dz != 0){
                if (dz > 0){
                    if (dx >= dz){
                        int e = dx;
                        dx = 2 * e;
                        dz = dz * 2;

                        while (test){
                            positions.push_back(Position(x1, y, yPlus, z1, l));
                            x1++;
                            if (x1 == x2) break;
                            e -= dz;
                            if (e < 0){
                                z1++;
                                e += dx;
                            }
                        }
                    }
                    else{
                        int e = dz;
                        dz = 2 * e;
                        dx = dx * 2;

                        while (test){
                            positions.push_back(Position(x1, y, yPlus, z1, l));
                            z1++;
                            if (z1 == z2) break;
                            e -= dx;
                            if (e < 0){
                                x1++;
                                e += dz;
                            }
                        }
                    }
                }
                else{
                    if (dx >= -dz){
                        int e = dx;
                        dx = 2 * e;
                        dz = dz * 2;

                        while (test){
                            positions.push_back(Position(x1, y, yPlus, z1, l));
                            x1++;
                            if (x1 == x2) break;
                            e += dz;
                            if (e < 0){
                                z1--;
                                e += dx;
                            }
                        }
                    }
                    else{
                        int e = dz;
                        dz = 2 * e;
                        dx = dx * 2;

                        while (test){
                            positions.push_back(Position(x1, y, yPlus, z1, l));
                            z1--;
                            if (z1 == z2) break;
                            e += dx;
                            if (e > 0){
                                x1++;
                                e += dz;
                            }
                        }
                    }
                }
            }
            else{
                while (x1 != x2){
                    positions.push_back(Position(x1, y, yPlus, z1, l));
                    x1++;
                }
            }
        }
        else{
            dz = z2 - z1;
            if (dz != 0){
                if (dz > 0){
                    if (-dx >= dz){
                        int e = dx;
                        dx = 2 * e;
                        dz = dz * 2;

                        while (test){
                            positions.push_back(Position(x1, y, yPlus, z1, l));
                            x1--;
                            if (x1 == x2) break;
                            e += dz;
                            if (e >= 0){
                                z1++;
                                e += dx;
                            }
                        }
                    }
                    else{
                        int e = dz;
                        dz = 2 * e;
                        dx = dx * 2;

                        while (test){
                            positions.push_back(Position(x1, y, yPlus, z1, l));
                            z1++;
                            if (z1 == z2) break;
                            e += dx;
                            if (e <= 0)
                            {
                                x1--;
                                e += dz;
                            }
                        }
                    }
                }
                else{
                    if (dx <= dz){
                        int e = dx;
                        dx = 2 * e;
                        dz = dz * 2;

                        while (test){
                            positions.push_back(Position(x1, y, yPlus, z1, l));
                            x1--;
                            if (x1 == x2) break;
                            e -= dz;
                            if (e >= 0){
                                z1--;
                                e += dx;
                            }
                        }
                    }
                    else{
                        int e = dz;
                        dz = 2 * e;
                        dx = dx * 2;

                        while (test){
                            positions.push_back(Position(x1, y, yPlus, z1, l));
                            z1--;
                            if (z1 == z2) break;
                            e -= dx;
                            if (e >= 0){
                                x1--;
                                e += dz;
                            }
                        }
                    }
                }
            }
            else{
                while (x1 != x2){
                    positions.push_back(Position(x1, y, yPlus, z1, l));
                    x1--;
                }
            }
        }
    }
    else{
        dz = z2 - z1;
        if (dz != 0){
            if (dz > 0){
                while(z1 != z2){
                    positions.push_back(Position(x1, y, yPlus, z1, l));
                    z1++;
                }
            }
            else{
                while (z1 != z2){
                    positions.push_back(Position(x1, y, yPlus, z1, l));
                    z1--;
                }
            }
        }
    }
}

// -------------------------------------------------------

bool ControlMapEditor::isTinPaintPossible(MapEditorSelectionKind selection,
                                          DrawKind drawKind,
                                          QString &messageError) const
{
    switch (drawKind) {
    case DrawKind::Pin:
        if (selection == MapEditorSelectionKind::Sprites) {
            messageError =
                    "A sprite cannot be applied with tin of paint option.";
            return false;
        }
    default:
        break;
    }

    return true;
}

// -------------------------------------------------------

bool ControlMapEditor::isPutLayerPossible(
        MapEditorSubSelectionKind subSelection, DrawKind drawKind, bool layerOn,
        QString& messageError) const
{
    if (layerOn) {
        if (drawKind == DrawKind::Pin) {
            messageError =
                    "A top layer cannot be applied with tin of paint option.";
            return false;
        }
        else if (subSelection == MapEditorSubSelectionKind::SpritesWall) {
            messageError =
                    "A top layer cannot be applied with sprite walls.";
            return false;
        }
    }

    return true;
}

// -------------------------------------------------------

int ControlMapEditor::getLayer(MapPortion *mapPortion, float d, Position& p,
                               bool layerOn, MapEditorSelectionKind kind,
                               MapEditorSubSelectionKind subKind)
{
    if (m_currentLayer == -1) {
        if (d != 0) {
            int layer = p.layer();
            if (layerOn)
                layer = mapPortion->getLastLayerAt(p, kind, subKind) + 1;

            return layer;
        }
        return 0;
    }

    return m_currentLayer;
}

// -------------------------------------------------------

void ControlMapEditor::undo() {
    QJsonArray states;
    m_controlUndoRedo.undo(m_map->mapProperties()->id(), states);
    undoRedo(states, true);
}

// -------------------------------------------------------

void ControlMapEditor::redo() {
    QJsonArray states;
    m_controlUndoRedo.redo(m_map->mapProperties()->id(), states);
    undoRedo(states, false);
}

// -------------------------------------------------------

void ControlMapEditor::undoRedo(QJsonArray& states, bool reverseAction) {
    for (int i = 0; i < states.size(); i++) {
        QJsonObject objState = states.at(i).toObject(), objBefore, objAfter;
        MapEditorSubSelectionKind kindBefore, kindAfter;
        Position position;
        m_controlUndoRedo.getStateInfos(objState, kindBefore, kindAfter,
                                        objBefore, objAfter, position);
        performUndoRedoAction(kindBefore, reverseAction, objBefore, position);
        performUndoRedoAction(kindAfter, !reverseAction, objAfter, position);
    }
}

void ControlMapEditor::performUndoRedoAction(
        MapEditorSubSelectionKind kind, bool before, QJsonObject& obj,
        Position& position)
{
    switch (kind) {
    case MapEditorSubSelectionKind::None:
        break;
    case MapEditorSubSelectionKind::Floors:
        if (before) {
            FloorDatas* floor = new FloorDatas;
            floor->read(obj);
            stockLand(position, floor, kind, false, true);
        }
        else
            eraseLand(position, true);
        break;
    case MapEditorSubSelectionKind::SpritesFace:
    case MapEditorSubSelectionKind::SpritesFix:
    case MapEditorSubSelectionKind::SpritesDouble:
    case MapEditorSubSelectionKind::SpritesQuadra:
        break;
    case MapEditorSubSelectionKind::SpritesWall:
        break;
    case MapEditorSubSelectionKind::Object:
        break;
    default:
        break;
    }
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void ControlMapEditor::paintGL(QMatrix4x4 &modelviewProjection,
                               QVector3D &cameraRightWorldSpace,
                               QVector3D &cameraUpWorldSpace,
                               QVector3D &cameraDeepWorldSpace,
                               MapEditorSelectionKind selectionKind,
                               MapEditorSubSelectionKind subSelectionKind,
                               DrawKind drawKind)
{
    m_map->paintFloors(modelviewProjection);

    if (selectionKind == MapEditorSelectionKind::Objects)
        m_cursorObject->paintGL(modelviewProjection);

    m_map->cursor()->paintGL(modelviewProjection);

    if (m_displayGrid){
        glDisable(GL_DEPTH_TEST);
        m_grid->paintGL(modelviewProjection);
        glEnable(GL_DEPTH_TEST);
    }

    m_map->paintOthers(modelviewProjection, cameraRightWorldSpace,
                       cameraUpWorldSpace, cameraDeepWorldSpace);

    if (subSelectionKind == MapEditorSubSelectionKind::SpritesWall &&
        drawKind != DrawKind::Pin)
    {
        m_beginWallIndicator->paintGL(modelviewProjection);
        m_endWallIndicator->paintGL(modelviewProjection);
    }
}

// -------------------------------------------------------

void ControlMapEditor::showHideGrid() {
    m_displayGrid = !m_displayGrid;
}

// -------------------------------------------------------

void ControlMapEditor::showHideSquareInformations() {
    m_displaySquareInformations = !m_displaySquareInformations;
}

// -------------------------------------------------------

QString ControlMapEditor::getSquareInfos(MapEditorSelectionKind kind,
                                         MapEditorSubSelectionKind subKind,
                                         bool layerOn)
{
    Position position;
    MapElement* element = getPositionSelected(position, kind, subKind, layerOn,
                                              true);
    if (!m_map->isInGrid(position))
        return "";

    return (element == nullptr ? "[NONE]" : "[" + element->toString() + "]") +
            + "\n" + position.toString(m_map->squareSize());
}

// -------------------------------------------------------

void ControlMapEditor::deleteTempUndoRedo() {
    m_controlUndoRedo.deleteTempUndoRedo();
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void ControlMapEditor::onMouseWheelMove(QWheelEvent* event, bool updateTree){
    if (event->delta() > 0)
        m_camera->zoomPlus(m_map->squareSize());
    else
        m_camera->zoomLess(m_map->squareSize());

    if (updateTree)
        updateCameraTreeNode();
}

// -------------------------------------------------------

void ControlMapEditor::onMouseMove(QPoint point,
                                   Qt::MouseButton button, bool updateTree)
{
    updateMousePosition(point);
    m_mouseMove = point;

    if (button == Qt::MouseButton::MiddleButton){
        m_camera->onMouseWheelPressed(m_mouseMove, m_mouseBeforeUpdate);
        if (updateTree)
            updateCameraTreeNode();
    }
}

// -------------------------------------------------------

void ControlMapEditor::onMousePressed(MapEditorSelectionKind selection,
                                      MapEditorSubSelectionKind subSelection,
                                      DrawKind drawKind, bool layerOn,
                                      QRect &tileset, int specialID,
                                      QPoint point, Qt::MouseButton button)
{
    // Update mouse
    updateMouse(point, layerOn);

    if (button != Qt::MouseButton::MiddleButton){

        // Add/Remove something
        m_isDeleting = button == Qt::MouseButton::RightButton;
        if (m_isDeleting)
            removePreviewElements();
        Position newPosition;
        getPositionSelected(newPosition, selection, subSelection, layerOn);
        if (((Position3D) m_previousMouseCoords) != ((Position3D) newPosition))
        {
            m_previousMouseCoords = newPosition;
            addRemove(selection, subSelection, drawKind, layerOn, tileset,
                      specialID);

            // Wall sprite
            if (subSelection == MapEditorSubSelectionKind::SpritesWall)
            {
                if (button == Qt::MouseButton::LeftButton)
                    m_isDrawingWall = true;
                else if (button == Qt::MouseButton::RightButton)
                    m_isDeletingWall = true;
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::onMouseReleased(MapEditorSelectionKind,
                                       MapEditorSubSelectionKind,
                                       DrawKind drawKind,
                                       QRect &, int specialID,
                                       QPoint,
                                       Qt::MouseButton button)
{
    if (button == Qt::MouseButton::LeftButton) {
        if (m_isDrawingWall) {
            m_isDrawingWall = false;
            addSpriteWall(drawKind, specialID);
        }
    }
    else if (button == Qt::MouseButton::RightButton) {
        if (m_isDeletingWall) {
            m_isDeletingWall = false;
            removeSpriteWall(drawKind);
        }
    }

    // Force previous mouse coords to be different
    m_previousMouseCoords.setCoords(-1, 0, 0, -1);

    // Update current layer to undefined
    m_currentLayer = -1;
    m_isDeleting = false;

    // Update the undo redo
    m_controlUndoRedo.addState(m_map->mapProperties()->id(), m_changes);
}

// -------------------------------------------------------

void ControlMapEditor::onKeyPressed(int k, double speed){
    if (!m_isDrawingWall && !m_isDeletingWall) {
        cursor()->onKeyPressed(k, m_camera->horizontalAngle(),
                               m_map->mapProperties()->length(),
                               m_map->mapProperties()->width(), speed);
    }
}

// -------------------------------------------------------

void ControlMapEditor::onKeyReleased(int ){

}
