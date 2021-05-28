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
#include "rpm.h"

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
    this->initialize();
    this->translate();
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

void DialogTroopBattleTest::initialize()
{
    m_battleMapID = 1;
    int index = SuperListItem::getIndexById(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelBattleMaps()->invisibleRootItem(),
        m_battleMapID, true);
    SuperListItem::fillComboBox(ui->comboBoxBattleMap, RPM::get()->project()
        ->gameDatas()->battleSystemDatas()->modelBattleMaps());
    ui->comboBoxBattleMap->setCurrentIndex(index);
    this->addHero();
}

// -------------------------------------------------------

void DialogTroopBattleTest::addHero(int index)
{
    SystemHeroTroopBattleTest *hero = new SystemHeroTroopBattleTest;
    m_heros.append(hero);
    ui->tabWidget->insertTab(index, new PanelHeroTroopBattleTest(hero), hero->name());
}

// -------------------------------------------------------

void DialogTroopBattleTest::translate()
{
    this->setWindowTitle(RPM::translate(Translations::TEST) + RPM::DOT_DOT_DOT);
    ui->labelBattleMap->setText(RPM::translate(Translations::BATTLE_MAP) + RPM::COLON);
    ui->pushButtonCopy->setText(RPM::translate(Translations::COPY));
    ui->pushButtonPaste->setText(RPM::translate(Translations::PASTE));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
