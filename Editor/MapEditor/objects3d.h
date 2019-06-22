/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef OBJECTS3D_H
#define OBJECTS3D_H

#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <qray3d.h>
#include "object3d.h"

// -------------------------------------------------------
//
//  CLASS SpritesWalls
//
//  A set of sprites walls in a portion of the map.
//
// -------------------------------------------------------

class Objects3DGL : protected QOpenGLFunctions
{
public:
    Objects3DGL();
    virtual ~Objects3DGL();
    void initializeVertices(Position& position, Object3DDatas *object3D);
    void initializeGL(QOpenGLShaderProgram* program);
    void updateGL();
    void paintGL();

protected:
    unsigned int m_count;

    // OpenGL
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_program;
};

// -------------------------------------------------------
//
//  CLASS Objects3D
//
//  A set of 3D objects in a portion of the map.
//
// -------------------------------------------------------

class Objects3D : public Serializable
{
public:
    const static QString JSON_ALL;
    const static QString JSON_OVERFLOW;

    Objects3D();
    virtual ~Objects3D();

    bool isEmpty() const;

    static void getSetPortionsOverflow(QSet<Portion>& portionsOverflow, Position
        &p, Object3DDatas *object3D);

    bool contains(Position &position) const;
    void addOverflow(Position &p);
    void removeOverflow(Position &p);
    void updateEmpty(bool previewSquare);
    void changePosition(Position &position, Position &newPosition);
    Object3DDatas* object3DAt(Position& position) const;
    void setObject3D(QSet<Portion> &portionsOverflow, Position &p, Object3DDatas
        *object3D);
    void addRemoveOverflow(QSet<Portion> &portionsOverflow, Position &p, bool
        add);
    Object3DDatas* removeObject3D(QSet<Portion> &portionsOverflow, Position &p);
    bool addObject3D(QSet<Portion> &portionsOverflow, Position &p, Object3DDatas
        *object3D, QJsonObject &previousObj, MapEditorSubSelectionKind
        &previousType);
    bool deleteObject3D(QSet<Portion> &portionsOverflow, Position &p,
        QJsonObject &previousObj, MapEditorSubSelectionKind &previousType);
    void removeObjects3DOut(MapProperties& properties);
    MapElement *updateRaycasting(float& finalDistance, Position &finalPosition,
        QRay3D &ray);
    bool updateRaycastingAt(Position &position, Object3DDatas *object3D, float
        &finalDistance, Position &finalPosition, QRay3D& ray);
    MapElement * getMapElementAt(Position &position);
    int getLastLayerAt(Position &) const;
    void initializeVertices(QHash<Position, MapElement*>& previewSquares,
        QList<Position>& previewDelete);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL(int textureID);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, Object3DDatas *> m_all;
    QHash<int, Objects3DGL*> m_allGL;
    QSet<Position> m_overflow;
    bool m_isEmpty;
};

#endif // OBJECTS3D_H
