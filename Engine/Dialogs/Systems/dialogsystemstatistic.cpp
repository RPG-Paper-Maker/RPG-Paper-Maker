/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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
    setFixedSize(geometry().width(), geometry().height());

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
    ui->widgetName->lineEdit()->setText(m_statistic.name());
    ui->lineEditAbbrevation->setText(m_statistic.abbreviation());

    QVector<QString> commands = m_statistic.commands();
    int i = 0;

    switch (commands.at(i++).toInt()){
    case 0:
        ui->radioButtonFix->setChecked(true);
        break;
    case 1:
        ui->radioButtonBar->setChecked(true);
        break;
    }
}
