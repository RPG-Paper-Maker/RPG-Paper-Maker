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

#include "textureautotile.h"
#include <QDebug>
// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TextureAutotile::TextureAutotile()
{

}

TextureAutotile::~TextureAutotile()
{
    delete m_texture;
}

QOpenGLTexture* TextureAutotile::texture() {
    return m_texture;
}

void TextureAutotile::setTexture(QOpenGLTexture* texture) {
    m_texture = texture;
}

void TextureAutotile::setBegin(int id, QPoint& point) {
    m_beginID = id;
    m_beginPoint = point;
}

void TextureAutotile::setEnd(int id, QPoint& point) {
    m_endID = id;
    m_endPoint = point;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool TextureAutotile::isSup(QRect* rect, QPoint& point) {
    if (rect->y() > point.y())
        return true;
    else if (rect->y() == point.y())
        return rect->x() >= point.x();

    return false;
}

// -------------------------------------------------------

bool TextureAutotile::isInf(QRect* rect, QPoint& point) {
    if (rect->y() < point.y())
        return true;
    else if (rect->y() == point.y())
        return rect->x() <= point.x();

    return false;
}

// -------------------------------------------------------

int TextureAutotile::isInTexture(int id, QRect* rect) {
    if (id >= m_beginID && id <= m_endID) {
        if (id == m_beginID) {
            if (id == m_endID)
                return isSup(rect, m_beginPoint) && isInf(rect, m_endPoint);
            else
                return isSup(rect, m_beginPoint);
        }
        else if (id < m_endID)
            return true;
        else
            return isInf(rect, m_endPoint);
    }
    return false;
}

// -------------------------------------------------------

void TextureAutotile::addToList(int id, QPoint& point) {
    m_list.append(QPair<int, QPoint>(id, point));
}

// -------------------------------------------------------

int TextureAutotile::getOffset(int id, QRect* rect) {
    for (int i = 0; i < m_list.size(); i++) {
        const QPair<int, QPoint>& pair = m_list.at(i);
        const QPoint& p = pair.second;
        if (id == pair.first && p.x() == rect->x() && p.y() == rect->y())
            return i;
    }

    return -1;
}
