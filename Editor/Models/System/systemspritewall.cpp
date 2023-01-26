/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemspritewall.h"
#include "rpm.h"

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
    SystemPicture *picture;

    picture = this->pictureByKind(PictureKind::Walls);
    if (picture == nullptr) {
        picture = RPM::get()->project()->picturesDatas()->missingPicture();
        picture->setId(m_pictureID);
    }

    return picture;
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

void SystemSpriteWall::setCopy(const SuperListItem &super){
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
