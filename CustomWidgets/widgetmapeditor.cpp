/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include <QMouseEvent>
#include <QDebug>
#include <QHash>
#include <QHashIterator>
#include <QTime>
#include <QMessageBox>
#include "widgetmapeditor.h"
#include "rpm.h"
#include "systemcolor.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetMapEditor::WidgetMapEditor(QWidget *parent) :
    QOpenGLWidget(parent),
    m_menuBar(nullptr),
    m_needUpdateMap(false),
    isGLInitialized(false),
    m_timerFirstPressure(new QTimer),
    m_firstPressure(false),
    m_spinBoxX(nullptr),
    m_spinBoxZ(nullptr)
{
    // Timers
    m_timerFirstPressure->setSingleShot(true);
    connect(m_timerFirstPressure, SIGNAL(timeout()), this, SLOT(onFirstPressure()));

    m_contextMenu = ContextMenuList::createContextObject(this);
    m_control.setContextMenu(m_contextMenu);

    m_elapsedTime = QTime::currentTime().msecsSinceStartOfDay();
}

WidgetMapEditor::~WidgetMapEditor()
{
    makeCurrent();
    delete m_timerFirstPressure;
}

void WidgetMapEditor::setMenuBar(WidgetMenuBarMapEditor *m) {
    m_menuBar = m;
}

void WidgetMapEditor::setPanelTextures(PanelTextures *m){
    m_panelTextures = m;
}

void WidgetMapEditor::setTreeMapNode(QStandardItem *item) {
    m_control.setTreeMapNode(item);
}

