/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "widgettilesetselector.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetSelector::WidgetTilesetSelector(QWidget *parent) :
    QWidget(parent),
    m_selectionRectangle(new WidgetSelectionRectangle)
{

}

WidgetTilesetSelector::~WidgetTilesetSelector()
{
    delete m_selectionRectangle;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetSelector::currentTexture(QRect& rect) const{
    m_selectionRectangle->getCoefRect(rect);
}

// -------------------------------------------------------

void WidgetTilesetSelector::setImage(QString path){
    m_textureTileset = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    updateImage();
}

// -------------------------------------------------------

void WidgetTilesetSelector::setImageNone(){
    m_textureTileset = QImage();
    updateImage();
}

// -------------------------------------------------------

void WidgetTilesetSelector::updateImage(){
    if (!m_textureTileset.isNull()){
        float coef = Wanok::coefReverseSquareSize();
        m_textureTileset = m_textureTileset.scaled(
                    m_textureTileset.width() * coef,
                    m_textureTileset.height() * coef);
    }
    this->setGeometry(0, 0,
                      m_textureTileset.width(),
                      m_textureTileset.height());
    setFixedSize(m_textureTileset.width(), m_textureTileset.height());

    // If cursor out of the new texture
    QRect cursorRect;
    m_selectionRectangle->getCoefRect(cursorRect);
    QRect newTextureRect(0, 0,
                         m_textureTileset.width() / Wanok::BASIC_SQUARE_SIZE,
                         m_textureTileset.height() / Wanok::BASIC_SQUARE_SIZE);
    if (!newTextureRect.contains(cursorRect)) {
        makeFirstSelection(0, 0);
        this->repaint();
    }

    // If < 32 x 32
    if (m_textureTileset.width() < Wanok::BASIC_SQUARE_SIZE ||
        m_textureTileset.height() < Wanok::BASIC_SQUARE_SIZE)
        selectNone();
}

// -------------------------------------------------------

void WidgetTilesetSelector::setRealCursorPosition(){
    m_selectionRectangle->setRealPosition();
}

// -------------------------------------------------------

void WidgetTilesetSelector::makeFirstSelection(int x, int y, float zoom){
    m_selectionRectangle->makeFirstSelection(x, y, zoom);
}

// -------------------------------------------------------

void WidgetTilesetSelector::makeSelection(int x, int y, float zoom){
    m_selectionRectangle->makeSelection(x, y,
                                        m_textureTileset.width(),
                                        m_textureTileset.height(),
                                        zoom);
}

// -------------------------------------------------------

void WidgetTilesetSelector::selectNone() {
    m_selectionRectangle->selectNone();
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetSelector::mousePressEvent(QMouseEvent *event){
    if (event->button() == Qt::MouseButton::LeftButton){
        makeFirstSelection(event->x(), event->y());
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetTilesetSelector::mouseMoveEvent(QMouseEvent *event){
    if (event->buttons() == Qt::LeftButton){
        makeSelection(event->x(), event->y());
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetTilesetSelector::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.drawImage(0, 0, m_textureTileset);
    m_selectionRectangle->draw(painter);
}
