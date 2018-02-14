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

#include "widgettilesetdirection.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetDirection::WidgetTilesetDirection(QWidget *parent) :
    QWidget(parent),
    m_imageArrow(":/icons/Ressources/direction.png"),
    m_squares(nullptr)
{
    m_imageArrow = m_imageArrow.scaled(m_imageArrow.width() * 2,
                                       m_imageArrow.height() * 2);
}

void WidgetTilesetDirection::setSquares(QHash<QPoint, CollisionSquare*>*squares)
{
    m_squares = squares;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetDirection::updateImage(SystemPicture* picture,
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

void WidgetTilesetDirection::drawArrow(QPainter &painter, int angle, int dx,
                                       int dy, int x, int y)
{
    QTransform transform;

    transform.translate((Wanok::BASIC_SQUARE_SIZE / 2) + dx + x,
                        (Wanok::BASIC_SQUARE_SIZE / 2) + dy + y);
    transform.rotate(angle);
    transform.translate(-m_imageArrow.width() / 2, -m_imageArrow.height() / 2);

    painter.setTransform(transform);
    painter.drawImage(0, 0, m_imageArrow);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetDirection::mousePressEvent(QMouseEvent *event) {

}

// -------------------------------------------------------

void WidgetTilesetDirection::paintEvent(QPaintEvent *){
    QPainter painter(this);

    // Draw image
    painter.drawImage(0, 0, m_image);

    if (m_squares == nullptr)
        return;

    // Draw arrows
    painter.setPen(Wanok::colorGrey);
    for (int i = 0; i < m_image.width() / Wanok::BASIC_SQUARE_SIZE; i++) {
        for (int j = 0; j < m_image.height() / Wanok::BASIC_SQUARE_SIZE; j++) {
            int x = i * Wanok::BASIC_SQUARE_SIZE;
            int y = j * Wanok::BASIC_SQUARE_SIZE;

            // Draw side arrows
            drawArrow(painter, 0, 0, -10, x, y);
            drawArrow(painter, 90, 10, 0, x, y);
            drawArrow(painter, 180, 0, 10, x, y);
            drawArrow(painter, 270, -10, 0, x, y);

            // Draw center rect
            QTransform transform;
            painter.setTransform(transform);
            painter.drawRect(x + (Wanok::BASIC_SQUARE_SIZE / 2) - 3,
                             y + (Wanok::BASIC_SQUARE_SIZE / 2) - 3, 5, 5);
        }
    }
}
