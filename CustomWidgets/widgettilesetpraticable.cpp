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
    QWidget(parent)
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

void WidgetTilesetPraticable::getRect(QRect& rect, QPoint& localPoint,
                                      CollisionSquare* collision)
{
    QRect rectBefore = *collision->rect();
    rect.setX(rectBefore.x() + (localPoint.x() * Wanok::BASIC_SQUARE_SIZE));
    rect.setY(rectBefore.y() + (localPoint.y() * Wanok::BASIC_SQUARE_SIZE));
    rect.setWidth(rectBefore.width());
    rect.setHeight(rectBefore.height());
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::isMouseOn(QPoint point, QPoint &mousePoint) const{
    return mousePoint.x() >= point.x() - OFFSET && mousePoint.x() <= point.x() +
           OFFSET && mousePoint.y() >= point.y() - OFFSET &&
           mousePoint.y() <= point.y() + OFFSET;
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::isMouseOnVertical(QRect& rect,
                                                QPoint& mousePoint) const
{
    return (mousePoint.x() >= rect.x() - OFFSET && mousePoint.x() <= rect.x() +
           OFFSET) || (mousePoint.x() >= rect.right() - OFFSET &&
           mousePoint.x() <= rect.right() + OFFSET);
}

// -------------------------------------------------------

bool WidgetTilesetPraticable::isMouseOnHorizontal(QRect& rect,
                                                  QPoint& mousePoint) const
{
    return (mousePoint.y() >= rect.y() - OFFSET && mousePoint.y() <= rect.y() +
           OFFSET) || (mousePoint.y() >= rect.bottom() - OFFSET &&
           mousePoint.y() <= rect.bottom() + OFFSET);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetPraticable::mousePressEvent(QMouseEvent *event) {
    QPoint point;
    getMousePoint(point, event);

    CollisionSquare* collision = m_squares->value(point);
    if (collision == nullptr) {
        collision = new CollisionSquare;
        m_squares->insert(point, collision);
    }

    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetPraticable::mouseMoveEvent(QMouseEvent *event) {
    QPoint point;
    getMousePoint(point, event);

    CollisionSquare* collision = m_squares->value(point);
    if (collision == nullptr)
        this->setCursor(QCursor(Qt::ArrowCursor));
    else {
        QRect rect;
        getRect(rect, point, collision);
        QPoint mousePoint = event->pos();
        if (isMouseOn(rect.topLeft(), mousePoint) ||
            isMouseOn(rect.bottomRight(), mousePoint))
            this->setCursor(QCursor(Qt::SizeFDiagCursor));
        else if (isMouseOn(rect.topRight(), mousePoint) ||
                 isMouseOn(rect.bottomLeft(), mousePoint))
            this->setCursor(QCursor(Qt::SizeBDiagCursor));
        else if (isMouseOnVertical(rect, mousePoint))
            this->setCursor(QCursor(Qt::SizeHorCursor));
        else if (isMouseOnHorizontal(rect, mousePoint))
            this->setCursor(QCursor(Qt::SizeVerCursor));
        else
            this->setCursor(QCursor(Qt::ArrowCursor));
    }
}

// -------------------------------------------------------

void WidgetTilesetPraticable::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.drawImage(0, 0, m_image);

    if (m_squares == nullptr)
        return;

    painter.setPen(Wanok::colorRedSelection);
    for (QHash<QPoint, CollisionSquare*>::iterator i = m_squares->begin();
         i != m_squares->end(); i++)
    {
        QPoint localPoint = i.key();
        QRect rect;
        getRect(rect, localPoint, i.value());
        painter.fillRect(rect, Wanok::colorRedSelectionBackground);
        painter.drawRect(rect);
    }
}
