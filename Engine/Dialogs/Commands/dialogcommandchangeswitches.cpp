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

#include "dialogcommandchangeswitches.h"
#include "ui_dialogcommandchangeswitches.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeSwitches::DialogCommandChangeSwitches(EventCommand *command,
                                                         QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeSwitches)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    ui->widgetSwitch->setVariable(false);
    ui->widgetSwitch->initialize();

    if (command != nullptr) initialize(command);
}

DialogCommandChangeSwitches::~DialogCommandChangeSwitches()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeSwitches::initialize(EventCommand* command){
    int i = 0;

    // Selection
    switch(command->valueCommandAt(i++).toInt()){
    case 0:
        ui->radioButtonSingle->setChecked(true);
        ui->widgetSwitch->setCurrentId(command->valueCommandAt(i++).toInt());
        break;
    case 1:
        ui->radioButtonRange->setChecked(true);
        ui->spinBoxRange1->setValue(command->valueCommandAt(i++).toInt());
        ui->spinBoxRange2->setValue(command->valueCommandAt(i++).toInt());
        break;
    }

    // Operation
    switch(command->valueCommandAt(i++).toInt()){
    case 0: ui->radioButtonON->setChecked(true); break;
    case 1: ui->radioButtonOFF->setChecked(true); break;
    case 2: ui->radioButtonINVERT->setChecked(true); break;
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandChangeSwitches::getCommand() const{
    QVector<QString> command;
    chooseSwitches(command);
    operation(command);

    return new EventCommand(EventCommandKind::ChangeSwitches, command);
}

// -------------------------------------------------------

void DialogCommandChangeSwitches::chooseSwitches(QVector<QString>&
                                                 command) const
{

    if (ui->radioButtonSingle->isChecked()){
        command.append("0");
        command.append(QString::number(ui->widgetSwitch->currentId()));
    }
    else if (ui->radioButtonRange->isChecked()){
        command.append("1");
        command.append(ui->spinBoxRange1->text());
        command.append(ui->spinBoxRange2->text());
    }
}

// -------------------------------------------------------

void DialogCommandChangeSwitches::operation(QVector<QString>& command) const{
    if (ui->radioButtonON->isChecked()) command.append("0");
    else if (ui->radioButtonOFF->isChecked()) command.append("1");
    else if (ui->radioButtonINVERT->isChecked()) command.append("2");

}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeSwitches::on_radioButtonSingle_toggled(bool checked){
    ui->widgetSwitch->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeSwitches::on_radioButtonRange_toggled(bool checked){
    ui->spinBoxRange1->setEnabled(checked);
    ui->labelRange->setEnabled(checked);
    ui->spinBoxRange2->setEnabled(checked);
}





