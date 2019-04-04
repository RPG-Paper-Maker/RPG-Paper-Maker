/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
#include "systemanimation.h"
#include "systemstatus.h"

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
    explicit DialogDatas(GameDatas* gameDatas, QWidget *parent = nullptr);
    ~DialogDatas();
    int finalLevel() const;

private:
    Ui::DialogDatas *ui;
    void initializeItems(GameDatas *gameDatas);
    void updateItem(SystemItem *sysItem);
    void initializeSkills(GameDatas *gameDatas);
    void updateSkill(SystemSkill *sysSkill);
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
    void initializeAnimations(GameDatas *gameDatas);
    void updateAnimation(SystemAnimation *sysAnimation);
    void initializeStatus(GameDatas *gameDatas);
    void updateStatus(SystemStatus *sysStatus);
    void initializeTilesets(GameDatas *gameDatas);
    void updateTileset(SystemTileset *sysTileset);
    void openSpecialElementsDialog(PictureKind kind);

private slots:
    void on_tabWidget_currentChanged(int index);
    void on_pageItemsSelected(QModelIndex index, QModelIndex);
    void on_pageSkillsSelected(QModelIndex index, QModelIndex);
    void on_pageWeaponsSelected(QModelIndex index, QModelIndex);
    void on_pageArmorsSelected(QModelIndex index, QModelIndex);
    void on_pageClassesSelected(QModelIndex index, QModelIndex);
    void on_pageHeroSelected(QModelIndex index, QModelIndex);
    void on_pageMonsterSelected(QModelIndex index, QModelIndex);
    void on_pageTroopSelected(QModelIndex index, QModelIndex);
    void on_pageTilesetSelected(QModelIndex index, QModelIndex);
    void on_pageAnimationsSelected(QModelIndex index, QModelIndex);
    void on_pageStatusSelected(QModelIndex index, QModelIndex);
    void on_pushButtonAutotiles_clicked();
    void on_pushButtonSpriteWalls_clicked();
    void on_tilesetPictureChanged(SystemPicture* picture);
};

#endif // DIALOGDATAS_H
