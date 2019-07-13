/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemmonstertroop.h"
#include "ui_dialogsystemmonstertroop.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemMonsterTroop::DialogSystemMonsterTroop(SystemMonsterTroop
    &monsterTroop, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemMonsterTroop),
    m_monsterTroop(monsterTroop)
{
    ui->setupUi(this);

    initialize();
}

DialogSystemMonsterTroop::~DialogSystemMonsterTroop()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemMonsterTroop::initialize(){
    SuperListItem::fillComboBox(ui->comboBoxMonster, RPM::get()->project()
                                ->gameDatas()->monstersDatas()->model());
    ui->comboBoxMonster->setCurrentIndex(
                SuperListItem::getIndexById(RPM::get()->project()
                                            ->gameDatas()->monstersDatas()
                                            ->model()->invisibleRootItem(),
                                            m_monsterTroop.id()));
    ui->spinBoxLevel->setValue(m_monsterTroop.level());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemMonsterTroop::on_comboBoxMonster_currentIndexChanged(int index)
{
    m_monsterTroop.setId(SuperListItem::getIdByIndex(RPM::get()->project()
        ->gameDatas()->monstersDatas()->model(), index));
}

// -------------------------------------------------------

void DialogSystemMonsterTroop::on_spinBoxLevel_valueChanged(int i) {
    m_monsterTroop.setLevel(i);
}
