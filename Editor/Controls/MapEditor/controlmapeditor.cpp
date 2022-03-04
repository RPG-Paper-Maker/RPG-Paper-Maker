/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QTime>
#include <QApplication>
#include "controlmapeditor.h"
#include "dialogobject.h"
#include "rpm.h"
#include "systemmapobject.h"

// -------------------------------------------------------

#include "controlmapeditor-raycasting.cpp"
#include "controlmapeditor-preview.cpp"
#include "controlmapeditor-add-remove.cpp"
#include "controlmapeditor-objects.cpp"

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
    m_cursorStart(nullptr),
    m_cursorDetection(nullptr),
    m_camera(new Camera),
    m_positionStart(nullptr),
    m_positionDetection(nullptr),
    m_elementOnLand(nullptr),
    m_elementOnSprite(nullptr),
    m_elementOnObject3D(nullptr),
    m_elementOnMountain(nullptr),
    m_positionPreviousPreview(-1, 0, 0, -1, 0),
    m_previousMouseCoords(-500, 0, 0, -500),
    m_firstMouseCoords(-500, 0, 0, -500),
    m_needMapInfosToSave(false),
    m_needMapObjectsUpdate(false),
    m_displayGrid(true),
    m_displaySquareInformations(true),
    m_displayCursor(true),
    m_isDrawingWall(false),
    m_isDeletingWall(false),
    m_isDrawingRectangle(false),
    m_isDeleting(false),
    m_isCtrlPressed(false),
    m_isShiftPressed(false),
    m_isMovingObject(false),
    m_copiedObject(nullptr)
{

}

ControlMapEditor::~ControlMapEditor() {
    deleteMap(false);

    delete m_camera;
    if (m_copiedObject != nullptr) {
        delete m_copiedObject;
    }
}

Map * ControlMapEditor::map() const {
    return m_map;
}

Grid * ControlMapEditor::grid() const {
    return m_grid;
}

Cursor * ControlMapEditor::cursor() const {
    return m_map->cursor();
}

Cursor * ControlMapEditor::cursorObject() const {
    return m_cursorObject;
}

Cursor * ControlMapEditor::cursorStart() const {
    return m_cursorStart;
}

Cursor * ControlMapEditor::cursorDetection() const {
    return m_cursorDetection;
}

Camera * ControlMapEditor::camera() const {
    return m_camera;
}

Position *ControlMapEditor::positionOnElement(MapEditorSelectionKind kind,
    DrawKind dk) const
{
    switch (kind) {
    case MapEditorSelectionKind::Land:
        return m_elementOnLand == nullptr ? nullptr : new Position(
            m_positionOnLand);
    case MapEditorSelectionKind::Sprites:
        return m_elementOnSprite == nullptr || (dk == DrawKind::Rotate &&
            m_elementOnSprite->getSubKind() == MapEditorSubSelectionKind
            ::SpritesWall) ? nullptr : new Position(m_positionOnSprite);
    case MapEditorSelectionKind::Mountains:
        return m_elementOnMountain == nullptr ? nullptr : new Position(
            m_positionOnMountain);
    case MapEditorSelectionKind::Objects3D:
        return m_elementOnObject3D == nullptr ? nullptr : new Position(
            m_positionOnObject3D);
    default:
        return nullptr;
    }
}

bool ControlMapEditor::isCtrlPressed() const {
    return m_isCtrlPressed;
}

void ControlMapEditor::setIsCtrlPressed(bool b) {
    m_isCtrlPressed = b;
}

bool ControlMapEditor::isShiftPressed() const {
    return m_isShiftPressed;
}

void ControlMapEditor::setIsShiftPressed(bool b) {
    m_isShiftPressed = b;
}

bool ControlMapEditor::displayGrid() const
{
    return m_displayGrid;
}

void ControlMapEditor::setDisplayGrid(bool displayGrid)
{
    m_displayGrid = displayGrid;
}

bool ControlMapEditor::displaySquareInformations() const
{
    return m_displaySquareInformations;
}

void ControlMapEditor::setDisplaySquareInformations(bool displaySquareInformations)
{
    m_displaySquareInformations = displaySquareInformations;
}

bool ControlMapEditor::displayCursor() const
{
    return m_displayCursor;
}

void ControlMapEditor::setDisplayCursor(bool displayCursor)
{
    m_displayCursor = displayCursor;
}

