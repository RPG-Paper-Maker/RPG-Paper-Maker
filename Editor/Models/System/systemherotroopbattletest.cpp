/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemherotroopbattletest.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemHeroTroopBattleTest::SystemHeroTroopBattleTest()
{

}

SystemHeroTroopBattleTest::~SystemHeroTroopBattleTest() {

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemHeroTroopBattleTest::name() const
{
    return SuperListItem::getById(RPM::get()->project()->gameDatas()->heroesDatas()
        ->model()->invisibleRootItem(), m_heroID)->name();
}
