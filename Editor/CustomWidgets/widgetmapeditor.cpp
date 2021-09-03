/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMouseEvent>
#include <QDebug>
#include <QHash>
#include <QHashIterator>
#include <QTime>
#include <QMessageBox>
#include <QToolTip>
#include <QApplication>
#include "widgetmapeditor.h"
#include "rpm.h"
#include "systemcolor.h"
#include "common.h"
#include "systemskybox.h"

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
    m_detection(nullptr),
    m_timerFirstPressure(new QTimer),
    m_firstPressure(false),
    m_spinBoxX(nullptr),
    m_spinBoxY(nullptr),
    m_spinBoxYPlus(nullptr),
    m_spinBoxZ(nullptr),
    m_position(nullptr),
    m_positionObject(nullptr),
    m_autotileFrame(0),
    m_timerAutotileFrame(new QTimer)
{
    QPixmap cursorPixmap;

    // Mouse tracking
    this->setMouseTracking(true);
    this->setFocus();
    this->setFocusPolicy(Qt::FocusPolicy::WheelFocus);

    // Initialize cursors
    cursorPixmap = QPixmap(":/icons/Ressources/translate_cursor.png");
    m_cursorTranslate = QCursor(cursorPixmap, 16, 16);
    cursorPixmap = QPixmap(":/icons/Ressources/rotate_cursor.png");
    m_cursorRotate = QCursor(cursorPixmap, 16, 16);
    cursorPixmap = QPixmap(":/icons/Ressources/scale_cursor.png");
    m_cursorScale = QCursor(cursorPixmap, 16, 16);
    cursorPixmap = QPixmap(":/icons/Ressources/pencil_cursor.png");
    m_cursorPencil = QCursor(cursorPixmap, 4, 27);
    cursorPixmap = QPixmap(":/icons/Ressources/rectangle_cursor.png");
    m_cursorRectangle = QCursor(cursorPixmap, 2, 4);
    cursorPixmap = QPixmap(":/icons/Ressources/pin_cursor.png");
    m_cursorPinPaint = QCursor(cursorPixmap, 0, 29);
    m_imageLayerOn = QImage(":/icons/Ressources/layer_on_cursor.png");

    // Height images
    m_imageHeight = QImage(":/icons/Ressources/height.png");
    m_imageHeightPlus = QImage(":/icons/Ressources/height_plus.png");

    // Timers
    m_timerFirstPressure->setSingleShot(true);
    connect(m_timerFirstPressure, SIGNAL(timeout()), this, SLOT(onFirstPressure()));
    connect(m_timerAutotileFrame, SIGNAL(timeout()), this, SLOT(onAutotileFrame()));

    m_contextMenu = ContextMenuList::createContextObject(this);
    m_control.setContextMenu(m_contextMenu);

    m_elapsedTime = QTime::currentTime().msecsSinceStartOfDay();
}

WidgetMapEditor::~WidgetMapEditor()
{
    makeCurrent();
    delete m_timerFirstPressure;
    delete m_timerAutotileFrame;
}

void WidgetMapEditor::setMenuBar(WidgetMenuBarMapEditor *m) {
    m_menuBar = m;
}

void WidgetMapEditor::setPanelTextures(PanelTextures *m){
    m_panelTextures = m;
}

Map * WidgetMapEditor::getMap() const {
    return m_control.map();
}

int WidgetMapEditor::cameraDistance() const {
    return m_cameraDistance;
}

double WidgetMapEditor::cameraHorizontalAngle() const {
    return m_cameraHorizontalAngle;
}

