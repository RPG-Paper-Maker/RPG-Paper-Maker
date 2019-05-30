/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef LAND_H
#define LAND_H

#include "mapelement.h"
#include "qray3d.h"
#include "position.h"
#include "vertex.h"
#include <QGLContext>

class LandDatas : public MapElement
{
public:
    LandDatas(QRect* texture, bool up);
    virtual ~LandDatas();
    bool operator==(const LandDatas& other) const;
    bool operator!=(const LandDatas& other) const;
    QRect* textureRect() const;
    bool up() const;
    virtual MapEditorSubSelectionKind getSubKind() const;

    virtual void initializeVertices(int, int, int, QVector<Vertex>&,
                                    QVector<GLuint>&, Position&, int&);
    void getPosSize(QVector3D& pos, QVector3D& size, int squareSize,
                    Position &position);

    static void getUpPosSize(QVector3D& pos, QVector3D& size, int squareSize,
        Position &position, bool up = true);
    float intersection(int squareSize, QRay3D& ray, Position& position);
    static float staticIntersection(int squareSize, QRay3D& ray, Position& position,
        bool up = true);

    static const QString JSON_UP;
    static const QString JSON_TEXTURE;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QRect* m_textureRect;
    bool m_up;
};

#endif // LAND_H
