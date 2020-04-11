/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandmodifyteam.h"
#include "ui_dialogcommandmodifyteam.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandModifyTeam::DialogCommandModifyTeam(EventCommand *command,
                                                 QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandModifyTeam)
{
    ui->setupUi(this);
    

    SuperListItem::fillComboBox(ui->comboBoxHero, RPM::get()->project()
                                ->gameDatas()->heroesDatas()->model());
    ui->widgetVariableStock->initialize();
    ui->widgetVariableConstantAddRemove->initializeNumber(nullptr, nullptr);
    ui->panelPrimitiveValueLevel->initializeNumber(nullptr, nullptr);
    ui->panelPrimitiveValueLevel->setNumberValue(1);
    ui->comboBoxInstanceTeam->addItems(RPM::ENUM_TO_STRING_TEAM);
    ui->comboBoxAddRemoveTeam->addItems(RPM::ENUM_TO_STRING_TEAM);

    if (command != nullptr) initialize(command);

    this->translate();
}

DialogCommandModifyTeam::~DialogCommandModifyTeam()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

//-------------------------------------------------

void DialogCommandModifyTeam::translate()
{
    this->setWindowTitle(RPM::translate(Translations::MODIFY_TEAM) + RPM
        ::DOT_DOT_DOT);
    ui->labelInInstance->setText(RPM::translate(Translations::IN_MESSAGE));
    ui->labelOfInstance->setText(RPM::translate(Translations::OF));
    ui->labelStockVariable->setText(RPM::translate(Translations
        ::STOCK_INSTANCE_ID_IN));
    ui->radioButtonHero->setText(RPM::translate(Translations::HERO) + RPM::COLON);
    ui->radioButtonMonster->setText(RPM::translate(Translations::MONSTER_ID) +
        RPM::COLON);
    ui->radioButtonNewInstance->setText(RPM::translate(Translations
        ::CREATE_NEW_INSTANCE_WITH_LEVEL));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

void DialogCommandModifyTeam::initialize(EventCommand* command){
    int i = 0;

    int type = command->valueCommandAt(i++).toInt();
    int typeCharacter;
    switch(type){
    case 0:
        ui->radioButtonNewInstance->setChecked(true);
        ui->panelPrimitiveValueLevel->initializeCommand(command, i);
        ui->comboBoxInstanceTeam->setCurrentIndex(command->valueCommandAt(i++)
                                                  .toInt());
        ui->widgetVariableStock->setCurrentId(command->valueCommandAt(i++)
                                              .toInt());
        typeCharacter = command->valueCommandAt(i++).toInt();
        if (typeCharacter == 0) {
            ui->radioButtonHero->setChecked(true);
            ui->comboBoxHero->setCurrentIndex(SuperListItem::getIndexById(
                    RPM::get()->project()->gameDatas()->heroesDatas()
                    ->model()->invisibleRootItem(),
                    command->valueCommandAt(i++).toInt()));
        }
        else if (typeCharacter == 1){
            ui->radioButtonMonster->setChecked(true);
        }
        break;
    case 1:
        ui->radioButtonAddRemove->setChecked(true);
        ui->comboBoxAddRemove->setCurrentIndex(command->valueCommandAt(i++)
                                               .toInt());
        ui->widgetVariableConstantAddRemove->initializeCommand(command, i);
        ui->comboBoxAddRemoveTeam->setCurrentIndex(command->valueCommandAt(i++)
                                                   .toInt());
        break;
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandModifyTeam::getCommand() const{
    QVector<QString> command;
    if (ui->radioButtonNewInstance->isChecked()){
        getNewInstance(command);
    }
    else if (ui->radioButtonAddRemove->isChecked()){
        getAddRemove(command);
    }

    return new EventCommand(EventCommandKind::ModifyTeam, command);
}

// -------------------------------------------------------

void DialogCommandModifyTeam::getNewInstance(QVector<QString> &command) const{
    command.append("0");
    ui->panelPrimitiveValueLevel->getCommand(command);
    command.append(QString::number(ui->comboBoxInstanceTeam->currentIndex()));
    command.append(QString::number(ui->widgetVariableStock->currentId()));
    if (ui->radioButtonHero->isChecked()){
        command.append("0");
        QStandardItem* model = RPM::get()->project()->gameDatas()
                ->heroesDatas()->model()->item(ui->comboBoxHero
                                               ->currentIndex());
        command.append(QString::number(((SuperListItem*)model->data()
                                        .value<qintptr>())->id()));
    }
    else if (ui->radioButtonMonster->isChecked()){
        command.append("1");
    }
}

// -------------------------------------------------------

void DialogCommandModifyTeam::getAddRemove(QVector<QString> &command) const{
    command.append("1");
    command.append(QString::number(ui->comboBoxAddRemove->currentIndex()));
    command.append(QString::number((int)ui->widgetVariableConstantAddRemove
                                   ->model()->kind()));
    ui->widgetVariableConstantAddRemove->getCommand(command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonNewInstance_toggled(bool checked){
    ui->panelPrimitiveValueLevel->setEnabled(checked);
    ui->labelInInstance->setEnabled(checked);
    ui->comboBoxInstanceTeam->setEnabled(checked);
    ui->labelOfInstance->setEnabled(checked);
    ui->labelStockVariable->setEnabled(checked);
    ui->widgetVariableStock->setEnabled(checked);
    ui->radioButtonHero->setEnabled(checked);
    ui->radioButtonMonster->setEnabled(checked);
    ui->comboBoxHero->setEnabled(checked && ui->radioButtonHero->isChecked());
    ui->comboBoxMonster->setEnabled(checked && ui->radioButtonMonster
                                    ->isChecked());
}

// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonHero_toggled(bool checked){
    ui->comboBoxHero->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonMonster_toggled(bool checked){
    ui->comboBoxMonster->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandModifyTeam::on_radioButtonAddRemove_toggled(bool checked){
    ui->comboBoxAddRemove->setEnabled(checked);
    ui->labelAddRemoveCharacter->setEnabled(checked);
    ui->widgetVariableConstantAddRemove->setEnabled(checked);
    ui->labelAddRemoveIn->setEnabled(checked);
    ui->comboBoxAddRemoveTeam->setEnabled(checked);
}
