/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemclassskill.h"
#include "ui_dialogsystemclassskill.h"
#include "rpm.h"

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
                RPM::get()->project()->gameDatas()->skillsDatas()->model()
                ->invisibleRootItem(),
                m_skill.id());
    SuperListItem::fillComboBox(ui->comboBoxSkill, RPM::get()->project()
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
            RPM::get()->project()->gameDatas()->skillsDatas()->model()
            ->item(index)->data().value<qintptr>();
    m_skill.setId(skill->id());
    m_skill.setName(skill->name());
}

// -------------------------------------------------------

void DialogSystemClassSkill::on_spinBoxLevel_valueChanged(int i){
    m_skill.setLevel(i);
}
