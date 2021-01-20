/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemstatusreleaseturn.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatusReleaseTurn::SystemStatusReleaseTurn() :
    SystemStatusReleaseTurn(-1, "")
{

}

SystemStatusReleaseTurn::SystemStatusReleaseTurn(int i, QString name) :
    SuperListItem(i, name)
{

}

SystemStatusReleaseTurn::~SystemStatusReleaseTurn()
{

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemStatusReleaseTurn::read(const QJsonObject &json) {
    SuperListItem::read(json);
}

// -------------------------------------------------------

void SystemStatusReleaseTurn::write(QJsonObject &json) const {
    SuperListItem::write(json);
}
