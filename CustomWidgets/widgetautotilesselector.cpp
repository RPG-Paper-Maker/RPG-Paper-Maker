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

#include "widgetautotilesselector.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetAutotilesSelector::WidgetAutotilesSelector(QWidget *parent) :
    QWidget(parent),
    m_selectionRectangle(new WidgetSelectionRectangle)
{

}

WidgetAutotilesSelector::~WidgetAutotilesSelector()
{
    delete m_selectionRectangle;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QRect WidgetAutotilesSelector::currentTexture() const{
    return m_selectionRectangle->getCoefRect();
}

// -------------------------------------------------------

void WidgetAutotilesSelector::setImage(SystemAutotile* autotile){
    m_texture = QImage(autotile->picture()->getPath(PictureKind::Autotiles));
    if (!m_texture.isNull()){
        float coef = Wanok::coefReverseSquareSize();
        m_texture = m_texture.scaled(m_texture.width() * coef,
                                     m_texture.height() * coef);
    }
    this->setGeometry(this->geometry().x(), this->geometry().y(),
                      m_texture.width(),m_texture.height());
    setFixedSize(m_texture.width(), m_texture.height());

    // If cursor out of the new texture
    QRect cursorRect = m_selectionRectangle->getCoefRect();
    QRect newTextureRect(0, 0,
                         m_texture.width() / Wanok::BASIC_SQUARE_SIZE,
                         m_texture.height() / Wanok::BASIC_SQUARE_SIZE);
    if (!newTextureRect.contains(cursorRect)) {
        makeSelection(0, 0);
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetAutotilesSelector::makeSelection(int x, int y, float zoom){
    m_selectionRectangle->makeFirstSelection(x, y, zoom);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetAutotilesSelector::mousePressEvent(QMouseEvent *event){
    if (event->button() == Qt::MouseButton::LeftButton){
        makeSelection(event->x(), event->y());
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetAutotilesSelector::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.drawImage(0, 0, m_texture);
    m_selectionRectangle->draw(painter);
}
