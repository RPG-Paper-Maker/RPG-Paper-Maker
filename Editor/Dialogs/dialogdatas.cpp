/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QTreeWidget>
#include <QScrollBar>
#include <QMessageBox>
#include "dialogdatas.h"
#include "ui_dialogdatas.h"
#include "datastabkind.h"
#include "superlistitem.h"
#include "rpm.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"
#include "systemmonstertroop.h"
#include "systemanimationframeeffect.h"
#include "dialogtilesetspecialelements.h"
#include "dialogpicturespreview.h"
#include "dialoganimationcopyframes.h"
#include "dialoganimationclearframes.h"
#include "dialoganimationcreatetransition.h"

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
    
    initializeItems(gameDatas);
    initializeSkills(gameDatas);
    initializeWeapons(gameDatas);
    initializeArmors(gameDatas);
    initializeClasses(gameDatas);
    initializeHeroes(gameDatas);
    initializeMonsters(gameDatas);
    initializeTroops(gameDatas);
    initializeTilesets(gameDatas);
    initializeAnimations(gameDatas);
    initializeStatus(gameDatas);

    ui->panelSuperListClasses->list()->setFocus(Qt::FocusReason::MouseFocusReason);
}

DialogDatas::~DialogDatas()
{
    delete ui;
}

int DialogDatas::finalLevel() const {
    switch (ui->tabWidget->currentIndex()) {
    case 0:
        return ui->panelDatasClass->finalLevel();
    case 1:
        return ui->panelDatasHero->finalLevel();
    case 2:
        return ui->panelDatasMonster->finalLevel();
    default:
        return 0;
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogDatas::initializeItems(GameDatas *gameDatas) {
    ui->panelSuperListItems->setIsLang(true);
    ui->panelSuperListItems->list()->initializeNewItemInstance(new SystemItem);
    ui->panelSuperListItems->initializeModel(gameDatas->itemsDatas()->model());
    ui->panelSuperListItems->showEditName(true);
    ui->panelDatasItems->initialize(CommonSkillItemKind::Item);

    connect(ui->panelSuperListItems->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex,QModelIndex)), this, SLOT(
        on_pageItemsSelected(QModelIndex,QModelIndex)));
    QModelIndex index = ui->panelSuperListItems->list()->getModel()->index(0,0);
    ui->panelSuperListItems->list()->setCurrentIndex(index);
    on_pageItemsSelected(index, index);
}

// -------------------------------------------------------

void DialogDatas::updateItem(SystemItem *sysItem) {
    ui->panelDatasItems->update(sysItem);
}

// -------------------------------------------------------

void DialogDatas::initializeSkills(GameDatas *gameDatas){
    ui->panelSuperListSkills->setIsLang(true);
    ui->panelSuperListSkills->list()->initializeNewItemInstance(
                new SystemSkill);
    ui->panelSuperListSkills->initializeModel(gameDatas->skillsDatas()
                                              ->model());
    ui->panelSuperListSkills->showEditName(true);
    ui->panelDatasSkill->initialize(CommonSkillItemKind::Skill);

    connect(ui->panelSuperListSkills->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex, QModelIndex)), this, SLOT(
        on_pageSkillsSelected(QModelIndex, QModelIndex)));
    QModelIndex index = ui->panelSuperListSkills->list()->getModel()->index(0,0);
    ui->panelSuperListSkills->list()->setCurrentIndex(index);
    on_pageSkillsSelected(index, index);
}

// -------------------------------------------------------

void DialogDatas::updateSkill(SystemSkill *sysSkill) {
    ui->panelDatasSkill->update(sysSkill);
}

// -------------------------------------------------------

