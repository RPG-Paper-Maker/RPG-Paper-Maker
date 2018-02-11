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

void WidgetTilesetPraticable::getMousePoint(QPoint& point, QMouseEvent *event) {
    point = event->pos();
    point.setX((int)(point.x() / ((float) Wanok::BASIC_SQUARE_SIZE)));
    point.setY((int)(point.y() / ((float) Wanok::BASIC_SQUARE_SIZE)));
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
    else
        this->setCursor(QCursor(Qt::SizeHorCursor));
}

// -------------------------------------------------------

void WidgetTilesetPraticable::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.drawImage(0, 0, m_image);

    painter.setPen(Wanok::colorRedSelection);
    for (QHash<QPoint, CollisionSquare*>::iterator i = m_squares->begin();
         i != m_squares->end(); i++)
    {
        QPoint localPoint = i.key();
        QRect rectBefore = *i.value()->rect();
        QRect rect(rectBefore.x() + (localPoint.x() * Wanok::BASIC_SQUARE_SIZE),
                   rectBefore.y() + (localPoint.y() * Wanok::BASIC_SQUARE_SIZE),
                   rectBefore.width(), rectBefore.height());
        painter.fillRect(rect, Wanok::colorRedSelectionBackground);
        painter.drawRect(rect);
    }
}
