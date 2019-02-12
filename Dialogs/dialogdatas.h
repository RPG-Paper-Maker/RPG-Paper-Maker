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

#ifndef DIALOGDATAS_H
#define DIALOGDATAS_H

#include <QDialog>
#include "eventcommand.h"
#include "gamedatas.h"
#include "systemitem.h"
#include "systemclass.h"
#include "systemhero.h"
#include "systemweapon.h"
#include "systemarmor.h"
#include "systemmonster.h"
#include "systemtroop.h"
#include "systemskill.h"
#include "systemtileset.h"

// -------------------------------------------------------
//
//  CLASS DialogDatas
//
//  A dialog used for configuring the main datas of the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogDatas;
}

class DialogDatas : public QDialog
{
    Q_OBJECT

public:
    explicit DialogDatas(GameDatas* gameDatas, QWidget *parent = 0);
    ~DialogDatas();
    int finalLevel() const;

private:
    Ui::DialogDatas *ui;
    void initializeItems(GameDatas *gameDatas);
    void updateItem(SystemItem *sysItem);
    void initializeSkills(GameDatas *gameDatas);
    void initializeWeapons(GameDatas *gameDatas);
    void updateWeapon(SystemWeapon *sysWeapon);
    void initializeArmors(GameDatas *gameDatas);
    void updateArmor(SystemArmor *sysArmor);
    void initializeHeroes(GameDatas *gameDatas);
    void updateHero(SystemHero *sysHero);
    void initializeMonsters(GameDatas *gameDatas);
    void updateMonster(SystemMonster *sysMonster);
    void initializeTroops(GameDatas *gameDatas);
    void updateTroop(SystemTroop *sysTroop);
    void initializeClasses(GameDatas *gameDatas);
    void updateClass(SystemClass *sysClass);
    void initializeTilesets(GameDatas *gameDatas);
    void updateTileset(SystemTileset *sysTileset);
    void openSpecialElementsDialog(PictureKind kind);

private slots:
    void on_tabWidget_currentChanged(int index);
    void on_comboBoxItemType_currentIndexChanged(int index);
    void on_checkBoxItemConsumable_toggled(bool checked);
    void on_pageItemsSelected(QModelIndex index, QModelIndex);
    void on_pageWeaponsSelected(QModelIndex index, QModelIndex);
    void on_pageArmorsSelected(QModelIndex index, QModelIndex);
    void on_pageClassesSelected(QModelIndex index, QModelIndex);
    void on_pageHeroSelected(QModelIndex index, QModelIndex);
    void on_pageMonsterSelected(QModelIndex index, QModelIndex);
    void on_pageTroopSelected(QModelIndex index, QModelIndex);
    void on_pageTilesetSelected(QModelIndex index, QModelIndex);
    void on_pushButtonAutotiles_clicked();
    void on_pushButtonSpriteWalls_clicked();
    void on_tilesetPictureChanged(SystemPicture* picture);
};

#endif // DIALOGDATAS_H