void DialogDatas::initializeWeapons(GameDatas *gameDatas) {
    ui->panelSuperListWeapons->setIsLang(true);
    ui->panelSuperListWeapons->list()->initializeNewItemInstance(new SystemWeapon);
    ui->panelSuperListWeapons->initializeModel(gameDatas->weaponsDatas()->model());
    ui->panelSuperListWeapons->showEditName(true);
    ui->panelDatasWeapons->initialize(CommonSkillItemKind::Weapon);

    connect(ui->panelSuperListWeapons->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex, QModelIndex)), this, SLOT(
        on_pageWeaponsSelected(QModelIndex, QModelIndex)));
    QModelIndex index = ui->panelSuperListWeapons->list()->getModel()->index(0,0);
    ui->panelSuperListWeapons->list()->setCurrentIndex(index);
    on_pageWeaponsSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateWeapon(SystemWeapon *sysWeapon) {
    ui->panelDatasWeapons->update(sysWeapon);
}

// -------------------------------------------------------

void DialogDatas::initializeArmors(GameDatas *gameDatas) {
    ui->panelSuperListArmors->setIsLang(true);
    ui->panelSuperListArmors->list()->initializeNewItemInstance(new SystemArmor);
    ui->panelSuperListArmors->initializeModel(gameDatas->armorsDatas()->model());
    ui->panelSuperListArmors->showEditName(true);
    ui->panelDatasArmors->initialize(CommonSkillItemKind::Armor);

    connect(ui->panelSuperListArmors->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex, QModelIndex)), this, SLOT(
        on_pageArmorsSelected(QModelIndex, QModelIndex)));
    QModelIndex index = ui->panelSuperListArmors->list()->getModel()->index(0,0);
    ui->panelSuperListArmors->list()->setCurrentIndex(index);
    on_pageArmorsSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateArmor(SystemArmor *sysArmor) {
    ui->panelDatasArmors->update(sysArmor);
}

// -------------------------------------------------------

void DialogDatas::initializeHeroes(GameDatas *gameDatas) {
    ui->panelSuperListHeroes->setIsLang(true);
    ui->panelSuperListHeroes->list()->initializeNewItemInstance(new SystemHero);
    ui->panelSuperListHeroes->initializeModel(gameDatas->heroesDatas()->model());
    ui->panelSuperListHeroes->showEditName(true);
    ui->panelDatasHero->setPanelSuperList(ui->panelSuperListHeroes);
    connect(ui->panelSuperListHeroes->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex,QModelIndex)), this, SLOT(
        on_pageHeroSelected(QModelIndex,QModelIndex)));
    QModelIndex index = ui->panelSuperListHeroes->list()->getModel()->index(0, 0);
    ui->panelSuperListHeroes->list()->setIndex(0);
    on_pageHeroSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateHero(SystemHero *sysHero) {
    int i = SuperListItem::getIndexById(ui->panelSuperListClasses->list()
        ->getModel()->invisibleRootItem(), sysHero->idClass(), true);
    ui->panelDatasHero->update(sysHero, i);
}

// -------------------------------------------------------

void DialogDatas::initializeMonsters(GameDatas *gameDatas){
    ui->panelSuperListMonsters->setIsLang(true);
    ui->panelSuperListMonsters->list()->initializeNewItemInstance(new
        SystemMonster);
    ui->panelSuperListMonsters->initializeModel(gameDatas->monstersDatas()
        ->model());
    ui->panelSuperListMonsters->showEditName(true);
    ui->panelDatasMonster->setPanelSuperList(ui->panelSuperListMonsters);
    connect(ui->panelSuperListMonsters->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex,QModelIndex)), this, SLOT(
        on_pageMonsterSelected(QModelIndex,QModelIndex)));
    ui->panelDatasMonster->initialize();
    QModelIndex index = ui->panelSuperListMonsters->list()->getModel()->index(0,
        0);
    ui->panelSuperListMonsters->list()->setIndex(0);
    on_pageMonsterSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateMonster(SystemMonster *sysMonster){
    int i = SuperListItem::getIndexById(ui->panelSuperListClasses->list()
        ->getModel()->invisibleRootItem(), sysMonster->idClass());
    ui->panelDatasMonster->update(sysMonster, i);
}

// -------------------------------------------------------

