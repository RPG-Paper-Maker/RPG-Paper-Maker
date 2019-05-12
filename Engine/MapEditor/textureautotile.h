/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
