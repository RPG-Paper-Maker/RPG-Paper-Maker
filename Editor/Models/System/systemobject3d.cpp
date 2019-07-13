/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    int mtlID, int pictureID, ObjectCollisionKind collisionKind, int
    collisionCustomID, double scale, int wS, double wP, int hS, double hP, int
    dS, double dP, bool stretch) :
    SystemSpecialElement(i, n, shapeKind, objID, mtlID, pictureID, collisionKind
        , collisionCustomID, scale, wS, wP, hS, hP, dS, dP, stretch)
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
