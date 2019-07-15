/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MOUNTAIN_H
#define MOUNTAIN_H

#include <qray3d.h>
#include <QOpenGLFunctions>
#include "mapelement.h"
#include "vertex.h"

// -------------------------------------------------------
//
//  CLASS MountainDatas
//
//  A 3D object datas.
//
// -------------------------------------------------------

class MountainDatas : public MapElement
{
public:
    const static QString JSON_TEXTURE_ID;

    MountainDatas();
    MountainDatas(int textureID);
    virtual ~MountainDatas();

    int textureID() const;

    bool operator==(const MountainDatas& other) const;
    bool operator!=(const MountainDatas& other) const;

    virtual void initializeVertices(QVector<Vertex> &vertices, QVector<GLuint>
        &indexes, Position &position, unsigned int &count);
    virtual float intersection(QRay3D& ray) const;
    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_textureID;
};

#endif // MOUNTAIN_H
