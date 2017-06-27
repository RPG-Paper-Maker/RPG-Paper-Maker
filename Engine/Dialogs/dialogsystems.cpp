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

#include "dialogsystems.h"
#include "ui_dialogsystems.h"
#include "superlistitem.h"
#include "systemitem.h"
#include "systemstatistic.h"
#include "systemcurrency.h"
#include "wanok.h"
#include "systemcreateparameter.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystems::DialogSystems(GameDatas *gameDatas, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystems)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    initializeSystem(gameDatas);
    initializeBattleSystem(gameDatas);
    initializeMainMenu(gameDatas);
    initializeEvents(gameDatas);
    initializeStates(gameDatas);
    initializeCommonReactors(gameDatas);
    initializeCommonObjects(gameDatas);
}

DialogSystems::~DialogSystems()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystems::initializeSystem(GameDatas *gameDatas){
    // Don't show edit name
    ui->panelSuperListCameraMovements->showEditName(false);
    ui->panelSuperListCameraProperties->showEditName(false);
    ui->panelSuperListColors->showEditName(false);
    ui->panelSuperListDetections->showEditName(false);
    ui->panelSuperListCurrencies->showEditName(false);
    ui->panelSuperListParticules->showEditName(false);

    // Initializing all the models
    ui->panelSuperListCurrencies->list()
            ->initializeNewItemInstance(new SystemCurrency);
    ui->panelSuperListCurrencies->list()
            ->initializeModel(gameDatas->systemDatas()->modelCurrencies());
}

// -------------------------------------------------------

void DialogSystems::initializeBattleSystem(GameDatas *gameDatas){
    ui->panelSuperListBattleMaps->showEditName(false);
    ui->panelSuperListCommonBattleCommands->showEditName(false);
    ui->panelSuperListCommonStatistics->showEditName(false);
    ui->panelSuperListElements->showEditName(false);
    ui->panelSuperListWeaponsKind->showEditName(false);
    ui->panelSuperListArmorsKind->showEditName(false);

    // Fill combo boxes
    QVector<SystemStatistic*> level = gameDatas->battleSystemDatas()
            ->getFixStatisticsList();
    QVector<SystemStatistic*> exp = gameDatas->battleSystemDatas()
            ->getBarStatisticsList();
    for (int i = 0; i < level.size(); i++){
        SystemStatistic* statistic = level.at(i);
        ui->comboBoxBattleLevel->addItem(statistic->toString());
        if (statistic->id() == gameDatas->battleSystemDatas()
                ->idStatisticLevel())
            ui->comboBoxBattleLevel->setCurrentIndex(i);
    }
    for (int i = 0; i < exp.size(); i++){
        SystemStatistic* statistic = exp.at(i);
        ui->comboBoxBattleExp->addItem(statistic->toString());
        if (statistic->id() == gameDatas->battleSystemDatas()
                ->idStatisticExp())
            ui->comboBoxBattleExp->setCurrentIndex(i);
    }

    // Initialize models
    ui->panelSuperListWeaponsKind->list()
            ->initializeModel(gameDatas->battleSystemDatas()
                              ->modelWeaponsKind());
    ui->panelSuperListArmorsKind->list()
            ->initializeModel(gameDatas->battleSystemDatas()
                              ->modelArmorsKind());
    ui->panelSuperListElements->list()
            ->initializeModel(gameDatas->battleSystemDatas()
                              ->modelElements());
    ui->panelSuperListCommonEquipments->list()
            ->initializeModel(gameDatas->battleSystemDatas()
                              ->modelCommonEquipment());
    ui->panelSuperListCommonStatistics->list()
            ->initializeModel(gameDatas->battleSystemDatas()
                              ->modelCommonStatistics());
    ui->panelSuperListCommonBattleCommands->list()
            ->initializeModel(gameDatas->battleSystemDatas()
                              ->modelCommonBattleCommand());
}

// -------------------------------------------------------

void DialogSystems::initializeMainMenu(GameDatas *gameDatas){
    ui->panelSuperListItemsTypes->list()->initializeModel(gameDatas
                                                          ->systemDatas()
                                                          ->modelItemsTypes());
}

// -------------------------------------------------------

void DialogSystems::initializeEvents(GameDatas *gameDatas){
    ui->treeViewEventsParameters
            ->initializeNewItemInstance(new SystemCreateParameter);
    ui->panelSuperListEvents->list()
            ->initializeNewItemInstance(new SystemEvent);
    ui->panelSuperListEvents->initializeModel(gameDatas->commonEventsDatas()
                                              ->modelEventsUser());
    connect(ui->panelSuperListEvents->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageEventsSelected(QModelIndex,QModelIndex)));
    QModelIndex index = ui->panelSuperListEvents->list()->getModel()
            ->index(0,0);
    ui->panelSuperListEvents->list()->setCurrentIndex(index);
    on_pageEventsSelected(index,index);
}

// -------------------------------------------------------

void DialogSystems::updateEvents(SystemEvent *sysEvent){
    ui->treeViewEventsParameters->initializeModel(sysEvent->modelParameters());
    ui->treeViewEventsParameters->setColumnWidth(0,400);
    ui->treeViewEventsParameters->setColumnWidth(1,50);
}

// -------------------------------------------------------