void DialogDatas::initializeTroops(GameDatas *gameDatas){
    ui->panelSuperListTroops->list()->initializeNewItemInstance(
                new SystemTroop);
    ui->panelSuperListTroops->initializeModel(gameDatas->troopsDatas()
                                              ->model());
    ui->treeViewMonstersList->initializeNewItemInstance(new SystemMonsterTroop);
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
    ui->panelSuperListClasses->setIsLang(true);
    ui->panelSuperListClasses->list()->initializeNewItemInstance(
                new SystemClass);
    ui->panelSuperListClasses->initializeModel(gameDatas->classesDatas()
                                               ->model());
    ui->panelSuperListClasses->showEditName(true);
    connect(ui->panelSuperListClasses->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageClassesSelected(QModelIndex,QModelIndex)));
    ui->panelDatasClass->initialize();
    QModelIndex index = ui->panelSuperListClasses->list()->getModel()
            ->index(0,0);
    ui->panelSuperListClasses->list()->setIndex(0);
    on_pageClassesSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateClass(SystemClass* sysClass) {
    ui->panelDatasClass->update(sysClass, sysClass);
}

// -------------------------------------------------------

void DialogDatas::initializeAnimations(GameDatas *gameDatas) {
    ui->widgetAnimation->setWidgetAnimationTexture(ui->widgetAnimationTexture);
    ui->treeViewEffects->initializeNewItemInstance(new
        SystemAnimationFrameEffect);
    connect(ui->widgetAnimation, SIGNAL(animationFinished()), this, SLOT(
        onAnimationFinished()));
    ui->widgetPictureAnimation->setKind(PictureKind::Animations);
    connect(ui->widgetPictureAnimation, SIGNAL(pictureChanged(SystemPicture *)),
        this, SLOT(on_animationPictureChanged(SystemPicture *)));
    ui->widgetAnimation->setScrollArea(ui->scrollAreaAnimation);
    ui->panelSuperListAnimationFrames->list()->initializeNewItemInstance(new
        SystemAnimationFrame);
    ui->panelSuperListAnimations->list()->initializeNewItemInstance(new
        SystemAnimation);
    ui->panelSuperListAnimations->initializeModel(gameDatas->animationsDatas()
        ->model());
    connect(ui->panelSuperListAnimations->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex, QModelIndex)), this, SLOT(
        on_pageAnimationsSelected(QModelIndex, QModelIndex)));
    QModelIndex index = ui->panelSuperListAnimations->list()->getModel()->index(
        0, 0);
    ui->panelSuperListAnimations->list()->setIndex(0);
    AnimationPositionKind pos = reinterpret_cast<SystemAnimation *>(ui
        ->panelSuperListAnimations->list()->getSelected()->data().value<quintptr
        >())->positionKind();
    ui->comboBoxAnimationPosition->addItems(RPM
        ::ENUM_TO_STRING_ANIMATION_POSITION_KIND);
    ui->comboBoxAnimationPosition->setCurrentIndex(static_cast<int>(pos));
    on_pageAnimationsSelected(index, index);
    connect(ui->panelSuperListAnimationFrames->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex, QModelIndex)), this, SLOT(
        on_pageAnimationFramesSelected(QModelIndex, QModelIndex)));
}

// -------------------------------------------------------

void DialogDatas::updateAnimation(SystemAnimation *animation) {
    ui->widgetPictureAnimation->setPicture(animation->picture());
    ui->spinBoxAnimationRows->setValue(animation->rows());
    ui->spinBoxAnimationColumns->setValue(animation->columns());
    ui->comboBoxAnimationPosition->setCurrentIndex(static_cast<int>(animation
        ->positionKind()));
    ui->panelSuperListAnimationFrames->initializeModel(animation->framesModel());
    QModelIndex index = ui->panelSuperListAnimationFrames->list()->getModel()
        ->index(0, 0);
    ui->panelSuperListAnimationFrames->list()->setIndex(0);
    this->on_pageAnimationFramesSelected(index, index);
}

// -------------------------------------------------------

