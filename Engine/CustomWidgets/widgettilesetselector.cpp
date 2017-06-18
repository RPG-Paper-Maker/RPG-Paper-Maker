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
    m_textureTileset = QImage(QString(
                                  Wanok::pathCombine(Wanok::get()->project()
                                                     ->pathCurrentProject(),
                                  Wanok::pathCombine(Wanok::pathTilesets,
                                                     "plains.png"))));
    m_textureTileset = m_textureTileset.scaled(m_textureTileset.width() * 2,
                                               m_textureTileset.height() * 2);
    this->setGeometry(0, 0,
                      m_textureTileset.width(),
                      m_textureTileset.height());
    setFixedSize(m_textureTileset.width(), m_textureTileset.height());
}

WidgetTilesetSelector::~WidgetTilesetSelector()
{
    delete m_selectionRectangle;
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetSelector::paintEvent(QPaintEvent *event){
    QPainter painter(this);

    painter.drawImage(0, 0, m_textureTileset);
}
