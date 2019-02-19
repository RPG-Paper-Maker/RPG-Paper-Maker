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

#include "paneldatasmonster.h"
#include "ui_paneldatasmonster.h"
#include "paneldatascharacter.h"
#include "rpm.h"
#include "systemcurrency.h"
#include "systemloot.h"

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

int PanelDatasMonster::finalLevel() const {
    return ui->panelDatasCharacter->finalLevel();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDatasMonster::initialize() {
    connect(ui->panelDatasCharacter->panelDatasClass(), SIGNAL(maxLevelUpdated(
        int)), this, SLOT(on_maxLevelChanged(int)));

    ui->treeViewLoots->initializeNewItemInstance(new SystemLoot);
}

// -------------------------------------------------------

void PanelDatasMonster::update(SystemMonster *monster, int classIndex) {
    int i, l;

    ui->panelDatasCharacter->update(monster, classIndex);
    ui->panelProgressionTableRewardExp->setProgression(monster->experience());
    ui->panelProgressionTableRewardExp->setMaxLevel(monster->maxLevel());
    ui->panelProgressionTableRewardExp->updateProgress();

    // Clear tabs currencies
    for (i = 0, l = ui->tabWidgetCurrencies->count(); i < l; i++) {
        delete reinterpret_cast<PanelProgressionTable *>(ui->tabWidgetCurrencies
            ->widget(i));
    }
    ui->tabWidgetCurrencies->clear();

    // Fill tabs currencies
    QStandardItemModel *currencies = RPM::get()->project()->gameDatas()
        ->systemDatas()->modelCurrencies();
    SystemProgressionTable *progression;
    PanelProgressionTable *widget;
    SystemCurrency *currency;
    for (i = 0, l = currencies->invisibleRootItem()->rowCount(); i < l; i++) {
        currency = reinterpret_cast<SystemCurrency *>(currencies->item(i)->data()
            .value<quintptr>());
        progression = monster->currencyProgressionAt(currency->id());
        if (progression == nullptr) {
            progression = new SystemProgressionTable;
            monster->insertCurrency(currency->id(), progression);
        }
        widget = new PanelProgressionTable;
        widget->setProgression(progression);
        widget->setMaxLevel(monster->maxLevel());
        widget->updateProgress();
        ui->tabWidgetCurrencies->addTab(widget, currency->name());
    }

    // Loots
    ui->treeViewLoots->initializeModel(monster->modelLoots());
    ui->treeViewLoots->header()->setSectionResizeMode(0, QHeaderView::Stretch);
    ui->treeViewLoots->header()->setSectionResizeMode(1, QHeaderView::Interactive);
    ui->treeViewLoots->header()->setSectionResizeMode(2, QHeaderView::Interactive);
    ui->treeViewLoots->header()->setSectionResizeMode(3, QHeaderView::Interactive);
    ui->treeViewLoots->header()->setSectionResizeMode(4, QHeaderView::Interactive);
}

// -------------------------------------------------------

SystemMonster * PanelDatasMonster::currentMonster() {
    return reinterpret_cast<SystemMonster *>(ui->panelDatasCharacter
        ->currentHero());
}

// -------------------------------------------------------

void PanelDatasMonster::updateClasses() {
    ui->panelDatasCharacter->updateClasses();
}

// -------------------------------------------------------

void PanelDatasMonster::updateClass() {
    ui->panelDatasCharacter->updateClass();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelDatasMonster::on_maxLevelChanged(int lvl) {
    ui->panelProgressionTableRewardExp->setMaxLevel(lvl);
    ui->panelProgressionTableRewardExp->updateProgress();
}
