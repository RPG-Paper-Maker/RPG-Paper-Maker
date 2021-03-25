/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogjump.h"
#include "ui_dialogjump.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogJump::DialogJump(QStandardItemModel
    *properties, QStandardItemModel *parameters, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogJump),
    m_properties(properties),
    m_parameters(parameters)
{
    ui->setupUi(this);
    this->initializePrimitives();
    this->translate();
}

DialogJump::~DialogJump()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogJump::getCommand(QVector<QString> &command) const
{
    ui->panelPrimitiveX->getCommand(command);
    ui->panelPrimitiveY->getCommand(command);
    ui->panelPrimitiveYPlus->getCommand(command);
    ui->panelPrimitiveZ->getCommand(command);
    ui->panelPrimitivePeakY->getCommand(command);
    ui->panelPrimitivePeakYPlus->getCommand(command);
    ui->panelPrimitiveTime->getCommand(command);
}

// -------------------------------------------------------

void DialogJump::initializePrimitives()
{
    ui->panelPrimitiveX->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveY->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveYPlus->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveZ->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitivePeakY->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitivePeakYPlus->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveTime->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveTime->setNumberDoubleValue(1.0);
}

// -------------------------------------------------------

void DialogJump::initialize(QVector<QString> &commands)
{
    int i = 2;
    ui->panelPrimitiveX->initializeCommandList(commands, i);
    ui->panelPrimitiveY->initializeCommandList(commands, i);
    ui->panelPrimitiveYPlus->initializeCommandList(commands, i);
    ui->panelPrimitiveZ->initializeCommandList(commands, i);
    ui->panelPrimitivePeakY->initializeCommandList(commands, i);
    ui->panelPrimitivePeakYPlus->initializeCommandList(commands, i);
    ui->panelPrimitiveTime->initializeCommandList(commands, i);
}

// -------------------------------------------------------

void DialogJump::translate()
{
    this->setWindowTitle(RPM::translate(Translations::JUMP) + RPM::DOT_DOT_DOT);
    ui->groupBoxFinalPositionOffset->setTitle(RPM::translate(Translations::FINAL_POSITION_OFFSET));
    ui->groupBoxPeak->setTitle(RPM::translate(Translations::PEAK));
    ui->labelTime->setText(RPM::translate(Translations::TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
