/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef OBJECT3DCUSTOM_H
#define OBJECT3DCUSTOM_H

#include "object3d.h"
#include "qbox3d.h"

// -------------------------------------------------------
//
//  CLASS Object3DCustomDatas
//
//  A 3D custom .obj object datas.
//
// -------------------------------------------------------

class Object3DCustomDatas : public Object3DDatas
{
public:
    Object3DCustomDatas();
    Object3DCustomDatas(SystemObject3D *datas);
    virtual ~Object3DCustomDatas();

    void rotateVertex(QVector3D& vec, Position &position, QVector3D& center);

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
    QVector3D m_min;
    QVector3D m_max;
};

#endif // OBJECT3DCUSTOM_H
