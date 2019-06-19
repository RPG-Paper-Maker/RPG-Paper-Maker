/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "object3dbox.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Object3DBoxDatas::Object3DBoxDatas() :
    Object3DDatas()
{

}

Object3DBoxDatas::Object3DBoxDatas(int datasID, SystemObject3D *datas) :
    Object3DDatas(datasID, datas)
{

}

Object3DBoxDatas::~Object3DBoxDatas()
{

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString Object3DBoxDatas::toString() const {
    return Object3DDatas::toString() + " - BOX";
}

// -------------------------------------------------------

void Object3DBoxDatas::read(const QJsonObject & json) {
    Object3DDatas::read(json);
}

// -------------------------------------------------------

void Object3DBoxDatas::write(QJsonObject & json) const{
    Object3DDatas::write(json);
}
