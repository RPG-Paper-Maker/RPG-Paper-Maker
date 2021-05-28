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
    m_troopID(troopID),
    m_battleMapID(1),
    m_copy(nullptr)
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
    int index = SuperListItem::getIndexById(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelBattleMaps()->invisibleRootItem(),
        m_battleMapID, true);
    SuperListItem::fillComboBox(ui->comboBoxBattleMap, RPM::get()->project()
        ->gameDatas()->battleSystemDatas()->modelBattleMaps());
    ui->comboBoxBattleMap->setCurrentIndex(index);
    this->addHero();
}

// -------------------------------------------------------

void DialogTroopBattleTest::addHero(int index, SystemHeroTroopBattleTest *hero)
{
    if (hero == nullptr)
    {
        hero = new SystemHeroTroopBattleTest;
    }
    m_heros.insert(index, hero);
    PanelHeroTroopBattleTest *panel = new PanelHeroTroopBattleTest(hero);
    ui->tabWidget->insertTab(index, panel, hero->name());
    connect(panel, &PanelHeroTroopBattleTest::heroChanged, this, [this, hero](
        const QString &text)
    {
        ui->tabWidget->setTabText(m_heros.indexOf(hero), text);
    });
    ui->tabWidget->setCurrentIndex(index);
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

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogTroopBattleTest::on_comboBoxBattleMap_currentIndexChanged(int index)
{
    m_battleMapID = SuperListItem::getIdByIndex(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelBattleMaps(), index);
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_pushButtonAdd_clicked()
{
    this->addHero(ui->tabWidget->currentIndex() + 1);
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_pushButtonRemove_clicked()
{
    if (ui->tabWidget->count() > 0)
    {
        int index = ui->tabWidget->currentIndex();
        delete m_heros.at(index);
        m_heros.removeAt(index);
        ui->tabWidget->removeTab(index);
    }
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_pushButtonCopy_clicked()
{
    m_copy = reinterpret_cast<SystemHeroTroopBattleTest *>(m_heros.at(ui
        ->tabWidget->currentIndex()));
}

// -------------------------------------------------------

void DialogTroopBattleTest::on_pushButtonPaste_clicked()
{
    if (m_copy != nullptr)
    {
        this->addHero(ui->tabWidget->currentIndex() + 1, reinterpret_cast<
            SystemHeroTroopBattleTest *>(m_copy->createCopy()));
    }
}
