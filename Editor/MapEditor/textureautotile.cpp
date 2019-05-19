/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
