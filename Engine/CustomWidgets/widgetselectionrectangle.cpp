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

#include "widgetselectionrectangle.h"
#include "wanok.h"

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
    m_rect.setCoords(0, 0,
                     Wanok::BASIC_SQUARE_SIZE - 1,
                     Wanok::BASIC_SQUARE_SIZE - 1);
    m_realX = 0;
    m_realY = 0;
    m_squareWidth = Wanok::BASIC_SQUARE_SIZE;
    m_squareHeight = Wanok::BASIC_SQUARE_SIZE;
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

QRect WidgetSelectionRectangle::getCoefRect() const{
    if (m_squareWidth != 0 && m_squareHeight != 0){
        return QRect(m_rect.x() / m_squareWidth,
                     m_rect.y() / m_squareHeight,
                     m_rect.width() / m_squareWidth,
                     m_rect.height() / m_squareHeight
                     );
    }
    else
        return QRect(0, 0, 0, 0);
}

// -------------------------------------------------------

void WidgetSelectionRectangle::setRectangle(int x, int y,
                                            int width, int height)
{
    if (m_squareWidth != 0 && m_squareHeight != 0){
        m_rect.setX(x * m_squareWidth);
        m_rect.setY(y  * m_squareHeight);
        m_rect.setWidth(width * m_squareWidth);
        m_rect.setHeight(height * m_squareHeight);
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::setRealPosition(){
    m_rect.setX(m_realX);
    m_rect.setY(m_realY);
}

// -------------------------------------------------------

void WidgetSelectionRectangle::makeFirstSelection(int x, int y, float zoom){
    if (m_squareWidth != 0 && m_squareHeight != 0){
        x = x / m_squareWidth;
        y = y / m_squareHeight;
        setRectangle((int)(x / zoom), (int)(y / zoom), 1, 1);
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::makeSelection(int x, int y, int w, int h,
                                             float zoom)
{
    if (m_squareWidth != 0 && m_squareHeight != 0){

        // Setting width
        if (x < 0)
            x = 0;
        if (x >= w)
            x = w - 1;
        x = (int)(x / zoom);
        int init_pos_x = m_rect.x() / m_squareWidth;
        int pos_x = x / m_squareWidth;
        int i_x = init_pos_x <= pos_x ? 1 : -1;
        int width = (pos_x - init_pos_x) + i_x;
        m_rect.setWidth(width * m_squareWidth);

        // Setting height
        if (y < 0)
            y = 0;
        if (y >= h)
            y = h - 1;
        y = (int)(y / zoom);
        int init_pos_y = m_rect.y() / m_squareHeight;
        int pos_y = y / m_squareHeight;
        int i_y = init_pos_y <= pos_y ? 1 : -1;
        int height = (pos_y - init_pos_y) + i_y;
        m_rect.setHeight(height * m_squareHeight);
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::draw(QPainter& painter, float zoom){

    // Setting coords
    int x = m_rect.x();
    int xWidth = 0;

    if (m_rect.width() < 0){
        x += m_rect.width() + m_squareWidth;
        m_rect.setWidth(-m_rect.width());
        xWidth = m_rect.width() - m_squareWidth;
    }

    int y = m_rect.y();
    int yHeight = 0;

    if (m_rect.height() < 0)
    {
        y += m_rect.height() + m_squareHeight;
        m_rect.setHeight(-m_rect.height());
        yHeight = m_rect.height() - m_squareHeight;
    }

    if (m_squareWidth != 0 && m_squareHeight != 0)
        drawSquare(painter, x, y, zoom);

    m_realX = m_rect.x() - xWidth;
    m_realY = m_rect.y() - yHeight;
}

// -------------------------------------------------------

void WidgetSelectionRectangle::drawSquare(QPainter &painter,
                                          int x, int y, float zoom)
{
    // Left-Top
    painter.drawImage(QRect((int)(x * zoom),
                            (int)(y * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(0, 0, BORDER_SIZE, BORDER_SIZE)
                      );
    // Right-Top
    painter.drawImage(QRect((int)((x + m_rect.width() - BORDER_SIZE) * zoom),
                            (int)(y * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(m_textureCursor.width() - BORDER_SIZE,
                            0,
                            BORDER_SIZE,
                            BORDER_SIZE)
                      );
    // Right-Bot
    painter.drawImage(QRect((int)((x + m_rect.width() - BORDER_SIZE) * zoom),
                            (int)((y + m_rect.height() - BORDER_SIZE) * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(m_textureCursor.width() - BORDER_SIZE,
                            m_textureCursor.height() - BORDER_SIZE,
                            BORDER_SIZE,
                            BORDER_SIZE)
                      );
    // Left-Bot
    painter.drawImage(QRect((int)(x * zoom),
                            (int)((y + m_rect.height() - BORDER_SIZE) * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(0,
                            m_textureCursor.height() - BORDER_SIZE,
                            BORDER_SIZE,
                            BORDER_SIZE)
                      );

    // Top
    painter.drawImage(QRect((int)((x + BORDER_SIZE) * zoom),
                            (int)(y * zoom),
                            (int)((m_rect.width() - (BORDER_SIZE * 2)) * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(BORDER_SIZE, 0, 1, BORDER_SIZE)
                      );
    // Right
    painter.drawImage(QRect((int)((x + m_rect.width() - BORDER_SIZE) * zoom),
                            (int)((y + BORDER_SIZE) * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)((m_rect.height() - (BORDER_SIZE * 2))
                                  * zoom)),
                      m_textureCursor,
                      QRect(0, BORDER_SIZE, BORDER_SIZE, 1)
                      );
    // Bot
    painter.drawImage(QRect((int)((x + BORDER_SIZE) * zoom),
                            (int)((y + m_rect.height() - BORDER_SIZE) * zoom),
                            (int)((m_rect.width() - (BORDER_SIZE * 2)) * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(BORDER_SIZE, 0, 1, BORDER_SIZE)
                      );
    // Left
    painter.drawImage(QRect((int)(x * zoom),
                            (int)((y + BORDER_SIZE) * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)((m_rect.height() - (BORDER_SIZE * 2)))),
                      m_textureCursor,
                      QRect(0, BORDER_SIZE, BORDER_SIZE, 1)
                      );
}
