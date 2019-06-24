/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef OBJECT3D_H
#define OBJECT3D_H

#include <QOpenGLFunctions>
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

    virtual int width() const = 0;
    virtual int height() const = 0;
    virtual int depth() const = 0;
    virtual int widthPixels() const = 0;
    virtual int heightPixels() const = 0;
    virtual int depthPixels() const = 0;
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

#endif // OBJECT3D_H
