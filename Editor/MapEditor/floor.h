/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
