/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemanimation.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemAnimation::SystemAnimation() :
    SystemAnimation(1, "")
{

}

SystemAnimation::SystemAnimation(int i, QString n) :
    SuperListItem(i, n)
{

}

SystemAnimation::~SystemAnimation() {

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemAnimation::read(const QJsonObject &json) {
    SuperListItem::read(json);
}

// -------------------------------------------------------

void SystemAnimation::write(QJsonObject &json) const {
    SuperListItem::write(json);
}
