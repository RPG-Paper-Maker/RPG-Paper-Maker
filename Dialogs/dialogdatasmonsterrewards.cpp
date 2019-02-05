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

#include "dialogdatasmonsterrewards.h"
#include "ui_dialogdatasmonsterrewards.h"
#include "systemcurrency.h"
#include "systemloot.h"
#include "main.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogDatasMonsterRewards::DialogDatasMonsterRewards(SystemMonster &monster,
                                                     QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogDatasMonsterRewards),
    m_monster(monster)
{
    ui->setupUi(this);
    

    initialize();
}

DialogDatasMonsterRewards::~DialogDatasMonsterRewards()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogDatasMonsterRewards::initialize(){
    SystemLoot* loot = new SystemLoot;

    ui->treeViewCurrencies->initializeNewItemInstance(new SystemCurrency);
    loot->updateName();
    ui->treeViewLoots->initializeNewItemInstance(loot);

    //ui->spinBoxExp->setValue(m_monster.exp());
    ui->treeViewCurrencies->initializeModel(m_monster.modelCurrencies());
    ui->treeViewCurrencies->setColumnWidth(0,180);
    ui->treeViewCurrencies->setColumnWidth(1,100);
    ui->treeViewLoots->initializeModel(m_monster.modelLoots());
    ui->treeViewLoots->setColumnWidth(0,180);
    ui->treeViewLoots->setColumnWidth(1,100);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogDatasMonsterRewards::on_spinBoxExp_valueChanged(int i){
    //m_monster.setExp(i);
}
