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

#include "dialogsystemstatisticprogression.h"
#include "ui_dialogsystemstatisticprogression.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemStatisticProgression::DialogSystemStatisticProgression(
        SystemStatisticProgression &statisticProgression,
        QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemStatisticProgression),
    m_statisticProgression(statisticProgression)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemStatisticProgression::~DialogSystemStatisticProgression()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemStatisticProgression::initialize(){

    // Stat
    int statIndex = SuperListItem::getIndexById(
                RPM::get()->project()->gameDatas()->battleSystemDatas()
                ->modelCommonStatistics()->invisibleRootItem(),
                m_statisticProgression.id());
    SuperListItem::fillComboBox(ui->comboBoxStatistic, RPM::get()->project()
                                ->gameDatas()->battleSystemDatas()
                                ->modelCommonStatistics());
    ui->comboBoxStatistic->setCurrentIndex(statIndex);
    on_comboBoxStatistic_currentIndexChanged(statIndex);

    // Initial and final values
    ui->spinBoxInitial->setValue(m_statisticProgression.initialValue());
    ui->spinBoxFinal->setValue(m_statisticProgression.finalValue());

    // Kind of progression
    if (m_statisticProgression.curve() == nullptr)
        ui->radioButtonRandom->setChecked(true);
    else
        ui->radioButtonStatic->setChecked(true);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemStatisticProgression::on_comboBoxStatistic_currentIndexChanged
(int index)
{
    SystemStatisticProgression* prog = (SystemStatisticProgression*)
            RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelCommonStatistics()->item(index)->data().value<qintptr>();
    m_statisticProgression.setId(prog->id());
    m_statisticProgression.setName(prog->name());
}

// -------------------------------------------------------

void DialogSystemStatisticProgression::on_spinBoxInitial_valueChanged(int i){
    m_statisticProgression.setInitialValue(i);
}

// -------------------------------------------------------

void DialogSystemStatisticProgression::on_spinBoxFinal_valueChanged(int i){
    m_statisticProgression.setFinalValue(i);
}
