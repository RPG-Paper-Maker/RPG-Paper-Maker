/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemmountain.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMountain::SystemMountain() :
    SystemSpecialElement()
{

}

SystemMountain::SystemMountain(int i, QString n, int pictureId) :
    SystemSpecialElement(i, n, ShapeKind::Box, -1, -1, pictureId)
{

}

SystemMountain::~SystemMountain()
{

}

SystemPicture* SystemMountain::picture() const {
    SystemPicture *picture;

    picture = this->pictureByKind(PictureKind::Mountains);
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

SuperListItem* SystemMountain::createCopy() const {
    SystemMountain* super = new SystemMountain;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemMountain::setCopy(const SuperListItem &super) {
    SystemSpecialElement::setCopy(super);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemMountain::read(const QJsonObject &json) {
    SystemSpecialElement::read(json);
}

// -------------------------------------------------------

void SystemMountain::write(QJsonObject &json) const {
    SystemSpecialElement::write(json);
}
