/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelherotroopbattletest.h"
#include "ui_panelherotroopbattletest.h"
#include "rpm.h"

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
    this->initialize();
    this->translate();
}

PanelHeroTroopBattleTest::~PanelHeroTroopBattleTest()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTION
//
// -------------------------------------------------------

void PanelHeroTroopBattleTest::initialize()
{
    int index = SuperListItem::getIndexById(RPM::get()->project()->gameDatas()
        ->heroesDatas()->model()->invisibleRootItem(), m_hero->heroID(), true);
    SuperListItem::fillComboBox(ui->comboBoxHero, RPM::get()->project()->gameDatas()
        ->heroesDatas()->model());
    ui->comboBoxHero->setCurrentIndex(index);
    ui->spinBoxLevel->setValue(m_hero->level());
    ui->treeViewEquipments->setCanCreateDelete(false);
    ui->treeViewEquipments->initializeModel(m_hero->modelEquipments());
}

// -------------------------------------------------------

void PanelHeroTroopBattleTest::translate()
{
    ui->labelHero->setText(RPM::translate(Translations::HERO) + RPM::COLON);
    ui->labelLevel->setText(RPM::translate(Translations::LEVEL) + RPM::COLON);
    ui->groupBoxEquipments->setTitle(RPM::translate(Translations::EQUIPMENTS));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelHeroTroopBattleTest::on_comboBoxHero_currentIndexChanged(int index)
{
    SuperListItem *hero = SuperListItem::getByIndex(RPM::get()->project()
        ->gameDatas()->heroesDatas()->model(), index);
    m_hero->setHeroID(hero->id());
    emit this->heroChanged(hero->name());
}

// -------------------------------------------------------

void PanelHeroTroopBattleTest::on_spinBoxLevel_valueChanged(int i)
{
    m_hero->setLevel(i);
}
