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

#include <QTreeWidget>
#include "dialogdatas.h"
#include "ui_dialogdatas.h"
#include "datastabkind.h"
#include "superlistitem.h"
#include "wanok.h"
#include "dialogdatasmonsterrewards.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"
#include "dialogtilesetspritewalls.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogDatas::DialogDatas(GameDatas *gameDatas, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogDatas)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    initializeItems(gameDatas);
    initializeSkills(gameDatas);
    initializeWeapons(gameDatas);
    initializeArmors(gameDatas);
    initializeClasses(gameDatas);
    initializeHeroes(gameDatas);
    initializeMonsters(gameDatas);
    initializeTroops(gameDatas);
    initializeTilesets(gameDatas);
}

DialogDatas::~DialogDatas()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogDatas::initializeItems(GameDatas *gameDatas){
    ui->panelSuperListItems->list()->initializeNewItemInstance(new SystemItem);
    ui->panelSuperListItems->initializeModel(gameDatas->itemsDatas()->model());
    connect(ui->panelSuperListItems->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageItemsSelected(QModelIndex,QModelIndex)));
    SuperListItem::fillComboBox(ui->comboBoxItemType, gameDatas->systemDatas()
                                ->modelItemsTypes());
    QModelIndex index = ui->panelSuperListItems->list()->getModel()->index(0,0);
    ui->panelSuperListItems->list()->setCurrentIndex(index);
    on_pageItemsSelected(index, index);
}

// -------------------------------------------------------

void DialogDatas::updateItem(SystemItem* sysItem){
    int i = SuperListItem::getIndexById(Wanok::get()->project()->gameDatas()
                                        ->systemDatas()->modelItemsTypes()
                                        ->invisibleRootItem(),
                           sysItem->idType());
    ui->comboBoxItemType->setCurrentIndex(i+1);
    ui->checkBoxItemConsumable->setChecked(sysItem->consumable());
}

// -------------------------------------------------------

void DialogDatas::initializeSkills(GameDatas *gameDatas){
    ui->panelSuperListSkills->list()->initializeNewItemInstance(
                new SystemSkill);
    ui->panelSuperListSkills->initializeModel(gameDatas->skillsDatas()
                                              ->model());
    ui->panelSuperListSkills->list()->setIndex(0);
}

// -------------------------------------------------------

void DialogDatas::initializeWeapons(GameDatas *gameDatas){
    ui->panelSuperListWeapons->list()->initializeNewItemInstance(
                new SystemWeapon);
    ui->panelSuperListWeapons->initializeModel(gameDatas->weaponsDatas()
                                               ->model());
    connect(ui->panelSuperListWeapons->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageWeaponsSelected(QModelIndex,QModelIndex)));
    SuperListItem::fillComboBox(ui->comboBoxWeaponKind,
                                gameDatas->battleSystemDatas()
                                ->modelWeaponsKind());
    QModelIndex index = ui->panelSuperListWeapons->list()->getModel()
            ->index(0,0);
    ui->panelSuperListWeapons->list()->setCurrentIndex(index);
    on_pageWeaponsSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateWeapon(SystemWeapon *sysWeapon){
    int i = SuperListItem::getIndexById(
                Wanok::get()->project()->gameDatas()->battleSystemDatas()
                ->modelWeaponsKind()->invisibleRootItem(),
                sysWeapon->idKind());
    ui->comboBoxWeaponKind->setCurrentIndex(i);
}

// -------------------------------------------------------

void DialogDatas::initializeArmors(GameDatas *gameDatas){
    ui->panelSuperListArmors->list()->initializeNewItemInstance(
                new SystemArmor);
    ui->panelSuperListArmors->initializeModel(gameDatas->armorsDatas()
                                              ->model());
    connect(ui->panelSuperListArmors->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageArmorsSelected(QModelIndex,QModelIndex)));
    SuperListItem::fillComboBox(ui->comboBoxArmorKind,
                                gameDatas->battleSystemDatas()
                                ->modelArmorsKind());
    QModelIndex index = ui->panelSuperListArmors->list()->getModel()
            ->index(0,0);
    ui->panelSuperListArmors->list()->setCurrentIndex(index);
    on_pageArmorsSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateArmor(SystemArmor *sysArmor){
    int i = SuperListItem::getIndexById(
                Wanok::get()->project()->gameDatas()->battleSystemDatas()
                ->modelArmorsKind()->invisibleRootItem(),
                sysArmor->idKind());
    ui->comboBoxArmorKind->setCurrentIndex(i);
}

// -------------------------------------------------------

