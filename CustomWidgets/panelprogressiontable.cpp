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

#include "panelprogressiontable.h"
#include "ui_panelprogressiontable.h"

const QString PanelProgressionTable::NAME_EXPERIENCE = "Experience";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelProgressionTable::PanelProgressionTable(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelProgressionTable),
    m_updating(false)
{
    ui->setupUi(this);

    ui->panelPrimitiveValueInitial->initializeNumberVariable();
    ui->panelPrimitiveValueFinal->initializeNumberVariable();
    connect(ui->panelPrimitiveValueInitial, SIGNAL(numberUpdated(int)), this,
        SLOT(on_spinBoxInitValueChanged(int)));
    connect(ui->panelPrimitiveValueFinal, SIGNAL(numberUpdated(int)), this,
        SLOT(on_spinBoxFinalValueChanged(int)));

    Q_FOREACH(QSlider * sl, findChildren<QSlider *>()) {
        sl->installEventFilter(this);
    }
}

PanelProgressionTable::~PanelProgressionTable()
{
    ui->graphicsView->chart()->removeAllSeries();
    delete ui;
}

SystemProgressionTable * PanelProgressionTable::progression() const {
    return m_progression;
}

void PanelProgressionTable::setProgression(SystemProgressionTable *progression) {
    m_progression = progression;
    ui->panelPrimitiveValueInitial->initializeModel(m_progression->initialValue());
    ui->panelPrimitiveValueFinal->initializeModel(m_progression->finalValue());
}

int PanelProgressionTable::maxLevel() const {
    return m_maxLevel;
}

void PanelProgressionTable::setMaxLevel(int l) {
    m_maxLevel = l;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelProgressionTable::updateProgress() {
    if (!m_updating) {
        m_updating = true;
        ui->panelPrimitiveValueInitial->updateValue(true);
        ui->panelPrimitiveValueInitial->updateKind();
        ui->panelPrimitiveValueFinal->updateValue(true);
        ui->panelPrimitiveValueFinal->updateKind();
        ui->tableWidget->setTable(m_progression->table());
        ui->tableWidget->initialize(m_maxLevel, NAME_EXPERIENCE);
        ui->tableWidget->updateWithEasing(m_progression, ui->graphicsView,
            m_maxLevel);
        m_updating = false;
    }
}

// -------------------------------------------------------

void PanelProgressionTable::gotoGraph() {
    ui->tabWidget->setCurrentIndex(1);
}

// -------------------------------------------------------

bool PanelProgressionTable::eventFilter(QObject *o, QEvent *e) {

    if (e->type() == QEvent::Wheel && !reinterpret_cast<QWidget *>(o)->hasFocus())
    {
        e->ignore();
        return true;
    }
    return QWidget::eventFilter(o, e);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelProgressionTable::on_tabWidget_currentChanged(int index) {
    if (index == 1) {
        updateProgress();
    }
}

// -------------------------------------------------------

void PanelProgressionTable::on_spinBoxInitValueChanged(int) {
    updateProgress();
}

// -------------------------------------------------------

void PanelProgressionTable::on_spinBoxFinalValueChanged(int i) {
    updateProgress();

    emit finalValueUpdated(i);
}

// -------------------------------------------------------

void PanelProgressionTable::on_horizontalSlider_valueChanged(int i) {
    m_progression->setEquation(i);
    updateProgress();
}

// -------------------------------------------------------

void PanelProgressionTable::on_pushButtonReset_clicked() {
    m_progression->reset();
    m_updating = true;
    ui->panelPrimitiveValueInitial->updateValue(true);
    ui->panelPrimitiveValueInitial->updateKind();
    ui->panelPrimitiveValueFinal->updateValue(true);
    ui->panelPrimitiveValueFinal->updateKind();
    ui->horizontalSlider->setValue(m_progression->equation());
    m_updating = false;
    updateProgress();
}
