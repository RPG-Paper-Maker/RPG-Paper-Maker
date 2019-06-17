/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    SystemObject3D(int i, QString n, ShapeKind shapeKind, int objID, int mtlID,
        int texID);
    virtual ~SystemObject3D();

    virtual SystemPicture* picture() const;
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SystemObject3D &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

#endif // SYSTEMOBJECT3D_H