void DialogDatas::initializeHeroes(GameDatas *gameDatas){
    ui->panelSuperListHeroes->list()->initializeNewItemInstance(
                new SystemHero);
    ui->panelSuperListHeroes->initializeModel(gameDatas->heroesDatas()
                                              ->model());
    connect(ui->panelSuperListHeroes->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageHeroSelected(QModelIndex,QModelIndex)));
    SuperListItem::fillComboBox(ui->comboBoxHeroClass, gameDatas
                                ->classesDatas()->model());
    QModelIndex index = ui->panelSuperListHeroes->list()->getModel()
            ->index(0,0);
    ui->panelSuperListHeroes->list()->setIndex(0);
    on_pageHeroSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateHero(SystemHero* sysHero){
    int i = SuperListItem::getIndexById(ui->panelSuperListClasses->list()
                                        ->getModel()->invisibleRootItem(),
                           sysHero->idClass());
    ui->comboBoxHeroClass->setCurrentIndex(i);
}

// -------------------------------------------------------

void DialogDatas::initializeMonsters(GameDatas *gameDatas){
    ui->panelSuperListMonsters->list()->initializeNewItemInstance(
                new SystemMonster);
    ui->panelSuperListMonsters->initializeModel(gameDatas->monstersDatas()
                                                ->model());
    connect(ui->panelSuperListMonsters->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageMonsterSelected(QModelIndex,QModelIndex)));
    SuperListItem::fillComboBox(ui->comboBoxMonsterClass,
                                gameDatas->classesDatas()->model());
    QModelIndex index = ui->panelSuperListMonsters->list()->getModel()
            ->index(0,0);
    ui->panelSuperListMonsters->list()->setIndex(0);
    on_pageMonsterSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateMonster(SystemMonster *sysMonster){
    int i = SuperListItem::getIndexById(ui->panelSuperListClasses->list()
                                        ->getModel()->invisibleRootItem(),
                           sysMonster->idClass());
    ui->comboBoxMonsterClass->setCurrentIndex(i);
}

// -------------------------------------------------------

void DialogDatas::initializeTroops(GameDatas *gameDatas){
    ui->panelSuperListTroops->list()->initializeNewItemInstance(
                new SystemTroop);
    ui->panelSuperListTroops->initializeModel(gameDatas->troopsDatas()
                                              ->model());
    connect(ui->panelSuperListTroops->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageTroopSelected(QModelIndex,QModelIndex)));
    QModelIndex index = ui->panelSuperListTroops->list()->getModel()
            ->index(0,0);
    ui->panelSuperListTroops->list()->setIndex(0);
    on_pageTroopSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateTroop(SystemTroop *sysTroop){
    ui->treeViewMonstersList->initializeModel(sysTroop->monstersList());
    ui->treeViewMonstersList->setColumnWidth(0,250);
    ui->treeViewMonstersList->setColumnWidth(1,50);
}

// -------------------------------------------------------

void DialogDatas::initializeClasses(GameDatas *gameDatas){
    ui->panelSuperListClasses->list()->initializeNewItemInstance(
                new SystemClass);
    ui->panelSuperListClasses->initializeModel(gameDatas->classesDatas()
                                               ->model());
    connect(ui->panelSuperListClasses->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageClassesSelected(QModelIndex,QModelIndex)));
    ui->treeViewStatisticsProgression->initializeNewItemInstance(
                new SystemStatisticProgression);
    ui->treeViewClassSkills->initializeNewItemInstance(new SystemClassSkill);
    QModelIndex index = ui->panelSuperListClasses->list()->getModel()
            ->index(0,0);
    ui->panelSuperListClasses->list()->setIndex(0);
    on_pageClassesSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateClass(SystemClass* sysClass){
    ui->spinBoxClassInitialLevel->setValue(sysClass->initialLevel());
    ui->spinBoxClassMaxLevel->setValue(sysClass->maxLevel());
    ui->spinBoxClassBase->setValue(sysClass->expBase());
    ui->spinBoxClassInflation->setValue(sysClass->expInflation());
    ui->treeViewStatisticsProgression->initializeModel(
                sysClass->statisticsProgression());
    ui->treeViewStatisticsProgression->setColumnWidth(0,200);
    ui->treeViewStatisticsProgression->setColumnWidth(1,50);
    ui->treeViewStatisticsProgression->setColumnWidth(2,50);
    ui->treeViewClassSkills->initializeModel(sysClass->skills());
    ui->treeViewClassSkills->setColumnWidth(0,250);
}

// -------------------------------------------------------

