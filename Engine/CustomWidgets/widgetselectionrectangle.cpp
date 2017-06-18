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
    m_rect.setCoords(0, 0, Wanok::BASIC_SQUARE_SIZE, Wanok::BASIC_SQUARE_SIZE);
    m_realX = 0;
    m_realY = 0;
    m_squareWidth = Wanok::BASIC_SQUARE_SIZE;
    m_squareHeight = Wanok::BASIC_SQUARE_SIZE;
}

WidgetSelectionRectangle::~WidgetSelectionRectangle()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetSelectionRectangle::setRectangle(int x, int y,
                                            int width, int height)
{
    if (m_squareWidth != 0 && m_squareHeight != 0){
        m_rect.setX((x / m_squareWidth) * m_squareWidth);
        m_rect.setY((x / m_squareHeight) * m_squareHeight);
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

void WidgetSelectionRectangle::draw(QPainter* painter, float zoom){

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

void WidgetSelectionRectangle::drawSquare(QPainter* painter,
                                          int x, int y, float zoom)
{

}
