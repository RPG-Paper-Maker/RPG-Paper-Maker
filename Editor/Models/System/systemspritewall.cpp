/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemspritewall.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSpriteWall::SystemSpriteWall() :
    SystemSpecialElement()
{

}

SystemSpriteWall::SystemSpriteWall(int i, QString n, int pictureId) :
    SystemSpecialElement(i, n, ShapeKind::Box, -1, -1, pictureId)
{

}

SystemSpriteWall::~SystemSpriteWall()
{

}

SystemPicture* SystemSpriteWall::picture() const {
    return pictureByKind(PictureKind::Walls);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemSpriteWall::createCopy() const{
    SystemSpriteWall* super = new SystemSpriteWall;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSpriteWall::setCopy(const SystemSpriteWall& super){
    SystemSpecialElement::setCopy(super);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemSpriteWall::read(const QJsonObject &json){
    SystemSpecialElement::read(json);
}

// -------------------------------------------------------

void SystemSpriteWall::write(QJsonObject &json) const{
    SystemSpecialElement::write(json);
}
