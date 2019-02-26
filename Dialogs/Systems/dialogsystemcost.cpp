/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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
