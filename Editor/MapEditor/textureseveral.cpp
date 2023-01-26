/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "textureseveral.h"
#include <QDebug>
// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TextureSeveral::TextureSeveral() :
    m_isAnimated(false)
{

}

TextureSeveral::~TextureSeveral()
{
    delete m_texture;
}

QOpenGLTexture* TextureSeveral::texture() {
    return m_texture;
}

void TextureSeveral::setTexture(QOpenGLTexture* texture) {
    m_texture = texture;
}

void TextureSeveral::setBegin(int id, QPoint& point) {
    m_beginID = id;
    m_beginPoint = point;
}

void TextureSeveral::setEnd(int id, QPoint& point) {
    m_endID = id;
    m_endPoint = point;
}

bool TextureSeveral::isAnimated() const
{
    return m_isAnimated;
}

void TextureSeveral::setIsAnimated(bool animated)
{
    m_isAnimated = animated;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool TextureSeveral::isSup(QRect* rect, QPoint& point) {
    if (rect == nullptr) {
        return true;
    }

    if (rect->y() > point.y())
        return true;
    else if (rect->y() == point.y())
        return rect->x() >= point.x();

    return false;
}

// -------------------------------------------------------

bool TextureSeveral::isInf(QRect* rect, QPoint& point) {
    if (rect == nullptr) {
        return true;
    }

    if (rect->y() < point.y())
        return true;
    else if (rect->y() == point.y())
        return rect->x() <= point.x();

    return false;
}

// -------------------------------------------------------

bool TextureSeveral::isInTexture(int id, QRect* rect) {
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

void TextureSeveral::addToList(int id, QPoint& point) {
    m_list.append(QPair<int, QPoint>(id, point));
}

// -------------------------------------------------------

int TextureSeveral::getOffset(int id, QRect* rect) {
    for (int i = 0; i < m_list.size(); i++) {
        const QPair<int, QPoint>& pair = m_list.at(i);
        const QPoint& p = pair.second;
        if (id == pair.first && (rect == nullptr || (p.x() == rect->x() && p.y()
            == rect->y())))
        {
            return i;
        }
    }

    return -1;
}
