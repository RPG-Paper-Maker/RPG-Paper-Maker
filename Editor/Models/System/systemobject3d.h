/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMOBJECT3D_H
#define SYSTEMOBJECT3D_H

#include <QMetaType>
#include "systemspecialelement.h"

// -------------------------------------------------------
//
//  CLASS SystemObject3D
//
//  A particulary 3D object (special element).
//
// -------------------------------------------------------

class SystemObject3D : public SystemSpecialElement
{
public:
    SystemObject3D();
    SystemObject3D(int i, QString n, ShapeKind shapeKind = ShapeKind::Box, int
        objID = -1, int mtlID = -1, int pictureID = -1, ObjectCollisionKind
        collisionKind = ObjectCollisionKind::None, int collisionCustomID = -1,
        double scale = 1.0, int wS = 1, double wP = 0, int hS = 1, double hP = 0
        , int dS = 1, double dP = 0, bool stretch = false);
    virtual ~SystemObject3D();

    virtual SystemPicture* picture() const;
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

#endif // SYSTEMOBJECT3D_H
