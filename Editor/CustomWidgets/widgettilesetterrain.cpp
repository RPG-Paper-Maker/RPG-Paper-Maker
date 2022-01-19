/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettilesetterrain.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetTerrain::WidgetTilesetTerrain(QWidget *parent) :
    QWidget(parent),
    m_pictureID(-1),
    m_kind(PictureKind::Tilesets)
{
    this->setMouseTracking(true);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetTerrain::updateImage(SystemPicture *picture, PictureKind kind)
{
    QString path = picture->getPath();
    m_image = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) : QImage();
    m_pictureID = picture->id();
    m_kind = kind;
    this->updateImageGeneral();
}

// -------------------------------------------------------

void WidgetTilesetTerrain::updateImageSpecial(QImage &editedImage, SystemPicture
    *picture, PictureKind kind)
{
    m_image = editedImage;
    m_pictureID = picture->id();
    m_kind = kind;
    this->updateImageGeneral();
}

// -------------------------------------------------------

void WidgetTilesetTerrain::updateImageGeneral()
{
    if (!m_image.isNull())
    {
        m_image = m_image.scaled(m_image.width() / RPM::coefSquareSize(),
            m_image.height() / RPM::coefSquareSize());
    }
    this->setGeometry(0, 0, m_image.width() + 1, m_image.height() + 1);
    this->setFixedSize(m_image.width() + 1, m_image.height() + 1);
    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetTerrain::getMousePoint(QPoint &point, QMouseEvent *event)
{
    point = event->pos();
    point.setX((int)(point.x() / ((float) RPM::BASIC_SQUARE_SIZE)));
    point.setY((int)(point.y() / ((float) RPM::BASIC_SQUARE_SIZE)));
}

// -------------------------------------------------------

void WidgetTilesetTerrain::getCenterRect(QRect &rect, int i, int j)
{
    rect.setX((i * RPM::BASIC_SQUARE_SIZE) + (RPM::BASIC_SQUARE_SIZE / 2) - 3);
    rect.setY((j * RPM::BASIC_SQUARE_SIZE) + (RPM::BASIC_SQUARE_SIZE / 2) - 3);
    rect.setWidth(5);
    rect.setHeight(5);
}

// -------------------------------------------------------

bool WidgetTilesetTerrain::isInsideRect(int dx, int dy, int x, int y, QPoint
    &mousePoint) const
{
    QRect rect((RPM::BASIC_SQUARE_SIZE / 2) + dx + x - 3, (RPM::BASIC_SQUARE_SIZE
        / 2) + dy + y - 3, 8, 8);
    return rect.contains(mousePoint);
}

// -------------------------------------------------------

void WidgetTilesetTerrain::updateHovered(QPoint &hovered, QPoint &point, int dx,
    int dy, int x, int y, QPoint &mousePoint)
{
    hovered = this->isInsideRect(dx, dy, x, y, mousePoint) ? point : QPoint(-1, -1);
}

// -------------------------------------------------------

CollisionSquare * WidgetTilesetTerrain::activateHovered(QPoint& hovered) {
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

void WidgetTilesetTerrain::checkStillExisting(QPoint& hovered,
                                                CollisionSquare* collision)
{
    if (collision->hasAllDirections() && collision->rect() == nullptr) {
        delete collision;
        SystemPicture::getByID(m_pictureID, m_kind)->collisions()->remove(hovered);
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetTerrain::mousePressEvent(QMouseEvent *event)
{
    QPoint point;
    this->getMousePoint(point, event);
    if (point.x() != -1 && point.y() != -1)
    {
        QHash<QPoint, CollisionSquare*> *squares = SystemPicture::getByID(
            m_pictureID, m_kind)->collisions();
        CollisionSquare *collision = squares->value(point);
        if (collision == nullptr)
        {
            collision = new CollisionSquare;
            squares->insert(point, collision);
        }
        if (event->button() == Qt::MouseButton::LeftButton)
        {
            collision->increaseTerrain();
        } else if (event->button() == Qt::MouseButton::RightButton)
        {
            collision->decreaseTerrain();
        }
    }
    this->repaint();
}

// -------------------------------------------------------

void WidgetTilesetTerrain::paintEvent(QPaintEvent *)
{
    QPainter painter(this);
    QHash<QPoint, CollisionSquare*>* squares = SystemPicture::getByID(m_pictureID,
        m_kind)->collisions();

    // Draw image
    if (!m_image.isNull())
    {
        painter.drawImage(0, 0, m_image);
    }

    // Draw numbers
    if (squares == nullptr)
    {
        return;
    }
    QPen penWhite(RPM::COLOR_ALMOST_WHITE);
    penWhite.setWidth(2);
    QPen penBlack(RPM::COLOR_ALMOST_BLACK);
    penBlack.setWidth(2);
    CollisionSquare *collision;
    QString text;
    int x, y;
    for (int i = 0; i < m_image.width() / RPM::BASIC_SQUARE_SIZE; i++)
    {
        for (int j = 0; j < m_image.height() / RPM::BASIC_SQUARE_SIZE; j++)
        {
            collision = squares->value(QPoint(i, j));
            int terrain = CollisionSquare::DEFAULT_TERRAIN;
            if (collision != nullptr) {
                terrain = collision->terrain();
            }
            text = QString::number(terrain);
            x = i * RPM::BASIC_SQUARE_SIZE + (text.length() == 1 ? 12 : 7);
            y = j * RPM::BASIC_SQUARE_SIZE + 21;
            painter.setPen(penBlack);
            painter.drawText(QPoint(x - 2, y ), text);
            painter.drawText(QPoint(x + 2, y), text);
            painter.drawText(QPoint(x, y + 2), text);
            painter.drawText(QPoint(x, y - 2), text);
            painter.setPen(penWhite);
            painter.drawText(QPoint(x, y), text);
        }
    }
}
