/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemstatusreleaseturn.h"
#include "ui_dialogsystemstatusreleaseturn.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemStatusReleaseTurn::DialogSystemStatusReleaseTurn(
    SystemStatusReleaseTurn &statusReleaseTurn, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemStatusReleaseTurn),
    m_statusReleaseTurn(statusReleaseTurn)
{
    ui->setupUi(this);

    this->initialize();
    this->translate();
}

DialogSystemStatusReleaseTurn::~DialogSystemStatusReleaseTurn()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemStatusReleaseTurn::initialize()
{
    int index = static_cast<int>(m_statusReleaseTurn.operationTurnKind());
    ui->comboBoxTurn->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->comboBoxTurn->setCurrentIndex(index);
    ui->panelPrimitiveTurn->initializeNumberAndUpdate(m_statusReleaseTurn.turn());
    ui->panelPrimitiveChance->initializeNumberAndUpdate(m_statusReleaseTurn
        .chance(), false);
}

//-------------------------------------------------

void DialogSystemStatusReleaseTurn::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_STATUS_RELEASE_TURN_CONDITIONS) +
        RPM::DOT_DOT_DOT);
    ui->labelChance->setText(RPM::translate(Translations::CHANCE) + RPM::COLON);
    ui->labelTurn->setText(RPM::translate(Translations::TURN) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemStatusReleaseTurn::on_comboBoxTurn_currentIndexChanged(int index)
{
    m_statusReleaseTurn.setOperationTurnKind(static_cast<OperationKind>(index));
}
