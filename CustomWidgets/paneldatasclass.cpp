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

#include "paneldatasclass.h"
#include "ui_paneldatasclass.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelDatasClass::PanelDatasClass(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelDatasClass)
{
    ui->setupUi(this);
}

PanelDatasClass::~PanelDatasClass()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDatasClass::initialize() {
    ui->treeViewStatisticsProgression->initializeNewItemInstance(new
        SystemStatisticProgression);
    ui->treeViewClassSkills->initializeNewItemInstance(new SystemClassSkill);
}

// -------------------------------------------------------

void PanelDatasClass::update(SystemClass *sysClass, SystemClass *originalClass)
{
    m_class = sysClass;
    m_originalClass = originalClass;
    ui->spinBoxClassInitialLevel->setValue(getInheritValue(sysClass
        ->initialLevel(), originalClass->initialLevel()));
    ui->spinBoxClassMaxLevel->setValue(getInheritValue(sysClass->maxLevel(),
        originalClass->maxLevel()));
    ui->spinBoxClassBase->setValue(getInheritValue(sysClass->expBase(),
        originalClass->expBase()));
    ui->spinBoxClassInflation->setValue(getInheritValue(sysClass->expInflation(),
        originalClass->expInflation()));
    ui->treeViewStatisticsProgression->initializeModel(sysClass
        ->statisticsProgression());
    ui->treeViewStatisticsProgression->setColumnWidth(0,200);
    ui->treeViewStatisticsProgression->setColumnWidth(1,50);
    ui->treeViewStatisticsProgression->setColumnWidth(2,50);
    ui->treeViewClassSkills->initializeModel(sysClass->skills());
    ui->treeViewClassSkills->setColumnWidth(0,250);

    if (m_class == m_originalClass) {
        ui->pushButtonSetClassValues->setVisible(false);
    }
}

// -------------------------------------------------------

int PanelDatasClass::getInheritValue(int v1, int v2) {
    return v1 == -1 ? v2 : v1;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassInitialLevel_valueChanged(int i) {
    m_class->setInitialLevel(i, m_originalClass);
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassMaxLevel_valueChanged(int i) {
    m_class->setMaxLevel(i, m_originalClass);
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassBase_valueChanged(int i) {
    m_class->setExpBase(i, m_originalClass);
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassInflation_valueChanged(int i) {
    m_class->setExpInflation(i, m_originalClass);
}

// -------------------------------------------------------

void PanelDatasClass::on_pushButtonSetClassValues_clicked() {
    ui->spinBoxClassInitialLevel->setValue(m_originalClass->initialLevel());
    ui->spinBoxClassMaxLevel->setValue(m_originalClass->maxLevel());
    ui->spinBoxClassBase->setValue(m_originalClass->expBase());
    ui->spinBoxClassInflation->setValue(m_originalClass->expInflation());
}
