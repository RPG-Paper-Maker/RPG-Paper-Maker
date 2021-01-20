/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef OBJECT3DBOX_H
#define OBJECT3DBOX_H

#include "object3d.h"
#include "qbox3d.h"

// -------------------------------------------------------
//
//  CLASS Object3DBoxDatas
//
//  A 3D box object datas.
//
// -------------------------------------------------------

class Object3DBoxDatas : public Object3DDatas
{
public:
    static QVector3D VERTICES_EQUAL[];
    static QVector3D VERTICES[];
    static QVector2D TEXTURES[];
    static QList<float> TEXTURES_VALUES;
    static GLuint INDEXES[];
    static int NB_VERTICES;
    static int NB_INDEXES;

    Object3DBoxDatas();
    Object3DBoxDatas(SystemObject3D *datas);
    virtual ~Object3DBoxDatas();

    void getPosSizeCenterInfos(QVector3D &pos, QVector3D &size, QVector3D
        &center, Position &position);

    virtual qreal xMin() const;
    virtual qreal yMin() const;
    virtual qreal zMin() const;
    virtual qreal xMax() const;
    virtual qreal yMax() const;
    virtual qreal zMax() const;
    virtual int width() const;
    virtual int height() const;
    virtual int depth() const;
    virtual int widthPixels() const;
    virtual int heightPixels() const;
    virtual int depthPixels() const;
    virtual int xOverflowCenter() const;
    virtual int yOverflowCenter() const;
    virtual int zOverflowCenter() const;
    virtual void getCenter(QVector3D &center) const;
    virtual int minDistanceFromCenter() const;
    virtual void initializeVertices(QVector<Vertex> &vertices, QVector<
        GLuint> &indexes, Position &position, unsigned int &count);
    virtual float intersection(QRay3D& ray) const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QBox3D m_box;
};

#endif // OBJECT3DBOX_H
