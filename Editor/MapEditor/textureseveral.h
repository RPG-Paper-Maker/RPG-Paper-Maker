/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TEXTUREAUTOTILE_H
#define TEXTUREAUTOTILE_H

#include <QOpenGLTexture>

// -------------------------------------------------------
//
//  CLASS TextureSeveral
//
//  A texture for a texture that is for several elements (autotiles, mountains).
//
// -------------------------------------------------------

class TextureSeveral
{
public:
    TextureSeveral();
    ~TextureSeveral();
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
