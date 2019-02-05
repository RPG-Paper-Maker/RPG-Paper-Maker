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
}

PanelProgressionTable::~PanelProgressionTable()
{
    delete ui;
}

SystemRewardTable * PanelProgressionTable::reward() const {
    return m_reward;
}

void PanelProgressionTable::setReward(SystemRewardTable *reward) {
    m_reward = reward;
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
        ui->spinBoxBase->setValue(m_reward->base());
        ui->spinBoxInflation->setValue(m_reward->inflation());
        ui->tableWidget->setTable(reward()->table());
        ui->tableWidget->initialize(m_maxLevel, NAME_EXPERIENCE);
        ui->tableWidget->updateWithBaseInflation(reward()->base(), reward()
            ->inflation(), m_maxLevel);
        m_updating = false;
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelProgressionTable::on_spinBoxBase_valueChanged(int i) {
    m_reward->setBase(i);
    updateProgress();
}

// -------------------------------------------------------

void PanelProgressionTable::on_spinBoxInflation_valueChanged(int i) {
    m_reward->setInflation(i);
    updateProgress();
}

// -------------------------------------------------------

void PanelProgressionTable::on_pushButtonReset_clicked() {
    m_reward->reset();
    m_updating = true;
    ui->spinBoxBase->setValue(m_reward->base());
    ui->spinBoxInflation->setValue(m_reward->inflation());
    m_updating = false;
    updateProgress();
}
