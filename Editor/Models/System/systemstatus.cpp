/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