void DialogSystems::initializeStates(GameDatas *gameDatas){
    ui->panelSuperListStates->list()->initializeNewItemInstance(
                new SuperListItem);
    ui->panelSuperListStates->initializeModel(gameDatas->commonEventsDatas()
                                              ->modelStates());
    QModelIndex index = ui->panelSuperListStates->list()->getModel()
            ->index(0,0);
    ui->panelSuperListStates->list()->setCurrentIndex(index);
}

// -------------------------------------------------------

void DialogSystems::initializeCommonReactors(GameDatas *gameDatas){
    ui->treeViewCommonReactorsParameters
            ->initializeNewItemInstance(new SystemCreateParameter);
    ui->panelSuperListCommonReactors->list()
            ->initializeNewItemInstance(new SystemCommonReaction);
    ui->panelSuperListCommonReactors
            ->initializeModel(gameDatas->commonEventsDatas()
                              ->modelCommonReactors());
    connect(ui->panelSuperListCommonReactors->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageCommonReactorsSelected(QModelIndex,QModelIndex)));
    QModelIndex index = ui->panelSuperListCommonReactors->list()->getModel()
            ->index(0,0);
    ui->panelSuperListCommonReactors->list()->setCurrentIndex(index);
    on_pageCommonReactorsSelected(index,index);
}

// -------------------------------------------------------

void DialogSystems::updateCommonReactors(SystemCommonReaction *
                                         sysCommonReactor)
{

    // Parameters
    ui->treeViewCommonReactorsParameters->initializeModel(sysCommonReactor
                                                          ->modelParameters());
    ui->treeViewCommonReactorsParameters->setColumnWidth(0,300);
    ui->treeViewCommonReactorsParameters->setColumnWidth(1,100);

    // Commands
    ui->treeCommandsView->initializeModel(sysCommonReactor->modelCommands());

    // Options
    ui->checkBoxCommonReactionBlockingHero->setChecked(sysCommonReactor
                                                       ->blockingHero());
}

// -------------------------------------------------------

void DialogSystems::initializeCommonObjects(GameDatas *gameDatas){
    ui->widgetCommonObject->showName(false);
    ui->panelSuperListCommonObjects->list()
            ->initializeNewItemInstance(new SystemCommonObject);
    ui->panelSuperListCommonObjects
            ->initializeModel(gameDatas->commonEventsDatas()
                              ->modelCommonObjects());
    connect(ui->panelSuperListCommonObjects->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageCommonObjectsSelected(QModelIndex,QModelIndex)));

    // Inheritance comboBox
    ui->widgetCommonObject->initializeList(gameDatas->commonEventsDatas()
                                           ->modelCommonObjects());
    connect(ui->panelSuperListCommonObjects->lineEditName(),
            SIGNAL(textChanged(QString)),
            SLOT(on_commonObjectNameChanged(QString)));
    connect(ui->panelSuperListCommonObjects,
            SIGNAL(maximumChanged()), this,
            SLOT(on_commonObjectMaximumChanged()));

    QModelIndex index = ui->panelSuperListCommonObjects->list()->getModel()
            ->index(0,0);
    ui->panelSuperListCommonObjects->list()->setCurrentIndex(index);
    on_pageCommonObjectsSelected(index,index);
}

// -------------------------------------------------------

void DialogSystems::updateCommonObjects(SystemCommonObject *sysCommonObject){
    ui->widgetCommonObject->initializeModel(sysCommonObject);
    ui->widgetCommonObject->updateModel();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystems::on_pageEventsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListEvents->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr){
        updateEvents((SystemEvent*) selected->data().value<quintptr>());
    }
}

// -------------------------------------------------------

void DialogSystems::on_pageCommonReactorsSelected(QModelIndex index,
                                                  QModelIndex)
{
    QStandardItem* selected = ui->panelSuperListCommonReactors->list()
            ->getModel()->itemFromIndex(index);
    if (selected != nullptr){
        updateCommonReactors((SystemCommonReaction*) selected->data()
                             .value<quintptr>());
    }
}

// -------------------------------------------------------
// Common objects

void DialogSystems::on_pageCommonObjectsSelected(QModelIndex index,
                                                 QModelIndex)
{
    QStandardItem* selected = ui->panelSuperListCommonObjects->list()
            ->getModel()->itemFromIndex(index);
    if (selected != nullptr){
        updateCommonObjects((SystemCommonObject*) selected->data()
                            .value<quintptr>());
    }
}

// -------------------------------------------------------

void DialogSystems::on_commonObjectNameChanged(QString){
    int index = ui->panelSuperListCommonObjects->list()->getIndex();
    QStandardItem* item = ui->panelSuperListCommonObjects->list()
            ->getSelected();
    SystemCommonObject* object = (SystemCommonObject*) item->data()
            .value<quintptr>();
    ui->widgetCommonObject->setInheritanceName(index+1, object->toString());
}

// -------------------------------------------------------

void DialogSystems::on_commonObjectMaximumChanged(){
    ui->widgetCommonObject->initializeList(
                Wanok::get()->project()->gameDatas()->commonEventsDatas()
                ->modelCommonObjects());
    ui->widgetCommonObject->initializeCommonInheritance();
}

// -------------------------------------------------------

void DialogSystems::on_checkBoxCommonReactionBlockingHero_toggled(bool checked){
    QStandardItem* selected = ui->panelSuperListCommonReactors->list()
            ->getSelected();
    if (selected != nullptr){
        SystemCommonReaction* react = (SystemCommonReaction*) selected->data()
                .value<quintptr>();
        react->setBlockingHero(checked);
    }
}
