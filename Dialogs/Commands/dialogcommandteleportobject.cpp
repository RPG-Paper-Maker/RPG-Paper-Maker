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

#include "dialogcommandteleportobject.h"
#include "ui_dialogcommandteleportobject.h"
#include "dialogcommandteleportobjectselect.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandTeleportObject::DialogCommandTeleportObject(
        EventCommand* command,
        SystemCommonObject *object,
        QStandardItemModel *parameters,
        QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandTeleportObject),
    m_modelObjects(nullptr)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    if (object != nullptr){

    }
    if (Wanok::isInConfig){
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    }
    else{
        m_modelObjects = Wanok::get()->project()->currentMap()->modelObjects();
    }

    ui->widgetObjectID->initializeDataBaseCommandId(m_modelObjects, parameters,
                                                    nullptr);
    ui->widgetIdMap->initializeNumber(parameters, nullptr);
    ui->widgetX->initializeNumber(parameters, nullptr);
    ui->widgetY->initializeNumber(parameters, nullptr);
    ui->widgetYplus->initializeNumber(parameters, nullptr);
    ui->widgetZ->initializeNumber(parameters, nullptr);
    ui->widgetObjectIDPosition->initializeDataBaseCommandId(m_modelObjects,
                                                            parameters,
                                                            nullptr);

    if (command != nullptr) initialize(command);
}

DialogCommandTeleportObject::~DialogCommandTeleportObject()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandTeleportObject::initialize(EventCommand* command){
    int i = 0;

    // Object ID
    ui->widgetObjectID->initializeCommand(command, i);

    // Position
    switch (command->valueCommandAt(i++).toInt()){
    case 0:
        ui->radioButtonSelect->setChecked(true);
        ui->labelIDMap->setText(command->valueCommandAt(i++));
        ui->labelX->setText(command->valueCommandAt(i++));
        ui->labelY->setText(command->valueCommandAt(i++));
        ui->labelYPlus->setText(command->valueCommandAt(i++));
        ui->labelZ->setText(command->valueCommandAt(i++));
        break;
    case 1:
        ui->radioButtonNumber->setChecked(true);
        ui->widgetIdMap->initializeCommand(command, i);
        ui->widgetX->initializeCommand(command, i);
        ui->widgetY->initializeCommand(command, i);
        ui->widgetYplus->initializeCommand(command, i);
        ui->widgetZ->initializeCommand(command, i);
        break;
    case 2:
        ui->radioButtonObject->setChecked(true);
        ui->widgetObjectIDPosition->initializeCommand(command, i);
        break;
    }

    // Options
    ui->comboBoxDirection->setCurrentIndex(command->valueCommandAt(i++)
                                           .toInt());
    ui->comboBoxShadinBefore->setCurrentIndex(command->valueCommandAt(i++)
                                              .toInt());
    ui->comboBoxShadingAfter->setCurrentIndex(command->valueCommandAt(i++)
                                              .toInt());
}

// -------------------------------------------------------

EventCommand* DialogCommandTeleportObject::getCommand() const{
    QVector<QString> command;

    // Object ID
    ui->widgetObjectID->getCommand(command);

    // Position
    if (ui->radioButtonSelect->isChecked()){
        command.append("0");
        command.append(ui->labelIDMap->text());
        command.append(ui->labelX->text());
        command.append(ui->labelY->text());
        command.append(ui->labelYPlus->text());
        command.append(ui->labelZ->text());
    }
    else if (ui->radioButtonNumber->isChecked()){
        command.append("1");
        ui->widgetIdMap->getCommand(command);
        ui->widgetX->getCommand(command);
        ui->widgetY->getCommand(command);
        ui->widgetYplus->getCommand(command);
        ui->widgetZ->getCommand(command);
    }
    else if (ui->radioButtonObject->isChecked()){
        command.append("2");
        ui->widgetObjectIDPosition->getCommand(command);
    }

    // Options
    command.append(QString::number(ui->comboBoxDirection->currentIndex()));
    command.append(QString::number(ui->comboBoxShadinBefore->currentIndex()));
    command.append(QString::number(ui->comboBoxShadingAfter->currentIndex()));

    return new EventCommand(EventCommandKind::TeleportObject, command);
}

//--------------------------------------------
//
//  SLOTS
//
//--------------------------------------------

void DialogCommandTeleportObject::on_pushButtonSelect_clicked(){
     DialogCommandTeleportObjectSelect dialog(ui->labelIDMap->text().toInt(),
                                              ui->labelX->text().toInt(),
                                              ui->labelY->text().toInt(),
                                              ui->labelYPlus->text().toInt(),
                                              ui->labelZ->text().toInt());

    if (dialog.exec() == QDialog::Accepted){
        ui->labelIDMap->setText(QString::number(dialog.idMap()));
        ui->labelX->setText(QString::number(dialog.x()));
        ui->labelY->setText(QString::number(dialog.y()));
        ui->labelYPlus->setText(QString::number(dialog.yPlus()));
        ui->labelZ->setText(QString::number(dialog.z()));
    }
}

//--------------------------------------------

void DialogCommandTeleportObject::on_radioButtonSelect_toggled(bool checked){
    ui->pushButtonSelect->setEnabled(checked);
    ui->labelLIDMap->setEnabled(checked);
    ui->labelIDMap->setEnabled(checked);
    ui->labelLX->setEnabled(checked);
    ui->labelX->setEnabled(checked);
    ui->labelLY->setEnabled(checked);
    ui->labelY->setEnabled(checked);
    ui->labelLYPlus->setEnabled(checked);
    ui->labelYPlus->setEnabled(checked);
    ui->labelLZ->setEnabled(checked);
    ui->labelZ->setEnabled(checked);
}

//--------------------------------------------

void DialogCommandTeleportObject::on_radioButtonNumber_toggled(bool checked){
    ui->widgetIdMap->setEnabled(checked);
    ui->widgetX->setEnabled(checked);
    ui->widgetY->setEnabled(checked);
    ui->widgetYplus->setEnabled(checked);
    ui->widgetZ->setEnabled(checked);
}

//--------------------------------------------

void DialogCommandTeleportObject::on_radioButtonObject_toggled(bool checked){
    ui->widgetObjectIDPosition->setEnabled(checked);
}





