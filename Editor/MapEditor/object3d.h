/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef OBJECT3D_H
#define OBJECT3D_H

#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <qray3d.h>
#include "mapelement.h"
#include "shapekind.h"
#include "systemobject3d.h"
#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS Object3DDatas
//
//  A 3D object datas.
//
// -------------------------------------------------------

class Object3DDatas : public MapElement
{
public:
    const static QString JSON_DATAS_ID;

    Object3DDatas();
    Object3DDatas(SystemObject3D *datas);
    virtual ~Object3DDatas();

    SystemObject3D * datas() const;
    int textureID() const;

    bool operator==(const Object3DDatas& other) const;
    bool operator!=(const Object3DDatas& other) const;

    static Object3DDatas * instanciate(SystemObject3D *datas);
    static Object3DDatas * instanciateFromJSON(const QJsonObject &json);
    static SystemObject3D * readFromJSON(const QJsonObject &json);

    virtual qreal xMin() const = 0;
    virtual qreal yMin() const = 0;
    virtual qreal zMin() const = 0;
    virtual qreal xMax() const = 0;
    virtual qreal yMax() const = 0;
    virtual qreal zMax() const = 0;
    virtual int width() const = 0;
    virtual int height() const = 0;
    virtual int depth() const = 0;
    virtual int widthPixels() const = 0;
    virtual int heightPixels() const = 0;
    virtual int depthPixels() const = 0;
    virtual int xOverflowCenter() const = 0;
    virtual int yOverflowCenter() const = 0;
    virtual int zOverflowCenter() const = 0;
    virtual void getCenter(QVector3D &center) const = 0;
    virtual int minDistanceFromCenter() const = 0;
    virtual void initializeVertices(QVector<Vertex> &vertices, QVector<GLuint>
        &indexes, Position &position, unsigned int &count) = 0;
    virtual float intersection(QRay3D& ray) const = 0;
    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SystemObject3D *m_datas;
};

// -------------------------------------------------------
//
//  CLASS Object3DObject
//
//  A 3D object object in a portion of the map.
//
// -------------------------------------------------------

class Object3DObject : protected QOpenGLFunctions
{
public:
    Object3DObject(Object3DDatas& datas);
    virtual ~Object3DObject();
    void initializeVertices(Position &position);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

protected:
    Object3DDatas &m_datas;

    // OpenGL static
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_program;
};

#endif // OBJECT3D_H
