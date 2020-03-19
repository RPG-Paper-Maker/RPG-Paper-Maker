/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelselectposition.h"
#include "ui_panelselectposition.h"
#include "dialogselectposition.h"
#include "rpm.h"

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

    this->translate();
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

//-------------------------------------------------

void PanelSelectPosition::translate()
{
    ui->labelLIDMap->setText(RPM::translate(Translations::MAP_ID) + RPM::COLON);
    ui->labelYPlus->setText(RPM::translate(Translations::Y_PLUS) + RPM::COLON);
    ui->labelLX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelLY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelLZ->setText(RPM::translate(Translations::Z) + RPM::COLON);
    ui->pushButtonSelect->setText(RPM::translate(Translations::SELECT) + RPM
        ::DOT_DOT_DOT);
}

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
