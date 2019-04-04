/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemstatus.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatus::SystemStatus() :
    SystemStatus(1, new LangsTranslation, -1)
{

}

SystemStatus::SystemStatus(int i, LangsTranslation *names, int pictureID) :
    SystemIcon(i, names, pictureID)
{

}

SystemStatus::~SystemStatus() {

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemStatus::read(const QJsonObject &json) {
    SystemIcon::read(json);
}

// -------------------------------------------------------

void SystemStatus::write(QJsonObject &json) const {
    SystemIcon::write(json);
}
