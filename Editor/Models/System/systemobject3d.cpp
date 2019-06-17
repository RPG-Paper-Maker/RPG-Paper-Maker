/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemobject3d.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemObject3D::SystemObject3D() :
    SystemSpecialElement()
{

}

SystemObject3D::SystemObject3D(int i, QString n, ShapeKind shapeKind, int objID,
    int mtlID, int texID) :
    SystemSpecialElement(i, n, shapeKind, objID, mtlID, texID)
{

}

SystemObject3D::~SystemObject3D() {

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SystemPicture* SystemObject3D::picture() const {
    return pictureByKind(PictureKind::Object3D);
}

// -------------------------------------------------------

SuperListItem* SystemObject3D::createCopy() const{
    SystemObject3D* super = new SystemObject3D;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemObject3D::setCopy(const SystemObject3D& super){
    SystemSpecialElement::setCopy(super);
}

// -------------------------------------------------------

void SystemObject3D::read(const QJsonObject &json){
    SystemSpecialElement::read(json);
}

// -------------------------------------------------------

void SystemObject3D::write(QJsonObject &json) const{
    SystemSpecialElement::write(json);
}
