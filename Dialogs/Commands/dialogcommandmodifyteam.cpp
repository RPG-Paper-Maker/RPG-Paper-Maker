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

#include "dialogcommandmodifyteam.h"
#include "ui_dialogcommandmodifyteam.h"
#include "wanok.h"

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
    setFixedSize(geometry().width(), geometry().height());

    SuperListItem::fillComboBox(ui->comboBoxHero, Wanok::get()->project()
                                ->gameDatas()->heroesDatas()->model());
    ui->widgetVariableStock->initialize();
    ui->widgetVariableConstantAddRemove->initializeNumberVariable();

    if (command != nullptr) initialize(command);
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

void DialogCommandModifyTeam::initialize(EventCommand* command){
    int i = 0;

    int type = command->valueCommandAt(i++).toInt();
    int typeCharacter;
    switch(type){
    case 0:
        ui->radioButtonNewInstance->setChecked(true);
        ui->spinBoxLevel->setValue(command->valueCommandAt(i++).toInt());
        ui->comboBoxInstanceTeam->setCurrentIndex(command->valueCommandAt(i++)
                                                  .toInt());
        ui->widgetVariableStock->setCurrentId(command->valueCommandAt(i++)
                                              .toInt());
        typeCharacter = command->valueCommandAt(i++).toInt();
        if (typeCharacter == 0){
            ui->radioButtonHero->setChecked(true);
            ui->comboBoxHero->setCurrentIndex(SuperListItem::getIndexById(
                    Wanok::get()->project()->gameDatas()->heroesDatas()
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
    command.append(ui->spinBoxLevel->text());
    command.append(QString::number(ui->comboBoxInstanceTeam->currentIndex()));
    command.append(QString::number(ui->widgetVariableStock->currentId()));
    if (ui->radioButtonHero->isChecked()){
        command.append("0");
        QStandardItem* model = Wanok::get()->project()->gameDatas()
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
    ui->spinBoxLevel->setEnabled(checked);
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
