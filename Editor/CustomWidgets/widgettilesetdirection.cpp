/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettilesetdirection.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetDirection::WidgetTilesetDirection(QWidget *parent) :
    QWidget(parent),
    m_imageArrow(":/icons/Ressources/direction.png"),
    m_imageArrowHover(":/icons/Ressources/direction_hover.png"),
    m_pictureID(-1),
    m_kind(PictureKind::Tilesets),
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

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetDirection::updateImage(SystemPicture* picture,
                                          PictureKind kind)
{
    QString path = picture->getPath(kind);
    m_image = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    m_pictureID = picture->id();
    m_kind = kind;
    updateImageGeneral();
}

void WidgetTilesetDirection::updateImageSpecial(QImage& editedImage,
    SystemPicture* picture, PictureKind kind)
{
    m_image = editedImage;
    m_pictureID = picture->id();
    m_kind = kind;
    updateImageGeneral();
}

// -------------------------------------------------------

void WidgetTilesetDirection::updateImageGeneral()
{
    if (!m_image.isNull()) {
        m_image = m_image.scaled(m_image.width() / RPM::coefSquareSize(),
                                 m_image.height() / RPM::coefSquareSize());
    }
    this->setGeometry(0, 0, m_image.width() + 1, m_image.height() + 1);
    setFixedSize(m_image.width() + 1, m_image.height() + 1);
    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetDirection::getMousePoint(QPoint& point, QMouseEvent *event) {
    point = event->pos();
    point.setX((int)(point.x() / ((float) RPM::BASIC_SQUARE_SIZE)));
    point.setY((int)(point.y() / ((float) RPM::BASIC_SQUARE_SIZE)));
}

// -------------------------------------------------------


void WidgetTilesetDirection::getCenterRect(QRect& rect, int i, int j) {
    rect.setX((i * RPM::BASIC_SQUARE_SIZE) + (RPM::BASIC_SQUARE_SIZE / 2)
              - 3);
    rect.setY((j * RPM::BASIC_SQUARE_SIZE) + (RPM::BASIC_SQUARE_SIZE / 2)
              - 3);
    rect.setWidth(5);
    rect.setHeight(5);
}

// -------------------------------------------------------

bool WidgetTilesetDirection::isInsideRect(int dx, int dy, int x, int y,
                                          QPoint& mousePoint) const
{
    QRect rect((RPM::BASIC_SQUARE_SIZE / 2) + dx + x - 3,
               (RPM::BASIC_SQUARE_SIZE / 2) + dy + y - 3, 8, 8);
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
        QHash<QPoint, CollisionSquare*>* squares = SystemPicture::getByID(
            m_pictureID, m_kind)->collisions();
        CollisionSquare* collision = squares->value(hovered);
        if (collision == nullptr) {
            collision = new CollisionSquare;
            squares->insert(hovered, collision);
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
        SystemPicture::getByID(m_pictureID, m_kind)->collisions()->remove(hovered);
    }
}

// -------------------------------------------------------

void WidgetTilesetDirection::drawArrow(QPainter &painter, QPoint& hoveredPoint,
                                       bool arrow, int angle, int dx, int dy,
                                       int i, int j)
{
    int x = i * RPM::BASIC_SQUARE_SIZE;
    int y = j * RPM::BASIC_SQUARE_SIZE;
    int posX = (RPM::BASIC_SQUARE_SIZE / 2) + dx + x;
    int posY = (RPM::BASIC_SQUARE_SIZE / 2) + dy + y;
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
            painter.fillRect(rect, RPM::COLOR_GRAY_HOVER_BACKGROUND);
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
    int x = point.x() * RPM::BASIC_SQUARE_SIZE;
    int y = point.y() * RPM::BASIC_SQUARE_SIZE;

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
    QHash<QPoint, CollisionSquare*>* squares = SystemPicture::getByID(
        m_pictureID, m_kind)->collisions();

    // Draw image
    if (!m_image.isNull()) {
        painter.drawImage(0, 0, m_image);
    }

    if (squares == nullptr)
        return;

    // Draw arrows
    painter.setPen(RPM::COLOR_GREY);
    for (int i = 0; i < m_image.width() / RPM::BASIC_SQUARE_SIZE; i++) {
        for (int j = 0; j < m_image.height() / RPM::BASIC_SQUARE_SIZE; j++) {

            // Get collision setting
            CollisionSquare* collision = squares->value(QPoint(i, j));
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
                painter.fillRect(rect, RPM::COLOR_GRAY_HOVER_BACKGROUND);
            painter.drawRect(rect);
        }
    }
}
