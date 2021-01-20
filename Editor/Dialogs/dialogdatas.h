/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
#include "systemanimationframe.h"
#include "animationeffectconditionkind.h"

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
    void updateAnimation(SystemAnimation *animation);
    void updateAnimationFrame(SystemAnimationFrame *animationFrame);
    void initializeStatus(GameDatas *gameDatas);
    void updateStatus(SystemStatus *status);
    void initializeTilesets(GameDatas *gameDatas);
    void updateTileset(SystemTileset *sysTileset);
    void openSpecialElementsDialog(PictureKind kind);
    void playAnimation(AnimationEffectConditionKind condition);
    void translate();

protected:
    virtual void showEvent(QShowEvent *event);

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
    void on_pageAnimationFramesSelected(QModelIndex index, QModelIndex);
    void on_pageStatusSelected(QModelIndex index, QModelIndex);
    void on_pushButtonAutotiles_clicked();
    void on_pushButtonSpriteWalls_clicked();
    void on_pushButtonMountains_clicked();
    void on_pushButton3DObjects_clicked();
    void on_tilesetPictureChanged(SystemPicture *picture);
    void on_animationPictureChanged(SystemPicture *picture);
    void on_comboBoxAnimationPosition_currentIndexChanged(int index);
    void on_spinBoxAnimationRows_valueChanged(int i);
    void on_spinBoxAnimationColumns_valueChanged(int i);
    void on_pushButtonChangeBattler_clicked();
    void on_pushButtonCopyFrames_clicked();
    void on_pushButtonClearFrames_clicked();
    void on_pushButtonCreateTransition_clicked();
    void on_pushButtonApplyTexture_clicked();
    void on_pushButtonPlayHit_clicked();
    void on_pushButtonPlayMiss_clicked();
    void on_pushButtonPlayCrit_clicked();
    void onAnimationFinished();
};

#endif // DIALOGDATAS_H
