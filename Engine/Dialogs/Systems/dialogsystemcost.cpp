/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemcost.h"
#include "ui_dialogsystemcost.h"


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
    ui->panelPrimitiveValue->initializeMessage();
    ui->panelPrimitiveValue->initializeModel(m_cost.valueFormula());
    ui->panelPrimitiveValue->updateModel();
}
