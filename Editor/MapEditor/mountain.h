/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MOUNTAIN_H
#define MOUNTAIN_H

#include <qray3d.h>
#include <QOpenGLFunctions>
#include "mapelement.h"
#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS MountainDatas
//
//  A 3D object datas.
//
// -------------------------------------------------------

class MountainDatas : public MapElement
{
public:
    const static QString JSON_SPECIAL_ID;
    const static QString JSON_WIDTH_SQUARES;
    const static QString JSON_WIDTH_PIXELS;
    const static QString JSON_HEIGHT_SQUARES;
    const static QString JSON_HEIGHT_PIXELS;
    const static QString JSON_DRAW_TOP;
    const static QString JSON_DRAW_BOT;
    const static QString JSON_DRAW_LEFT;
    const static QString JSON_DRAW_RIGHT;

    MountainDatas();
    MountainDatas(int specialID, int ws, double wp, int hs, double hp);
    virtual ~MountainDatas();

    int textureID() const;
    int widthSquares() const;
    double widthPixels() const;
    int heightSquares() const;
    double heightPixels() const;

    bool operator==(const MountainDatas& other) const;
    bool operator!=(const MountainDatas& other) const;

    virtual void initializeVertices(QVector<Vertex> &vertices, QVector<GLuint>
        &indexes, Position &position, unsigned int &count);
    virtual float intersection(QRay3D& ray) const;
    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_specialID;
    int m_textureID;
    int m_widthSquares;
    double m_widthPixels;
    int m_heightSquares;
    double m_heightPixels;
    bool m_drawTop;
    bool m_drawBot;
    bool m_drawLeft;
    bool m_drawRight;
};

#endif // MOUNTAIN_H
