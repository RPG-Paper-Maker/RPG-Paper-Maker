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

#ifndef TEXTUREAUTOTILE_H
#define TEXTUREAUTOTILE_H

#include <QOpenGLTexture>

// -------------------------------------------------------
//
//  CLASS TextureAutotile
//
//  A texture for an autotile.
//
// -------------------------------------------------------

class TextureAutotile
{
public:
    TextureAutotile();
    ~TextureAutotile();
    QOpenGLTexture* texture();
    void setTexture(QOpenGLTexture* texture);
    void setBegin(int id, QPoint& point);
    void setEnd(int id, QPoint& point);
    static bool isSup(QRect* rect, QPoint& point);
    static bool isInf(QRect* rect, QPoint& point);
    int isInTexture(int id, QRect* rect);
    void addToList(int id, QPoint& point);
    int getOffset(int id, QRect* rect);

protected:
    QOpenGLTexture* m_texture;
    int m_beginID;
    QPoint m_beginPoint;
    int m_endID;
    QPoint m_endPoint;
    QList<QPair<int, QPoint>> m_list;
};

#endif // TEXTUREAUTOTILE_H
