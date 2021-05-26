/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogtroopbattletest.h"
#include "ui_dialogtroopbattletest.h"
#include "panelherotroopbattletest.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogTroopBattleTest::DialogTroopBattleTest(int troopID, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogTroopBattleTest),
    m_troopID(troopID)
{
    ui->setupUi(this);
    this->addHero();
}

DialogTroopBattleTest::~DialogTroopBattleTest()
{
    delete ui;
    for (int i = 0, l = m_heros.size(); i < l; i++)
    {
        delete m_heros.at(i);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogTroopBattleTest::addHero(int index)
{
    SystemHeroTroopBattleTest *hero = new SystemHeroTroopBattleTest;
    m_heros.append(hero);
    ui->tabWidget->insertTab(index, new PanelHeroTroopBattleTest(hero), hero->name());
}
