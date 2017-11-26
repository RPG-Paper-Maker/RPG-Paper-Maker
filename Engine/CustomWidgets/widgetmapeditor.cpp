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

#include <QMouseEvent>
#include <QDebug>
#include <QHash>
#include <QHashIterator>
#include <QTime>
#include "widgetmapeditor.h"
#include "wanok.h"
#include <QMessageBox>

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

    QSurfaceFormat  format;
     //format.setSamples(4);
     //format.setDepthBufferSize(24);
     //format.setStencilBufferSize(8);
       format.setProfile(QSurfaceFormat::OpenGLContextProfile::CompatibilityProfile);
     QSurfaceFormat::setDefaultFormat(format);

    this->setFormat(format);

    // Timers
    m_timerFirstPressure->setSingleShot(true);
    connect(m_timerFirstPressure, SIGNAL(timeout()),
            this, SLOT(onFirstPressure()));

    m_contextMenu = ContextMenuList::createContextObject(this);
    m_control.setContextMenu(m_contextMenu);

    m_elapsedTime = QTime::currentTime().msecsSinceStartOfDay();
}

WidgetMapEditor::~WidgetMapEditor()
{
    makeCurrent();
    delete m_timerFirstPressure;
}

void WidgetMapEditor::setMenuBar(WidgetMenuBarMapEditor* m){ m_menuBar = m; }

void WidgetMapEditor::setPanelTextures(PanelTextures* m){ m_panelTextures = m; }

void WidgetMapEditor::setTreeMapNode(QStandardItem* item) {
    m_control.setTreeMapNode(item);
}

Map* WidgetMapEditor::getMap() const { return m_control.map(); }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Map *WidgetMapEditor::loadMap(int idMap, QVector3D* position,
                              QVector3D *positionObject, int cameraDistance,
                              double cameraHorizontalAngle,
                              double cameraVerticalAngle)
{
    m_idMap = idMap;
    m_position = position;
    m_positionObject = positionObject;
    m_cameraDistance = cameraDistance;
    m_cameraHorizontalAngle = cameraHorizontalAngle;
    m_cameraVerticalAngle = cameraVerticalAngle;

    return m_control.loadMap(idMap, position, positionObject, cameraDistance,
                             cameraHorizontalAngle, cameraVerticalAngle);
}

// -------------------------------------------------------

void WidgetMapEditor::deleteMap(){
    makeCurrent();
    m_control.deleteMap();
}

// -------------------------------------------------------

void WidgetMapEditor::initializeSpinBoxesCoords(QSpinBox* x, QSpinBox* z){
    m_spinBoxX = x;
    m_spinBoxZ = z;
}

// -------------------------------------------------------

void WidgetMapEditor::initializeGL(){

    // Initialize OpenGL Backend
    initializeOpenGLFunctions();
    connect(this, SIGNAL(frameSwapped()), this, SLOT(update()));

    isGLInitialized = true;
    if (m_needUpdateMap)
        initializeMap();
}

// -------------------------------------------------------

void WidgetMapEditor::resizeGL(int width, int height){
    m_control.onResize(width, height);
}

// -------------------------------------------------------

void WidgetMapEditor::paintGL(){

    QPainter p(this);

    // Clear buffer
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

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

        if (!Wanok::isInConfig || m_menuBar == nullptr) {

            // Key press
            if (!m_firstPressure) {
                double speed = (QTime::currentTime().msecsSinceStartOfDay() -
                                m_elapsedTime) * 0.04666 *
                        Wanok::get()->getSquareSize();

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
            m_control.update(subKind);
            if (m_menuBar != nullptr) {
                QRect tileset = m_panelTextures->getTilesetTexture();
                int specialID = m_panelTextures->getID(subKind);
                m_control.updateWallIndicator();
                if (mousePosChanged) {
                    m_control.updatePreviewElements(kind, subKind, drawKind,
                                                    layerOn, tileset,
                                                    specialID);
                }
            }
        }

        // Model view / projection
        QMatrix4x4 viewMatrix = m_control.camera()->view();
        QMatrix4x4 projectionMatrix = m_control.camera()->projection();
        QMatrix4x4 modelviewProjection = projectionMatrix * viewMatrix;

        // Calculate camera worldSpace
        QVector3D cameraRightWorldSpace(viewMatrix.row(0).x(),
                                        viewMatrix.row(0).y(),
                                        viewMatrix.row(0).z());
        QVector3D cameraUpWorldSpace(viewMatrix.row(1).x(),
                                     viewMatrix.row(1).y(),
                                     viewMatrix.row(1).z());
        QVector3D cameraDeepWorldSpace(viewMatrix.row(2).x(),
                                       viewMatrix.row(2).y(),
                                       viewMatrix.row(2).z());

        // Paint
        m_control.paintGL(modelviewProjection, cameraRightWorldSpace,
                          cameraUpWorldSpace, cameraDeepWorldSpace, kind,
                          subKind, drawKind);
        p.endNativePainting();

        // Draw additional text informations
        if (m_menuBar != nullptr) {
            QString infos = m_control.getSquareInfos(kind, subKind, layerOn);
            QStringList listInfos = infos.split("\n");
            for (int i = 0; i < listInfos.size(); i++) {
                renderText(20, 20 * (listInfos.size() - i), listInfos.at(i),
                           QFont(), QColor(255, 255, 255));
            }
        }

        // Update elapsed time
        m_elapsedTime = QTime::currentTime().msecsSinceStartOfDay();
    }

    p.end();
}

