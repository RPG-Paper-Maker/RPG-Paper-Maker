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
                              int cameraHeight)
{
    m_idMap = idMap;
    m_position = position;
    m_positionObject = positionObject;
    m_cameraDistance = cameraDistance;
    m_cameraHeight = cameraHeight;
    return m_control.loadMap(idMap, position, positionObject, cameraDistance,
                             cameraHeight);
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

    // Set global information
    //glCullFace(GL_FRONT_AND_BACK);
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    glEnable(GL_DEPTH_TEST);
    glEnable( GL_BLEND );
    glBlendEquation( GL_FUNC_ADD );
    glBlendFunc(GL_SRC_ALPHA,GL_ONE_MINUS_SRC_ALPHA);
    /*
    glEnable(GL_ALPHA_TEST);
    glAlphaFunc(GL_GREATER, 0);
    */

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

    // Clear buffer
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    if (m_control.map() != nullptr){

        // Update control
        m_control.update();

        // Draw
        QMatrix4x4 modelviewProjection = m_control.camera()->projection() *
                                         m_control.camera()->view();

        MapEditorSelectionKind kind = (m_menuBar == nullptr)
                ? MapEditorSelectionKind::Land : m_menuBar->selectionKind();
        m_control.paintGL(modelviewProjection, kind);
    }
}

// -------------------------------------------------------

void WidgetMapEditor::update(){
    QOpenGLWidget::update();

    if (!m_firstPressure){
        double speed = (QTime::currentTime().msecsSinceStartOfDay() -
                        m_elapsedTime) * 0.04666 *
                Wanok::get()->getSquareSize();

        // Multi keys
        QSet<int>::iterator i;
        for (i = m_keysPressed.begin(); i != m_keysPressed.end(); i++)
            onKeyPress(*i, speed);
    }

    m_elapsedTime = QTime::currentTime().msecsSinceStartOfDay();
}

// -------------------------------------------------------

void WidgetMapEditor::needUpdateMap(int idMap, QVector3D* position,
                                    QVector3D *positionObject,
                                    int cameraDistance, int cameraHeight)
{
    m_needUpdateMap = true;
    m_idMap = idMap;
    m_position = position;
    m_positionObject = positionObject;
    m_cameraDistance = cameraDistance;
    m_cameraHeight = cameraHeight;

    if (isGLInitialized)
        initializeMap();
}

// -------------------------------------------------------

void WidgetMapEditor::initializeMap(){
    makeCurrent();
    Map* map = loadMap(m_idMap, m_position, m_positionObject, m_cameraDistance,
                       m_cameraHeight);
    if (m_menuBar != nullptr){
        m_menuBar->show();
        Wanok::get()->project()->setCurrentMap(map);
    }
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
    int cameraDistance = m_control.camera()->distance();
    int cameraHeight = m_control.camera()->height();

    deleteMap();
    needUpdateMap(m_idMap, m_position, m_positionObject, cameraDistance,
                  cameraHeight);
}

// -------------------------------------------------------

void WidgetMapEditor::deleteObject(){
    Position p;
    setObjectPosition(p);
    m_control.removeObject(p);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetMapEditor::focusOutEvent(QFocusEvent*){
    m_keysPressed.clear();
    m_mousesPressed.clear();
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
            m_control.onMouseMove(event->pos(), button);

            if (m_menuBar != nullptr){
                QRect tileset = m_panelTextures->getTilesetTexture();
                m_control.addRemove(m_menuBar->selectionKind(),
                                    m_menuBar->subSelectionKind(),
                                    m_menuBar->drawKind(),
                                    tileset,
                                    button);
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mousePressEvent(QMouseEvent* event){
    this->setFocus();
    if (m_control.map() != nullptr){
        if (m_menuBar != nullptr){
            m_mousesPressed += event->button();
            QRect tileset = m_panelTextures->getTilesetTexture();
            m_control.onMousePressed(m_menuBar->selectionKind(),
                                     m_menuBar->subSelectionKind(),
                                     m_menuBar->drawKind(),
                                     tileset,
                                     event->pos(),
                                     event->button());
        }
        // If in teleport command
        else{
            m_control.moveCursorToMousePosition(event->pos());
            updateSpinBoxes();
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mouseReleaseEvent(QMouseEvent* event){
    this->setFocus();
    if (m_control.map() != nullptr){
        if (m_menuBar != nullptr)
            m_mousesPressed -= event->button();
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
            m_control.onKeyPressedWithoutRepeat(event->key());
            onKeyPress(event->key(), -1);
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
