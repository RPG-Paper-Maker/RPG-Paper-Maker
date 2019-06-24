/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

    virtual int width() const;
    virtual int height() const;
    virtual int depth() const;
    virtual int widthPixels() const;
    virtual int heightPixels() const;
    virtual int depthPixels() const;
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

#endif // OBJECT3DCUSTOM_H