// -------------------------------------------------------

void WidgetMapEditor::update(){
    QOpenGLWidget::update();
}

// -------------------------------------------------------

void WidgetMapEditor::needUpdateMap(int idMap, QVector3D* position,
                                    QVector3D *positionObject,
                                    int cameraDistance,
                                    double cameraHorizontalAngle,
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

void WidgetMapEditor::initializeMap(){
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

void WidgetMapEditor::save(){
    m_control.save();
}

// -------------------------------------------------------

void WidgetMapEditor::setCursorX(int x){
    if (m_control.map() != nullptr)
        m_control.cursor()->setX(x);
}

void WidgetMapEditor::setCursorY(int y){
    if (m_control.map() != nullptr)
        m_control.cursor()->setY(y);
}

// -------------------------------------------------------

void WidgetMapEditor::setCursorYplus(int yPlus){
    if (m_control.map() != nullptr)
        m_control.cursor()->setYplus(yPlus);
}

// -------------------------------------------------------

void WidgetMapEditor::setCursorZ(int z){
    if (m_control.map() != nullptr)
        m_control.cursor()->setZ(z);
}

// -------------------------------------------------------

void WidgetMapEditor::updateSpinBoxes(){
    if (m_spinBoxX != nullptr){
        m_spinBoxX->setValue(m_control.cursor()->getSquareX());
        m_spinBoxZ->setValue(m_control.cursor()->getSquareZ());
    }
}

// -------------------------------------------------------

void WidgetMapEditor::setObjectPosition(Position& position){
    position.setX(m_control.cursorObject()->getSquareX());
    position.setZ(m_control.cursorObject()->getSquareZ());
}

// -------------------------------------------------------

void WidgetMapEditor::addObject(){
    Position p;
    setObjectPosition(p);
    m_control.addObject(p);
}

// -------------------------------------------------------

void WidgetMapEditor::deleteObject(){
    Position p;
    setObjectPosition(p);
    m_control.removeObject(p);
}

// -------------------------------------------------------

void WidgetMapEditor::removePreviewElements() {
    m_control.removePreviewElements();
}

// -------------------------------------------------------

void WidgetMapEditor::renderText(double x, double y, const QString &text,
                                 const QFont& font, const QColor& fontColor)
{

    // Identify x and y locations to render text within widget
    int height = this->height();
    GLdouble textPosX = x, textPosY = y;
    textPosY = height - textPosY; // y is inverted

    // Render text
    QPainter painter(this);
    painter.setPen(fontColor);
    painter.setFont(font);
    painter.drawText(textPosX, textPosY, text);
    painter.end();
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
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetMapEditor::focusOutEvent(QFocusEvent*){
    m_keysPressed.clear();
    m_mousesPressed.clear();
    this->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::wheelEvent(QWheelEvent* event){
    if (m_control.map() != nullptr){
        m_control.onMouseWheelMove(event);
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mouseMoveEvent(QMouseEvent* event){
    if (m_control.map() != nullptr){

        // Multi keys
        QSet<Qt::MouseButton>::iterator i;
        for (i = m_mousesPressed.begin(); i != m_mousesPressed.end(); i++){
            Qt::MouseButton button = *i;
            m_control.onMouseMove(event->pos(), button,
                                  m_menuBar != nullptr);

            if (m_menuBar != nullptr && button != Qt::MouseButton::MiddleButton)
            {
                QRect tileset = m_panelTextures->getTilesetTexture();
                MapEditorSubSelectionKind subSelection =
                        m_menuBar->subSelectionKind();
                int specialID = m_panelTextures->getID(subSelection);
                bool layerOn = m_menuBar->layerOn();
                m_control.addRemove(m_menuBar->selectionKind(),
                                    subSelection, m_menuBar->drawKind(),
                                    layerOn, tileset, specialID);
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mousePressEvent(QMouseEvent* event){
    this->setFocus();
    if (m_control.map() != nullptr){
        Qt::MouseButton button = event->button();
        m_mousesPressed += button;
        if (m_menuBar != nullptr){
            MapEditorSelectionKind selection = m_menuBar->selectionKind();
            MapEditorSubSelectionKind subSelection =
                    m_menuBar->subSelectionKind();
            DrawKind drawKind = m_menuBar->drawKind();
            QString messageError;
            bool layerOn = m_menuBar->layerOn();
            if (m_control.isTinPaintPossible(selection, drawKind, messageError)
                && m_control.isPutLayerPossible(subSelection, drawKind, layerOn,
                                                messageError))
            {
                QRect tileset = m_panelTextures->getTilesetTexture();
                int specialID = m_panelTextures->getID(subSelection);
                m_control.onMousePressed(selection, subSelection, drawKind,
                                         layerOn, tileset, specialID,
                                         event->pos(), button);
            }
            else
                QMessageBox::information(nullptr, "Warning", messageError);
        }
        // If in teleport command
        else{
            if (button != Qt::MouseButton::MiddleButton){
                m_control.moveCursorToMousePosition(event->pos());
                updateSpinBoxes();
            }
            else{
                m_control.updateMousePosition(event->pos());
                m_control.update(MapEditorSubSelectionKind::None);
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mouseReleaseEvent(QMouseEvent* event){
    this->setFocus();
    if (m_control.map() != nullptr && m_menuBar != nullptr){
        Qt::MouseButton button = event->button();
        m_mousesPressed -= button;
        QRect tileset = m_panelTextures->getTilesetTexture();
        MapEditorSubSelectionKind subSelection =
                m_menuBar->subSelectionKind();
        int specialID = m_panelTextures->getID(subSelection);
        bool layerOn = m_menuBar->layerOn();
        m_control.onMouseReleased(m_menuBar->selectionKind(),
                                  subSelection, m_menuBar->drawKind(), layerOn,
                                  tileset, specialID, event->pos(), button);
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mouseDoubleClickEvent(QMouseEvent* event){
    this->setFocus();
    if (m_control.map() != nullptr){
        if (m_menuBar != nullptr){
            m_mousesPressed += event->button();
            if (m_menuBar->selectionKind() == MapEditorSelectionKind::Objects)
                addObject();
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::keyPressEvent(QKeyEvent* event){
    if (m_control.map() != nullptr){
        if (m_keysPressed.isEmpty()){
            m_firstPressure = true;
            m_timerFirstPressure->start(35);
            //m_control.onKeyPressedWithoutRepeat(event->key());
            onKeyPress(event->key(), -1);
            m_control.cursor()->updatePositionSquare();
        }

        int key = event->key();
        if (!m_keysPressed.contains(key)) {
            KeyBoardDatas* keyBoardDatas = Wanok::get()->engineSettings()
                    ->keyBoardDatas();
            if ((keyBoardDatas->isEqual(key,
                                        KeyBoardEngineKind::MoveCursorUp) &&
                keyBoardDatas->contains(m_keysPressed,
                                        KeyBoardEngineKind::MoveCursorLeft)) ||
                (keyBoardDatas->isEqual(key,
                                        KeyBoardEngineKind::MoveCursorLeft) &&
                keyBoardDatas->contains(m_keysPressed,
                                        KeyBoardEngineKind::MoveCursorUp)) ||
                (keyBoardDatas->isEqual(key,
                                        KeyBoardEngineKind::MoveCursorDown) &&
                keyBoardDatas->contains(m_keysPressed,
                                        KeyBoardEngineKind::MoveCursorRight)) ||
                (keyBoardDatas->isEqual(key,
                                        KeyBoardEngineKind::MoveCursorRight) &&
                keyBoardDatas->contains(m_keysPressed,
                                        KeyBoardEngineKind::MoveCursorDown)))
            {
                m_control.cursor()->centerInSquare(1);
            }
            else if ((
                keyBoardDatas->isEqual(key,
                                       KeyBoardEngineKind::MoveCursorUp) &&
                keyBoardDatas->contains(m_keysPressed,
                                        KeyBoardEngineKind::MoveCursorRight)) ||
                (keyBoardDatas->isEqual(key,
                                        KeyBoardEngineKind::MoveCursorRight) &&
                keyBoardDatas->contains(m_keysPressed,
                                        KeyBoardEngineKind::MoveCursorUp)) ||
                (keyBoardDatas->isEqual(key,
                                        KeyBoardEngineKind::MoveCursorDown) &&
                keyBoardDatas->contains(m_keysPressed,
                                        KeyBoardEngineKind::MoveCursorLeft)) ||
                (keyBoardDatas->isEqual(key,
                                        KeyBoardEngineKind::MoveCursorLeft) &&
                keyBoardDatas->contains(m_keysPressed,
                                        KeyBoardEngineKind::MoveCursorDown)))
            {
                m_control.cursor()->centerInSquare(0);
            }
        }
        m_keysPressed += event->key();
    }
}

// -------------------------------------------------------

void WidgetMapEditor::keyReleaseEvent(QKeyEvent* event){
    if (m_control.map() != nullptr){
        if (!event->isAutoRepeat()){
            m_keysPressed -= event->key();
            m_control.onKeyReleased(event->key());
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::onFirstPressure(){
    m_firstPressure = false;
}

// -------------------------------------------------------

void WidgetMapEditor::onKeyPress(int k, double speed){
    m_control.onKeyPressed(k, speed);
    updateSpinBoxes();
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------

void WidgetMapEditor::contextNew(){
    addObject();
}

// -------------------------------------------------------

void WidgetMapEditor::contextEdit(){
    addObject();
}

// -------------------------------------------------------

void WidgetMapEditor::contextCopy(){

}

// -------------------------------------------------------

void WidgetMapEditor::contextPaste(){

}

// -------------------------------------------------------

void WidgetMapEditor::contextDelete(){
    deleteObject();
}

// -------------------------------------------------------

void WidgetMapEditor::contextHero(){
    m_control.defineAsHero();
}
