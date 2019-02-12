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
#include "dialogdatas.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemStatisticProgression::DialogSystemStatisticProgression(
        SystemStatisticProgression &statisticProgression) :
    QDialog(qApp->activeModalWidget()),
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

void DialogSystemStatisticProgression::initialize() {
    // Statistic combobox
    int statIndex = SuperListItem::getIndexById(RPM::get()->project()
        ->gameDatas()->battleSystemDatas()->modelCommonStatistics()
        ->invisibleRootItem(), m_statisticProgression.id());
    SuperListItem::fillComboBox(ui->comboBoxStatistic, RPM::get()->project()
        ->gameDatas()->battleSystemDatas()->modelCommonStatistics());
    ui->comboBoxStatistic->setCurrentIndex(statIndex);
    on_comboBoxStatistic_currentIndexChanged(statIndex);

    // Maximum
    ui->panelPrimitiveValueMax->initializeNumberVariable();
    ui->panelPrimitiveValueMax->initializeModel(m_statisticProgression.max());
    ui->panelPrimitiveValueMax->updateValue(true);
    ui->panelPrimitiveValueMax->updateKind();

    // Fix table progression
    if (m_statisticProgression.isFix()) {
        ui->radioButtonFix->setChecked(true);
    } else {
        ui->radioButtonFormula->setChecked(true);
    }
    ui->panelProgressionTable->setProgression(m_statisticProgression.table());
    ui->panelProgressionTable->setMaxLevel(reinterpret_cast<DialogDatas *>(this
        ->parentWidget())->finalLevel());
    ui->panelProgressionTable->gotoGraph();
    ui->panelProgressionTable->updateProgress();
    connect(ui->panelProgressionTable, SIGNAL(finalValueUpdated(int)), this,
        SLOT(on_tableProgressionFinalValueUpdated(int)));

    // Random
    ui->panelPrimitiveValueRandom->initializeNumberVariable();
    ui->panelPrimitiveValueRandom->initializeModel(m_statisticProgression
        .random());
    ui->panelPrimitiveValueRandom->updateValue(true);
    ui->panelPrimitiveValueRandom->updateKind();

    // Formula
    ui->panelPrimitiveValueFormula->initializeMessage();
    ui->panelPrimitiveValueFormula->initializeModel(m_statisticProgression
        .formula());
    ui->panelPrimitiveValueFormula->updateValue(true);
    ui->panelPrimitiveValueFormula->updateKind();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemStatisticProgression::on_comboBoxStatistic_currentIndexChanged
    (int index)
{
    SystemStatisticProgression *prog = reinterpret_cast<
        SystemStatisticProgression *>(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics()->item(index)->data()
        .value<qintptr>());
    m_statisticProgression.setId(prog->id());
    m_statisticProgression.setName(prog->name());
}

// -------------------------------------------------------

void DialogSystemStatisticProgression::on_radioButtonFix_toggled(bool checked) {
    ui->panelProgressionTable->setEnabled(checked);
    ui->labelRandom->setEnabled(checked);
    ui->panelPrimitiveValueRandom->setEnabled(checked);

    m_statisticProgression.setIsFix(checked);
}

// -------------------------------------------------------

void DialogSystemStatisticProgression::on_radioButtonFormula_toggled(bool checked)
{
    ui->panelPrimitiveValueFormula->setEnabled(checked);

    m_statisticProgression.setIsFix(!checked);
}

// -------------------------------------------------------

void DialogSystemStatisticProgression::on_tableProgressionFinalValueUpdated(int
    f)
{
    if (ui->panelPrimitiveValueMax->model()->kind() == PrimitiveValueKind
        ::Number)
    {
        ui->panelPrimitiveValueMax->setNumberValue(f);
    }
}
