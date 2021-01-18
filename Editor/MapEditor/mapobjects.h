/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MAPOBJECTS_H
#define MAPOBJECTS_H

#include <QHash>
#include <QPair>
#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <QOpenGLTexture>
#include "serializable.h"
#include "position.h"
#include "systemcommonobject.h"
#include "vertex.h"
#include "sprites.h"
#include "object3d.h"

// -------------------------------------------------------
//
//  CLASS MapObjects
//
//  A set of objects in a portion of the map.
//
// -------------------------------------------------------

class MapObjects : protected QOpenGLFunctions, public Serializable
{
public:
    MapObjects();
    virtual ~MapObjects();
    bool isEmpty() const;

    void updateEmpty();
    SystemCommonObject * getObjectAt(Position &p) const;
    void setObject(Position &p, SystemCommonObject *object);
    SystemCommonObject * removeObject(Position &p);
    bool addObject(Position &p, SystemCommonObject *object, QJsonObject
        &previousObj, MapEditorSubSelectionKind &previousType);
    bool deleteObject(Position &p, QJsonObject &previousObj,
        MapEditorSubSelectionKind &previousType);
    void removeObjectsOut(QList<int> &listDeletedObjectsIDs, MapProperties& properties);
    void clear();
    void initializeVertices(int squareSize, QHash<int, QOpenGLTexture *>
        &characters, QOpenGLTexture *tileset);
    MapElement * updateRaycasting(int squareSize, float& finalDistance, Position
        &finalPosition, QRay3D &ray);
    bool updateRaycastingAt(Position &position, int squareSize, float
        &finalDistance, Position &finalPosition, QRay3D& ray);
    QList<QStandardItem *> getAllCommandsList() const;
    void initializeGL(QOpenGLShaderProgram *programStatic, QOpenGLShaderProgram
        *programFace);
    void updateGL();
    void paintStaticSprites(int textureID, QOpenGLTexture *texture);
    void paintFaceSprites(int textureID, QOpenGLTexture *texture);
    void paintObjects3D(int textureID, QOpenGLTexture *texture);
    void paintSquares();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QHash<Position, SystemCommonObject *> m_all;
    QHash<Position, MapElement *> m_allElements;
    QHash<int, QList<SpriteObject *>*> m_spritesStaticGL;
    QHash<int, QList<SpriteObject *>*> m_spritesFaceGL;
    QHash<int, QList<Object3DObject *>*> m_objects3DGL;
    bool m_isEmpty;

    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_programStatic;
};

#endif // MAPOBJECTS_H
