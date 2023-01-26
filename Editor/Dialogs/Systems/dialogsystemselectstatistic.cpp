/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemselectstatistic.h"
#include "ui_dialogsystemselectstatistic.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemSelectStatistic::DialogSystemSelectStatistic(SystemSelectStatistic
    &selectStatistic, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemSelectStatistic),
    m_selectStatistic(selectStatistic)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemSelectStatistic::~DialogSystemSelectStatistic()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemSelectStatistic::initialize()
{
    ui->panelPrimitiveStatisticID->initializeDataBaseAndUpdate(m_selectStatistic
        .statisticID());
}

// -------------------------------------------------------

void DialogSystemSelectStatistic::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_STATISTIC) + RPM
        ::DOT_DOT_DOT);
    ui->labelStatisticID->setText(RPM::translate(Translations::STATISTIC_ID) +
        RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