void DialogDatas::updateAnimationFrame(SystemAnimationFrame *animationFrame) {
    ui->widgetAnimation->setCurrentFrame(animationFrame);
    ui->treeViewEffects->initializeModel(animationFrame->modelEffects());
    ui->treeViewEffects->header()->setSectionResizeMode(0, QHeaderView::Stretch);
    ui->treeViewEffects->header()->setSectionResizeMode(1, QHeaderView::Interactive);
}

// -------------------------------------------------------

void DialogDatas::initializeStatus(GameDatas *gameDatas) {
    ui->panelSuperListStatus->setIsLang(true);
    ui->panelSuperListStatus->list()->initializeNewItemInstance(new
        SystemStatus);
    ui->panelSuperListStatus->initializeModel(gameDatas->statusDatas()
        ->model());
    ui->panelSuperListStatus->showEditName(true);
    connect(ui->panelSuperListStatus->list()->selectionModel(), SIGNAL(
        currentChanged(QModelIndex, QModelIndex)), this, SLOT(
        on_pageStatusSelected(QModelIndex, QModelIndex)));
    QModelIndex index = ui->panelSuperListStatus->list()->getModel()->index(
        0, 0);
    ui->panelSuperListStatus->list()->setIndex(0);
    on_pageStatusSelected(index, index);
}

// -------------------------------------------------------

void DialogDatas::updateStatus(SystemStatus *) {

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
    ui->panelSuperListTilesetAnimatedAutotiles->showButtonMax(false);
    ui->panelSuperListTilesetAnimatedAutotiles->showEditName(false);
    ui->panelSuperListTilesetSpriteWalls->showButtonMax(false);
    ui->panelSuperListTilesetSpriteWalls->showEditName(false);
    ui->panelSuperListTileset3DObjects->showButtonMax(false);
    ui->panelSuperListTileset3DObjects->showEditName(false);
    ui->panelSuperListTilesetMountains->showButtonMax(false);
    ui->panelSuperListTilesetMountains->showEditName(false);
    ui->panelSuperListTilesetSlopes->showButtonMax(false);
    ui->panelSuperListTilesetSlopes->showEditName(false);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListTilesets->list()->getModel()
            ->index(0,0);
    ui->panelSuperListTilesets->list()->setIndex(0);
    on_pageTilesetSelected(index,index);
}

// -------------------------------------------------------

void DialogDatas::updateTileset(SystemTileset *sysTileset){
    SystemPicture* picture = sysTileset->picture();
    ui->widgetPictureTileset->setPicture(picture);
    ui->widgetTilesetPictureSettings->updateImage(picture);

    // Initialize special models
    ui->panelSuperListTilesetAutotiles->initializeModel(
                sysTileset->modelAutotiles());
    ui->panelSuperListTilesetSpriteWalls->initializeModel(
                sysTileset->modelSpriteWalls());
    ui->panelSuperListTileset3DObjects->initializeModel(
                sysTileset->model3DObjects());
    ui->panelSuperListTilesetMountains->initializeModel(
                sysTileset->modelMountains());

    // Update special models
    sysTileset->updateModelAutotiles();
    sysTileset->updateModelSpriteWalls();
    sysTileset->updateModel3DObjects();
    sysTileset->updateModelMountains();
}

// -------------------------------------------------------

void DialogDatas::openSpecialElementsDialog(PictureKind kind) {
    SystemTileset* tileset = (SystemTileset*) ui->panelSuperListTilesets->list()
            ->getSelected()->data().value<quintptr>();

    DialogTilesetSpecialElements dialog(tileset, kind);
    if (dialog.exec() == QDialog::Accepted)
        RPM::get()->project()->writeSpecialsDatas();
    else
        RPM::get()->project()->readSpecialsDatas();
}

// -------------------------------------------------------

