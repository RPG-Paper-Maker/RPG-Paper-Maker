/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WAYPREVIEW_H
#define WAYPREVIEW_H

#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLFunctions>
#include <QOpenGLTexture>
#include "position.h"
#include "vertex.h"
#include "orientationkind.h"

class WayPreview : protected QOpenGLFunctions
{
public:
    WayPreview();
    ~WayPreview();

    static bool checkTwoOrientations(OrientationKind kind1, OrientationKind kind2,
        OrientationKind possibleKind1, OrientationKind possibleKind2);

    void loadTexture();
    void initializeGL(QOpenGLShaderProgram *programStatic);
    void updateGL();
    void initializeVertices(Position3D &p, QList<OrientationKind> &orientations);
    void addSquare(Position3D &p, OrientationKind orientation, float left,
        float right, int &count);
    void addSquareCorner(Position3D &p, OrientationKind orientation, int &count);
    void addSquareSide(Position3D &p, OrientationKind orientation, int &count);
    void addSquareStart(Position3D &p, OrientationKind orientation, int &count);
    void addSquareEnd(Position3D &p, OrientationKind orientation, int &count);
    void addSquareCornerOrientation(Position3D &p, OrientationKind currentOrientation,
        OrientationKind previousOrientation, OrientationKind orientation1,
        OrientationKind orientation2, int &count);

    void clear();
    void paintGL();

protected:
    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_program;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLTexture* m_texture;
    int u_modelviewProjection;
};

#endif // WAYPREVIEW_H