void DialogDatas::initializeTilesets(GameDatas *gameDatas){

    // Initialize name & pictures
    ui->panelSuperListTilesets->list()->initializeNewItemInstance(
                new SystemTileset);
    ui->panelSuperListTilesets->initializeModel(gameDatas->tilesetsDatas()
                                                ->model());
    connect(ui->panelSuperListTilesets->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageTilesetSelected(QModelIndex,QModelIndex)));
    ui->widgetPictureTileset->setKind(PictureKind::Tilesets);
    ui->widgetTilesetPictureSettings->setKind(PictureKind::Tilesets);
    connect(ui->widgetPictureTileset, SIGNAL(pictureChanged(SystemPicture*)),
            this, SLOT(on_tilesetPictureChanged(SystemPicture*)));

    // Initialize special elements
    ui->panelSuperListTilesetAutotiles->showButtonMax(false);
    ui->panelSuperListTilesetAutotiles->showEditName(false);
    ui->panelSuperListTilesetSpriteWalls->showButtonMax(false);
    ui->panelSuperListTilesetSpriteWalls->showEditName(false);
    ui->panelSuperListTileset3DObjects->showButtonMax(false);
    ui->panelSuperListTileset3DObjects->showEditName(false);
    ui->panelSuperListTilesetReliefs->showButtonMax(false);
    ui->panelSuperListTilesetReliefs->showEditName(false);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListTilesets->list()->getModel()
            ->index(0,0);
    ui->panelSuperListTilesets->list()->setIndex(0);
    on_pageTilesetSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateTileset(SystemTileset *sysTileset){
    ui->widgetPictureTileset->setPicture(sysTileset->picture());
    ui->widgetTilesetPictureSettings->updateImage(sysTileset->picture());
    ui->panelSuperListTilesetAutotiles->initializeModel(
                sysTileset->modelAutotiles());
    ui->panelSuperListTilesetSpriteWalls->initializeModel(
                sysTileset->modelSpriteWalls());
    ui->panelSuperListTileset3DObjects->initializeModel(
                sysTileset->model3DObjects());
    ui->panelSuperListTilesetReliefs->initializeModel(
                sysTileset->modelReliefs());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogDatas::on_comboBoxItemType_currentIndexChanged(int index){
    QStandardItem* item;
    if (index != 0){
        item = Wanok::get()->project()->gameDatas()->systemDatas()
                ->modelItemsTypes()->item(index-1);
        index = ((SystemItem*)item->data().value<quintptr>())->id();
    }

    int i = ui->panelSuperListItems->list()->getIndex();
    item = ui->panelSuperListItems->list()->getModel()->item(i);
    SystemItem* sysItem = ((SystemItem*)item->data().value<quintptr>());
    sysItem->setIdType(index);
}

// -------------------------------------------------------

void DialogDatas::on_checkBoxItemConsumable_toggled(bool checked){
    QStandardItem* selected = ui->panelSuperListItems->list()
            ->getSelected();
    SystemItem* sysItem = ((SystemItem*)selected->data().value<quintptr>());
    sysItem->setConsumable(checked);
}

// -------------------------------------------------------

void DialogDatas::on_pageItemsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListItems->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateItem((SystemItem*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogDatas::on_pageWeaponsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListWeapons->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateWeapon((SystemWeapon*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogDatas::on_pageArmorsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListArmors->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateArmor((SystemArmor*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogDatas::on_pageClassesSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListClasses->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateClass((SystemClass*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogDatas::on_pageHeroSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListHeroes->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateHero((SystemHero*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogDatas::on_pageMonsterSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListMonsters->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateMonster((SystemMonster*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogDatas::on_pageTroopSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListTroops->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateTroop((SystemTroop*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogDatas::on_pageTilesetSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListTilesets->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateTileset((SystemTileset*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogDatas::on_tilesetPictureChanged(SystemPicture* picture){
    SystemTileset* tileset = (SystemTileset*) ui->panelSuperListTilesets->list()
            ->getSelected()->data().value<quintptr>();

    tileset->setPicture(picture);
    ui->widgetTilesetPictureSettings->updateImage(picture);
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonSpriteWalls_clicked() {
    DialogTilesetSpriteWalls dialog;

    if (dialog.exec() == QDialog::Accepted){

    }
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonMonsterbattleRewards_clicked(){
    QStandardItem* selected = ui->panelSuperListMonsters->list()
            ->getSelected();
    SystemMonster* monster = (SystemMonster*)selected->data()
            .value<quintptr>();
    SystemMonster monsterCopy;
    monsterCopy.setCopy(*monster);
    DialogDatasMonsterRewards dialog(monsterCopy);
    if (dialog.exec() == QDialog::Accepted){
        monster->setCopy(monsterCopy);
    }
}
