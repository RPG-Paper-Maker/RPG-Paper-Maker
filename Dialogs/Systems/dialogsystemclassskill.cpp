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

#include "dialogsystemclassskill.h"
#include "ui_dialogsystemclassskill.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemClassSkill::DialogSystemClassSkill(SystemClassSkill &skill,
                                               QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemClassSkill),
    m_skill(skill)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemClassSkill::~DialogSystemClassSkill()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemClassSkill::initialize(){

    // Skill
    int skillIndex = SuperListItem::getIndexById(
                Wanok::get()->project()->gameDatas()->skillsDatas()->model()
                ->invisibleRootItem(),
                m_skill.id());
    SuperListItem::fillComboBox(ui->comboBoxSkill, Wanok::get()->project()
                                ->gameDatas()->skillsDatas()->model());
    ui->comboBoxSkill->setCurrentIndex(skillIndex);

    // Level
    ui->spinBoxLevel->setValue(m_skill.level());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemClassSkill::on_comboBoxSkill_currentIndexChanged(int index){
    SystemClassSkill* skill = (SystemClassSkill*)
            Wanok::get()->project()->gameDatas()->skillsDatas()->model()
            ->item(index)->data().value<qintptr>();
    m_skill.setId(skill->id());
    m_skill.setName(skill->name());
}

// -------------------------------------------------------

void DialogSystemClassSkill::on_spinBoxLevel_valueChanged(int i){
    m_skill.setLevel(i);
}
