/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "panelselectposition.h"
#include "ui_panelselectposition.h"
#include "dialogselectposition.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelSelectPosition::PanelSelectPosition(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelSelectPosition)
{
    ui->setupUi(this);
}

PanelSelectPosition::~PanelSelectPosition()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelSelectPosition::initialize(EventCommand *command, int &i) {
    ui->labelIDMap->setText(command->valueCommandAt(i++));
    ui->labelX->setText(command->valueCommandAt(i++));
    ui->labelY->setText(command->valueCommandAt(i++));
    ui->labelYPlus->setText(command->valueCommandAt(i++));
    ui->labelZ->setText(command->valueCommandAt(i++));
}

// -------------------------------------------------------

void PanelSelectPosition::getCommand(QVector<QString> &command) const {
    command.append(ui->labelIDMap->text());
    command.append(ui->labelX->text());
    command.append(ui->labelY->text());
    command.append(ui->labelYPlus->text());
    command.append(ui->labelZ->text());
}

// -------------------------------------------------------

void PanelSelectPosition::setEnabled(bool checked) {
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
//
//  SLOTS
//
//--------------------------------------------

void PanelSelectPosition::on_pushButtonSelect_clicked() {
    DialogSelectPosition dialog(ui->labelIDMap->text().toInt(),
        ui->labelX->text().toInt(), ui->labelY->text().toInt(),
        ui->labelYPlus->text().toInt(), ui->labelZ->text().toInt());

    if (dialog.exec() == QDialog::Accepted) {
        ui->labelIDMap->setText(QString::number(dialog.idMap()));
        ui->labelX->setText(QString::number(dialog.x()));
        ui->labelY->setText(QString::number(dialog.y()));
        ui->labelYPlus->setText(QString::number(dialog.yPlus()));
        ui->labelZ->setText(QString::number(dialog.z()));
    }
}
