/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    SystemSpecialElement(i, n, pictureId)
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
