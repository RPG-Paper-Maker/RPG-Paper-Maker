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

#include "dialogsystemstatistic.h"
#include "ui_dialogsystemstatistic.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemStatistic::DialogSystemStatistic(SystemStatistic &statistic,
                                             QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemStatistic),
    m_statistic(statistic)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemStatistic::~DialogSystemStatistic()
{
    delete ui;
}

SystemStatistic& DialogSystemStatistic::statistic() const {
    return m_statistic;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemStatistic::initialize(){
    ui->widgetName->initializeNames(&m_statistic);
    ui->lineEditAbbrevation->setText(m_statistic.abbreviation());

    if (m_statistic.isFix())
        ui->radioButtonFix->setChecked(true);
    else
        ui->radioButtonBar->setChecked(true);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemStatistic::on_lineEditAbbrevation_textChanged(
        const QString & text)
{
    m_statistic.setAbbreviation(text);
}

// -------------------------------------------------------

void DialogSystemStatistic::on_radioButtonFix_toggled(bool check){
    m_statistic.setIsFix(check);
}
