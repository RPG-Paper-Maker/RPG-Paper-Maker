/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef FLOOR_H
#define FLOOR_H

#include <QHash>
#include <QRect>
#include <QVector>
#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include "land.h"
#include "position.h"
#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS FloorDatas
//
//  A square floor datas.
//
// -------------------------------------------------------

class FloorDatas : public LandDatas
{
public:
    FloorDatas();
    FloorDatas(QRect *texture, bool up = true);
    virtual ~FloorDatas();
    bool operator==(const FloorDatas& other) const;
    bool operator!=(const FloorDatas& other) const;

    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;

    virtual void initializeVertices(int squareSize, int width, int height,
                                    QVector<Vertex>& vertices,
                                    QVector<GLuint>& indexes,
                                    Position& position, int& count);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject & json) const;
};

#endif // FLOOR_H
