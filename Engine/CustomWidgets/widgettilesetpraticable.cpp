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

#include "widgettilesetpraticable.h"
#include "wanok.h"
#include <QPainter>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetPraticable::WidgetTilesetPraticable(QWidget *parent) :
    QWidget(parent)
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetPraticable::updateImage(SystemPicture* picture){
    m_image = QImage(picture->getPath(PictureKind::Tilesets));
    if (!m_image.isNull()) {
        m_image = m_image.scaled(m_image.width() / Wanok::coefSquareSize(),
                                 m_image.height() / Wanok::coefSquareSize());
    }
    this->setGeometry(0, 0, m_image.width(), m_image.height());
    setFixedSize(m_image.width(), m_image.height());
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetPraticable::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.drawImage(0, 0, m_image);
}
