/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

DialogSystemStatisticProgression::~DialogSystemStatisticProgression() {
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
    ui->panelPrimitiveValueFormula->initializeMessage(true);
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