void ControlMapEditor::setContextMenu(ContextMenuList *m)
{
    m_contextMenu = m;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ControlMapEditor::moveCursorToMousePosition(QPoint point) {
    Position position;
    bool b;

    this->updateMousePosition(point);

    this->getPositionSelected(position, MapEditorSelectionKind::None,
        MapEditorSubSelectionKind::None, true, b, true);

    if (m_map->isInGrid(position)) {
        this->cursor()->setPositions(position);
    }
}

// -------------------------------------------------------

void ControlMapEditor::reLoadTextures(){
    m_map->loadTextures();
}

// -------------------------------------------------------

void ControlMapEditor::applyMap(Map *map, QVector3D *position, QVector3D
    *positionObject, int cameraDistance, double cameraHorizontalAngle, double
    cameraVerticalAngle, SystemDetection *detection)
{
    SystemMapObject *mapObject;
    Position3D heroPosition;
    int i, l;

    clearPortionsToUpdate();
    m_detection = detection;

    // Map & cursor
    m_map = map;
    RPM::get()->project()->setCurrentMap(m_map);
    m_map->initializeCursor(position);
    m_map->initializeGL();

    // Update current portion and load all the local portions
    m_currentPortion = cursor()->getPortion();
    m_map->loadPortions(m_currentPortion);

    // Grid
    m_grid = new Grid;
    m_grid->initializeVertices(m_map->mapProperties()->length(), m_map
        ->mapProperties()->width(), m_map->squareSize());
    m_grid->initializeGL();

    // Cursor object
    m_cursorObject = new Cursor(positionObject);
    Position pos(m_cursorObject->getSquareX(), m_cursorObject->getSquareY(),
        m_cursorObject->getPercentYPlus(), m_cursorObject->getSquareZ());
    setCursorObjectPosition(pos);
    m_cursorObject->setFrameNumber(1);
    m_cursorObject->loadTexture(":/textures/Ressources/object_square_cursor.png");
    m_cursorObject->initialize();

    // Skybox
    if (!m_map->mapProperties()->isSkyColor() && !m_map->mapProperties()
        ->isSkyImage())
    {
        m_map->initializeSkybox();
        m_map->skybox()->initializeGL();
    }

    // Cursor start
    if (m_detection == nullptr) {
        heroPosition = Position3D(-1, 0, 0, -1);
        if (m_map->mapProperties()->id() == RPM::get()->project()->gameDatas()
            ->systemDatas()->idMapHero())
        {

            for (i = 2, l = m_map->modelObjects()->invisibleRootItem()->rowCount();
                i < l; i++)
            {
                mapObject = reinterpret_cast<SystemMapObject *>(m_map->modelObjects()
                    ->item(i)->data().value<quintptr>());
                if (mapObject->id() == RPM::get()->project()->gameDatas()
                    ->systemDatas()->idObjectHero())
                {
                    heroPosition = mapObject->position();
                    break;
                }
            }
        }
        m_positionStart = new QVector3D(heroPosition.x() * m_map->squareSize(),
            heroPosition.getY(), heroPosition.z() * m_map
            ->squareSize());
        m_cursorStart = new Cursor(m_positionStart);
        m_cursorStart->setFrameNumber(1);
        m_cursorStart->loadTexture(":/textures/Ressources/start.png");
        m_cursorStart->initialize();
    } else {
        m_positionDetection = new QVector3D(positionObject->x(), positionObject
            ->y(), positionObject->z());
        m_cursorDetection = new Cursor(m_positionDetection);
        m_cursorDetection->setFrameNumber(1);
        m_cursorDetection->loadTexture(":/textures/Ressources/big_arrow_down.png");
        m_cursorDetection->initialize();
    }

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
    m_camera->setDistance(static_cast<int>(cameraDistance * RPM::coefSquareSize()));
    m_camera->setHorizontalAngle(cameraHorizontalAngle);
    m_camera->setVerticalAngle(cameraVerticalAngle);
    m_camera->update(cursor(), m_map->squareSize());
}

// -------------------------------------------------------

Map * ControlMapEditor::loadMap(int idMap, QVector3D *position,
    QVector3D *positionObject, int cameraDistance, double cameraHorizontalAngle,
    double cameraVerticalAngle)
{
    this->applyMap(new Map(idMap), position, positionObject, cameraDistance,
        cameraHorizontalAngle, cameraVerticalAngle);

    return m_map;
}

// -------------------------------------------------------

void ControlMapEditor::deleteMap(bool updateCamera) {
    clearPortionsToUpdate();
    removePreviewElements();

    // Cursors
    if (m_cursorObject != nullptr) {
        delete m_cursorObject;
        m_cursorObject = nullptr;
    }
    if (m_cursorStart != nullptr) {
        delete m_cursorStart;
        m_cursorStart = nullptr;
    }
    if (m_cursorDetection != nullptr) {
        delete m_cursorDetection;
        m_cursorDetection = nullptr;
    }
    if (m_beginWallIndicator != nullptr) {
        delete m_beginWallIndicator;
        m_beginWallIndicator = nullptr;
    }
    if (m_endWallIndicator != nullptr) {
        delete m_endWallIndicator;
        m_endWallIndicator = nullptr;
    }
    if (m_positionStart != nullptr) {
        delete m_positionStart;
        m_positionStart = nullptr;
    }
    if (m_positionDetection != nullptr) {
        delete m_positionDetection;
        m_positionDetection = nullptr;
    }

    // Grid
    if (m_grid != nullptr) {
        delete m_grid;
        m_grid = nullptr;
    }

    // Update camera node
    if (updateCamera && m_map != nullptr) {
        m_camera->setDistance(static_cast<int>(m_camera->distance() /
            RPM::coefSquareSize()));
        updateCameraTreeNode();
    }

    // Map
    if (m_map != nullptr) {
        delete m_map;
        m_map = nullptr;
    }
}

// -------------------------------------------------------

void ControlMapEditor::onResize(int width, int height) {
    m_width = width;
    m_height = height;
    m_camera->setProjection(width, height);
}

// -------------------------------------------------------

void ControlMapEditor::updateCameraTreeNode() {
    TreeMapTag *tag = reinterpret_cast<TreeMapTag *>(m_map->getAssociatedMapItem()
        ->data().value<quintptr>());
    tag->setCameraDistance(m_camera->distance());
    tag->setCameraHorizontalAngle(m_camera->horizontalAngle());
    tag->setCameraVerticalAngle(m_camera->verticalAngle());
}

// -------------------------------------------------------
//
//  UPDATES
//
// -------------------------------------------------------

void ControlMapEditor::update(MapEditorSelectionKind selectionKind, bool square,
    DrawKind drawKind, bool layerOn, bool needUpdatePortions)
{
    // Update portions
    if (needUpdatePortions)
    {
        updatePortions(selectionKind, drawKind);
        saveTempPortions();
        clearPortionsToUpdate();
        updateMovingPortions();
    }

    // Check textures need to be reloaded
    m_map->checkNeedReloadTextures();

    // Camera
    m_camera->update(cursor(), m_map->squareSize());

    // Raycasting
    updateRaycasting(selectionKind, square, drawKind, layerOn);

    // Mouse update
    m_mouseBeforeUpdate = m_mouseMove;
}

// -------------------------------------------------------

void ControlMapEditor::updateMouse(QPoint point, MapEditorSelectionKind
    selectionKind, bool square, DrawKind drawKind, bool layerOn)
{
    updateMousePosition(point);
    m_mouseMove = point;
    updateRaycasting(selectionKind, square, drawKind, layerOn);
    m_mouseBeforeUpdate = m_mouseMove;
}

// -------------------------------------------------------

void ControlMapEditor::updateMousePosition(QPoint point) {
    m_mouse = point;
}

// -------------------------------------------------------

void ControlMapEditor::updateMouseMove(QPoint point) {
    updateMousePosition(point);
    m_mouseMove = point;
}

// -------------------------------------------------------

bool ControlMapEditor::mousePositionChanged(QPoint point) {
    return m_mouse != point;
}

// -------------------------------------------------------

void ControlMapEditor::updateWallIndicator() {
    if (!m_isDrawingWall && !m_isDeletingWall) {
        m_beginWallIndicator->setPosition(m_positionOnPlaneWallIndicator,
            m_map->mapProperties()->length(), m_map->mapProperties()->width());
    }
    m_endWallIndicator->setPosition(m_positionOnPlaneWallIndicator,
        m_map->mapProperties()->length(), m_map->mapProperties()->width());
}

// -------------------------------------------------------

void ControlMapEditor::updatePortions(MapEditorSelectionKind selectionKind,
    DrawKind drawKind)
{
    if (m_needMapObjectsUpdate) {
        m_needMapObjectsUpdate = false;
        m_map->updateMapObjects();
    }

    QSet<MapPortion *>::iterator i;
    bool isTransforming;

    isTransforming = drawKind == DrawKind::Rotate;
    for (i = m_portionsToUpdate.begin(); i != m_portionsToUpdate.end(); i++) {
        MapPortion *mapPortion = *i;
        m_map->updatePortion(mapPortion, isTransforming && selectionKind ==
            MapEditorSelectionKind::Land ? m_elementOnLand : nullptr,
            isTransforming && selectionKind == MapEditorSelectionKind::Sprites ?
            m_elementOnSprite : nullptr, isTransforming && selectionKind ==
            MapEditorSelectionKind::Objects3D ? m_elementOnObject3D : nullptr);
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMovingPortions() {

    // Move portions
    Portion newPortion = cursor()->getPortion();
    if (qAbs(m_currentPortion.x() - newPortion.x()) < m_map->getMapPortionSize()
        && qAbs(m_currentPortion.y() - newPortion.y()) < m_map->getMapPortionSize()
        && qAbs(m_currentPortion.z() - newPortion.z()) < m_map->getMapPortionSize())
    {
        if (m_currentPortion != newPortion) {
            removePreviewElements();
            updateMovingPortionsEastWest(newPortion);
            updateMovingPortionsNorthSouth(newPortion);
            updateMovingPortionsUpDown(newPortion);
        }
    }
    else {
        m_map->loadPortions(newPortion);
        m_currentPortion = newPortion;
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMovingPortionsEastWest(Portion &newPortion) {
    int r = m_map->portionsRay();
    if (newPortion.x() > m_currentPortion.x()) {
        int dif = newPortion.x() - m_currentPortion.x();
        int state = 1;
        while (state <= dif) {
            for (int k = -r; k <= r; k++) {
                for (int j = -r; j <= r; j++) {
                    bool visible = j != -r && j != r && k != -r && k != r;
                    int i = -r;
                    removePortion(i, k, j);
                    setPortion(i, k, j, i + 1, k, j, false);
                    i++;
                    for (; i < r; i++)
                        setPortion(i, k, j, i + 1, k, j, visible);

                    loadPortion(m_currentPortion.x() + state, m_currentPortion.y(),
                        m_currentPortion.z(), r, k, j);
                }
            }
            state++;
        }
        m_currentPortion.setX(m_currentPortion.x() + dif);
    } else if (newPortion.x() < m_currentPortion.x()) {
        int dif = m_currentPortion.x() - newPortion.x();
        int state = 1;
        while (state <= dif) {
            for (int k = -r; k <= r; k++) {
                for (int j = -r; j <= r; j++) {
                    bool visible = j != -r && j != r && k != -r && k != r;
                    int i = r;
                    removePortion(i, k, j);
                    setPortion(i, k, j, i - 1, k, j, false);
                    i--;
                    for (; i > -r; i--)
                        setPortion(i, k, j, i - 1, k, j, visible);

                    loadPortion(m_currentPortion.x() - state, m_currentPortion.y(),
                        m_currentPortion.z(), -r, k, j);
                }
            }
            state++;
        }
        m_currentPortion.setX(m_currentPortion.x() - dif);
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMovingPortionsNorthSouth(Portion &newPortion) {
    int r = m_map->portionsRay();
    if (newPortion.z() > m_currentPortion.z()) {
        int dif = newPortion.z() - m_currentPortion.z();
        int state = 1;
        while (state <= dif) {
            for (int k = -r; k <= r; k++) {
                for (int i = -r; i <= r; i++) {
                    bool visible = i != -r && i != r && k != -r && k != r;
                    int j = -r;
                    removePortion(i, k, j);
                    setPortion(i, k, j, i, k, j + 1, false);
                    j++;
                    for (; j < r; j++)
                        setPortion(i, k, j, i, k, j + 1, visible);

                    loadPortion(m_currentPortion.x(), m_currentPortion.y(),
                        m_currentPortion.z() + state, i, k, r);
                }
            }
            state++;
        }
        m_currentPortion.setZ(m_currentPortion.z() + dif);
    }
    else if (newPortion.z() < m_currentPortion.z()) {
        int dif = m_currentPortion.z() - newPortion.z();
        int state = 1;
        while (state <= dif) {
            for (int k = -r; k <= r; k++) {
                for (int i = -r; i <= r; i++) {
                    bool visible = i != -r && i != r && k != -r && k != r;
                    int j = r;
                    removePortion(i, k, j);
                    setPortion(i, k, j, i, k, j - 1, false);
                    j--;
                    for (; j > -r; j--)
                        setPortion(i, k, j, i, k, j - 1, visible);

                    loadPortion(m_currentPortion.x(), m_currentPortion.y(),
                        m_currentPortion.z() - state, i, k, -r);
                }
            }
            state++;
        }
        m_currentPortion.setZ(m_currentPortion.z() - dif);
    }
}

// -------------------------------------------------------

void ControlMapEditor::updateMovingPortionsUpDown(Portion &newPortion) {
    int r = m_map->portionsRay();
    if (newPortion.y() > m_currentPortion.y()) {
        int dif = newPortion.y() - m_currentPortion.y();
        int state = 1;
        while (state <= dif) {
            for (int i = -r; i <= r; i++) {
                for (int j = -r; j <= r; j++) {
                    bool visible = i != -r && i != r && j != -r && j != r;
                    int k = -r;
                    removePortion(i, k, j);
                    setPortion(i, k, j, i, k + 1, j, false);
                    k++;
                    for (; k < r; k++)
                        setPortion(i, k, j, i, k + 1, j, visible);

                    loadPortion(m_currentPortion.x(), m_currentPortion.y() + state,
                        m_currentPortion.z(), i, r, j);
                }
            }
            state++;
        }
        m_currentPortion.setY(m_currentPortion.y() + dif);
    }
    else if (newPortion.y() < m_currentPortion.y()) {
        int dif = m_currentPortion.y() - newPortion.y();
        int state = 1;
        while (state <= dif) {
            for (int i = -r; i <= r; i++) {
                for (int j = -r; j <= r; j++) {
                    bool visible = i != -r && i != r && j != -r && j != r;
                    int k = r;
                    removePortion(i, k, j);
                    setPortion(i, k, j, i, k - 1, j, false);
                    k--;
                    for (; k > -r; k--)
                        setPortion(i, k, j, i, k - 1, j, visible);

                    loadPortion(m_currentPortion.x(), m_currentPortion.y() -
                        state, m_currentPortion.z(), i, -r, j);
                }
            }
            state++;
        }
        m_currentPortion.setY(m_currentPortion.y() - dif);
    }
}

// -------------------------------------------------------

void ControlMapEditor::removePortion(int i, int j, int k) {
    MapPortion *mapPortion = m_map->mapPortion(i, j, k);
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

void ControlMapEditor::loadPortion(int a, int b, int c, int i, int j, int k)
{
    m_map->loadPortion(a + i, b + j, c + k, i, j, k, false);
}

// -------------------------------------------------------

void ControlMapEditor::saveTempPortions() {
    QSet<MapPortion *>::iterator i;
    for (i = m_portionsToSave.begin(); i != m_portionsToSave.end(); i++)
        m_map->savePortionMap(*i);

    QHash<Portion, MapPortion *>::iterator j;
    for (j = m_portionsGlobalSave.begin(); j != m_portionsGlobalSave.end(); j++)
        m_map->savePortionMap(*j);

    // Save file infos
    if (m_needMapInfosToSave) {
        m_map->saveMapProperties();
        m_needMapInfosToSave = false;
    }
}

// -------------------------------------------------------

void ControlMapEditor::clearPortionsToUpdate() {
    m_portionsToUpdate.clear();
    m_portionsToSave.clear();

    QHash<Portion, MapPortion *>::iterator i;
    for (i = m_portionsGlobalSave.begin(); i != m_portionsGlobalSave.end(); i++)
        delete *i;

    m_portionsGlobalSave.clear();
}

// -------------------------------------------------------

void ControlMapEditor::setToNotSaved(Map *map)
{
    if (map == nullptr)
    {
        map = m_map;
    }
    if (map != nullptr)
    {
        map->setToNotSaved();
    }
}

// -------------------------------------------------------

void ControlMapEditor::save() {
    m_map->getAssociatedMapItem()->setText(m_map->mapProperties()->name());
}

// -------------------------------------------------------

MapElement * ControlMapEditor::getPositionSelected(Position &position,
    MapEditorSelectionKind selection, MapEditorSubSelectionKind subSelection,
    bool layerOn, bool &isObject, bool isForDisplay) const
{
    MapElement *element;
    float min;

    switch (selection) {
    case MapEditorSelectionKind::Land:
        position = m_positionOnLand;
        return m_elementOnLand;
    case MapEditorSelectionKind::Sprites:
        if ((m_isDeleting && subSelection != MapEditorSubSelectionKind::SpritesWall)
             || layerOn || isForDisplay)
        {
            position = m_positionOnSprite;
            return m_elementOnSprite;
        }
        position = m_positionOnLand;
        return nullptr;
    case MapEditorSelectionKind::Objects3D:
        if (m_isDeleting || isForDisplay) {
            position = m_positionOnObject3D;
            return m_elementOnObject3D;
        }
        position = m_positionOnLand;
        return nullptr;
    case MapEditorSelectionKind::Mountains:
        if (m_isDeleting || isForDisplay) {
            position = m_positionOnMountain;
            return m_elementOnMountain;
        }
        position = m_positionOnLand;
        return nullptr;
    case MapEditorSelectionKind::Objects:
        position = m_positionOnObject;
        isObject = true;
        return m_elementOnObject;
    case MapEditorSelectionKind::None:
        position = m_positionOnPlane;
        min = 0.0f;
        element = nullptr;
        if (m_distanceObject != 0.0f) {
            if (min == 0.0f || m_distanceObject < min) {
                min = m_distanceObject;
                position = m_positionOnObject;
                element = m_elementOnObject;
                isObject = true;
            }
        }
        if (m_distanceLand != 0.0f) {
            if (min == 0.0f || m_distanceLand < min) {
                min = m_distanceLand;
                position = m_positionOnLand;
                element = m_elementOnLand;
            }
        }
        if (m_distanceSprite != 0.0f) {
            if (min == 0.0f || m_distanceSprite < min) {
                min = m_distanceSprite;
                position = m_positionOnSprite;
                element = m_elementOnSprite;
            }
        }
        if (m_distanceObject3D != 0.0f) {
            if (min == 0.0f || m_distanceObject3D < min) {
                min = m_distanceObject3D;
                position = m_positionOnObject3D;
                element = m_elementOnObject3D;
            }
        }
        return element;
    }

    return nullptr;
}

// -------------------------------------------------------

void ControlMapEditor::getWallSpritesPositions(QList<Position> &positions) {
    int x, y, z;
    double yPlus;
    Position3D begin, end;
    m_beginWallIndicator->getPosition(begin);
    m_endWallIndicator->getPosition(end);

    // Can't build a wall if not in the same height
    if (begin.y() != end.y())
        return;
    y = begin.y(); yPlus = begin.yPlus();

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

LandDatas * ControlMapEditor::getLand(Portion &portion, Position &p) {
    MapPortion *mapPortion = m_map->mapPortion(portion);
    if (mapPortion == nullptr)
        return nullptr;
    return mapPortion->getLand(p);
}

// -------------------------------------------------------

void ControlMapEditor::getFloorTextureReduced(QRect &rect, QRect &rectAfter,
    int localX, int localZ)
{
    rectAfter.setX(rect.x() + Common::modulo(localX, rect.width()));
    rectAfter.setY(rect.y() + Common::modulo(localZ, rect.height()));
    rectAfter.setWidth(1);
    rectAfter.setHeight(1);
}

// -------------------------------------------------------

bool ControlMapEditor::areLandsEquals(LandDatas *landBefore, QRect &textureAfter,
    MapEditorSubSelectionKind kindAfter)
{
    if (landBefore == nullptr)
        return kindAfter == MapEditorSubSelectionKind::None;
    else {
        return (landBefore->getSubKind() == kindAfter) ? (*landBefore
            ->textureRect()) == textureAfter : false;
    }
}

// -------------------------------------------------------

LandDatas * ControlMapEditor::getLandAfter(MapEditorSubSelectionKind kindAfter,
    int specialID, QRect &textureAfter, bool up)
{
    QRect *texture = new QRect(textureAfter.x(), textureAfter.y(), textureAfter
        .width(), textureAfter.height());
    switch (kindAfter) {
    case MapEditorSubSelectionKind::Floors:
        return new FloorDatas(texture, up);
    case MapEditorSubSelectionKind::Autotiles:
        return new AutotileDatas(specialID, texture, up);
    case MapEditorSubSelectionKind::Water:
        return nullptr;
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

void ControlMapEditor::getLandTexture(QRect &rect, LandDatas *land){
    rect.setX(land->textureRect()->x());
    rect.setY(land->textureRect()->y());
    rect.setWidth(land->textureRect()->width());
    rect.setHeight(land->textureRect()->height());
}

// -------------------------------------------------------

SpriteDatas * ControlMapEditor::getCompleteSprite(MapEditorSubSelectionKind kind,
    int xOffset, int yOffset, int zOffset, QRect &tileset, bool front,
    bool layerOn) const
{
    SpriteDatas *sprite = new SpriteDatas(kind, new QRect(tileset), front);
    if (layerOn) {
        sprite->setXOffset(xOffset);
        sprite->setYOffset(yOffset);
        sprite->setZOffset(zOffset);
    }

    return sprite;
}

// -------------------------------------------------------

void ControlMapEditor::updatePortionsToSaveOverflow(QSet<Portion> &portionsOverflow)
{
    for (QSet<Portion>::const_iterator i = portionsOverflow.begin(); i !=
         portionsOverflow.end(); i++)
    {
        Portion portion = *i;
        MapPortion *newMapPortion = m_map->mapPortionFromGlobal(portion);

        if (newMapPortion != nullptr)
            m_portionsToSave += newMapPortion;
    }

}

// -------------------------------------------------------

MapPortion * ControlMapEditor::getMapPortion(Position &p, Portion &portion,
    bool undoRedo, bool force)
{
    MapPortion *mapPortion = nullptr;
    m_map->getLocalPortion(p, portion);

    if (m_map->isInPortion(portion, undoRedo || force ? 0 : -1))
        mapPortion = m_map->mapPortion(portion);
    else if (undoRedo) {
        Portion globalPortion;
        m_map->getGlobalPortion(p, globalPortion);
        mapPortion = m_portionsGlobalSave.value(globalPortion);

        if (mapPortion == nullptr) {
            mapPortion = m_map->loadPortionMap(globalPortion.x(), globalPortion
                .y(), globalPortion.z(), true);
            m_portionsGlobalSave.insert(globalPortion, mapPortion);
        }
    }

    return mapPortion;
}

// -------------------------------------------------------

void ControlMapEditor::traceLine(Position &previousCoords, Position &coords,
    QList<Position> &positions)
{
    if (m_previousMouseCoords.x() == -1) {
        return;
    }

    int x1 = previousCoords.x(), x2 = coords.x();
    int y = coords.y();
    double yPlus = coords.yPlus();
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

int ControlMapEditor::getLayer(MapPortion *mapPortion, float d, Position &p,
    bool layerOn, MapEditorSelectionKind kind)
{
    if (m_currentLayer == -1) {
        if (d != 0.0f) {
            int layer = p.layer();
            if (layerOn)
                layer = mapPortion->getLastLayerAt(p, kind) + 1;

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

void ControlMapEditor::addHeight(int h, int hp) {
    this->cursor()->addHeight(h, hp);
    Position pos(m_cursorObject->getSquareX(), this->cursor()->getSquareY(),
        this->cursor()->getPercentYPlus(), m_cursorObject->getSquareZ());
    setCursorObjectPosition(pos);
}

// -------------------------------------------------------

void ControlMapEditor::heightUp() {
    addHeight(1, 0);
}

// -------------------------------------------------------

void ControlMapEditor::heightPlusUp() {
    addHeight(0, 1);
}

// -------------------------------------------------------

void ControlMapEditor::heightDown() {
    addHeight(-1, 0);
}

// -------------------------------------------------------

void ControlMapEditor::heightPlusDown() {
    addHeight(0, -1);
}

// -------------------------------------------------------

void ControlMapEditor::zoom(int value)
{
    if (value > 0) {
        m_camera->zoomPlus(m_map->squareSize());
    } else
    {
        m_camera->zoomLess(m_map->squareSize());
    }
}

// -------------------------------------------------------

void ControlMapEditor::undoRedo(QJsonArray &states, bool reverseAction) {
    int init = reverseAction ? states.size() : 0;
    int incr = reverseAction ? -1 : 1;

    for (int i = init; reverseAction ? i >= 0 : i < states.size(); i += incr) {
        QJsonObject objState = states.at(i).toObject(), objBefore, objAfter;
        MapEditorSubSelectionKind kindBefore, kindAfter;
        Position position;
        m_controlUndoRedo.getStateInfos(objState, kindBefore, kindAfter,
                                        objBefore, objAfter, position);
        if (reverseAction) {
            performUndoRedoAction(kindAfter, !reverseAction, objAfter, position);
            performUndoRedoAction(kindBefore, reverseAction, objBefore, position);
        }
        else {
            performUndoRedoAction(kindBefore, reverseAction, objBefore, position);
            performUndoRedoAction(kindAfter, !reverseAction, objAfter, position);
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::performUndoRedoAction(MapEditorSubSelectionKind kind,
    bool before, QJsonObject &obj, Position &position)
{
    switch (kind) {
    case MapEditorSubSelectionKind::None:
        break;
    case MapEditorSubSelectionKind::Floors:
    case MapEditorSubSelectionKind::Autotiles:
    {
        if (before) {
            LandDatas* land = nullptr;
            switch (kind) {
            case MapEditorSubSelectionKind::Floors:
                land = new FloorDatas; break;
            case MapEditorSubSelectionKind::Autotiles:
                land = new AutotileDatas; break;
            default:
                break;
            }
            land->read(obj);
            stockLand(position, land, kind, false, true);
        }
        else
            eraseLand(position, true);
        break;
    }
    case MapEditorSubSelectionKind::SpritesFace:
    case MapEditorSubSelectionKind::SpritesFix:
    case MapEditorSubSelectionKind::SpritesDouble:
    case MapEditorSubSelectionKind::SpritesQuadra:
    {
        if (before) {
            SpriteDatas* sprite = new SpriteDatas;
            sprite->read(obj);
            stockSprite(position, sprite, kind, false, true);
        }
        else
            eraseSprite(position, true);
        break;
    }
    case MapEditorSubSelectionKind::SpritesWall:
    {
        if (before) {
            SpriteWallDatas* sprite = new SpriteWallDatas;
            sprite->read(obj);
            stockSpriteWall(position, sprite, true);
        }
        else
            eraseSpriteWall(position, true);
        break;
    }
    case MapEditorSubSelectionKind::Object3D:
    {
        if (before) {
            Object3DDatas *object3D = Object3DDatas::instanciateFromJSON(obj);
            object3D->read(obj);
            stockObject3D(position, object3D, true);
        }
        else
            eraseObject3D(position, true);
        break;
    }
    case MapEditorSubSelectionKind::Mountains:
    {
        if (before) {
            MountainDatas *mountain = new MountainDatas;
            mountain->read(obj);
            Position p;
            stockMountain(position, mountain, p, true);
        }
        else
            eraseMountain(position, true);
        break;
    }
    case MapEditorSubSelectionKind::Object:
        if (before) {
            SystemCommonObject* object = new SystemCommonObject;
            object->read(obj);
            stockObject(position, object, true);
        }
        else
            eraseObject(position, true);
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
    QVector3D &cameraRightWorldSpace, QVector3D &cameraUpWorldSpace,
    QVector3D &cameraDeepWorldSpace, MapEditorSelectionKind selectionKind,
    MapEditorSubSelectionKind subSelectionKind, DrawKind drawKind, int autotileFrame)
{
    Position3D position;

    // Draw skybox
    if (m_map->skybox() != nullptr)
    {
        m_map->skybox()->paintGL(modelviewProjection, m_camera->positionX(),
            m_camera->positionY(), m_camera->positionZ());
    }

    // Drawing floors
    m_map->paintFloors(modelviewProjection, autotileFrame);

    // Drawing object cursor
    if (selectionKind == MapEditorSelectionKind::Objects) {
        if (isCursorObjectVisible()) {
            m_cursorObject->paintGL(modelviewProjection);
        }
    }

    // Drawing user cursor
    if (m_displayCursor)
    {
        m_map->cursor()->paintGL(modelviewProjection);
    }

    // Drawing start cursor
    if (m_cursorStart != nullptr) {
        m_cursorStart->getPosition3D(position);
        if (isVisible(position) && position.x() >= 0 && position.z() >= 0) {
            m_cursorStart->paintGL(modelviewProjection);
        }
    }

    // Drawing detection cursor
    if (m_cursorDetection != nullptr) {
        m_cursorDetection->getPosition3D(position);
        if (isVisible(position)) {
            m_cursorDetection->paintGL(modelviewProjection);
        }
    }

    // Drawing other stuff
    m_map->paintOthers(modelviewProjection, cameraRightWorldSpace,
        cameraUpWorldSpace, cameraDeepWorldSpace);

    // Drawing wall indicator
    if (subSelectionKind == MapEditorSubSelectionKind::SpritesWall &&
        drawKind != DrawKind::Pin)
    {
        m_beginWallIndicator->paintGL(modelviewProjection);
        m_endWallIndicator->paintGL(modelviewProjection);
    }

    // Drawing grid
    if (m_displayGrid){
        m_grid->paintGL(modelviewProjection, static_cast<int>(this->cursor()
            ->getY()));
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
    MapEditorSubSelectionKind subKind, bool layerOn, bool focus)
{
    if (focus) {
        Position position;
        bool isObject = false;
        MapElement* element = getPositionSelected(position, m_isCtrlPressed ?
            MapEditorSelectionKind::None : kind, subKind, layerOn, isObject,
            true);
        if (!m_map->isInGrid(position)) {
            m_lastSquareInfos = "";
        } else {
            m_lastSquareInfos = (element == nullptr ? "[" + RPM::translate(
                Translations::NONE).toUpper() +  "]" : "[" + (isObject
                ? RPM::translate(Translations::OBJECT).toUpper() : element
                ->toString()) + "]") + "\n" + position.toString();
        }
    }

    return m_lastSquareInfos;
}

// -------------------------------------------------------

bool ControlMapEditor::isVisible(Position3D &position) {
    Portion portion;
    m_map->getLocalPortion(position, portion);

    return m_map->isInPortion(portion);
}

// -------------------------------------------------------

void ControlMapEditor::getMountainTopFloorPosition(Position &topPosition,
    Position &p, int heightSquares, double heightPixels)
{
    double yPlus;

    topPosition = p;
    yPlus = p.yPlus() + heightPixels;
    topPosition.setY(p.y() + heightSquares + static_cast<int>(yPlus / 100));
    topPosition.setYPlus(std::fmod(yPlus, 100));
}

// -------------------------------------------------------

void ControlMapEditor::onTransformationPositionChanged(Position &newPosition,
    Position &previousPosition, MapEditorSelectionKind k)
{
    MapPortion *mapPortion;
    Portion portion;

    m_map->getLocalPortion(newPosition, portion);
    mapPortion = m_map->mapPortion(portion);
    if (mapPortion != nullptr) {
        MapElement *element;
        QJsonObject obj;

        element = mapPortion->updateElementPosition(previousPosition, k);
        if (element != nullptr)
        {
            m_firstMouseCoords = newPosition;
            switch (k) {
            case MapEditorSelectionKind::Land:
            {
                FloorDatas *floor = reinterpret_cast<FloorDatas *>(element);
                this->eraseLand(previousPosition, false, false, false);
                this->stockLand(newPosition, floor, floor->getSubKind(), false);
                break;
            }
            case MapEditorSelectionKind::Sprites:
            {
                SpriteDatas *sprite = reinterpret_cast<SpriteDatas *>(element);
                this->eraseSprite(previousPosition, false, false);
                this->stockSprite(newPosition, sprite, sprite->getSubKind(), false);
                break;
            }
            case MapEditorSelectionKind::Objects3D:
            {
                Object3DDatas *object3D = (reinterpret_cast<Object3DDatas *>(element));
                this->eraseObject3D(previousPosition, false, false);
                this->stockObject3D(newPosition, object3D);
                break;
            }
            default:
                break;
            }
        }
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void ControlMapEditor::onMouseWheelMove(QWheelEvent *event, bool updateTree) {
    if (m_isCtrlPressed)
    {
        int value = event->delta() > 0 ? 1 : -1;
        addHeight(m_isShiftPressed ? 0 : value, m_isShiftPressed
            ? value : 0);
    } else
    {
        this->zoom(event->delta());
    }
    if (m_detection == nullptr && updateTree) {
        updateCameraTreeNode();
    }
}

// -------------------------------------------------------

void ControlMapEditor::onMouseMove(QPoint point, Qt::MouseButton button,
    bool updateTree)
{
    updateMousePosition(point);
    m_mouseMove = point;

    if (button == Qt::MouseButton::MiddleButton || m_isShiftPressed)
    {
        m_camera->onMouseWheelPressed(m_mouseMove, m_mouseBeforeUpdate);
        if (updateTree)
        {
            updateCameraTreeNode();
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::onMousePressed(MapEditorSelectionKind selection,
    MapEditorSubSelectionKind subSelection, bool square, DrawKind drawKind, bool layerOn,
    QRect &tileset, int specialID, int widthSquares, double widthPixels, int
    heightSquares, double heightPixels, QRect &defaultFloorRect, QPoint point,
    Qt::MouseButton button)
{

    // Update mouse
    updateMouse(point, selection, square, drawKind, layerOn);

    if (button != Qt::MouseButton::MiddleButton)
    {
        // If ctrl key is pressed, teleport
        if (QApplication::keyboardModifiers() & Qt::ControlModifier)
        {
            moveCursorToMousePosition(point);
            return;
        }

        // If shit pressed, do nothing
        if (QApplication::keyboardModifiers() & Qt::ShiftModifier)
        {
            return;
        }

        // Add/Remove something
        m_isDeleting = button == Qt::MouseButton::RightButton;
        if (m_isDeleting) {
            removePreviewElements();
        }
        Position newPosition;
        bool b;
        getPositionSelected(newPosition, selection, subSelection, layerOn, b);
        if (static_cast<Position3D>(m_previousMouseCoords) !=
            static_cast<Position3D>(newPosition))
        {
            m_previousMouseCoords = newPosition;
            m_firstMouseCoords = newPosition;
            addRemove(selection, subSelection, drawKind, layerOn, tileset,
                specialID, widthSquares, widthPixels, heightSquares,
                heightPixels, defaultFloorRect);

            // Drawing rectangle check
            if (drawKind == DrawKind::Rectangle)
            {
                m_isDrawingRectangle = true;
            }

            // Wall sprite
            if (subSelection == MapEditorSubSelectionKind::SpritesWall) {
                if (button == Qt::MouseButton::LeftButton)
                    m_isDrawingWall = true;
                else if (button == Qt::MouseButton::RightButton)
                    m_isDeletingWall = true;
            }
        }
    }
}

// -------------------------------------------------------

void ControlMapEditor::onMouseReleased(MapEditorSelectionKind kind,
    MapEditorSubSelectionKind subKind, DrawKind drawKind, QRect &tilset, int
    specialID, QPoint point, bool layerOn, Qt::MouseButton button)
{
    if (button == Qt::MouseButton::LeftButton) {
        if (m_isDrawingWall) {
            m_isDrawingWall = false;
            addSpriteWall(drawKind, specialID);
        }
        if (m_isDrawingRectangle)
        {
            this->paintRectangleLand(subKind, specialID, tilset, layerOn);
        }
    }
    else if (button == Qt::MouseButton::RightButton) {
        if (m_isDeletingWall) {
            m_isDeletingWall = false;
            removeSpriteWall(drawKind);
        }
    }
    m_isDrawingRectangle = false;
    m_positionStartRectangle.setCoords(0, 0, 0, 0);

    // Force previous mouse coords to be different
    m_previousMouseCoords.setCoords(-500, 0, 0, -500);
    m_firstMouseCoords.setCoords(-500, 0, 0, -500);

    // Update current layer to undefined
    m_currentLayer = -1;
    m_isDeleting = false;
    m_isMovingObject = false;

    // Update the undo redo
    m_controlUndoRedo.addState(m_map->mapProperties()->id(), m_changes);
}

// -------------------------------------------------------

void ControlMapEditor::onKeyPressed(int k, double speed) {
    if (!m_isDrawingWall && !m_isDeletingWall && !m_isMovingObject && !m_isDrawingRectangle)
    {
        cursor()->onKeyPressed(k, m_camera->horizontalAngle(), m_map
            ->mapProperties()->length(), m_map->mapProperties()->width(), speed);
    }
}

// -------------------------------------------------------

void ControlMapEditor::onKeyReleased(int) {

}
