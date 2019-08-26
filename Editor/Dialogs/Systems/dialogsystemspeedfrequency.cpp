/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemspeedfrequency.h"
#include "ui_dialogsystemspeedfrequency.h"

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