void DialogDatas::playAnimation(AnimationEffectConditionKind condition) {
    this->setEnabled(false);
    ui->widgetAnimation->playAnimation(condition, ui
        ->panelSuperListAnimationFrames->list()->getModel());
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogDatas::showEvent(QShowEvent *event) {
    QDialog::showEvent(event);

    // Scroll area for animations centered
    ui->scrollAreaAnimation->horizontalScrollBar()->setValue(ui
        ->scrollAreaAnimation->horizontalScrollBar()->maximum() / 2);
    ui->scrollAreaAnimation->verticalScrollBar()->setSliderPosition(ui
        ->scrollAreaAnimation->verticalScrollBar()->maximum() / 2);

    ui->tabWidget->setCurrentIndex(0);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogDatas::on_tabWidget_currentChanged(int index) {
    switch (index) {
    case 1:
        ui->panelDatasHero->updateClasses();
        updateHero(reinterpret_cast<SystemHero *>(ui->panelSuperListHeroes
            ->list()->getSelected()->data().value<quintptr>()));
        break;
    case 2:
        ui->panelDatasMonster->updateClasses();
        updateMonster(reinterpret_cast<SystemMonster *>(ui->panelSuperListMonsters
            ->list()->getSelected()->data().value<quintptr>()));
        break;
    case 4:
        ui->panelDatasItems->updateAllModelsRow();
        break;
    case 5:
        ui->panelDatasWeapons->updateAllModelsRow();
        break;
    case 6:
        ui->panelDatasArmors->updateAllModelsRow();
        break;
    case 7:
        ui->panelDatasSkill->updateAllModelsRow();
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void DialogDatas::on_pageItemsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListItems->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr) {
        updateItem(reinterpret_cast<SystemItem *>(selected->data().value<
            quintptr>()));
    }
}

// -------------------------------------------------------

void DialogDatas::on_pageSkillsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListSkills->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr) {
        updateSkill(reinterpret_cast<SystemSkill *>(selected->data().value<
            quintptr>()));
    }
}

// -------------------------------------------------------

void DialogDatas::on_pageWeaponsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListWeapons->list()->getModel()
        ->itemFromIndex(index);
    if (selected != nullptr) {
        updateWeapon(reinterpret_cast<SystemWeapon *>(selected->data().value<
            quintptr>()));
    }
}

// -------------------------------------------------------

void DialogDatas::on_pageArmorsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListArmors->list()->getModel()
        ->itemFromIndex(index);
    if (selected != nullptr) {
        updateArmor(reinterpret_cast<SystemArmor *>(selected->data().value<
            quintptr>()));
    }
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

void DialogDatas::on_pageAnimationsSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListAnimations->list()->getModel()
        ->itemFromIndex(index);
    if (selected != nullptr) {
        updateAnimation(reinterpret_cast<SystemAnimation *>(selected->data()
            .value<quintptr>()));
    }
}

// -------------------------------------------------------

void DialogDatas::on_pageAnimationFramesSelected(QModelIndex index, QModelIndex)
{
    QStandardItem *selected;

    selected = ui->panelSuperListAnimationFrames->list()->getModel()
        ->itemFromIndex(index);
    if (selected != nullptr) {
        this->updateAnimationFrame(reinterpret_cast<SystemAnimationFrame *>(
            selected->data().value<quintptr>()));
    }
}

// -------------------------------------------------------

