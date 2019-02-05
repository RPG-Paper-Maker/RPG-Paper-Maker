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

#include "paneldatasmonster.h"
#include "ui_paneldatasmonster.h"
#include "paneldatascharacter.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelDatasMonster::PanelDatasMonster(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelDatasMonster)
{
    ui->setupUi(this);
}

PanelDatasMonster::~PanelDatasMonster()
{
    delete ui;
}

void PanelDatasMonster::setPanelSuperList(PanelSuperList *list) {
    m_panelSuperList = list;
    ui->panelDatasCharacter->setPanelSuperList(list);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDatasMonster::initialize() {
    ui->panelDatasCharacter->initialize();

    // Initialize
    /*
    m_completingTableExp = true;
    ui->tableWidgetNextLevel->clear();
    ui->tableWidgetNextLevel->setRowCount(maxLevel - 1);
    ui->tableWidgetNextLevel->setColumnCount(2);
    ui->tableWidgetNextLevel->setHorizontalHeaderItem(0, new QTableWidgetItem(
        NAME_LEVEL));
    ui->tableWidgetNextLevel->setHorizontalHeaderItem(1, new QTableWidgetItem(
        NAME_EXPERIENCE));
    ui->tableWidgetNextLevel->verticalHeader()->hide();
    ui->tableWidgetTotalLevel->clear();
    ui->tableWidgetTotalLevel->setRowCount(maxLevel);
    ui->tableWidgetTotalLevel->setColumnCount(2);
    ui->tableWidgetTotalLevel->setHorizontalHeaderItem(0, new QTableWidgetItem(
        NAME_LEVEL));
    ui->tableWidgetTotalLevel->setHorizontalHeaderItem(1, new QTableWidgetItem(
        NAME_EXPERIENCE));
    ui->tableWidgetTotalLevel->verticalHeader()->hide();

    // Complete basic table
    ui->tableWidgetTotalLevel->setItem(0, 0, new QTableWidgetItem(QString
        ::number(1)));
    ui->tableWidgetTotalLevel->setItem(0, 1, new QTableWidgetItem(QString
        ::number(0)));
    for (int i = 2; i <= maxLevel; i++) {
        exp = qFloor(expBase * (qPow(i + 3, pow) / qPow(5, pow)));
        total += exp;
        ui->tableWidgetNextLevel->setItem(i - 2, 0, new QTableWidgetItem(QString
            ::number(i - 1)));
        ui->tableWidgetNextLevel->setItem(i - 2, 1, new QTableWidgetItem(QString
            ::number(exp)));
        ui->tableWidgetTotalLevel->setItem(i - 1, 0, new QTableWidgetItem(QString
            ::number(i)));
        ui->tableWidgetTotalLevel->setItem(i - 1, 1, new QTableWidgetItem(QString
            ::number(total)));
    }*/
}

// -------------------------------------------------------

void PanelDatasMonster::update(SystemHero *hero, int classIndex) {
    ui->panelDatasCharacter->update(hero, classIndex);
}

// -------------------------------------------------------

SystemHero * PanelDatasMonster::currentHero() {
    return ui->panelDatasCharacter->currentHero();
}

// -------------------------------------------------------

void PanelDatasMonster::updateClasses() {
    ui->panelDatasCharacter->updateClasses();
}

// -------------------------------------------------------

void PanelDatasMonster::updateClass() {
    ui->panelDatasCharacter->updateClass();
}