Map * WidgetMapEditor::getMap() const {
    return m_control.map();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Map *WidgetMapEditor::loadMap(int idMap, QVector3D *position, QVector3D
    *positionObject, int cameraDistance, double cameraHorizontalAngle,
    double cameraVerticalAngle)
{
    m_idMap = idMap;
    m_position = position;
    m_positionObject = positionObject;
    m_cameraDistance = cameraDistance;
    m_cameraHorizontalAngle = cameraHorizontalAngle;
    m_cameraVerticalAngle = cameraVerticalAngle;

    Map *map = m_control.loadMap(idMap, position, positionObject, cameraDistance,
        cameraHorizontalAngle, cameraVerticalAngle);
    m_backgroundColor = (map->mapProperties()->skyColorID()->kind() ==
        PrimitiveValueKind::Variable) ? Qt::black : reinterpret_cast<
        SystemColor *>(SuperListItem::getById(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelColors()->invisibleRootItem(), map
        ->mapProperties()->skyColorID()->numberValue()))->color();

    return map;
}

// -------------------------------------------------------

void WidgetMapEditor::deleteMap() {
    makeCurrent();
    m_control.deleteMap();
}

// -------------------------------------------------------

void WidgetMapEditor::initializeSpinBoxesCoords(QSpinBox *x, QSpinBox *z) {
    m_spinBoxX = x;
    m_spinBoxZ = z;
}

// -------------------------------------------------------

void WidgetMapEditor::initializeGL() {

    // Initialize OpenGL Backend
    initializeOpenGLFunctions();
    connect(this, SIGNAL(frameSwapped()), this, SLOT(update()));

    isGLInitialized = true;
    if (m_needUpdateMap)
        initializeMap();
}

// -------------------------------------------------------

void WidgetMapEditor::resizeGL(int width, int height) {
    m_control.onResize(width, height);
}

// -------------------------------------------------------

void WidgetMapEditor::paintGL() {
    QPainter p(this);

    // Clear buffer
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glClearColor(m_backgroundColor.red() / 255.0f, m_backgroundColor.green() /
        255.0f, m_backgroundColor.blue() / 255.0f, m_backgroundColor.alpha() /
        255.0f);

    if (m_control.map() != nullptr) {
        p.beginNativePainting();
        glEnable(GL_DEPTH_TEST);
        glEnable(GL_BLEND);
        glBlendEquation(GL_FUNC_ADD);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

        // Config
        MapEditorSelectionKind kind;
        MapEditorSubSelectionKind subKind;
        DrawKind drawKind;
        bool layerOn;

        if (m_menuBar == nullptr) {
            kind = MapEditorSelectionKind::Land;
            subKind = MapEditorSubSelectionKind::None;
            drawKind = DrawKind::Pencil;
            layerOn = false;
        }
        else {
            kind = m_menuBar->selectionKind();
            subKind = m_menuBar->subSelectionKind();
            drawKind = m_menuBar->drawKind();
            layerOn = m_menuBar->layerOn();
        }

        if (!RPM::isInConfig || m_menuBar == nullptr) {

            // Key press
            if (!m_firstPressure) {
                double speed = (QTime::currentTime().msecsSinceStartOfDay() -
                    m_elapsedTime) * 0.04666 * RPM::get()->getSquareSize();

                // Multi keys
                QSet<int>::iterator i;
                for (i = m_keysPressed.begin(); i != m_keysPressed.end(); i++)
                    onKeyPress(*i, speed);
                m_control.cursor()->updatePositionSquare();
            }

            // Update control
            QPoint point = mapFromGlobal(QCursor::pos());
            bool mousePosChanged = m_control.mousePositionChanged(point);
            m_control.updateMousePosition(point);
            m_control.update(layerOn);
            if (m_menuBar != nullptr) {
                QRect tileset;
                m_panelTextures->getTilesetTexture(tileset);
                int specialID = m_panelTextures->getID();
                m_control.updateWallIndicator();
                if (mousePosChanged && this->hasFocus()) {
                    m_control.updatePreviewElements(kind, subKind, drawKind,
                        layerOn, tileset, specialID);
                }
            }
        }

        // Model view / projection
        QMatrix4x4 viewMatrix = m_control.camera()->view();
        QMatrix4x4 projectionMatrix = m_control.camera()->projection();
        QMatrix4x4 modelviewProjection = projectionMatrix * viewMatrix;

        // Calculate camera worldSpace
        QVector3D cameraRightWorldSpace(viewMatrix.row(0).x(), viewMatrix.row(0)
            .y(), viewMatrix.row(0).z());
        QVector3D cameraUpWorldSpace(viewMatrix.row(1).x(), viewMatrix.row(1)
            .y(), viewMatrix.row(1).z());
        QVector3D cameraDeepWorldSpace(viewMatrix.row(2).x(), viewMatrix.row(2)
            .y(), viewMatrix.row(2).z());

        // Paint
        m_control.paintGL(modelviewProjection, cameraRightWorldSpace,
            cameraUpWorldSpace, cameraDeepWorldSpace, kind, subKind, drawKind);
        p.endNativePainting();
        p.end();

        // Draw additional text informations
        if (m_menuBar != nullptr && m_control.displaySquareInformations()) {
            QString infos = m_control.getSquareInfos(kind, subKind, layerOn,
                this->hasFocus());
            QStringList listInfos = infos.split("\n");
            p.begin(this);
            for (int i = 0; i < listInfos.size(); i++) {
                renderText(p, 20, 20 * (listInfos.size() - i), listInfos.at(i),
                    QFont(), QColor(255, 255, 255));
            }
            p.end();
        }

        // Update elapsed time
        m_elapsedTime = QTime::currentTime().msecsSinceStartOfDay();
    }
    else
        p.end();
}

// -------------------------------------------------------

void WidgetMapEditor::update() {
    QOpenGLWidget::update();
}

// -------------------------------------------------------

void WidgetMapEditor::needUpdateMap(int idMap, QVector3D *position, QVector3D
    *positionObject, int cameraDistance, double cameraHorizontalAngle,
    double cameraVerticalAngle)
{
    m_needUpdateMap = true;
    m_idMap = idMap;
    m_position = position;
    m_positionObject = positionObject;
    m_cameraDistance = cameraDistance;
    m_cameraHorizontalAngle = cameraHorizontalAngle;
    m_cameraVerticalAngle = cameraVerticalAngle;

    if (isGLInitialized)
        initializeMap();
}

// -------------------------------------------------------

void WidgetMapEditor::updateCameraDistance(float coef) {
    m_control.camera()->setDistance(static_cast<int>(m_control.camera()
        ->distance() * coef));
}

// -------------------------------------------------------

void WidgetMapEditor::initializeMap() {
    makeCurrent();
    loadMap(m_idMap, m_position, m_positionObject, m_cameraDistance,
        m_cameraHorizontalAngle, m_cameraVerticalAngle);
    if (m_menuBar != nullptr)
        m_menuBar->show();

    m_needUpdateMap = false;
    this->setFocus();
    updateSpinBoxes();
}

// -------------------------------------------------------

void WidgetMapEditor::save() {
    m_control.save();
}

// -------------------------------------------------------

void WidgetMapEditor::setCursorX(int x) {
    if (m_control.map() != nullptr)
        m_control.cursor()->setX(x);
}

void WidgetMapEditor::setCursorY(int y) {
    if (m_control.map() != nullptr)
        m_control.cursor()->setY(y);
}

// -------------------------------------------------------

void WidgetMapEditor::setCursorYplus(int yPlus) {
    if (m_control.map() != nullptr)
        m_control.cursor()->setYplus(yPlus);
}

// -------------------------------------------------------

void WidgetMapEditor::setCursorZ(int z) {
    if (m_control.map() != nullptr)
        m_control.cursor()->setZ(z);
}

// -------------------------------------------------------

void WidgetMapEditor::updateSpinBoxes() {
    if (m_spinBoxX != nullptr) {
        m_spinBoxX->setValue(m_control.cursor()->getSquareX());
        m_spinBoxZ->setValue(m_control.cursor()->getSquareZ());
    }
}

// -------------------------------------------------------

void WidgetMapEditor::addObject() {
    Position p;
    m_control.setObjectPosition(p);
    if (m_control.isVisible(p))
        m_control.addObject(p);
}

// -------------------------------------------------------

void WidgetMapEditor::deleteObject(){
    Position p;
    m_control.setObjectPosition(p);
    if (m_control.isVisible(p))
        m_control.removeObject(p);
}

// -------------------------------------------------------

void WidgetMapEditor::removePreviewElements() {
    m_control.removePreviewElements();
}

// -------------------------------------------------------

void WidgetMapEditor::renderText(QPainter &p, double x, double y, const QString
    &text, const QFont &font, const QColor &fontColor, const QColor &outlineColor)
{

    // Identify x and y locations to render text within widget
    int height = this->height();
    GLdouble textPosX = x, textPosY = y;
    textPosY = height - textPosY; // y is inverted

    // Render outline
    p.setFont(font);
    p.setPen(outlineColor);
    p.drawText(static_cast<int>(textPosX + 1), static_cast<int>(textPosY), text);
    p.drawText(static_cast<int>(textPosX), static_cast<int>(textPosY + 1), text);
    p.drawText(static_cast<int>(textPosX - 1), static_cast<int>(textPosY), text);
    p.drawText(static_cast<int>(textPosX), static_cast<int>(textPosY - 1), text);

    // Render text
    p.setPen(fontColor);
    p.drawText(static_cast<int>(textPosX), static_cast<int>(textPosY), text);
}

// -------------------------------------------------------

void WidgetMapEditor::showHideGrid() {
    m_control.showHideGrid();
}

// -------------------------------------------------------

void WidgetMapEditor::showHideSquareInformations() {
    m_control.showHideSquareInformations();
}

// -------------------------------------------------------

void WidgetMapEditor::undo() {
    m_control.undo();
}

// -------------------------------------------------------

void WidgetMapEditor::redo() {
    m_control.redo();
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetMapEditor::focusOutEvent(QFocusEvent *) {
    m_keysPressed.clear();
    this->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::wheelEvent(QWheelEvent *event) {
    if (m_control.map() != nullptr) {
        m_control.onMouseWheelMove(event);
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mouseMoveEvent(QMouseEvent *event) {
    if (m_control.map() != nullptr) {

        // Multi keys
        QSet<Qt::MouseButton> buttons;
        if (event->buttons() & Qt::LeftButton)
            buttons += Qt::LeftButton;
        if (event->buttons() & Qt::RightButton)
            buttons += Qt::RightButton;
        if (event->buttons() & Qt::MiddleButton)
            buttons += Qt::MiddleButton;
        QSet<Qt::MouseButton>::iterator i;
        for (i = buttons.begin(); i != buttons.end(); i++) {
            Qt::MouseButton button = *i;
            m_control.onMouseMove(event->pos(), button, m_menuBar != nullptr);

            if (m_menuBar != nullptr && button != Qt::MouseButton::MiddleButton
                && !m_control.isCtrlPressed())
            {
                QRect tileset;
                m_panelTextures->getTilesetTexture(tileset);
                MapEditorSubSelectionKind subSelection = m_menuBar
                    ->subSelectionKind();
                int specialID = m_panelTextures->getID();
                bool layerOn = m_menuBar->layerOn();
                m_control.addRemove(m_menuBar->selectionKind(), subSelection,
                    m_menuBar->drawKind(), layerOn, tileset, specialID);
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mousePressEvent(QMouseEvent *event) {
    this->setFocus();
    if (m_control.map() != nullptr) {
        Qt::MouseButton button = event->button();
        if (m_menuBar != nullptr) {
            MapEditorSelectionKind selection = m_menuBar->selectionKind();
            MapEditorSubSelectionKind subSelection = m_menuBar->subSelectionKind();
            DrawKind drawKind = m_menuBar->drawKind();
            bool layerOn = m_menuBar->layerOn();
            QRect tileset;
            m_panelTextures->getTilesetTexture(tileset);
            int specialID = m_panelTextures->getID();
            m_control.onMousePressed(selection, subSelection, drawKind, layerOn,
                tileset, specialID, event->pos(), button);
        } else{
            if (button != Qt::MouseButton::MiddleButton) {
                m_control.moveCursorToMousePosition(event->pos());
                updateSpinBoxes();
            } else{
                m_control.updateMouseMove(event->pos());
                m_control.update(false);
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mouseReleaseEvent(QMouseEvent *event) {
    this->setFocus();
    if (m_control.map() != nullptr && m_menuBar != nullptr) {
        Qt::MouseButton button = event->button();
        QRect tileset;
        m_panelTextures->getTilesetTexture(tileset);
        MapEditorSubSelectionKind subSelection = m_menuBar->subSelectionKind();
        int specialID = m_panelTextures->getID();
        m_control.onMouseReleased(m_menuBar->selectionKind(), subSelection,
            m_menuBar->drawKind(), tileset, specialID, event->pos(), button);
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mouseDoubleClickEvent(QMouseEvent *) {
    this->setFocus();
    if (m_control.map() != nullptr) {
        if (m_menuBar != nullptr) {
            if (m_menuBar->selectionKind() == MapEditorSelectionKind::Objects)
                addObject();
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::keyPressEvent(QKeyEvent *event) {
    if (m_control.map() != nullptr) {
        if (m_keysPressed.isEmpty()) {
            m_firstPressure = true;
            m_timerFirstPressure->start(35);
            onKeyPress(event->key(), -1);
            m_control.cursor()->updatePositionSquare();
        }

        if (event->modifiers() & Qt::ControlModifier) {
            m_control.setIsCtrlPressed(true);
            m_control.removePreviewElements();
        }

        // Move
        int key = event->key();
        if (!m_keysPressed.contains(key)) {
            KeyBoardDatas *keyBoardDatas = RPM::get()->engineSettings()
                ->keyBoardDatas();
            if ((keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorUp) &&
                keyBoardDatas->contains(m_keysPressed,
                KeyBoardEngineKind::MoveCursorLeft)) || (keyBoardDatas->isEqual(
                key, KeyBoardEngineKind::MoveCursorLeft) && keyBoardDatas
                ->contains(m_keysPressed, KeyBoardEngineKind::MoveCursorUp)) ||
                (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorDown)
                && keyBoardDatas->contains(m_keysPressed,
                KeyBoardEngineKind::MoveCursorRight)) || (keyBoardDatas->isEqual
                (key, KeyBoardEngineKind::MoveCursorRight) && keyBoardDatas
                ->contains(m_keysPressed, KeyBoardEngineKind::MoveCursorDown)))
            {
                m_control.cursor()->centerInSquare(1);
            } else if ((keyBoardDatas->isEqual(key,
                KeyBoardEngineKind::MoveCursorUp) && keyBoardDatas->contains(
                m_keysPressed, KeyBoardEngineKind::MoveCursorRight)) ||
                (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorRight
                ) && keyBoardDatas->contains(m_keysPressed,
                KeyBoardEngineKind::MoveCursorUp)) || (keyBoardDatas->isEqual(
                key, KeyBoardEngineKind::MoveCursorDown) && keyBoardDatas
                ->contains(m_keysPressed, KeyBoardEngineKind::MoveCursorLeft))
                || (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorLeft)
                && keyBoardDatas->contains(m_keysPressed,
                KeyBoardEngineKind::MoveCursorDown)))
            {
                m_control.cursor()->centerInSquare(0);
            }
        }

        // Shortcut
        if (m_menuBar != nullptr && m_menuBar->selectionKind() ==
            MapEditorSelectionKind::Objects)
        {
            QKeySequence seq = RPM::getKeySequence(event);
            QList<QAction*> actions = m_contextMenu->actions();
            QAction* action;

            action = actions.at(0);
            if (RPM::isPressingEnter(event) && action->isEnabled()) {
                contextNew();
                return;
            }
            action = actions.at(1);
            if (RPM::isPressingEnter(event) && action->isEnabled()) {
                contextEdit();
                return;
            }
            action = actions.at(3);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextCopy();
                return;
            }
            action = actions.at(4);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextPaste();
                return;
            }
            action = actions.at(6);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextDelete();
                return;
            }
            action = actions.at(8);
            if (action->shortcut().matches(seq) && action->isEnabled()) {
                contextHero();
                return;
            }
        }

        m_keysPressed += key;
    }
}

// -------------------------------------------------------

void WidgetMapEditor::keyReleaseEvent(QKeyEvent *event) {
    if (m_control.map() != nullptr) {
        if (!event->isAutoRepeat()) {
            m_keysPressed -= event->key();
            m_control.onKeyReleased(event->key());

            if (!(event->modifiers() & Qt::ControlModifier))
                m_control.setIsCtrlPressed(false);
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::onFirstPressure() {
    m_firstPressure = false;
}

// -------------------------------------------------------

void WidgetMapEditor::onKeyPress(int k, double speed) {
    m_control.onKeyPressed(k, speed);
    updateSpinBoxes();
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------

void WidgetMapEditor::contextNew() {
    addObject();
}

// -------------------------------------------------------

void WidgetMapEditor::contextEdit() {
    addObject();
}

// -------------------------------------------------------

void WidgetMapEditor::contextCopy() {

}

// -------------------------------------------------------

void WidgetMapEditor::contextPaste() {

}

// -------------------------------------------------------

void WidgetMapEditor::contextDelete() {
    deleteObject();
}

// -------------------------------------------------------

void WidgetMapEditor::contextHero() {
    if (m_control.isCursorObjectVisible())
        m_control.defineAsHero();
}
