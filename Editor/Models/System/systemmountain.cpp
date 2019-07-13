/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemmountain.h"

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
    return pictureByKind(PictureKind::Mountains);
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

void SystemMountain::setCopy(const SystemMountain& super) {
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