void DialogDatas::on_pageStatusSelected(QModelIndex index, QModelIndex){
    QStandardItem* selected = ui->panelSuperListStatus->list()->getModel()
        ->itemFromIndex(index);
    if (selected != nullptr) {
        updateStatus(reinterpret_cast<SystemStatus *>(selected->data()
            .value<quintptr>()));
    }
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonAutotiles_clicked() {
    openSpecialElementsDialog(PictureKind::Autotiles);
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonSpriteWalls_clicked() {
    openSpecialElementsDialog(PictureKind::Walls);
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonMountains_clicked() {
    openSpecialElementsDialog(PictureKind::Mountains);
}

// -------------------------------------------------------

void DialogDatas::on_pushButton3DObjects_clicked() {
    openSpecialElementsDialog(PictureKind::Object3D);
}

// -------------------------------------------------------

void DialogDatas::on_tilesetPictureChanged(SystemPicture* picture) {
    reinterpret_cast<SystemTileset *>(ui->panelSuperListTilesets->list()
        ->getSelected()->data().value<quintptr>())->setPictureID(picture->id());
    ui->widgetTilesetPictureSettings->updateImage(picture);
}

// -------------------------------------------------------


void DialogDatas::on_animationPictureChanged(SystemPicture *picture) {
    reinterpret_cast<SystemAnimation *>(ui->panelSuperListTilesets->list()
        ->getSelected()->data().value<quintptr>())->setPictureID(picture->id());
    ui->widgetAnimationTexture->updatePicture(picture->id());
}

// -------------------------------------------------------

void DialogDatas::on_comboBoxAnimationPosition_currentIndexChanged(int index) {
    AnimationPositionKind positionKind;

    positionKind = static_cast<AnimationPositionKind>(index);
    reinterpret_cast<SystemAnimation *>(ui->panelSuperListAnimations->list()
        ->getSelected()->data().value<quintptr>())->setPositionKind(positionKind);
    ui->widgetAnimation->setAnimationPositionKind(positionKind);
}

// -------------------------------------------------------

void DialogDatas::on_spinBoxAnimationRows_valueChanged(int i) {
    reinterpret_cast<SystemAnimation *>(ui->panelSuperListAnimations->list()
        ->getSelected()->data().value<quintptr>())->setRows(i);
    ui->widgetAnimationTexture->setRows(i);
    ui->widgetAnimation->repaint();
}

// -------------------------------------------------------

void DialogDatas::on_spinBoxAnimationColumns_valueChanged(int i) {
    reinterpret_cast<SystemAnimation *>(ui->panelSuperListAnimations->list()
        ->getSelected()->data().value<quintptr>())->setColumns(i);
    ui->widgetAnimationTexture->setColumns(i);
    ui->widgetAnimation->repaint();
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonChangeBattler_clicked() {
    DialogPicturesPreview dialog(ui->widgetAnimation->pictureBattler(),
        PictureKind::Battlers);
    dialog.exec();
    ui->widgetAnimation->updateBattlerPicture(dialog.picture()->id());
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonCopyFrames_clicked() {
    DialogAnimationCopyFrames dialog;
    if (dialog.exec() == QDialog::Accepted) {
        dialog.copyFrames(reinterpret_cast<SystemAnimation *>(ui
            ->panelSuperListAnimations->list()->getSelected()->data().value<
            quintptr>()));
        ui->widgetAnimation->repaint();
    }
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonClearFrames_clicked() {
    DialogAnimationClearFrames dialog;
    if (dialog.exec() == QDialog::Accepted) {
        dialog.clearFrames(reinterpret_cast<SystemAnimation *>(ui
            ->panelSuperListAnimations->list()->getSelected()->data().value<
            quintptr>()));
        ui->widgetAnimation->repaint();
    }
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonCreateTransition_clicked() {
    DialogAnimationCreateTransition dialog;
    if (dialog.exec() == QDialog::Accepted) {
        dialog.createTransition(reinterpret_cast<SystemAnimation *>(ui
            ->panelSuperListAnimations->list()->getSelected()->data().value<
            quintptr>()));
        ui->widgetAnimation->repaint();
    }
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonApplyTexture_clicked() {
    if (ui->widgetAnimation->selectedElement() == nullptr) {
        QMessageBox::information(this, "Warning", "Select an element to apply.");
    } else {
        ui->widgetAnimation->selectedElement()->setTexRow(ui
            ->widgetAnimationTexture->currentRow());
        ui->widgetAnimation->selectedElement()->setTexColumn(ui
            ->widgetAnimationTexture->currentColumn());
        ui->widgetAnimation->repaint();
    }
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonPlayHit_clicked() {
    this->playAnimation(AnimationEffectConditionKind::Hit);
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonPlayMiss_clicked() {
    this->playAnimation(AnimationEffectConditionKind::Miss);
}

// -------------------------------------------------------

void DialogDatas::on_pushButtonPlayCrit_clicked() {
    this->playAnimation(AnimationEffectConditionKind::Critical);
}

// -------------------------------------------------------

void DialogDatas::onAnimationFinished() {
    this->setEnabled(true);
}
