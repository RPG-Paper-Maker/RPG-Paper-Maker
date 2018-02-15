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
    m_imageArrowHover(":/icons/Ressources/direction_hover.png"),
    m_squares(nullptr),
    m_hoveredPoint(-1, -1),
    m_hoveredLeft(-1, -1),
    m_hoveredRight(-1, -1),
    m_hoveredTop(-1, -1),
    m_hoveredBot(-1, -1)
{
    this->setMouseTracking(true);
    m_imageArrow = m_imageArrow.scaled(m_imageArrow.width() * 2,
                                       m_imageArrow.height() * 2);
    m_imageArrowHover = m_imageArrowHover.scaled(m_imageArrowHover.width()*2,
                                                 m_imageArrowHover.height()*2);
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

void WidgetTilesetDirection::getMousePoint(QPoint& point, QMouseEvent *event) {
    point = event->pos();
    point.setX((int)(point.x() / ((float) Wanok::BASIC_SQUARE_SIZE)));
    point.setY((int)(point.y() / ((float) Wanok::BASIC_SQUARE_SIZE)));
}

// -------------------------------------------------------


void WidgetTilesetDirection::getCenterRect(QRect& rect, int i, int j) {
    rect.setX((i * Wanok::BASIC_SQUARE_SIZE) + (Wanok::BASIC_SQUARE_SIZE / 2)
              - 3);
    rect.setY((j * Wanok::BASIC_SQUARE_SIZE) + (Wanok::BASIC_SQUARE_SIZE / 2)
              - 3);
    rect.setWidth(5);
    rect.setHeight(5);
}

// -------------------------------------------------------

bool WidgetTilesetDirection::isInsideRect(int dx, int dy, int x, int y,
                                          QPoint& mousePoint) const
{
    QRect rect((Wanok::BASIC_SQUARE_SIZE / 2) + dx + x - 3,
               (Wanok::BASIC_SQUARE_SIZE / 2) + dy + y - 3, 8, 8);
    return rect.contains(mousePoint);
}

// -------------------------------------------------------

void WidgetTilesetDirection::updateHovered(QPoint& hovered, QPoint& point,
                                           int dx, int dy, int x, int y,
                                           QPoint& mousePoint)
{
    if (isInsideRect(dx, dy, x, y, mousePoint))
        hovered = point;
    else
        hovered = QPoint(-1, -1);
}

// -------------------------------------------------------

CollisionSquare* WidgetTilesetDirection::activateHovered(QPoint& hovered) {
    if (hovered.x() != -1 && hovered.y() != -1) {
        CollisionSquare* collision = m_squares->value(hovered);
        if (collision == nullptr) {
            collision = new CollisionSquare;
            m_squares->insert(hovered, collision);
        }
        return collision;
    }

    return nullptr;
}

// -------------------------------------------------------

void WidgetTilesetDirection::checkStillExisting(QPoint& hovered,
                                                CollisionSquare* collision)
{
    if (collision->hasAllDirections() && collision->rect() == nullptr) {
        delete collision;
        m_squares->remove(hovered);
    }
}

// -------------------------------------------------------

void WidgetTilesetDirection::drawArrow(QPainter &painter, QPoint& hoveredPoint,
                                       bool arrow, int angle, int dx, int dy,
                                       int i, int j)
{
    int x = i * Wanok::BASIC_SQUARE_SIZE;
    int y = j * Wanok::BASIC_SQUARE_SIZE;
    int posX = (Wanok::BASIC_SQUARE_SIZE / 2) + dx + x;
    int posY = (Wanok::BASIC_SQUARE_SIZE / 2) + dy + y;
    if (arrow) {
        QTransform transform;
        transform.translate(posX, posY);
        transform.rotate(angle);
        transform.translate(-m_imageArrow.width() / 2,
                            -m_imageArrow.height() / 2);
        painter.setTransform(transform);
        if (hoveredPoint.x() == i && hoveredPoint.y() == j)
            painter.drawImage(0, 0, m_imageArrowHover);
        else
            painter.drawImage(0, 0, m_imageArrow);
    }
    else {
        QTransform transform;
        painter.setTransform(transform);
        QRect rect(posX - 3, posY - 3, 5, 5);
        if (hoveredPoint.x() == i && hoveredPoint.y() == j)
            painter.fillRect(rect, Wanok::colorGrayHoverBackground);
        painter.drawRect(rect);
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetDirection::mousePressEvent(QMouseEvent*) {
    CollisionSquare* collision = nullptr;
    collision = activateHovered(m_hoveredPoint);
    if (collision != nullptr) {
        collision->revertAllDirections();
        checkStillExisting(m_hoveredPoint, collision);
    }
    collision = activateHovered(m_hoveredTop);
    if (collision != nullptr) {
        collision->revertTop();
        checkStillExisting(m_hoveredTop, collision);
    }
    collision = activateHovered(m_hoveredRight);
    if (collision != nullptr) {
        collision->revertRight();
        checkStillExisting(m_hoveredRight, collision);
    }
    collision = activateHovered(m_hoveredBot);
    if (collision != nullptr) {
        collision->revertBot();
        checkStillExisting(m_hoveredBot, collision);
    }
    collision = activateHovered(m_hoveredLeft);
    if (collision != nullptr) {
        collision->revertLeft();
        checkStillExisting(m_hoveredLeft, collision);
    }

    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetDirection::mouseMoveEvent(QMouseEvent *event) {
    QPoint point;
    QPoint mousePoint = event->pos();
    getMousePoint(point, event);
    int x = point.x() * Wanok::BASIC_SQUARE_SIZE;
    int y = point.y() * Wanok::BASIC_SQUARE_SIZE;

    updateHovered(m_hoveredPoint, point, 0, 0, x, y, mousePoint);
    updateHovered(m_hoveredTop, point, 0, -10, x, y, mousePoint);
    updateHovered(m_hoveredRight, point, 10, 0, x, y, mousePoint);
    updateHovered(m_hoveredBot, point, 0, 10, x, y, mousePoint);
    updateHovered(m_hoveredLeft, point, -10, 0, x, y, mousePoint);

    this->repaint();
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

            // Get collision setting
            CollisionSquare* collision = m_squares->value(QPoint(i, j));
            bool left = true, right = true, top = true, bot = true;
            if (collision != nullptr) {
                left = collision->left();
                right = collision->right();
                top = collision->top();
                bot = collision->bot();
            }

            // Draw side arrows
            drawArrow(painter, m_hoveredTop, top, 0, 0, -10, i, j);
            drawArrow(painter, m_hoveredRight, right, 90, 10, 0, i, j);
            drawArrow(painter, m_hoveredBot, bot, 180, 0, 10, i, j);
            drawArrow(painter, m_hoveredLeft, left, 270, -10, 0, i, j);

            // Draw center rect
            QTransform transform;
            painter.setTransform(transform);
            QRect rect;
            getCenterRect(rect, i, j);
            if (m_hoveredPoint.x() == i && m_hoveredPoint.y() == j)
                painter.fillRect(rect, Wanok::colorGrayHoverBackground);
            painter.drawRect(rect);
        }
    }
}
