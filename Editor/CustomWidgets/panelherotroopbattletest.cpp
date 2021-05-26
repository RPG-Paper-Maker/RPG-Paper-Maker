/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelherotroopbattletest.h"
#include "ui_panelherotroopbattletest.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelHeroTroopBattleTest::PanelHeroTroopBattleTest(SystemHeroTroopBattleTest *hero,
    QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelHeroTroopBattleTest),
    m_hero(hero)
{
    ui->setupUi(this);
}

PanelHeroTroopBattleTest::~PanelHeroTroopBattleTest()
{
    delete ui;
}
