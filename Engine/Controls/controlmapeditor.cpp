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
    m_positionPreviousPreview(-1, 0, 0, -1, 0),
    m_displayGrid(true),
    m_treeMapNode(nullptr),
    m_isDrawingWall(false),
    m_isDeletingWall(false)
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

void ControlMapEditor::moveCursorToMousePosition(QPoint point)
{
    updateMousePosition(point);
    update(MapEditorSubSelectionKind::None);

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
                               int cameraHeight, double cameraHorizontalAngle)
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
    m_camera->setHeight(cameraHeight * Wanok::coefSquareSize());
    m_camera->setHorizontalAngle(cameraHorizontalAngle);
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
        m_camera->setHeight(m_camera->height() / Wanok::coefSquareSize());
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
    tag->setCameraHeight(m_camera->height());
    tag->setCameraHorizontalAngle(m_camera->horizontalAngle());
}

// -------------------------------------------------------
//
//  UPDATE
//
// -------------------------------------------------------

void ControlMapEditor::update(MapEditorSubSelectionKind subSelection) {
    updateRaycasting();

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

void ControlMapEditor::updateMouse(QPoint point) {
    updateMousePosition(point);
    m_mouseMove = point;
    updateRaycasting();
    m_mouseBeforeUpdate = m_mouseMove;
}

// -------------------------------------------------------

void ControlMapEditor::updateMousePosition(QPoint point) {
    m_mouse = point;
}

// -------------------------------------------------------

void ControlMapEditor::updateRaycasting(){
    QList<Portion> portions;

    // Raycasting plane
    QMatrix4x4 projection = m_camera->projection();
    QMatrix4x4 view = m_camera->view();
    QVector3D rayDirection = getRayWorld(m_mouse, projection, view);
    int height = 0;
    m_distancePlane = (height - m_camera->positionY()) / rayDirection.y();
    getCorrectPositionOnRay(m_positionOnPlane, rayDirection, m_distancePlane);
    QVector3D cameraPosition(m_camera->positionX(), m_camera->positionY(),
                            m_camera->positionZ());
    QRay3D ray(cameraPosition, rayDirection);
    getPortionsInRay(portions, ray);

    qDebug() << QString::number(portions.size());

    // Others
    m_distanceLand = 0;
    m_distanceSprite = 0;
    for (int i = portions.size() - 1; i >= 0; i--) {
        Portion portion = portions.at(i);
        MapPortion* mapPortion = m_map->mapPortion(portion);
        updateRaycastingLand(mapPortion, ray);
        updateRaycastingSprites(mapPortion, ray);
    }
    if (m_distanceLand == 0)
        m_positionOnLand = m_positionOnPlane;
    if (m_distanceSprite == 0)
        m_positionOnSprite = m_positionOnPlane;
}

// -------------------------------------------------------

void ControlMapEditor::getPortionsInRay(QList<Portion>& portions, QRay3D& ray) {
    QVector3D direction = ray.direction();

    // Getting here the portion were is positioned the camera first
    Position positionCamera;
    getCorrectPositionOnRay(positionCamera, direction, 0);
    Portion portionCamera;
    portionCamera = m_map->getLocalPortion(positionCamera);

    // If camera is inside the portions, ok !
    if (m_map->isInSomething(positionCamera, portionCamera))
        portions.append(portionCamera);
    // Else, we need to find te nearest portion the camera is looking at
    else {

        // Getting the box including all the drawable portions
        Portion leftBotPortion = m_currentPortion;
        Portion rightTopPortion = m_currentPortion;
        leftBotPortion.addAll(m_map->portionsRay() - 1);
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
        QBox3D box(leftBotCorner, rightTopCorner);

        // Testing intersection
        float distance = box.intersection(ray);
        if (isnan(distance))
            return;
        else {
            getCorrectPositionOnRay(positionCamera, direction, distance);
            portionCamera = m_map->getLocalPortion(positionCamera);

            if (m_map->isInSomething(positionCamera, portionCamera))
                portions.append(portionCamera);
            else
                return;
        }
    }

    updatePortionsInRay(portions, ray);
}

// -------------------------------------------------------

void ControlMapEditor::updatePortionsInRay(QList<Portion>& portions,
                                           QRay3D &ray)
{
    Portion portion = portions.first();
    QList<Portion> adjacents;
    adjacents << Portion(-1, 0, 0) << Portion(1, 0, 0) << Portion(0, 0, -1)
              << Portion(0, 0, 1) << Portion(0, -1, 0) << Portion(0, 1, 0);

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
            float distance = box.intersection(ray);
            if (!isnan(distance)) {
                if (m_map->isPortionInGrid(leftBotPortion)) {
                    portions.insert(0, adjacent);
                    updatePortionsInRay(portions, ray);

                    return;
                }
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateRaycastingLand(MapPortion*, QRay3D&)
{

}

// -------------------------------------------------------

void ControlMapEditor::updateRaycastingSprites(MapPortion* mapPortion,
                                               QRay3D& ray)
{
    mapPortion->updateRaycastingSprites(m_map->squareSize(), m_distanceSprite,
                                        m_positionOnSprite, ray,
                                        m_camera->horizontalAngle());
}

// -------------------------------------------------------
//
//  MOUSE RAYCASTING
//
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
                                               QVector3D &ray, int distance){
    QVector3D point = getPositionOnRay(ray, distance);
    int x = ((int) point.x()) / m_map->squareSize();
    int y = ((int) point.y()) / m_map->squareSize();
    int yPlus = (((int) point.y()) % m_map->squareSize() / m_map->squareSize())
            * 100;
    int z = ((int) point.z()) / m_map->squareSize();
    if (point.x() < 0) x--;
    if (point.z() < 0) z--;

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
        m_beginWallIndicator->setGridPosition(m_positionOnPlane,
                                              m_map->mapProperties()->length(),
                                              m_map->mapProperties()->width());
    }
    m_endWallIndicator->setGridPosition(m_positionOnPlane,
                                        m_map->mapProperties()->length(),
                                        m_map->mapProperties()->width());
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewElements(
        MapEditorSelectionKind selection,
        MapEditorSubSelectionKind subSelection, DrawKind drawKind,
        QRect& tileset, int specialID)
{
    if (drawKind == DrawKind::Pin)
        return;

    Position position = getPositionSelected(selection, subSelection, true);
    if (position == m_positionPreviousPreview)
        return;
    m_positionPreviousPreview = position;

    // Remove previous
    removePreviewElements();

    // Add new previous
    if (subSelection == MapEditorSubSelectionKind::Floors)
        updatePreviewFloors(tileset, position);
    else if (subSelection == MapEditorSubSelectionKind::SpritesWall) {
        if (m_isDrawingWall || m_isDeletingWall)
            updatePreviewWallSprites(specialID);
    }
    else
        updatePreviewOthers(selection, subSelection, tileset);
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

void ControlMapEditor::updatePreviewFloors(QRect &tileset, Position &position) {
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
                MapElement* element = new FloorDatas(
                            new QRect(tileset.x() + i, tileset.y() + j, 1, 1));
                updatePreviewElement(shortPosition, shortPortion, element);
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::getWallSpritesPositions(QList<GridPosition>& positions) {
    int x, y, yPlus, z;
    Position3D begin, end;
    m_beginWallIndicator->getGridPosition(begin);
    m_endWallIndicator->getGridPosition(end);

    // Can't build a wall if not in the same height
    if (begin.y() != end.y())
        return;
    y = begin.y(), yPlus = begin.yPlus();

    // Vertical
    if (begin.x() == end.x()) {
        x = begin.x();
        int upZ = qMin(begin.z(), end.z());
        int downZ = qMax(begin.z(), end.z());

        for (int i = upZ; i < downZ; i++) {
            Position shortPosition(x, y, yPlus, i, 0);
            GridPosition gridPosition(shortPosition, false);
            positions.append(gridPosition);
        }
    }

    // Horizontal
    else if (begin.z() == end.z()) {
        z = begin.z();
        int leftX = qMin(begin.x(), end.x());
        int rightX = qMax(begin.x(), end.x());

        for (int i = leftX; i < rightX; i++) {
            Position shortPosition(i, y, yPlus, z, 0);
            GridPosition gridPosition(shortPosition, true);
            positions.append(gridPosition);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewWallSprites(int specialID) {
    QList<GridPosition> positions;
    getWallSpritesPositions(positions);

    for (int i = 0; i < positions.size(); i++)
        updatePreviewWallSprite(positions[i], specialID);
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewWallSprite(GridPosition& gridPosition,
                                               int specialID)
{
    Position3D p1, p2;
    gridPosition.getSquares(p1, p2);
    Portion portion1 = m_map->getLocalPortion(p1);
    Portion portion2 = m_map->getLocalPortion(p2);
    bool isP1 = m_map->isInGrid(p1) && m_map->isInPortion(portion1);
    bool isP2 = m_map->isInGrid(p2) && m_map->isInPortion(portion2);

    if (isP1 || isP2) {
        MapElement* element = m_isDeletingWall ? nullptr
                                               : new SpriteWallDatas(specialID);
        updatePreviewElementGrid(gridPosition, isP1 ? portion1 : portion2,
                                 element);
    }
}

// -------------------------------------------------------

void ControlMapEditor::updatePreviewOthers(
        MapEditorSelectionKind selection,
        MapEditorSubSelectionKind subSelection, QRect& tileset)
{
    MapElement* element = nullptr;
    Portion portion = m_map->getLocalPortion(m_positionPreviousPreview);
    if (m_map->isInGrid(m_positionPreviousPreview) &&
        m_map->isInPortion(portion))
    {
        switch (subSelection) {
        case MapEditorSubSelectionKind::Floors:
            element = new FloorDatas(new QRect(tileset.x(),
                                               tileset.y(),
                                               tileset.width(),
                                               tileset.height()));
            break;
        default:
            break;
        }
        switch (selection) {
        case MapEditorSelectionKind::Sprites:
            element = new SpriteDatas(subSelection, 50, 0,
                                     new QRect(tileset.x(),
                                                tileset.y(),
                                                tileset.width(),
                                                tileset.height()));
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

void ControlMapEditor::updatePreviewElementGrid(GridPosition& p,
                                                Portion &portion,
                                                MapElement* element)
{
    MapPortion* mapPortion = m_map->mapPortion(portion);
    if (element == nullptr)
        mapPortion->addPreviewDeleteGrid(p);
    else
        mapPortion->addPreviewGrid(p, element);
    m_portionsToUpdate += mapPortion;
    m_portionsPreviousPreview += mapPortion;
}

// -------------------------------------------------------

void ControlMapEditor::updatePortions(MapEditorSubSelectionKind subSelection) {
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
                                 DrawKind drawKind, QRect& tileset,
                                 int specialID, bool adding)
{
    Position p = getPositionSelected(selection, subSelection, adding);
    if (subSelection == MapEditorSubSelectionKind::SpritesWall) {
        if (!m_isDrawingWall && !m_isDeletingWall) {
            m_beginWallIndicator->setGridPosition(
                        p, m_map->mapProperties()->length(),
                        m_map->mapProperties()->width());
        }
    }
    else {
        if (m_map->isInGrid(p)) {
            if (adding)
                add(selection, subSelection, drawKind, tileset, specialID, p);
            else
                remove(selection, drawKind, p);
        }
    }
}

// -------------------------------------------------------

Position ControlMapEditor::getPositionSelected(MapEditorSelectionKind
                                               selection,
                                               MapEditorSubSelectionKind
                                               subSelection, bool adding) const
{
    switch (selection){
    case MapEditorSelectionKind::Land:
        return m_positionOnPlane;
    case MapEditorSelectionKind::Sprites:
        if (!adding && subSelection != MapEditorSubSelectionKind::SpritesWall)
            return m_positionOnSprite;
        else
            return m_positionOnPlane;
    case MapEditorSelectionKind::Objects:
        return m_positionOnPlane;
    default:
        return m_positionOnPlane;
    }
}

// -------------------------------------------------------

void ControlMapEditor::add(MapEditorSelectionKind selection,
                           MapEditorSubSelectionKind subSelection,
                           DrawKind drawKind,
                           QRect& tileset, int specialID,
                           Position& p)
{
    if (tileset.width() != 0 && tileset.height() != 0) {
        switch (selection){
        case MapEditorSelectionKind::Land:
            addFloor(p, subSelection, drawKind, tileset, specialID);
            break;
        case MapEditorSelectionKind::Sprites:
            addSprite(p, subSelection, drawKind, tileset);
            break;
        case MapEditorSelectionKind::Objects:
            setCursorObjectPosition(p); break;
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::remove(MapEditorSelectionKind selection,
                              DrawKind drawKind,
                              Position& p)
{
    switch (selection){
    case MapEditorSelectionKind::Land:
        removeLand(p, drawKind);
        break;
    case MapEditorSelectionKind::Sprites:
        removeSprite(p, drawKind);
        break;
    case MapEditorSelectionKind::Objects:
        setCursorObjectPosition(p);
        showObjectMenuContext();
        break;
    }
}

// -------------------------------------------------------
//
//  Floors
//
// -------------------------------------------------------

void ControlMapEditor::addFloor(Position& p,
                                MapEditorSubSelectionKind kind,
                                DrawKind drawKind,
                                QRect &tileset, int)
{
    FloorDatas* floor;
    QRect* shortTexture;

    // Pencil
    switch (drawKind) {
    case DrawKind::Pencil:
        if (tileset.width() == 1 && tileset.width() == 1){
            QList<Position> positions;
            traceLine(m_previousMouseCoords, p, positions);
            for (int i = 0; i < positions.size(); i++){
                stockLand(positions[i],
                          new FloorDatas(new QRect(tileset.x(),
                                                   tileset.y(),
                                                   tileset.width(),
                                                   tileset.height())));
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
                floor = new FloorDatas(shortTexture);
                stockLand(shortPosition, floor);
            }
        }
        break;
    case DrawKind::Rectangle:
        break; // TODO
    case DrawKind::Pin:
        paintPinLand(p, kind, tileset);
        break;
    }

    m_previousMouseCoords = p;
}

// -------------------------------------------------------

void ControlMapEditor::paintPinLand(Position& p,
                                    MapEditorSubSelectionKind kindAfter,
                                    QRect& textureAfter)
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
                    stockLand(p, getLandAfter(kindAfter, textureAfterReduced));

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
                                                      textureAfterReduced));
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

void ControlMapEditor::stockLand(Position& p, LandDatas *landDatas){
    if (m_map->isInGrid(p)){
        Portion portion = m_map->getLocalPortion(p);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            if (mapPortion->addLand(p, landDatas) && m_map->saved())
                setToNotSaved();
            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;

            return;
        }
    }

    delete landDatas;
}

// -------------------------------------------------------

void ControlMapEditor::removeLand(Position& p, DrawKind drawKind) {
    QList<Position> positions;

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
        paintPinLand(p, MapEditorSubSelectionKind::None, tileset);
        break;
    }

    m_previousMouseCoords = p;
}

// -------------------------------------------------------

void ControlMapEditor::eraseLand(Position& p){
    if (m_map->isInGrid(p)){
        Portion portion = m_map->getLocalPortion(p);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            if (mapPortion->deleteLand(p) && m_map->saved())
                setToNotSaved();
            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;
        }
    }
}

// -------------------------------------------------------
//
//  Sprites
//
// -------------------------------------------------------

void ControlMapEditor::addSprite(Position& p,
                                 MapEditorSubSelectionKind kind,
                                 DrawKind drawKind,
                                 QRect& tileset)
{
    QList<Position> positions;

    // Pencil
    switch (drawKind) {
    case DrawKind::Pencil:
        traceLine(m_previousMouseCoords, p, positions);
        for (int i = 0; i < positions.size(); i++)
            stockSprite(positions[i], kind, 50, 0, new QRect(tileset));
        stockSprite(p, kind, 50, 0, new QRect(tileset));
        break;
    case DrawKind::Pin:
        break;
    case DrawKind::Rectangle:
        break;
    }

    m_previousMouseCoords = p;
}

// -------------------------------------------------------

void ControlMapEditor::addSpriteWall(DrawKind drawKind, int specialID) {
    QList<GridPosition> positions;

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

void ControlMapEditor::stockSprite(Position& p, MapEditorSubSelectionKind kind,
                                   int widthPosition, int angle,
                                   QRect *textureRect)
{
    if (m_map->isInGrid(p)){
        Portion portion = m_map->getLocalPortion(p);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            if (mapPortion->addSprite(p, kind, widthPosition, angle,
                                      textureRect) &&
                m_map->saved())
            {
                setToNotSaved();
            }

            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;

            return;
        }
    }

    delete textureRect;
}

// -------------------------------------------------------

void ControlMapEditor::stockSpriteWall(GridPosition& gridPosition,
                                       int specialID)
{
    if (m_map->isVisibleGridPosition(gridPosition)) {
        Portion portion = m_map->getPortionGrid(gridPosition);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            if (mapPortion->addSpriteWall(gridPosition, specialID) &&
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

// -------------------------------------------------------

void ControlMapEditor::removeSpriteWall(DrawKind drawKind) {
    QList<GridPosition> positions;

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
            if (mapPortion->deleteSprite(p) && m_map->saved())
                setToNotSaved();
            m_portionsToUpdate += mapPortion;
            m_portionsToSave += mapPortion;
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::eraseSpriteWall(GridPosition& gridPosition) {
    if (m_map->isVisibleGridPosition(gridPosition)) {
        Portion portion = m_map->getPortionGrid(gridPosition);
        if (m_map->isInPortion(portion)){
            MapPortion* mapPortion = m_map->mapPortion(portion);
            if (mapPortion->deleteSpriteWall(gridPosition) && m_map->saved())
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

void ControlMapEditor::traceLine(Position& previousCoords, Position& coords,
                                 QList<Position>& positions)
{
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
//
//  GL
//
// -------------------------------------------------------

void ControlMapEditor::paintGL(QMatrix4x4 &modelviewProjection,
                               QVector3D &cameraRightWorldSpace,
                               QVector3D &cameraUpWorldSpace,
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
                       cameraUpWorldSpace);

    if (subSelectionKind == MapEditorSubSelectionKind::SpritesWall &&
        drawKind != DrawKind::Pin)
    {
        m_beginWallIndicator->paintGL(modelviewProjection);
        m_endWallIndicator->paintGL(modelviewProjection);
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void ControlMapEditor::onMouseWheelMove(QWheelEvent* event, bool updateTree){
    if (event->delta() > 0)
        m_camera->zoomPlus(0);
    else
        m_camera->zoomLess(0);

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
                                      DrawKind drawKind,
                                      QRect &tileset, int specialID,
                                      QPoint point,
                                      Qt::MouseButton button)
{
    // Update mouse
    updateMouse(point);

    if (button != Qt::MouseButton::MiddleButton){
        // Add/Remove something
        bool adding = button == Qt::MouseButton::LeftButton;
        m_previousMouseCoords = getPositionSelected(selection, subSelection,
                                                    adding);
        addRemove(selection, subSelection, drawKind, tileset, specialID,
                  adding);

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

void ControlMapEditor::onKeyPressedWithoutRepeat(int k){
    if (k == Qt::Key_G)
        m_displayGrid = !m_displayGrid;
}

// -------------------------------------------------------

void ControlMapEditor::onKeyReleased(int ){

}
