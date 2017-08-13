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

#include "dialogcommandmovecamera.h"
#include "ui_dialogcommandmovecamera.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandMoveCamera::DialogCommandMoveCamera(EventCommand *command,
                                                 SystemCommonObject *object,
                                                 QStandardItemModel *parameters,
                                                 QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandMoveCamera),
    m_modelObjects(nullptr)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    if (Wanok::isInConfig){
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    }
    else{
        m_modelObjects = Wanok::get()->project()->currentMap()->modelObjects();
    }
    ui->widgetPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
                                                             parameters,
                                                             nullptr);

    if (command != nullptr) initialize(command);
}

DialogCommandMoveCamera::~DialogCommandMoveCamera()
{
    delete ui;

    if (Wanok::isInConfig)
        SuperListItem::deleteModel(m_modelObjects);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandMoveCamera::initialize(EventCommand* command) {
    int i = 0;

    // Target
    int targetKind = command->valueCommandAt(i++).toInt();
    switch (targetKind) {
    case 0:
        ui->radioButtonTargetUnchanged->setChecked(true);
        break;
    case 1:
        ui->radioButtonTargetObjectID->setChecked(true);
        ui->widgetPrimitiveObjectID->initializeCommand(command, i);
        break;
    }

    // Operations
    switch (command->valueCommandAt(i++).toInt()) {
    case 0: ui->radioButtonEquals->setChecked(true); break;
    case 1: ui->radioButtonPlus->setChecked(true); break;
    case 2: ui->radioButtonMinus->setChecked(true); break;
    case 3: ui->radioButtonTimes->setChecked(true); break;
    case 4: ui->radioButtonDivided->setChecked(true); break;
    case 5: ui->radioButtonModulo->setChecked(true); break;
    }

    // Move
    ui->checkBoxtargetOffset->setChecked(command->valueCommandAt(i++) == "1");
    ui->checkBoxCameraOrientation->setChecked(command->valueCommandAt(i++)
                                              == "1");
    ui->spinBoxX->setValue(command->valueCommandAt(i++).toInt());
    ui->comboBoxX->setCurrentIndex(command->valueCommandAt(i++).toInt());
    ui->spinBoxY->setValue(command->valueCommandAt(i++).toInt());
    ui->comboBoxY->setCurrentIndex(command->valueCommandAt(i++).toInt());
    ui->spinBoxZ->setValue(command->valueCommandAt(i++).toInt());
    ui->comboBoxZ->setCurrentIndex(command->valueCommandAt(i++).toInt());

    // Rotation
    ui->doubleSpinBoxRotationH->setValue(command->valueCommandAt(i++)
                                         .toDouble());
    ui->doubleSpinBoxRotationV->setValue(command->valueCommandAt(i++)
                                         .toDouble());

    // Zoom
    ui->spinBoxDistance->setValue(command->valueCommandAt(i++).toInt());
    ui->spinBoxHeight->setValue(command->valueCommandAt(i++).toInt());

    // Options
    ui->checkBoxWaitEnd->setChecked(command->valueCommandAt(i++) == "1");
    ui->doubleSpinBoxTime->setValue(command->valueCommandAt(i++).toDouble());
}

// -------------------------------------------------------

EventCommand* DialogCommandMoveCamera::getCommand() const {
    QVector<QString> command;

    // Target
    if (ui->radioButtonTargetUnchanged->isChecked())
        command.append("0");
    else if (ui->radioButtonTargetObjectID->isChecked()) {
        command.append("1");
        ui->widgetPrimitiveObjectID->getCommand(command);
    }

    // Operations
    if (ui->radioButtonEquals->isChecked()) command.append("0");
    else if (ui->radioButtonPlus->isChecked()) command.append("1");
    else if (ui->radioButtonMinus->isChecked()) command.append("2");
    else if (ui->radioButtonTimes->isChecked()) command.append("3");
    else if (ui->radioButtonDivided->isChecked()) command.append("4");
    else if (ui->radioButtonModulo->isChecked()) command.append("5");

    // Move
    command.append(ui->checkBoxtargetOffset->isChecked() ? "1" : "0");
    command.append(ui->checkBoxCameraOrientation->isChecked() ? "1" : "0");
    command.append(ui->spinBoxX->text());
    command.append(QString::number(ui->comboBoxX->currentIndex()));
    command.append(ui->spinBoxY->text());
    command.append(QString::number(ui->comboBoxY->currentIndex()));
    command.append(ui->spinBoxZ->text());
    command.append(QString::number(ui->comboBoxZ->currentIndex()));

    // Rotation
    command.append(QString::number(ui->doubleSpinBoxRotationH->value()));
    command.append(QString::number(ui->doubleSpinBoxRotationV->value()));

    // Zoom
    command.append(ui->spinBoxDistance->text());
    command.append(ui->spinBoxHeight->text());

    // Options
    command.append(ui->checkBoxWaitEnd->isChecked() ? "1" : "0");
    command.append(QString::number(ui->doubleSpinBoxTime->value()));

    return new EventCommand(EventCommandKind::MoveCamera, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandMoveCamera::on_radioButtonTargetObjectID_toggled(bool checked)
{
    ui->widgetPrimitiveObjectID->setEnabled(checked);
}
