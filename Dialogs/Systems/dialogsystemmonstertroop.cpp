/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "dialogsystemmonstertroop.h"
#include "ui_dialogsystemmonstertroop.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemMonsterTroop::DialogSystemMonsterTroop(
        SystemMonsterTroop &monsterTroop,
        QWidget *parent) :
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
    SuperListItem::fillComboBox(ui->comboBoxMonster, Wanok::get()->project()
                                ->gameDatas()->monstersDatas()->model());

    ui->comboBoxMonster->setCurrentIndex(
                SuperListItem::getIndexById(Wanok::get()->project()
                                            ->gameDatas()->monstersDatas()
                                            ->model()->invisibleRootItem(),
                                            m_monsterTroop.id()));
    ui->spinBoxLevel->setValue(m_monsterTroop.level());
}
