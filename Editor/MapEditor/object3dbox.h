/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef OBJECT3DBOX_H
#define OBJECT3DBOX_H

#include "object3d.h"

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
    Object3DBoxDatas();
    Object3DBoxDatas(int datasID, SystemObject3D *datas);
    virtual ~Object3DBoxDatas();

    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

#endif // OBJECT3DBOX_H
