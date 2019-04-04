/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    SystemCommonObject* getObjectAt(Position& p) const;
    void setObject(Position& p, SystemCommonObject* object);
    SystemCommonObject* removeObject(Position& p);
    bool addObject(Position& p, SystemCommonObject* object,
                   QJsonObject &previousObj,
                   MapEditorSubSelectionKind &previousType);
    bool deleteObject(Position& p, QJsonObject &previousObj,
                      MapEditorSubSelectionKind &previousType);

    void removeObjectsOut(QList<int> &listDeletedObjectsIDs,
                          MapProperties& properties);

    void clearSprites();
    void initializeVertices(int squareSize,
                            QHash<int, QOpenGLTexture *> &characters);
    void initializeGL(QOpenGLShaderProgram* programStatic,
                      QOpenGLShaderProgram *programFace);
    void updateGL();
    void paintStaticSprites(int textureID, QOpenGLTexture* texture);
    void paintFaceSprites(int textureID, QOpenGLTexture* texture);
    void paintSquares();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QHash<Position, SystemCommonObject*> m_all;
    QHash<int, QList<SpriteObject*>*> m_spritesStaticGL;
    QHash<int, QList<SpriteObject*>*> m_spritesFaceGL;

    // OpenGL informations
    QOpenGLBuffer m_vertexBuffer;
    QOpenGLBuffer m_indexBuffer;
    QVector<Vertex> m_vertices;
    QVector<GLuint> m_indexes;
    QOpenGLVertexArrayObject m_vao;
    QOpenGLShaderProgram* m_programStatic;
};

#endif // MAPOBJECTS_H
