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

#include "dialogcommandchangevariables.h"
#include "ui_dialogcommandchangevariables.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeVariables::DialogCommandChangeVariables(
        EventCommand *command,
        QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeVariables)
{
    ui->setupUi(this);

    ui->widgetVariableOne->initialize();

    if (command != nullptr) initialize(command);
}

DialogCommandChangeVariables::~DialogCommandChangeVariables()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeVariables::initialize(EventCommand* command){
    int i = 0;

    // Selection
    switch(command->valueCommandAt(i++).toInt()){
    case 0:
        ui->radioButtonOneVariable->setChecked(true);
        ui->widgetVariableOne->setCurrentId(command->valueCommandAt(i++)
                                            .toInt());
        break;
    case 1:
        ui->radioButtonRange->setChecked(true);
        ui->spinBoxRange1->setValue(command->valueCommandAt(i++).toInt());
        ui->spinBoxRange2->setValue(command->valueCommandAt(i++).toInt());
        break;
    }

    // Operation
    switch (command->valueCommandAt(i++).toInt()) {
    case 0: ui->radioButtonEquals->setChecked(true); break;
    case 1: ui->radioButtonPlus->setChecked(true); break;
    case 2: ui->radioButtonMinus->setChecked(true); break;
    case 3: ui->radioButtonTimes->setChecked(true); break;
    case 4: ui->radioButtonDivided->setChecked(true); break;
    case 5: ui->radioButtonModulo->setChecked(true); break;
    }

    // Value
    switch(command->valueCommandAt(i++).toInt()){
    case 0:
        ui->radioButtonRandom->setChecked(true);
        ui->spinBoxRandom1->setValue(command->valueCommandAt(i++).toInt());
        ui->spinBoxRandom2->setValue(command->valueCommandAt(i++).toInt());
        break;
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandChangeVariables::getCommand() const{
    QVector<QString> command;
    selection(command); // Information about type of selection
    operation(command); // Type of operation done
    value(command); // Type of value given to the selected variable(s)

    return new EventCommand(EventCommandKind::ChangeVariables, command);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::selection(QVector<QString>& command) const{
    // If only selecting one variable...
    if (ui->radioButtonOneVariable->isChecked()){
        command.append("0");
        command.append(QString::number(ui->widgetVariableOne->currentId()));
    }
    // If selecting a range of variables...
    else if (ui->radioButtonRange->isChecked()){
        command.append("1");
        command.append(ui->spinBoxRange1->text());
        command.append(ui->spinBoxRange2->text());
    }
}

// -------------------------------------------------------

void DialogCommandChangeVariables::operation(QVector<QString>& command) const{
    if (ui->radioButtonEquals->isChecked()) command.append("0");
    else if (ui->radioButtonPlus->isChecked()) command.append("1");
    else if (ui->radioButtonMinus->isChecked()) command.append("2");
    else if (ui->radioButtonTimes->isChecked()) command.append("3");
    else if (ui->radioButtonDivided->isChecked()) command.append("4");
    else if (ui->radioButtonModulo->isChecked()) command.append("5");
}

// -------------------------------------------------------

void DialogCommandChangeVariables::value(QVector<QString> &command) const{
    if (ui->radioButtonRandom->isChecked()){
        command.append("0");
        command.append(ui->spinBoxRandom1->text());
        command.append(ui->spinBoxRandom2->text());
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonOneVariable_toggled(
        bool checked)
{
    ui->widgetVariableOne->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonRange_toggled(bool checked){
    ui->spinBoxRange1->setEnabled(checked);
    ui->labelRange->setEnabled(checked);
    ui->spinBoxRange2->setEnabled(checked);
}
