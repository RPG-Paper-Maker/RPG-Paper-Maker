/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemspeedfrequency.h"
#include "ui_dialogsystemspeedfrequency.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemSpeedFrequency::DialogSystemSpeedFrequency(SystemSpeedFrequency &sf,
    QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemSpeedFrequency),
    m_speedFrequency(sf)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemSpeedFrequency::~DialogSystemSpeedFrequency() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemSpeedFrequency::initialize() {
    ui->lineEditName->setText(m_speedFrequency.name());
    ui->panelPrimitiveValue->initializeNumberAndUpdate(m_speedFrequency.value(),
        false);

    // If frequency, change UI
    if (!m_speedFrequency.isSpeed()) {
        ui->labelValue->setText(RPM::translate(Translations::TIME) + RPM::COLON);
        ui->labelX->hide();
    } else {
        ui->labelSeconds->hide();
    }
}

//-------------------------------------------------

void DialogSystemSpeedFrequency::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_SPEED_FREQUENCY) + RPM
        ::DOT_DOT_DOT);
    ui->labelValue->setText(RPM::translate(Translations::VALUE) + RPM::COLON);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemSpeedFrequency::on_lineEditName_textChanged(const QString &text)
{
    m_speedFrequency.setName(text);
}
