/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetselectionrectangle.h"
#include "rpm.h"

const int WidgetSelectionRectangle::BORDER_SIZE = 4;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSelectionRectangle::WidgetSelectionRectangle(QWidget *parent) :
    QWidget(parent)
{
    m_textureCursor = QImage(":/textures/Ressources/tileset_cursor.png");
    this->setRectangle(0, 0, 1, 1);
    m_initX = 0;
    m_initY = 0;
    m_squareWidth = RPM::BASIC_SQUARE_SIZE;
    m_squareHeight = RPM::BASIC_SQUARE_SIZE;
}

WidgetSelectionRectangle::~WidgetSelectionRectangle()
{

}

void WidgetSelectionRectangle::setSquareWidth(int s) { m_squareWidth = s; }

void WidgetSelectionRectangle::setSquareHeight(int s) { m_squareHeight = s; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetSelectionRectangle::getCoefRect(QRect& rect) const{
    rect.setX(m_rect.x());
    rect.setY(m_rect.y());
    rect.setWidth(m_rect.width());
    rect.setHeight(m_rect.height());
}

// -------------------------------------------------------

void WidgetSelectionRectangle::setRectangle(int x, int y,
                                            int width, int height)
{
    m_rect.setX(x);
    m_rect.setY(y);
    m_rect.setWidth(width);
    m_rect.setHeight(height);
}

// -------------------------------------------------------

void WidgetSelectionRectangle::makeFirstSelection(int x, int y, float zoom){
    if (m_squareWidth != 0 && m_squareHeight != 0)
    {
        x = x / m_squareWidth;
        y = y / m_squareHeight;
        setRectangle((int)(x / zoom), (int)(y / zoom), 1, 1);
        m_initX = m_rect.x();
        m_initY = m_rect.y();
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::makeSelection(int x, int y, int w, int h,
                                             float zoom)
{
    if (m_squareWidth != 0 && m_squareHeight != 0)
    {
        // Setting width
        if (x < 0)
            x = 0;
        if (x >= w)
            x = w - 1;
        int pos_x = static_cast<int>(x / zoom) / m_squareWidth;
        int i_x = m_initX <= pos_x ? 1 : -1;
        int width = (pos_x - m_initX) + i_x;
        if (width > 0)
        {
            pos_x = m_initX;
        } else
        {
            width = -width;
        }

        // Setting height
        if (y < 0)
            y = 0;
        if (y >= h)
            y = h - 1;
        int pos_y = static_cast<int>(y / zoom) / m_squareHeight;
        int i_y = m_initY <= pos_y ? 1 : -1;
        int height = (pos_y - m_initY) + i_y;
        if (height > 0)
        {
            pos_y = m_initY;
        } else
        {
            height = -height;
        }

        this->setRectangle(pos_x, pos_y, width, height);
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::selectNone() {
    m_rect.setWidth(0); m_rect.setHeight(0);
}

// -------------------------------------------------------

void WidgetSelectionRectangle::draw(QPainter& painter, float zoom)
{
    int x = static_cast<int>(m_rect.x() * zoom * m_squareWidth);
    int y = static_cast<int>(m_rect.y() * zoom * m_squareHeight);
    int width = static_cast<int>(m_rect.width() * zoom * m_squareWidth);
    int height = static_cast<int>(m_rect.height() * zoom * m_squareHeight);
    int borderSize = static_cast<int>(BORDER_SIZE * zoom);

    // Left-Top
    painter.drawImage(QRect(x, y, borderSize, borderSize), m_textureCursor,
        QRect(0, 0, BORDER_SIZE, BORDER_SIZE));

    // Right-Top
    painter.drawImage(QRect(x + width - borderSize, y, borderSize, borderSize),
        m_textureCursor, QRect(m_textureCursor.width() - BORDER_SIZE, 0,
        BORDER_SIZE, BORDER_SIZE));

    // Right-Bot
    painter.drawImage(QRect(x + width - borderSize, y + height - borderSize,
        borderSize, borderSize), m_textureCursor, QRect(m_textureCursor.width()
        - BORDER_SIZE, m_textureCursor.height() - BORDER_SIZE, BORDER_SIZE,
        BORDER_SIZE));

    // Left-Bot
    painter.drawImage(QRect(x, y + height - borderSize, borderSize, borderSize),
        m_textureCursor, QRect(0, m_textureCursor.height() - BORDER_SIZE,
        BORDER_SIZE, BORDER_SIZE));

    // Top
    painter.drawImage(QRect(x + borderSize, y, width - (borderSize * 2),
        borderSize), m_textureCursor, QRect(BORDER_SIZE, 0, 1, BORDER_SIZE));

    // Right
    painter.drawImage(QRect(x + width - borderSize, y + borderSize, borderSize,
        height - (borderSize * 2)), m_textureCursor, QRect(0, BORDER_SIZE,
        BORDER_SIZE, 1));

    // Bot
    painter.drawImage(QRect(x + borderSize, y + height - borderSize, width - (
        borderSize * 2), borderSize), m_textureCursor, QRect(BORDER_SIZE, 0, 1,
        BORDER_SIZE));

    // Left
    painter.drawImage(QRect(x, y + borderSize, borderSize, height - (borderSize
        * 2)), m_textureCursor, QRect(0, BORDER_SIZE, BORDER_SIZE, 1));
}