double WidgetMapEditor::cameraVerticalAngle() const {
    return m_cameraVerticalAngle;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetMapEditor::applyMap(SystemDetection *detection, QVector3D *position,
    QVector3D *positionObject, int cameraDistance, double cameraHorizontalAngle,
    double cameraVerticalAngle)
{
    Map *map;

    m_detection = detection;
    m_position = position;
    m_positionObject = positionObject;
    m_cameraDistance = cameraDistance;
    m_cameraHorizontalAngle = cameraHorizontalAngle;
    m_cameraVerticalAngle = cameraVerticalAngle;

    map = m_detection->createDetectionMap();
    m_control.applyMap(map, position, positionObject, cameraDistance,
        cameraHorizontalAngle, cameraVerticalAngle, detection);
    m_backgroundColor = Qt::black;
}

// -------------------------------------------------------

Map * WidgetMapEditor::loadMap(int idMap, QVector3D *position, QVector3D
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

    // Start autotile timer
    m_timerAutotileFrame->start(RPM::get()->project()->gameDatas()->systemDatas()
        ->autotilesFrameDuration());

    // Load background
    if (m_control.map()->mapProperties()->isSkyColor())
    {
        m_backgroundColor = (map->mapProperties()->skyColorID()->kind() ==
            PrimitiveValueKind::Variable) ? Qt::black : reinterpret_cast<
            SystemColor *>(SuperListItem::getById(RPM::get()->project()
            ->gameDatas()->systemDatas()->modelColors()->invisibleRootItem(),
            map->mapProperties()->skyColorID()->numberValue()))->color();
    } else if (m_control.map()->mapProperties()->isSkyImage())
    {
        m_imageBackground = QImage(reinterpret_cast<SystemPicture *>(
            SuperListItem::getById(RPM::get()->project()->picturesDatas()->model
            (PictureKind::Pictures)->invisibleRootItem(), m_control.map()
            ->mapProperties()->skyPictureID()->id()))->getPath());
    }

    return map;
}

// -------------------------------------------------------

void WidgetMapEditor::deleteMap() {
    makeCurrent();
    m_control.deleteMap();
}

// -------------------------------------------------------

void WidgetMapEditor::initializeSpinBoxesCoords(QSpinBox *x, QSpinBox *y,
    QSpinBox *yPlus, QSpinBox *z)
{
    m_spinBoxX = x;
    m_spinBoxY = y;
    m_spinBoxYPlus = yPlus;
    m_spinBoxZ = z;
}

// -------------------------------------------------------

void WidgetMapEditor::initializeGL()
{
    // Initialize OpenGL Backend
    initializeOpenGLFunctions();
    connect(this, SIGNAL(frameSwapped()), this, SLOT(update()));
    isGLInitialized = true;

    if (m_needUpdateMap)
    {
        initializeMap();
    }
}

// -------------------------------------------------------

void WidgetMapEditor::resizeGL(int width, int height) {
    m_control.onResize(width, height);
}

// -------------------------------------------------------

void WidgetMapEditor::paintGL() {
    QPainter p(this);
    p.beginNativePainting();

    // Clear buffer
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // CLear background color
    if (m_control.map() == nullptr) {
        glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    } else {
        glClearColor(m_backgroundColor.red() / 255.0f, m_backgroundColor.green()
            / 255.0f, m_backgroundColor.blue() / 255.0f, m_backgroundColor
            .alpha() / 255.0f);
    }

    if (m_control.map() != nullptr) {
        if (m_control.map()->mapProperties()->isSkyImage())
        {
            if (!p.isActive())
            {
                p.begin(this);
            }
            p.drawImage(QRect(0, 0, this->width(), this->height()), m_imageBackground);
        }
        glEnable(GL_DEPTH_TEST);
        glEnable(GL_BLEND);
        glBlendEquation(GL_FUNC_ADD);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

        // Config
        MapEditorSelectionKind kind;
        MapEditorSubSelectionKind subKind;
        bool square;
        DrawKind drawKind;
        bool layerOn;
        if (m_menuBar == nullptr || m_detection != nullptr)
        {
            kind = MapEditorSelectionKind::Land;
            subKind = MapEditorSubSelectionKind::None;
            square = true;
            drawKind = DrawKind::Pencil;
            layerOn = false;
        } else
        {
            kind = m_menuBar->selectionKind();
            subKind = m_menuBar->subSelectionKind();
            square = m_menuBar->squareOn();
            drawKind = m_menuBar->drawKind();
            layerOn = m_menuBar->layerOn();
        }

        QPoint point = mapFromGlobal(QCursor::pos());
        if (!RPM::isInConfig || m_menuBar == nullptr || m_detection != nullptr) {

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
            bool mousePosChanged = m_control.mousePositionChanged(point);
            m_control.updateMousePosition(point);
            m_control.update(kind, square, drawKind, layerOn);
            if (m_menuBar != nullptr && m_detection == nullptr)
            {
                QRect tileset;
                m_panelTextures->getTilesetTexture(tileset);
                int specialID = m_panelTextures->getID();
                int widthSquares = m_panelTextures->getWidthSquares();
                double widthPixels = m_panelTextures->getWidthPixels();
                int heightSquares = m_panelTextures->getHeightSquares();
                double heightPixels = m_panelTextures->getHeightPixels();
                QRect defaultTopFloor;
                m_panelTextures->getDefaultFloorRect(defaultTopFloor);
                m_control.updateWallIndicator();
                if (mousePosChanged && this->hasFocus()) {
                    m_control.updatePreviewElements(kind, subKind, drawKind,
                        layerOn, tileset, specialID, widthSquares, widthPixels,
                        heightSquares, heightPixels, defaultTopFloor);
                }
            } else if (m_detection != nullptr)
            {
                m_control.updatePreviewDetection();
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
            cameraUpWorldSpace, cameraDeepWorldSpace, kind, subKind, drawKind,
            m_autotileFrame);
        this->paintOther3DStuff();
        p.endNativePainting();
        p.end();
        // Draw additional text informations
        p.begin(this);
        if (m_menuBar != nullptr) {
            QString infos = m_control.getSquareInfos(kind, subKind, layerOn,
                this->hasFocus());
            QStringList listInfos = infos.split("\n");
            if (m_control.displaySquareInformations()) {
                p.drawImage(QRect(10, 10, 16, 16), m_imageHeight);
                renderText(p, 32, 23, QString::number(m_control.cursor()
                    ->getSquareY()), QFont(), QColor(255, 255, 255), QColor(),
                    false);
                p.drawImage(QRect(10, 34, 16, 16), m_imageHeightPlus);
                renderText(p, 32, 47, QString::number(m_control.cursor()
                    ->getYPlus()), QFont(), QColor(255, 255, 255), QColor(),
                    false);
                for (int i = 0; i < listInfos.size(); i++) {
                    renderText(p, 20, 20 * (listInfos.size() - i), listInfos.at(i),
                        QFont(), QColor(255, 255, 255));
                }
            }
            if (m_detection == nullptr && m_menuBar->layerOn() && m_menuBar
                ->selectionKind() != MapEditorSelectionKind::Objects)
            {
                p.drawImage(point.x() + 10, point.y() - 10, m_imageLayerOn);
            }
        }
        this->paintOtherHUDStuff(p);
        p.end();

        // Update elapsed time
        m_elapsedTime = QTime::currentTime().msecsSinceStartOfDay();
        return;
    }
    p.end();
}

// -------------------------------------------------------

void WidgetMapEditor::paintOther3DStuff()
{

}

// -------------------------------------------------------

void WidgetMapEditor::paintOtherHUDStuff(QPainter &)
{

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

    if (isGLInitialized) {
        initializeMap();
    }
}

// -------------------------------------------------------

void WidgetMapEditor::needUpdateMapDetection(SystemDetection *detection,
    QVector3D *position, QVector3D *positionObject, int cameraDistance, double
    cameraHorizontalAngle, double cameraVerticalAngle)
{
    m_needUpdateMap = true;
    m_detection = detection;
    m_position = position;
    m_positionObject = positionObject;
    m_cameraDistance = cameraDistance;
    m_cameraHorizontalAngle = cameraHorizontalAngle;
    m_cameraVerticalAngle = cameraVerticalAngle;

    if (isGLInitialized) {
        initializeMap();
    }
}

// -------------------------------------------------------

void WidgetMapEditor::updateTagsSquares(float s, float ps)
{
    m_control.cursor()->syncPositions();
    m_control.cursorObject()->syncPositions();
    m_control.camera()->setDistance(qRound(m_control.camera()->distance() / ps *
        s));
}

// -------------------------------------------------------

void WidgetMapEditor::initializeMap() {
    makeCurrent();
    if (m_detection == nullptr) {
        loadMap(m_idMap, m_position, m_positionObject, m_cameraDistance,
            m_cameraHorizontalAngle, m_cameraVerticalAngle);
    } else {
        applyMap(m_detection, m_position, m_positionObject, m_cameraDistance,
            m_cameraHorizontalAngle, m_cameraVerticalAngle);
    }
    if (m_menuBar != nullptr) {
        m_menuBar->show();
    }

    m_needUpdateMap = false;
    updateSpinBoxes();
    this->setFocus();
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

void WidgetMapEditor::setCursorY(int y, int yPlus) {
    if (m_control.map() != nullptr) {
        Position3D pos(0, y, static_cast<qreal>(yPlus) / RPM::get()
            ->getSquareSize() * 100, 0);
        m_control.cursor()->setY(pos);
    }
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
        m_spinBoxY->setValue(m_control.cursor()->getSquareY());
        m_spinBoxYPlus->setValue(m_control.cursor()->getYPlus());
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
    &text, const QFont &font, const QColor &fontColor, const QColor &outlineColor,
    bool isBottom)
{

    // Identify x and y locations to render text within widget
    int height = this->height();
    GLdouble textPosX = x, textPosY = y;
    textPosY = isBottom ? height - textPosY : textPosY; // y is inverted

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

void WidgetMapEditor::heightUp() {
    m_control.heightUp();
}

// -------------------------------------------------------

void WidgetMapEditor::heightPlusUp() {
    m_control.heightPlusUp();
}

// -------------------------------------------------------

void WidgetMapEditor::heightDown() {
    m_control.heightDown();
}

// -------------------------------------------------------

void WidgetMapEditor::heightPlusDown() {
    m_control.heightPlusDown();
}

// -------------------------------------------------------

void WidgetMapEditor::zoom(int value)
{
    m_control.zoom(value);
}

// -------------------------------------------------------

void WidgetMapEditor::updateCursor() {
    if (m_menuBar == nullptr || m_menuBar->selectionKind() ==
        MapEditorSelectionKind::Objects || m_detection != nullptr)
    {
        setCursor(Qt::ArrowCursor);
    } else
    {
        QCursor *cursor = nullptr;
        switch (m_menuBar->drawKind())
        {
        case DrawKind::Translate:
            cursor = &m_cursorTranslate;
            break;
        case DrawKind::Rotate:
            cursor = &m_cursorRotate;
            break;
        case DrawKind::Scale:
            cursor = &m_cursorScale;
            break;
        case DrawKind::Pencil:
            cursor = &m_cursorPencil;
            break;
        case DrawKind::Rectangle:
            cursor = &m_cursorRectangle;
            break;
        case DrawKind::Pin:
            cursor = &m_cursorPinPaint;
            break;
        }
        setCursor(*cursor);
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

bool WidgetMapEditor::focusNextPrevChild(bool)
{
    return false;
}

// -------------------------------------------------------

void WidgetMapEditor::focusOutEvent(QFocusEvent *)
{
    m_keysPressed.clear();
}

// -------------------------------------------------------

void WidgetMapEditor::wheelEvent(QWheelEvent *event)
{
    if (m_control.map() != nullptr)
    {
        m_control.onMouseWheelMove(event);
    }
}

// -------------------------------------------------------

void WidgetMapEditor::enterEvent(QEvent *)
{
    updateCursor();
    this->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::leaveEvent(QEvent *)
{
    setCursor(Qt::ArrowCursor);
}

// -------------------------------------------------------

void WidgetMapEditor::mouseMoveEvent(QMouseEvent *event)
{
    if (m_control.map() != nullptr)
    {

        // Tooltip for height
        if (m_menuBar != nullptr)
        {
            if (event->pos().x() <= 50 && event->pos().y() <= 50)
            {
                QToolTip::showText(this->mapToGlobal(event->pos()), RPM
                    ::translate(Translations::CHANGE_HEIGHT_TOOLTIP_1) + RPM
                    ::DOT + RPM::NEW_LINE + RPM::SPACE + RPM::translate(
                    Translations::CHANGE_HEIGHT_TOOLTIP_2) + RPM::DOT);
            } else
            {
                QToolTip::hideText();
            }
        }

        // Multi keys
        QSet<Qt::MouseButton> buttons;
        if (event->buttons() & Qt::LeftButton)
        {
            buttons += Qt::LeftButton;
        }
        if (event->buttons() & Qt::RightButton)
        {
            buttons += Qt::RightButton;
        }
        if (event->buttons() & Qt::MiddleButton)
        {
            buttons += Qt::MiddleButton;
        }
        QSet<Qt::MouseButton>::iterator i;
        for (i = buttons.begin(); i != buttons.end(); i++)
        {
            Qt::MouseButton button = *i;
            m_control.onMouseMove(event->pos(), button, m_menuBar != nullptr);
            if (button != Qt::MouseButton::MiddleButton && !(QApplication
                ::keyboardModifiers() & Qt::ControlModifier) && !(QApplication
                ::keyboardModifiers() & Qt::ShiftModifier))
            {
                QRect defaultFloorRect;
                if (m_menuBar != nullptr && m_detection == nullptr)
                {
                    QRect tileset;
                    m_panelTextures->getTilesetTexture(tileset);
                    MapEditorSubSelectionKind subSelection = m_menuBar
                        ->subSelectionKind();
                    int specialID = m_panelTextures->getID();
                    bool layerOn = m_menuBar->layerOn();
                    int widthSquares = m_panelTextures->getWidthSquares();
                    double widthPixels = m_panelTextures->getWidthPixels();
                    int heightSquares = m_panelTextures->getHeightSquares();
                    double heightPixels = m_panelTextures->getHeightPixels();
                    m_panelTextures->getDefaultFloorRect(defaultFloorRect);
                    m_control.addRemove(m_menuBar->selectionKind(), subSelection
                        , m_menuBar->drawKind(), layerOn, tileset, specialID,
                        widthSquares, widthPixels, heightSquares, heightPixels,
                        defaultFloorRect);
                } else if (m_detection != nullptr)
                {
                    defaultFloorRect.setWidth(1);
                    defaultFloorRect.setHeight(1);
                    m_control.addRemove(MapEditorSelectionKind::Objects3D,
                        MapEditorSubSelectionKind::Object3D, DrawKind::Pencil,
                        false, defaultFloorRect, 1, 1, 0, 1, 0, defaultFloorRect);
                }
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mousePressEvent(QMouseEvent *event)
{
    this->setFocus();
    if (m_control.map() != nullptr)
    {
        Qt::MouseButton button = event->button();
        QRect defaultFloorRect;
        if (m_menuBar != nullptr && m_detection == nullptr)
        {
            MapEditorSelectionKind selection = m_menuBar->selectionKind();
            MapEditorSubSelectionKind subSelection = m_menuBar->subSelectionKind();
            bool square = m_menuBar->squareOn();
            DrawKind drawKind = m_menuBar->drawKind();
            bool layerOn = m_menuBar->layerOn();
            QRect tileset;
            m_panelTextures->getTilesetTexture(tileset);
            int specialID = m_panelTextures->getID();
            int widthSquares = m_panelTextures->getWidthSquares();
            double widthPixels = m_panelTextures->getWidthPixels();
            int heightSquares = m_panelTextures->getHeightSquares();
            double heightPixels = m_panelTextures->getHeightPixels();
            m_panelTextures->getDefaultFloorRect(defaultFloorRect);
            m_control.onMousePressed(selection, subSelection, square, drawKind,
                layerOn, tileset, specialID, widthSquares, widthPixels,
                heightSquares, heightPixels, defaultFloorRect, event->pos(), button);

            // Rotations
            if (button != Qt::MouseButton::MiddleButton)
            {
                if (drawKind == DrawKind::Rotate)
                {
                    Position *position;

                    position = m_control.positionOnElement(selection, drawKind);
                    emit selectPositionTransformation(position, button == Qt
                        ::MouseButton::LeftButton);
                }
            }
        } else
        {
            if (button != Qt::MouseButton::MiddleButton)
            {
                if (m_detection == nullptr)
                {
                    m_control.moveCursorToMousePosition(event->pos());
                    updateSpinBoxes();
                } else
                {
                    defaultFloorRect.setWidth(1);
                    defaultFloorRect.setHeight(1);
                    m_control.onMousePressed(MapEditorSelectionKind::Objects3D,
                        MapEditorSubSelectionKind::Object3D, true, DrawKind
                        ::Pencil, false, defaultFloorRect, 1, 1, 0, 1, 0,
                        defaultFloorRect, event->pos(), button);
                }
            } else
            {
                m_control.updateMouseMove(event->pos());
                m_control.update(MapEditorSelectionKind::None, true, DrawKind
                    ::Pencil, false);
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::mouseReleaseEvent(QMouseEvent *event)
{
    this->setFocus();
    if (m_control.map() != nullptr)
    {
        Qt::MouseButton button = event->button();
        QRect tileset;
        if (m_menuBar != nullptr && m_detection == nullptr)
        {
            m_panelTextures->getTilesetTexture(tileset);
            MapEditorSubSelectionKind subSelection = m_menuBar->subSelectionKind();
            int specialID = m_panelTextures->getID();
            m_control.onMouseReleased(m_menuBar->selectionKind(), subSelection,
                m_menuBar->drawKind(), tileset, specialID, event->pos(), button);
        } else if (m_detection != nullptr)
        {
            tileset.setWidth(1);
            tileset.setHeight(1);
            m_control.onMouseReleased(MapEditorSelectionKind::Objects3D,
                MapEditorSubSelectionKind::Object3D, DrawKind::Pencil, tileset,
                1, event->pos(), button);
        }
    }
    this->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::mouseDoubleClickEvent(QMouseEvent *event)
{
    this->setFocus();
    if (m_control.map() != nullptr)
    {
        if (m_menuBar != nullptr && m_detection == nullptr)
        {
            if (m_menuBar->selectionKind() == MapEditorSelectionKind::Objects)
            {
                addObject();
            }
            // Rotations
            Qt::MouseButton button = event->button();
            DrawKind drawKind = m_menuBar->drawKind();
            MapEditorSelectionKind selection = m_menuBar->selectionKind();
            if (button != Qt::MouseButton::MiddleButton)
            {
                if (drawKind == DrawKind::Rotate)
                {
                    Position *position = m_control.positionOnElement(selection, drawKind);
                    emit selectPositionTransformation(position, button == Qt
                        ::MouseButton::LeftButton);
                }
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::keyPressEvent(QKeyEvent *event)
{
    if (m_control.map() != nullptr)
    {
        int key = event->key();

        // Move cursor up / down with arrow shortcut for dialog select position
        if (m_menuBar == nullptr || m_detection != nullptr)
        {
            if (m_control.isCtrlPressed())
            {
                if (m_control.isShiftPressed())
                {
                    if (key == Qt::Key_Up)
                    {
                        this->heightPlusUp();
                        return;
                    } else if (key == Qt::Key_Down)
                    {
                        this->heightPlusDown();
                        return;
                    }
                } else
                {
                    if (key == Qt::Key_Up)
                    {
                        this->heightUp();
                        return;
                    } else if (key == Qt::Key_Down)
                    {
                        this->heightDown();
                        return;
                    }
                }
            }
        }
        if (m_keysPressed.isEmpty())
        {
            m_firstPressure = true;
            m_timerFirstPressure->start(35);
            onKeyPress(event->key(), -1);
            m_control.cursor()->updatePositionSquare();
        }
        if (event->modifiers() & Qt::ControlModifier)
        {
            m_control.setIsCtrlPressed(true);
            m_control.removePreviewElements();
        }
        if (event->modifiers() & Qt::ShiftModifier)
        {
            m_control.setIsShiftPressed(true);
        }

        // Tab
        if (m_menuBar != nullptr && key == Qt::Key_Tab)
        {
            m_menuBar->toggleSelection();
        }

        // Move
        if (!m_keysPressed.contains(key))
        {
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
                || (keyBoardDatas->isEqual(key, KeyBoardEngineKind
                ::MoveCursorLeft) && keyBoardDatas->contains(m_keysPressed,
                KeyBoardEngineKind::MoveCursorDown)))
            {
                m_control.cursor()->centerInSquare(0);
            }
        }

        // Shortcut
        if (m_menuBar != nullptr && m_menuBar->selectionKind() ==
            MapEditorSelectionKind::Objects && m_detection == nullptr)
        {
            m_control.updateMenuContext();
            QKeySequence seq = Common::getKeySequence(event);
            QList<QAction*> actions = m_contextMenu->actions();
            QAction* action = actions.at(0);
            if (Common::isPressingEnter(event) && action->isEnabled())
            {
                contextNew();
                return;
            }
            action = actions.at(1);
            if (Common::isPressingEnter(event) && action->isEnabled())
            {
                contextEdit();
                return;
            }
            action = actions.at(3);
            if (action->shortcut().matches(seq) && action->isEnabled())
            {
                contextCopy();
                return;
            }
            action = actions.at(4);
            if (action->shortcut().matches(seq) && action->isEnabled())
            {
                contextPaste();
                return;
            }
            action = actions.at(6);
            if (action->shortcut().matches(seq) && action->isEnabled())
            {
                contextDelete();
                return;
            }
            action = actions.at(8);
            if (action->shortcut().matches(seq) && action->isEnabled())
            {
                contextHero();
                return;
            }
        }
        m_keysPressed += key;
    }
}

// -------------------------------------------------------

void WidgetMapEditor::keyReleaseEvent(QKeyEvent *event)
{
    if (m_control.map() != nullptr)
    {
        if (!event->isAutoRepeat())
        {
            m_keysPressed -= event->key();
            m_control.onKeyReleased(event->key());
            if (!(event->modifiers() & Qt::ControlModifier))
            {
                m_control.setIsCtrlPressed(false);
            }
            if (!(event->modifiers() & Qt::ShiftModifier))
            {
                m_control.setIsShiftPressed(false);
            }
        }
    }
}

// -------------------------------------------------------

void WidgetMapEditor::onFirstPressure()
{
    m_firstPressure = false;
}

// -------------------------------------------------------

void WidgetMapEditor::onAutotileFrame()
{
    m_autotileFrame = (m_autotileFrame + 1) % RPM::get()->project()->gameDatas()
        ->systemDatas()->autotilesFrames();
}

// -------------------------------------------------------

void WidgetMapEditor::onKeyPress(int k, double speed)
{
    m_control.onKeyPressed(k, speed);
    updateSpinBoxes();
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------

void WidgetMapEditor::contextNew()
{
    if (m_control.isCursorObjectVisible())
    {
        addObject();
    }
    m_contextMenu->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::contextEdit()
{
    if (m_control.isCursorObjectVisible())
    {
        addObject();
    }
    m_contextMenu->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::contextCopy()
{
    if (m_control.isCursorObjectVisible())
    {
        m_control.copyObject();
    }
    m_contextMenu->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::contextPaste()
{
    if (m_control.isCursorObjectVisible())
    {
        m_control.pasteObject();
    }
    m_contextMenu->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::contextDelete()
{
    if (m_control.isCursorObjectVisible())
    {
        deleteObject();
    }
    m_contextMenu->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::contextHero()
{
    if (m_control.isCursorObjectVisible())
    {
        m_control.defineAsHero();
    }
    m_contextMenu->setFocus();
}

// -------------------------------------------------------

void WidgetMapEditor::onTransformationPositionChanged(Position &newPosition,
    Position &previousPosition)
{
    m_control.onTransformationPositionChanged(newPosition, previousPosition,
        m_menuBar->selectionKind());
}
