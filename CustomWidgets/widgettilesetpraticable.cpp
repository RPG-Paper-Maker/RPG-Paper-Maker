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

#include "widgettilesetpraticable.h"
#include "wanok.h"
#include <QPainter>

const int WidgetTilesetPraticable::OFFSET = 5;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetPraticable::WidgetTilesetPraticable(QWidget *parent) :
    QWidget(parent),
    m_squares(nullptr),
    m_selectedPoint(-1, -1),
    m_hoveredPoint(-1, -1),
    m_resizeKind(CollisionResizeKind::None),
    m_selectedCollision(nullptr)
{
    this->setMouseTracking(true);
}

void WidgetTilesetPraticable::setSquares(QHash<QPoint, CollisionSquare*>*
                                         squares)
{
    m_squares = squares;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetPraticable::updateImage(SystemPicture* picture,
                                          PictureKind kind)
{
    m_image = QImage(picture->getPath(kind));
    if (!m_image.isNull()) {
        m_image = m_image.scaled(m_image.width() / Wanok::coefSquareSize(),
                                 m_image.height() / Wanok::coefSquareSize());
    }
    this->setGeometry(0, 0, m_image.width() + 1, m_image.height() + 1);
    setFixedSize(m_image.width() + 1, m_image.height() + 1);
    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getMousePoint(QPoint& point, QMouseEvent *event) {
    point = event->pos();
    point.setX((int)(point.x() / ((float) Wanok::BASIC_SQUARE_SIZE)));
    point.setY((int)(point.y() / ((float) Wanok::BASIC_SQUARE_SIZE)));
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getRect(QRect& rect, const QPoint& localPoint,
                                      CollisionSquare* collision)
{
    QRect rectBefore = *collision->rect();
    rect.setX(rectBefore.x() + (localPoint.x() * Wanok::BASIC_SQUARE_SIZE));
    rect.setY(rectBefore.y() + (localPoint.y() * Wanok::BASIC_SQUARE_SIZE));
    rect.setWidth(rectBefore.width());
    rect.setHeight(rectBefore.height());
}

// -------------------------------------------------------

void WidgetTilesetPraticable::getBasicRect(QRect& rect,
                                           const QPoint& localPoint)
{
    rect.setX(localPoint.x() * Wanok::BASIC_SQUARE_SIZE);
    rect.setY(localPoint.y() * Wanok::BASIC_SQUARE_SIZE);
    rect.setWidth(Wanok::BASIC_SQUARE_SIZE);
    rect.setHeight(Wanok::BASIC_SQUARE_SIZE);
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
        this->setCursor(QCursor(Qt::SizeFDiagCursor));
    }
    else if (isMouseOn(rect, rect.bottomRight(), mousePoint)) {
        m_resizeKind = CollisionResizeKind::BotRight;
        this->setCursor(QCursor(Qt::SizeFDiagCursor));
    }
    else if (isMouseOn(rect, rect.topRight(), mousePoint)) {
        m_resizeKind = CollisionResizeKind::TopRight;
        this->setCursor(QCursor(Qt::SizeBDiagCursor));
    }
    else if (isMouseOn(rect, rect.bottomLeft(), mousePoint)) {
        m_resizeKind = CollisionResizeKind::BotLeft;
        this->setCursor(QCursor(Qt::SizeBDiagCursor));
    }
    else if (isMouseOnLeft(rect, mousePoint)) {
        m_resizeKind = CollisionResizeKind::Left;
        this->setCursor(QCursor(Qt::SizeHorCursor));
    }
    else if (isMouseOnRight(rect, mousePoint)) {
        m_resizeKind = CollisionResizeKind::Right;
        this->setCursor(QCursor(Qt::SizeHorCursor));
    }
    else if (isMouseOnTop(rect, mousePoint)) {
        m_resizeKind = CollisionResizeKind::Top;
        this->setCursor(QCursor(Qt::SizeVerCursor));
    }
    else if (isMouseOnBot(rect, mousePoint)) {
        m_resizeKind = CollisionResizeKind::Bottom;
        this->setCursor(QCursor(Qt::SizeVerCursor));
    }
    else {
        m_resizeKind = CollisionResizeKind::None;
        this->setCursor(QCursor(Qt::ArrowCursor));
    }
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

    collision->rect()->setX(rect.x() % Wanok::BASIC_SQUARE_SIZE);
    collision->rect()->setY(rect.y() % Wanok::BASIC_SQUARE_SIZE);
    collision->rect()->setWidth(rect.width());
    collision->rect()->setHeight(rect.height());
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
    getRect(rect, localPoint, collision);
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
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetPraticable::mousePressEvent(QMouseEvent *event) {
    QPoint point;
    getMousePoint(point, event);

    // Update collisions
    CollisionSquare* collision = m_squares->value(point);
    if (collision == nullptr) {
        collision = new CollisionSquare;
        m_squares->insert(point, collision);
    }

    // Update selected collision
    m_selectedPoint = point;
    m_selectedCollision = collision;

    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::mouseMoveEvent(QMouseEvent *event) {
    QRect rect;
    QPoint mousePoint = event->pos();
    QPoint point;
    getMousePoint(point, event);

    if (event->buttons() == Qt::MouseButton::LeftButton &&
        m_selectedCollision != nullptr)
    {
        getRect(rect, m_selectedPoint, m_selectedCollision);
        updateRect(rect, mousePoint, m_selectedPoint, m_selectedCollision);
    }
    else {
        CollisionSquare* collision = m_squares->value(point);
        if (collision == nullptr)
            this->setCursor(QCursor(Qt::ArrowCursor));
        else {
            getRect(rect, point, collision);
            updateCursor(rect, mousePoint);
        }
        m_hoveredPoint = point;
    }

    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::paintEvent(QPaintEvent *){
    QPainter painter(this);

    // Draw background
    painter.fillRect(0, 0, m_image.width(), m_image.height(), Qt::white);

    // Draw image
    painter.drawImage(0, 0, m_image);

    if (m_squares == nullptr)
        return;

    // Draw all the collisions
    painter.setPen(Wanok::colorRedSelection);
    for (QHash<QPoint, CollisionSquare*>::iterator i = m_squares->begin();
         i != m_squares->end(); i++)
    {
        drawCollision(painter, i.key(), i.value(),
                      Wanok::colorRedSelectionBackground);
    }

    // Draw another layer for the selected collision
    CollisionSquare* collision = m_squares->value(m_selectedPoint);
    if (collision != nullptr) {
        painter.setPen(Wanok::colorBlueSelection);
        drawCollision(painter, m_selectedPoint, collision,
                      Wanok::colorBlueSelectionBackground);
    }

    // Draw hovered layer
    collision = m_squares->value(m_hoveredPoint);
    if (collision != nullptr) {
        drawCollision(painter, m_hoveredPoint, collision,
                      Wanok::colorGrayHoverBackground, false);
    }
}
