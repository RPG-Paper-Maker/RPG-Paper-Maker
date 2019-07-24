/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MOUTAINS_H
#define MOUTAINS_H

#include <QOpenGLFunctions>
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>
#include <QOpenGLVertexArrayObject>
#include <qray3d.h>
#include "mountain.h"

class MapPortion;

// -------------------------------------------------------
//
//  CLASS MountainsGL
//
//  A set of mountains with the same texture ID.
//
// -------------------------------------------------------

class MountainsGL : protected QOpenGLFunctions
{
public:
    MountainsGL();
    virtual ~MountainsGL();

    void initializeVertices(TextureSeveral *texture, Position &position,
        MountainDatas *mountain);
    void initializeGL(QOpenGLShaderProgram *program);
    void updateGL();
    void paintGL();

protected:
    int m_count;

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
//  CLASS Mountains
//
//  A set of mountains groups for en entire portion map.
//
// -------------------------------------------------------

class Mountains : public Serializable
{
public:
    const static QString JSON_ALL;
    const static QString JSON_OVERFLOW;

    Mountains();
    virtual ~Mountains();

    bool isEmpty() const;

    static void getSetPortionsOverflow(QSet<Portion>& portionsOverflow, Position
        &p, MountainDatas *mountain);
    static MountainDatas * tileExisting(Position &position, Portion &portion,
        QHash<Position, MountainDatas *> &preview);
    static MountainDatas * tileOnWhatever(Position &position, Portion &portion,
        int id, int width, int height, QHash<Position, MountainDatas *> &preview);
    static bool tileOnLeft(Position &position, Portion &portion, int id, int
        width, int height, QHash<Position, MountainDatas *> &preview);
    static bool tileOnRight(Position &position, Portion &portion, int id, int
        width, int height, QHash<Position, MountainDatas *> &preview);
    static bool tileOnTop(Position &position, Portion &portion, int id, int
        width, int height, QHash<Position, MountainDatas *> &preview);
    static bool tileOnBottom(Position &position, Portion &portion, int id, int
        width, int height, QHash<Position, MountainDatas *> &preview);

    void clearMountainsGL();
    bool contains(Position &position) const;
    void addOverflow(Position &p);
    void removeOverflow(Position &p);
    void updateEmpty(bool previewSquare);
    void changePosition(Position &position, Position &newPosition);
    MountainDatas * mountainAt(Position& position) const;
    void setMountain(QSet<Portion> &portionsOverflow, Position &p, MountainDatas
        *mountain);
    void addRemoveOverflow(QSet<Portion> &portionsOverflow, Position &p, bool
        add);
    MountainDatas * removeMountain(QSet<Portion> &portionsOverflow, Position &p);
    bool addMountain(QSet<Portion> &portionsOverflow, Position &p, MountainDatas
        *mountain, QJsonObject &previousObj, MapEditorSubSelectionKind
        &previousType, QSet<MapPortion *> &update, QSet<MapPortion *> &save,
        Position &positionPreviousFloor);
    bool deleteMountain(QSet<Portion> &portionsOverflow, Position &p,
        QJsonObject &previousObj, MapEditorSubSelectionKind &previousType, QSet<
        MapPortion *> &update, QSet<MapPortion *> &save);
    void removeMountainsOut(MapProperties& properties);
    MapElement *updateRaycasting(float& finalDistance, Position &finalPosition,
        QRay3D &ray);
    bool updateRaycastingAt(Position &position, MountainDatas *mountain, float
        &finalDistance, Position &finalPosition, QRay3D& ray);
    MapElement * getMapElementAt(Position &position);
    int getLastLayerAt(Position &) const;
    void getMountainsWithPreview(QHash<Position, MountainDatas *>
        &mountainsWithPreview, QHash<Position, MapElement *> &preview);
    void updateAround(Position &position, QHash<Position, MountainDatas *>
        &mountains, QSet<MapPortion *> &update, QSet<MapPortion *> &save,
        QSet<MapPortion*> *previousPreview);
    void updateWithoutPreview(Position &position, QSet<MapPortion *> &update,
        QSet<MapPortion *> &save);
    void updateMountains(Position &position, QHash<Position, MapElement *>
        &preview, QSet<MapPortion *> &update, QSet<MapPortion *> &save, QSet<
        MapPortion*> &previousPreview);
    void initializeVertices(QList<TextureSeveral *> &texturesMountains, QHash<
        Position, MapElement*>& previewSquares, QList<Position>& previewDelete);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL(int textureID);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, MountainDatas *> m_all;
    QList<MountainsGL *> m_allGL;
    QSet<Position> m_overflow;
    bool m_isEmpty;
};

#endif // MOUTAINS_H
