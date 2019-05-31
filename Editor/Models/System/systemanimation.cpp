/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
