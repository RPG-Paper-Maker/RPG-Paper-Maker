/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcost.h"
#include "ui_dialogsystemcost.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCost::DialogSystemCost(SystemCost &cost, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCost),
    m_cost(cost)
{
    ui->setupUi(this);

    initialize();

    this->translate();
}

DialogSystemCost::~DialogSystemCost() {
    delete ui;
}

SystemCost & DialogSystemCost::cost() const {
    return m_cost;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCost::initialize() {
    ui->panelDamagesKind->initialize(m_cost.statisticID(), m_cost
        .currencyID(), m_cost.variableID(), m_cost.kind());
    ui->panelPrimitiveValue->initializeMessage(true);
    ui->panelPrimitiveValue->initializeModel(m_cost.valueFormula());
    ui->panelPrimitiveValue->updateModel();
}

//-------------------------------------------------

void DialogSystemCost::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_COST) + RPM
        ::DOT_DOT_DOT);
    ui->labelWithValue->setText(RPM::translate(Translations::WITH_VALUE));
    ui->labelApplyCostOn->setText(RPM::translate(Translations::APPLY_COST_ON));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
