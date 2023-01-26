/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPainter>
#include <QtMath>
#include "widgettilesetpraticable.h"
#include "rpm.h"
#include "common.h"
#include "dialogrect.h"

const int WidgetTilesetPraticable::OFFSET = 5;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetPraticable::WidgetTilesetPraticable(QWidget *parent) :
    QWidget(parent),
    m_pictureID(-1),
    m_kind(PictureKind::Tilesets),
    m_selectedPoint(-1, -1),
    m_hoveredPoint(-1, -1),
    m_resizeKind(CollisionResizeKind::None),
    m_selectedCollision(nullptr),
    m_isCreating(false),
    m_zoom(1.0f),
    m_firstResize(false),
    m_lastCursorShape(Qt::ArrowCursor)
{
    this->setMouseTracking(true);
    this->setContextMenuPolicy(Qt::CustomContextMenu);
    this->setFocusPolicy(Qt::StrongFocus);
    this->setFocus();

    // Context menu connections
    m_contextMenu = ContextMenuList::createContextPraticable(this);
    connect(this, SIGNAL(customContextMenuRequested(const QPoint &)),
            this, SLOT(showContextMenu(const QPoint &)));
}

WidgetTilesetPraticable::~WidgetTilesetPraticable() {
    delete m_contextMenu;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int WidgetTilesetPraticable::getPictureRows() const
{
    return reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(PictureKind::Characters)
        ->invisibleRootItem(), m_pictureID))->getRows();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateImage(SystemPicture* picture,
                                          PictureKind kind)
{
    QString path = picture->getPath();
    m_baseImage = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    updateImageGeneral(picture, kind);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateImageSpecial(QImage& editedImage,
    SystemPicture* picture, PictureKind kind)
{
    m_baseImage = editedImage;
    updateImageGeneral(picture, kind);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateImageGeneral(SystemPicture* picture,
    PictureKind kind)
{
    m_pictureID = picture->id();
    m_kind = kind;
    m_image = m_baseImage;
    updateImageSize();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateZoom(float zoom) {
    m_zoom = zoom;
    updateImageSize();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateImageSize() {
    if (!m_image.isNull()) {
        m_image = m_baseImage.scaled(m_baseImage.width() * m_zoom,
                                     m_baseImage.height() * m_zoom);
    }
    this->setGeometry(0, 0, m_image.width() + 1, m_image.height() + 1);
    setFixedSize(m_image.width() + 1, m_image.height() + 1);
    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getMousePoint(QPoint& point, QMouseEvent *event) {
    point = event->pos();
    point.setX((int)(point.x() / getSquareProportion()));
    point.setY((int)(point.y() / getSquareProportion()));
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getRectCollision(QRect& rect,
                                               const QPoint& localPoint,
                                               CollisionSquare* collision)
{
    if (collision->rect() == nullptr)
        return;

    getRect(rect, localPoint, *collision->rect());
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getRect(QRect& rect, const QPoint& localPoint,
                                      QRectF& rectBefore)
{
    rect.setX(qRound(rectBefore.x() * getSquareProportion() / 100.0) +
              (localPoint.x() * getSquareProportion()));
    rect.setY(qRound(rectBefore.y() * getSquareProportion() / 100.0) +
              (localPoint.y() * getSquareProportion()));
    rect.setWidth(qRound(rectBefore.width() *
                         getSquareProportion() / 100.0));
    rect.setHeight(qRound(rectBefore.height() *
                          getSquareProportion() / 100.0));
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getRectRepeatBot(QRect& rect) const {
    int h = qCeil(m_image.height() / static_cast<qreal>(this->getPictureRows()));
    rect.setX(0);
    rect.setY(h);
    rect.setWidth(m_image.width());
    rect.setHeight(m_image.height() - h);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getRectRepeatTop(QRect& rect) const {
    int w = qCeil(m_image.width() / ((float) RPM::get()->project()
                                     ->gameDatas()->systemDatas()
                                     ->framesAnimation()));
    rect.setX(w);
    rect.setY(0);
    rect.setWidth(m_image.width() - w);
    rect.setHeight(qCeil(m_image.height() / static_cast<qreal>(this->getPictureRows())));
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getPointsRepeat(QHash<QPoint, CollisionSquare *>&
                                              list)
{
    SystemPicture *picture = SystemPicture::getByID(m_pictureID, m_kind);
    picture->getRepeatList(m_baseImage, *picture->collisions(), list);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getBasicRect(QRect& rect,
                                           const QPoint& localPoint)
{
    rect.setX(localPoint.x() * getSquareProportion());
    rect.setY(localPoint.y() * getSquareProportion());
    rect.setWidth(getSquareProportion());
    rect.setHeight(getSquareProportion());
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::isMouseOn(QRect& rect, QPoint point,
                                        QPoint &mousePoint) const
{
    int offset = getOffset(rect);
    return mousePoint.x() >= point.x() - offset && mousePoint.x() <= point.x() +
           offset && mousePoint.y() >= point.y() - offset &&
           mousePoint.y() <= point.y() + offset;
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::isMouseOnLeft(QRect& rect,
                                            QPoint& mousePoint) const
{
    int offset = getOffset(rect);
    return mousePoint.x() >= rect.x() - offset && mousePoint.x() <= rect.x() +
           offset;
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::isMouseOnRight(QRect& rect,
                                             QPoint& mousePoint) const
{
    int offset = getOffset(rect);
    return mousePoint.x() >= rect.right() - offset && mousePoint.x() <=
           rect.right() + offset;
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::isMouseOnTop(QRect& rect,
                                           QPoint& mousePoint) const
{
    int offset = getOffset(rect);
    return mousePoint.y() >= rect.y() - offset && mousePoint.y() <= rect.y() +
           offset;
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::isMouseOnBot(QRect& rect,
                                           QPoint& mousePoint) const
{
    int offset = getOffset(rect);
    return mousePoint.y() >= rect.bottom() - offset && mousePoint.y() <=
           rect.bottom() + offset;
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateCursor(QRect& rect, QPoint& mousePoint)
{
    if (isMouseOn(rect, rect.topLeft(), mousePoint))
    {
        m_resizeKind = CollisionResizeKind::TopLeft;
        m_lastCursorShape = Qt::SizeFDiagCursor;
    }
    else if (isMouseOn(rect, rect.bottomRight(), mousePoint)) {
        m_resizeKind = CollisionResizeKind::BotRight;
        m_lastCursorShape = Qt::SizeFDiagCursor;
    }
    else if (isMouseOn(rect, rect.topRight(), mousePoint)) {
        m_resizeKind = CollisionResizeKind::TopRight;
        m_lastCursorShape = Qt::SizeBDiagCursor;
    }
    else if (isMouseOn(rect, rect.bottomLeft(), mousePoint)) {
        m_resizeKind = CollisionResizeKind::BotLeft;
        m_lastCursorShape = Qt::SizeBDiagCursor;
    }
    else if (isMouseOnLeft(rect, mousePoint)) {
        m_resizeKind = CollisionResizeKind::Left;
        m_lastCursorShape = Qt::SizeHorCursor;
    }
    else if (isMouseOnRight(rect, mousePoint)) {
        m_resizeKind = CollisionResizeKind::Right;
        m_lastCursorShape = Qt::SizeHorCursor;
    }
    else if (isMouseOnTop(rect, mousePoint)) {
        m_resizeKind = CollisionResizeKind::Top;
        m_lastCursorShape = Qt::SizeVerCursor;
    }
    else if (isMouseOnBot(rect, mousePoint)) {
        m_resizeKind = CollisionResizeKind::Bottom;
        m_lastCursorShape = Qt::SizeVerCursor;
    }
    else {
        m_resizeKind = CollisionResizeKind::None;
        m_lastCursorShape = Qt::ArrowCursor;
    }

    this->setCursor(QCursor(m_lastCursorShape));
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateRect(QRect &rect, QPoint& mousePoint,
                                         QPoint& localPoint,
                                         CollisionSquare* collision)
{
    QRect rectBasic;
    getBasicRect(rectBasic, localPoint);

    switch (m_resizeKind) {
    case CollisionResizeKind::Left:
        updateRectLeft(rect, mousePoint, rectBasic);
        break;
    case CollisionResizeKind::Right:
        updateRectRight(rect, mousePoint, rectBasic);
        break;
    case CollisionResizeKind::Top:
        updateRectTop(rect, mousePoint, rectBasic);
        break;
    case CollisionResizeKind::Bottom:
        updateRectBot(rect, mousePoint, rectBasic);
        break;
    case CollisionResizeKind::TopLeft:
        updateRectTop(rect, mousePoint, rectBasic);
        updateRectLeft(rect, mousePoint, rectBasic);
        break;
    case CollisionResizeKind::TopRight:
        updateRectTop(rect, mousePoint, rectBasic);
        updateRectRight(rect, mousePoint, rectBasic);
        break;
    case CollisionResizeKind::BotLeft:
        updateRectBot(rect, mousePoint, rectBasic);
        updateRectLeft(rect, mousePoint, rectBasic);
        break;
    case CollisionResizeKind::BotRight:
        updateRectBot(rect, mousePoint, rectBasic);
        updateRectRight(rect, mousePoint, rectBasic);
        break;
    default:
        break;
    }

    // Getting in percent
    float x = (rect.x() % (int)(getSquareProportion())) / getSquareProportion()
            * 100.0f;
    float y = (rect.y() % (int)(getSquareProportion())) / getSquareProportion()
            * 100.0f;
    float w = rect.width() / getSquareProportion() * 100.0f;
    float h = rect.height() / getSquareProportion() * 100.0f;

    // But round for adapting to the square size
    int i_x = qCeil((x / 100.0f) * RPM::get()->getSquareSize());
    int i_y = qCeil((y / 100.0f) * RPM::get()->getSquareSize());
    int i_w = qFloor((w / 100.0f) * RPM::get()->getSquareSize());
    int i_h = qFloor((h / 100.0f) * RPM::get()->getSquareSize());
    if (i_w < 1) {
        if (i_x >= RPM::get()->getSquareSize())
            i_x -= 1;
        i_w = 1;
    }
    if (i_h < 1) {
        if (i_y >= RPM::get()->getSquareSize())
            i_y -= 1;
        i_h = 1;
    }

    // Update collision rect with rounded values
    collision->rect()->setX((i_x / (float) RPM::get()->getSquareSize()) *
                            100.0f);
    collision->rect()->setY((i_y / (float) RPM::get()->getSquareSize()) *
                            100.0f);
    collision->rect()->setWidth((i_w / (float) RPM::get()->getSquareSize()) *
                                100.0f);
    collision->rect()->setHeight((i_h / (float) RPM::get()->getSquareSize()) *
                                 100.0f);

    // Update the fake rect (no rounded values)
    m_fakeRect = QRectF(x, y, w, h);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateRectLeft(QRect &rect, QPoint& mousePoint,
                                             QRect& rectBasic)
{
    int value = getRectValue(mousePoint.x(), rectBasic.left(), rect.right());
    rect.setLeft(value);
    if (rect.width() == 1)
        rect.setLeft(rect.left() - 1);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateRectRight(QRect &rect, QPoint& mousePoint,
                                              QRect& rectBasic)
{
    int value = getRectValue(mousePoint.x(), rect.left(), rectBasic.right());
    rect.setRight(value);
    if (rect.width() == 1)
        rect.setRight(rect.right() + 1);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateRectTop(QRect &rect, QPoint& mousePoint,
                                            QRect& rectBasic)
{
    int value = getRectValue(mousePoint.y(), rectBasic.top(), rect.bottom());
    rect.setTop(value);
    if (rect.height() == 1)
        rect.setTop(rect.top() - 1);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::updateRectBot(QRect &rect, QPoint& mousePoint,
                                            QRect& rectBasic)
{
    int value = getRectValue(mousePoint.y(), rect.top(), rectBasic.bottom());
    rect.setBottom(value);
    if (rect.height() == 1)
        rect.setBottom(rect.bottom() + 1);
}

// -------------------------------------------------------

int WidgetTilesetPraticable::getRectValue(int mousePos, int left, int right) {
    int value = mousePos;
    if (value < left)
        value = left;
    else if (value > right)
        value = right;

    return value;
}

// -------------------------------------------------------

void WidgetTilesetPraticable::drawCollision(
        QPainter& painter, const QPoint &localPoint, CollisionSquare* collision,
        const QColor &color, bool outline)
{
    QRect rect;
    QPen pen(painter.pen().color(), 2, Qt::DashLine);
    painter.setPen(pen);
    getRectCollision(rect, localPoint, collision);
    painter.fillRect(rect, color);
    if (outline)
        painter.drawRect(rect);
}

// -------------------------------------------------------

int WidgetTilesetPraticable::getOffset(QRect& rect) const {
    return (rect.width() < (OFFSET * 2) || rect.height() < (OFFSET * 2)) ?
           0 : OFFSET;
}

// -------------------------------------------------------

void WidgetTilesetPraticable::editCollision() {
    DialogRect dialog(m_selectedCollision->rect(), this);
    QRect rect;
    getRectCollision(rect, m_selectedPoint, m_selectedCollision);
    QPoint point = this->mapToGlobal(
                QPoint(rect.x() + getSquareProportion(),
                       rect.y() + getSquareProportion()));
    dialog.setGeometry(point.x(), point.y(), dialog.width(), dialog.height());
    dialog.exec();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::deleteCollision() {
    m_selectedCollision->setRect(nullptr);
    if (m_selectedCollision->checkStillExisting(m_selectedPoint, m_pictureID, m_kind)) {
        m_selectedCollision = nullptr;
        m_selectedPoint = QPoint(-1, -1);
    }
}

// -------------------------------------------------------

float WidgetTilesetPraticable::getSquareProportion() const {
    return RPM::get()->getSquareSize() * m_zoom;
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::canDraw(QPoint& mousePoint) const {
    QRect rectBot, rectTop;
    getRectRepeatBot(rectBot);
    getRectRepeatTop(rectTop);

    return (!SystemPicture::getByID(m_pictureID, m_kind)->repeatCollisions() ||
        (!rectBot.contains(mousePoint) && !rectTop.contains(mousePoint)));
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetPraticable::keyPressEvent(QKeyEvent *event){
    QKeySequence seq = Common::getKeySequence(event);
    QList<QAction*> actions = m_contextMenu->actions();
    QAction* action;

    // Forcing shortcuts
    action = actions.at(0);
    if (Common::isPressingEnter(event) && action->isEnabled()) {
        contextEdit();
        return;
    }
    action = actions.at(2);
    if (action->shortcut().matches(seq) && action->isEnabled()) {
        contextDelete();
        return;
    }
}

// -------------------------------------------------------

void WidgetTilesetPraticable::mousePressEvent(QMouseEvent *event) {
    QPoint mousePoint = event->pos();
    if (canDraw(mousePoint)) {
        QPoint point;

        getMousePoint(point, event);

        // Update collisions
        QHash<QPoint, CollisionSquare*>* squares = SystemPicture::getByID(
            m_pictureID, m_kind)->collisions();
        CollisionSquare* collision = squares->value(point);
        if (collision == nullptr) {
            collision = new CollisionSquare;
            collision->setDefaultPraticable();
            squares->insert(point, collision);
            m_isCreating = true;
        }
        else if (collision->rect() == nullptr) {
            collision->setDefaultPraticable();
            m_isCreating = true;
        }

        // Update selected collision
        m_selectedPoint = point;
        m_selectedCollision = collision;

        m_firstResize = true;

        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetTilesetPraticable::mouseMoveEvent(QMouseEvent *event) {
    if (m_isCreating)
        return;

    QRect rect;
    QPoint mousePoint = event->pos();
    QPoint point;
    getMousePoint(point, event);

    if (canDraw(mousePoint)) {
        if (event->buttons() == Qt::MouseButton::LeftButton &&
            m_selectedCollision != nullptr)
        {
            if (m_firstResize) {
                m_fakeRect = *m_selectedCollision->rect();
            }
            getRect(rect, m_selectedPoint, m_fakeRect);
            updateRect(rect, mousePoint, m_selectedPoint, m_selectedCollision);
            this->setCursor(QCursor(m_lastCursorShape));
        }
        else {
            CollisionSquare* collision = SystemPicture::getByID(m_pictureID,
                m_kind)->collisions()->value(point);
            if (collision == nullptr) {
                this->setCursor(QCursor(Qt::ArrowCursor));
                m_lastCursorShape = Qt::ArrowCursor;
            }
            else {
                getRectCollision(rect, point, collision);
                updateCursor(rect, mousePoint);
            }
            m_hoveredPoint = point;
        }
    }
    else
        this->setCursor(QCursor(Qt::ForbiddenCursor));

    m_firstResize = false;

    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::mouseReleaseEvent(QMouseEvent*) {
    m_isCreating = false;
}

// -------------------------------------------------------

void WidgetTilesetPraticable::paintEvent(QPaintEvent *){
    QPainter painter(this);
    SystemPicture *picture = SystemPicture::getByID(m_pictureID, m_kind);
    QHash<QPoint, CollisionSquare*>* squares = picture->collisions();

    // Draw background
    painter.fillRect(0, 0, m_image.width(), m_image.height(),
                     RPM::COLOR_ALMOST_TRANSPARENT);

    // Draw image
    if (!m_image.isNull()) {
        painter.drawImage(0, 0, m_image);
    }

    if (squares == nullptr)
        return;

    // Draw all the collisions
    painter.setPen(RPM::get()->engineSettings()->theme() == ThemeKind::Dark ?
        RPM::COLOR_ALMOST_WHITE : RPM::COLOR_FORTY_TRANSPARENT);
    for (QHash<QPoint, CollisionSquare*>::iterator i = squares->begin();
         i != squares->end(); i++)
    {
        drawCollision(painter, i.key(), i.value(),
                      RPM::COLOR_FORTY_TRANSPARENT);
    }

    // Draw another layer for the selected collision
    CollisionSquare* collision = squares->value(m_selectedPoint);
    if (collision != nullptr) {
        painter.setPen(RPM::COLOR_PURPLE_SELECTION);
        drawCollision(painter, m_selectedPoint, collision,
                      RPM::COLOR_PURPLE_SELCTION_BACKGROUND);
    }

    // Draw hovered layer
    collision = squares->value(m_hoveredPoint);
    if (collision != nullptr) {
        drawCollision(painter, m_hoveredPoint, collision,
                      RPM::COLOR_GRAY_HOVER_BACKGROUND, false);
    }

    // For repeat option :
    if (picture->repeatCollisions()) {
        QRect rect;
        getRectRepeatBot(rect);
        painter.fillRect(rect, RPM::COLOR_FORTY_TRANSPARENT);
        getRectRepeatTop(rect);
        painter.fillRect(rect, RPM::COLOR_FORTY_TRANSPARENT);
        QHash<QPoint, CollisionSquare*> list;
        getPointsRepeat(list);
        for (QHash<QPoint, CollisionSquare*>::iterator i = list.begin();
             i != list.end(); i++)
        {
            drawCollision(painter, i.key(), i.value(),
                          RPM::COLOR_FORTY_TRANSPARENT, true);
        }
    }
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------

void WidgetTilesetPraticable::showContextMenu(const QPoint& p) {
    if (m_selectedCollision != nullptr &&m_selectedCollision->rect() != nullptr)
        m_contextMenu->showContextMenu(p);
}

// -------------------------------------------------------

void WidgetTilesetPraticable::contextEdit() {
    if (m_selectedCollision != nullptr &&m_selectedCollision->rect() != nullptr)
        editCollision();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::contextDelete() {
    if (m_selectedCollision != nullptr &&m_selectedCollision->rect() != nullptr)
        deleteCollision();
}
