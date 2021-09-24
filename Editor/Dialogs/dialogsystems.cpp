/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystems.h"
#include "ui_dialogsystems.h"
#include "superlistitem.h"
#include "systemitem.h"
#include "systemstatistic.h"
#include "systemcurrency.h"
#include "rpm.h"
#include "systemcreateparameter.h"
#include "systemweaponarmorkind.h"
#include "systemelement.h"
#include "systembattlecommand.h"
#include "systembattlemap.h"
#include "systemcolor.h"
#include "systemwindowskin.h"
#include "systemcameraproperties.h"
#include "systemdetection.h"
#include "systemtitlecommand.h"
#include "systemgameovercommand.h"
#include "systemspeedfrequency.h"
#include "systemfontsize.h"
#include "systemfontname.h"
#include "systeminventoryfilter.h"
#include "systemmainmenucommand.h"
#include "systemselectstatistic.h"
#include "dialogcommandsetdialogboxoptions.h"
#include "systemskybox.h"
#include "dialogenternameoptions.h"
#include "systeminitialpartymember.h"

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
    initializeSystem(gameDatas);
    initializeBattleSystem(gameDatas);
    initializeTitleScreenGameOver(gameDatas);
    initializeMainMenu(gameDatas);
    initializeEvents(gameDatas);
    initializeStates(gameDatas);
    initializeCommonReactors(gameDatas);
    initializeCommonObjects(gameDatas);

    Q_FOREACH(QSpinBox * sp, findChildren<QSpinBox*>()) {
        sp->installEventFilter(this);
        sp->clearFocus();
    }

    this->translate();
    ui->tabWidget->setCurrentIndex(RPM::get()->engineSettings()->tabIndexSystems());
}

DialogSystems::~DialogSystems()
{
    delete ui;
}

int DialogSystems::getSquareSize() const {
    return ui->spinBoxSquareSize->value();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool DialogSystems::eventFilter(QObject *o, QEvent *e) {
    if (e->type() == QEvent::Wheel) {
        e->ignore();
        return true;
    }
    return QDialog::eventFilter(o, e);
}

// -------------------------------------------------------

void DialogSystems::closeEvent(QCloseEvent *event)
{
    RPM::get()->project()->setCurrentObject(nullptr);
    QDialog::closeEvent(event);
}

// -------------------------------------------------------

void DialogSystems::initializeSystem(GameDatas *gameDatas) {
    SystemDatas *systemDatas = RPM::get()->project()->gameDatas()->systemDatas();
    systemDatas->updateModelsToString();
    int index = systemDatas->isScreenWindow() ? 0 : 1;
    ui->comboBoxScreenWindow->addItem(RPM::translate(Translations::WINDOW));
    ui->comboBoxScreenWindow->addItem(RPM::translate(Translations::FULL_SCREEN));
    ui->comboBoxScreenWindow->setCurrentIndex(index);

    // Don't show edit name
    ui->panelSuperListColors->showEditName(false);
    ui->panelSuperListCurrencies->showEditName(false);
    ui->panelSuperListWindowSkins->showEditName(false);
    ui->panelSuperListCameraProperties->showEditName(false);
    ui->panelSuperListDetections->showEditName(false);
    ui->panelSuperListSpeeds->showEditName(false);
    ui->panelSuperListFrequencies->showEditName(false);
    ui->panelSuperListFontSizes->showEditName(false);
    ui->panelSuperListFontNames->showEditName(false);
    ui->panelSuperListSkyBoxes->showEditName(false);

    // Allow editions
    ui->panelSuperListWindowSkins->list()->setCanEdit(true);
    ui->panelSuperListCameraProperties->list()->setCanEdit(true);
    ui->panelSuperListColors->list()->setCanEdit(true);
    ui->panelSuperListDetections->list()->setCanEdit(true);
    ui->panelSuperListCurrencies->list()->setCanEdit(true);
    ui->panelSuperListSpeeds->list()->setCanEdit(true);
    ui->panelSuperListFrequencies->list()->setCanEdit(true);
    ui->panelSuperListFontSizes->list()->setCanEdit(true);
    ui->panelSuperListFontNames->list()->setCanEdit(true);
    ui->panelSuperListSkyBoxes->list()->setCanEdit(true);

    // Values
    ui->widgetGameName->initializeNamesLang(systemDatas->projectName());
    ui->spinBoxScreenWidth->setValue(systemDatas->screenWidth());
    ui->spinBoxScreenHeight->setValue(systemDatas->screenHeight());
    ui->spinBoxScreenWidth->setEnabled(systemDatas->isScreenWindow());
    ui->spinBoxScreenHeight->setEnabled(systemDatas->isScreenWindow());
    ui->checkBoxAntialiasing->setChecked(systemDatas->antialiasing());
    ui->checkBoxMouseControls->setChecked(systemDatas->isMouseControls());
    ui->spinBoxSquareSize->setValue(systemDatas->squareSize());
    ui->spinBoxRayEditor->setValue(systemDatas->portionsRayEditor());
    ui->spinBoxRayIngame->setValue(systemDatas->portionsRayIngame());
    ui->widgetMountainCollisionHeight->initializeNumberAndUpdate(systemDatas
        ->mountainCollisionHeight());
    ui->widgetMountainCollisionAngle->initializeNumberAndUpdate(systemDatas
        ->mountainCollisionAngle(), false);
    ui->spinBoxAnimationFrames->setValue(systemDatas->framesAnimation());
    ui->spinBoxBattlersFrames->setValue(systemDatas->battlersFrames());
    ui->spinBoxBattlersColumns->setValue(systemDatas->battlersColumns());
    ui->spinBoxAutotilesFrames->setValue(systemDatas->autotilesFrames());
    ui->spinBoxAutotilesFrameDuration->setValue(systemDatas->autotilesFrameDuration());
    ui->panelPrimitiveMapFrameDuration->initializeNumberAndUpdate(systemDatas
        ->mapFrameDuration());
    ui->spinBoxSaveSlots->setValue(systemDatas->saveSlots());
    ui->primitiveValuePriceSoldItem->initializeNumberAndUpdate(systemDatas
        ->priceSoldItem(), false);

    // Initializing all the models
    ui->panelSuperListColors->list()->initializeNewItemInstance(new SystemColor);
    ui->panelSuperListColors->initializeModel(gameDatas->systemDatas()
        ->modelColors());
    ui->panelSuperListCurrencies->list()->initializeNewItemInstance(new
        SystemCurrency);
    ui->panelSuperListCurrencies->initializeModel(gameDatas->systemDatas()
        ->modelCurrencies());
    ui->panelSuperListWindowSkins->list()->initializeNewItemInstance(new
        SystemWindowSkin);
    ui->panelSuperListWindowSkins->initializeModel(gameDatas->systemDatas()
        ->modelWindowSkins());
    ui->panelSuperListCameraProperties->list()->initializeNewItemInstance(new
        SystemCameraProperties);
    ui->panelSuperListCameraProperties->initializeModel(gameDatas->systemDatas()
        ->modelcameraProperties());
    ui->panelSuperListDetections->list()->initializeNewItemInstance(new
        SystemDetection);
    ui->panelSuperListDetections->initializeModel(gameDatas->systemDatas()
        ->modelDetections());
    ui->panelSuperListSpeeds->list()->initializeNewItemInstance(new
        SystemSpeedFrequency);
    ui->panelSuperListSpeeds->initializeModel(gameDatas->systemDatas()
        ->modelSpeed());
    ui->panelSuperListFrequencies->list()->initializeNewItemInstance(new
        SystemSpeedFrequency(-1, "", new PrimitiveValue(0.0), false));
    ui->panelSuperListFrequencies->initializeModel(gameDatas->systemDatas()
        ->modelFrequencies());
    ui->panelSuperListFontSizes->list()->initializeNewItemInstance(new
        SystemFontSize);
    ui->panelSuperListFontSizes->initializeModel(gameDatas->systemDatas()
        ->modelFontSizes());
    ui->panelSuperListFontNames->list()->initializeNewItemInstance(new
        SystemFontName);
    ui->panelSuperListFontNames->initializeModel(gameDatas->systemDatas()
        ->modelFontNames());
    ui->panelSuperListSkyBoxes->list()->initializeNewItemInstance(new
        SystemSkyBox);
    ui->panelSuperListSkyBoxes->initializeModel(gameDatas->systemDatas()
        ->modelSkyBoxes());
    ui->treeView->initializeNewItemInstance(new SystemInitialPartyMember);
    ui->treeView->initializeModel(gameDatas->systemDatas()->modelInitialPartyMembers());

    // Sounds
    ui->widgetChooseCursor->initialize(gameDatas->systemDatas()->soundCursor());
    ui->widgetChooseConfirmation->initialize(gameDatas->systemDatas()
        ->soundConfirmation());
    ui->widgetChooseCancel->initialize(gameDatas->systemDatas()->soundCancel());
    ui->widgetChooseImpossible->initialize(gameDatas->systemDatas()
        ->soundImpossible());
}

// -------------------------------------------------------

void DialogSystems::initializeBattleSystem(GameDatas *gameDatas)
{
    // Set as translatable
    ui->panelSuperListCommonEquipments->setIsLang(true);

    // Don't show edit name
    ui->panelSuperListCommonStatistics->showEditName(false);
    ui->panelSuperListElements->showEditName(false);
    ui->panelSuperListWeaponsKind->showEditName(false);
    ui->panelSuperListArmorsKind->showEditName(false);

    // Allow editions
    ui->panelSuperListCommonEquipments->list()->setCanEdit(true);
    ui->panelSuperListCommonStatistics->list()->setCanEdit(true);
    ui->panelSuperListElements->list()->setCanEdit(true);
    ui->panelSuperListWeaponsKind->list()->setCanEdit(true);
    ui->panelSuperListArmorsKind->list()->setCanEdit(true);

    // Update ID
    ui->treeViewBattleMap->setUpdateId(true);
    ui->treeViewBattleMap->setCanBeEmpty(false);
    ui->treeViewBattleCommands->setUpdateId(true);
    ui->treeViewBattleCommands->setCanBeEmpty(false);

    // Fill combo boxes
    updateStatisticsBase();
    connect(ui->panelSuperListCommonStatistics->list(), SIGNAL(updated()),
            this, SLOT(on_statisticsUpdated()));

    // Equipment change connection for weapon / armor kind
    connect(ui->panelSuperListCommonEquipments->list(), SIGNAL(updated()),
            this, SLOT(on_equipmentUpdated()));

    // Formulas
    ui->panelPrimitiveValueFormulaIsDead->initializeMessageAndUpdate(gameDatas
        ->battleSystemDatas()->formulaIsDead(), true);
    ui->panelPrimitiveValueFormulaCrit->initializeMessageAndUpdate(gameDatas
        ->battleSystemDatas()->formulaCrit(), true);
    ui->panelPrimitiveHeroesBattlersCenterOffset->initializeMessageAndUpdate(
        gameDatas->battleSystemDatas()->heroesBattlersCenterOffset(), true);
    ui->panelPrimitiveHeroesBattlersOffset->initializeMessageAndUpdate(
        gameDatas->battleSystemDatas()->heroesBattlersOffset(), true);
    ui->panelPrimitiveTroopsBattlersCenterOffset->initializeMessageAndUpdate(
        gameDatas->battleSystemDatas()->troopsBattlersCenterOffset(), true);
    ui->panelPrimitiveTroopsBattlersOffset->initializeMessageAndUpdate(
        gameDatas->battleSystemDatas()->troopsBattlersOffset(), true);

    // Initialize musics
    ui->widgetChooseBattleMusic->initialize(gameDatas->battleSystemDatas()
        ->music());
    ui->widgetChooseBattleLevelUp->initialize(gameDatas->battleSystemDatas()
        ->levelup());
    ui->widgetChooseBattleVictory->initialize(gameDatas->battleSystemDatas()
        ->victory());

    // Initialize models
    ui->treeViewBattleMap->initializeModel(gameDatas->battleSystemDatas()
        ->modelBattleMaps());
    ui->treeViewBattleMap->initializeNewItemInstance(new SystemBattleMap);
    ui->treeViewBattleCommands->initializeModel(gameDatas->battleSystemDatas()
        ->modelCommonBattleCommand());
    ui->treeViewBattleCommands->initializeNewItemInstance(new
        SystemBattleCommand);
    ui->panelSuperListWeaponsKind->initializeModel(gameDatas
        ->battleSystemDatas()->modelWeaponsKind());
    ui->panelSuperListWeaponsKind->list()->initializeNewItemInstance(
        new SystemWeaponArmorKind);
    ui->panelSuperListArmorsKind->list()->initializeModel(gameDatas
        ->battleSystemDatas()->modelArmorsKind());
    ui->panelSuperListArmorsKind->list()->initializeNewItemInstance(
        new SystemWeaponArmorKind);
    ui->panelSuperListElements->list()->initializeModel(gameDatas
        ->battleSystemDatas()->modelElements());
    ui->panelSuperListElements->list()->initializeNewItemInstance(
        new SystemElement);
    ui->panelSuperListCommonEquipments->initializeModel(gameDatas
        ->battleSystemDatas()->modelCommonEquipment());
    ui->panelSuperListCommonEquipments->list()->initializeNewItemInstance(
        new SystemTranslatable);
    ui->panelSuperListCommonEquipments->showEditName(true);
    QModelIndex index = ui->panelSuperListCommonEquipments->list()->getModel()
        ->index(0, 0);
    ui->panelSuperListCommonEquipments->list()->setCurrentIndex(index);
    ui->panelSuperListCommonStatistics->list()->initializeModel(gameDatas
        ->battleSystemDatas()->modelCommonStatistics());
    ui->panelSuperListCommonStatistics->list()->initializeNewItemInstance(
        new SystemStatistic);
}

// -------------------------------------------------------

void DialogSystems::updateStatisticsBase(){

    // Clear before adding
    ui->comboBoxBattleLevel->clear();
    ui->comboBoxBattleExp->clear();

    // Update
    GameDatas* gameDatas = RPM::get()->project()->gameDatas();
    QVector<SystemStatistic*> level, exp;
    int index, id;
    gameDatas->battleSystemDatas()->getSortedStatistics(level, exp);
    index = 0;
    id =  gameDatas->battleSystemDatas()->idStatisticLevel();
    for (int i = 0; i < level.size(); i++){
        SystemStatistic* statistic = level.at(i);
        ui->comboBoxBattleLevel->addItem(
                    statistic->toString(),
                    QVariant::fromValue(reinterpret_cast<quintptr>(statistic)));
        if (statistic->id() == id)
            index = i;
    }
    ui->comboBoxBattleLevel->setCurrentIndex(index);
    index = 0;
    id = gameDatas->battleSystemDatas()->idStatisticExp();
    for (int i = 0; i < exp.size(); i++){
        SystemStatistic* statistic = exp.at(i);
        ui->comboBoxBattleExp->addItem(
                    statistic->toString(),
                    QVariant::fromValue(reinterpret_cast<quintptr>(statistic)));
        if (statistic->id() == id)
            index = i;
    }
    ui->comboBoxBattleExp->setCurrentIndex(index);
}

// -------------------------------------------------------

void DialogSystems::initializeTitleScreenGameOver(GameDatas *gameDatas)
{
    // Title screen
    if (!gameDatas->titleScreenGameOverDatas()->isTitleBackgroundImage())
    {
        ui->radioButtonVideo->setChecked(true);
    }
    ui->widgetPictureTitleBackground->setKind(PictureKind::TitleScreen);
    ui->widgetPictureTitleBackground->initializeSuper(gameDatas
        ->titleScreenGameOverDatas()->titleBackgroundImageID());
    ui->widgetVideoTitleBackground->initialize(gameDatas
        ->titleScreenGameOverDatas()->titleBackgroundVideoID());
    ui->widgetChooseMusicTitle->initialize(gameDatas->titleScreenGameOverDatas()
        ->titleMusic());
    ui->treeViewTitleMenuCommands->initializeNewItemInstance(new
        SystemTitleCommand);
    ui->treeViewTitleMenuCommands->initializeModel(gameDatas
        ->titleScreenGameOverDatas()->modelTitleCommands());
    ui->treeViewTitleSettings->setCanBeControled(false);
    ui->treeViewTitleSettings->setCanCreateDelete(false);
    ui->treeViewTitleSettings->initializeNewItemInstance(new SuperListItem);
    ui->treeViewTitleSettings->initializeModel(gameDatas
        ->titleScreenGameOverDatas()->modelTitleSettings());

    // Game over
    if (!gameDatas->titleScreenGameOverDatas()->isGameOverBackgroundImage())
    {
        ui->radioButtonVideoGameOver->setChecked(true);
    }
    ui->widgetPictureGameOverBackground->setKind(PictureKind::GameOver);
    ui->widgetPictureGameOverBackground->initializeSuper(gameDatas
        ->titleScreenGameOverDatas()->gameOverBackgroundImageID());
    ui->widgetVideoGameOverBackground->initialize(gameDatas
        ->titleScreenGameOverDatas()->gameOverBackgroundVideoID());
    ui->widgetChooseMusicGameOver->initialize(gameDatas->titleScreenGameOverDatas()
        ->gameOverMusic());
    ui->treeViewGameOverMenuCommands->initializeNewItemInstance(new
        SystemGameOverCommand);
    ui->treeViewGameOverMenuCommands->initializeModel(gameDatas
        ->titleScreenGameOverDatas()->modelGameOverCommands());
}

// -------------------------------------------------------

void DialogSystems::initializeMainMenu(GameDatas *gameDatas){
    ui->panelSuperListItemsTypes->setIsLang(true);
    ui->panelSuperListItemsTypes->list()->setCanEdit(true);
    ui->panelSuperListItemsTypes->initializeModel(gameDatas->systemDatas()
        ->modelItemsTypes());
    ui->panelSuperListItemsTypes->list()->initializeNewItemInstance(new SystemTranslatable);
    ui->panelSuperListItemsTypes->showEditName(true);
    ui->panelSuperListInventoryFilters->list()->setCanEdit(true);
    ui->panelSuperListInventoryFilters->showEditName(false);
    ui->panelSuperListInventoryFilters->initializeModel(gameDatas->systemDatas()
        ->modelInventoryFilters());
    ui->panelSuperListInventoryFilters->list()->initializeNewItemInstance(new SystemInventoryFilter);
    ui->panelSuperListMainMenuCommands->list()->setCanEdit(true);
    ui->panelSuperListMainMenuCommands->showEditName(false);
    ui->panelSuperListMainMenuCommands->initializeModel(gameDatas->systemDatas()
        ->modelMainMenuCommands());
    ui->panelSuperListMainMenuCommands->list()->initializeNewItemInstance(new SystemMainMenuCommand);
    ui->panelSuperListHeroesStatistics->list()->setCanEdit(true);
    ui->panelSuperListHeroesStatistics->showEditName(false);
    ui->panelSuperListHeroesStatistics->initializeModel(gameDatas->systemDatas()
        ->modelHeroesStatistics());
    ui->panelSuperListHeroesStatistics->list()->initializeNewItemInstance(new SystemSelectStatistic);
}

// -------------------------------------------------------

void DialogSystems::initializeEvents(GameDatas *gameDatas) {
    ui->treeViewEventsParameters->setUpdateId(true);
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

void DialogSystems::initializeCommonReactors(GameDatas *gameDatas) {
    ui->treeViewCommonReactorsParameters->setUpdateId(true);
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
    RPM::get()->project()->setCurrentParameters(sysCommonReactor
        ->modelParameters());
    ui->treeCommandsView->initializeParameters(sysCommonReactor
        ->modelParameters());
    ui->treeCommandsView->initializeModel(sysCommonReactor->modelCommands());

    // Options
    ui->checkBoxCommonReactionBlockingHero->setChecked(sysCommonReactor
                                                       ->blockingHero());
}

// -------------------------------------------------------

void DialogSystems::initializeCommonObjects(GameDatas *gameDatas){
    ui->widgetCommonObject->showName(false);
    ui->widgetCommonObject->showID(false);
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

void DialogSystems::updateCommonObjects(SystemCommonObject *sysCommonObject) {
    ui->widgetCommonObject->initializeModel(sysCommonObject);
    ui->widgetCommonObject->updateModel();
}

//-------------------------------------------------

void DialogSystems::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SYSTEMS_MANAGER) + RPM
        ::DOT_DOT_DOT);
    ui->tabWidget->setTabText(0, RPM::translate(Translations::SYSTEM));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::BATTLE_SYSTEM));
    ui->tabWidget->setTabText(2, RPM::translate(Translations
        ::TITLE_SCREEN_GAME_OVER));
    ui->tabWidget->setTabText(3, RPM::translate(Translations::MAIN_MENU));
    ui->tabWidget->setTabText(4, RPM::translate(Translations::EVENTS_STATES));
    ui->tabWidget->setTabText(5, RPM::translate(Translations::COMMON_REACTIONS));
    ui->tabWidget->setTabText(6, RPM::translate(Translations::MODELS));
    ui->labelMusic->setText(RPM::translate(Translations::MUSIC) + RPM::COLON);
    ui->labelWidth->setText(RPM::translate(Translations::WIDTH) + RPM::COLON);
    ui->labelBattle->setText(RPM::translate(Translations::BATTLE) + RPM::COLON);
    ui->labelCancel->setText(RPM::translate(Translations::CANCEL) + RPM::COLON);
    ui->labelCursor->setText(RPM::translate(Translations::CURSOR) + RPM::COLON);
    ui->labelIsDead->setText(RPM::translate(Translations::IS_DEAD) + RPM::COLON);
    ui->labelheight->setText(RPM::translate(Translations::HEIGHT) + RPM::COLON);
    ui->labelLevelUp->setText(RPM::translate(Translations::LEVEL_UP) + RPM
        ::COLON);
    ui->labelVictory->setText(RPM::translate(Translations::VICTORY) + RPM
        ::COLON);
    ui->labelGameName->setText(RPM::translate(Translations::GAME_NAME) + RPM
        ::COLON);
    ui->labelImpossible->setText(RPM::translate(Translations::IMPOSSIBLE) + RPM
        ::COLON);
    ui->labelSquareSize->setText(RPM::translate(Translations::SQUARE_SIZE) + RPM
        ::SPACE + RPM::PARENTHESIS_LEFT + RPM::translate(Translations::IN_PX) +
        RPM::PARENTHESIS_RIGHT + RPM::COLON);
    ui->labelConfirmation->setText(RPM::translate(Translations::CONFIRMATION) +
        RPM::COLON);
    ui->labelAnimationFrames->setText(RPM::translate(Translations
        ::ANIMATION_FRAMES) + RPM::COLON);
    ui->labelPriceOfSoldItem->setText(RPM::translate(Translations
        ::PRICE_SOLD_ITEM) + RPM::COLON);
    ui->labelCriticalInfluence->setText(RPM::translate(Translations
        ::CRITICAL_INFLUENCE) + RPM::COLON);
    ui->labelRayPortionsEditor->setText(RPM::translate(Translations
        ::RAY_PORTIONS) + RPM::SPACE + RPM::PARENTHESIS_LEFT + RPM::translate(
        Translations::EDITOR) + RPM::PARENTHESIS_RIGHT + RPM::COLON);
    ui->labelRayPortionsIngame->setText(RPM::translate(Translations
        ::RAY_PORTIONS) + RPM::SPACE + RPM::PARENTHESIS_LEFT + RPM::translate(
        Translations::INGAME) + RPM::PARENTHESIS_RIGHT + RPM::COLON);
    ui->labelMaxNumberOfSaveSlots->setText(RPM::translate(Translations
        ::MAX_NUMBER_SAVE_SLOTS) + RPM::COLON);
    ui->labelPercentOfDefaultPrice->setText("%" + RPM::SPACE + RPM::translate(
        Translations::OF_DEFAULT_PRICE));
    ui->labelDefaultDialogBoxOptions->setText(RPM::translate(Translations
        ::DEFAULT_DIALOG_BOX_OPTIONS) + RPM::COLON);
    ui->labelStatisticAssociatedToExp->setText(RPM::translate(Translations
        ::STATISTIC_ASSOCIATED_EXP) + RPM::COLON);
    ui->labelStatisticAssociatedToLevel->setText(RPM::translate(Translations
        ::STATISTIC_ASSOCIATED_LEVEL) + RPM::COLON);
    ui->labelMountainsCollisionAngleLimit1->setText(RPM::translate(Translations
        ::MOUNTAIN_COLLISION_ANGLE_LIMIT_1));
    ui->labelMountainsCollisionAngleLimit2->setText(RPM::translate(Translations
        ::MOUNTAIN_COLLISION_ANGLE_LIMIT_2) + RPM::COLON);
    ui->labelMountainsCollisionHeightLimit1->setText(RPM::translate(Translations
        ::MOUNTAIN_COLLISION_HEIGHT_LIMIT_1));
    ui->labelMountainsCollisionHeightLimit2->setText(RPM::translate(Translations
        ::MOUNTAIN_COLLISION_HEIGHT_LIMIT_2) + RPM::COLON);
    ui->labelMapFrameDuration->setText(RPM::translate(Translations
        ::MAP_FRAME_DURATION) + RPM::COLON);
    ui->radioButtonImage->setText(RPM::translate(Translations::IMAGE) + RPM
        ::COLON);
    ui->radioButtonVideo->setText(RPM::translate(Translations::VIDEO) + RPM
        ::COLON);
    ui->checkBoxCommonReactionBlockingHero->setText(RPM::translate(Translations
        ::BLOCK_HERO_WHEN_REACTION));
    ui->groupBoxColors->setTitle(RPM::translate(Translations::COLORS));
    ui->groupBoxEvents->setTitle(RPM::translate(Translations::EVENTS));
    ui->groupBoxModels->setTitle(RPM::translate(Translations::MODELS));
    ui->groupBoxMusics->setTitle(RPM::translate(Translations::MUSICS));
    ui->groupBoxSpeeds->setTitle(RPM::translate(Translations::SPEEDS));
    ui->groupBoxStates->setTitle(RPM::translate(Translations::STATES));
    ui->groupBoxElements->setTitle(RPM::translate(Translations::ELEMENTS));
    ui->groupBoxFormulas->setTitle(RPM::translate(Translations::FORMULAS));
    ui->groupBoxGameOver->setTitle(RPM::translate(Translations::GAME_OVER));
    ui->groupBoxFontNames->setTitle(RPM::translate(Translations::FONT_NAMES));
    ui->groupBoxFontSizes->setTitle(RPM::translate(Translations::FONT_SIZES));
    ui->groupBoxArmorsKind->setTitle(RPM::translate(Translations::ARMORS_KIND));
    ui->groupBoxBattleMaps->setTitle(RPM::translate(Translations::BATTLE_MAPS));
    ui->groupBoxCurrencies->setTitle(RPM::translate(Translations::CURRENCIES));
    ui->groupBoxDetections->setTitle(RPM::translate(Translations::DETECTIONS));
    ui->groupBoxParameters->setTitle(RPM::translate(Translations::PARAMETERS));
    ui->groupBoxFrequencies->setTitle(RPM::translate(Translations::FREQUENCIES));
    ui->groupBoxOtheOptions->setTitle(RPM::translate(Translations::OTHER_OPTIONS));
    ui->groupBoxTitleScreen->setTitle(RPM::translate(Translations::TITLE_SCREEN));
    ui->groupBoxWeaponsKind->setTitle(RPM::translate(Translations::WEAPONS_KIND));
    ui->groupBoxWindowSkins->setTitle(RPM::translate(Translations::WINDOW_SKINS));
    ui->groupBoxInitialParty->setTitle(RPM::translate(Translations::INITIAL_PARTY_MEMBERS));
    ui->groupBoxGlobalSounds->setTitle(RPM::translate(Translations
        ::GLOBAL_SOUNDS));
    ui->groupBoxMenuCommands->setTitle(RPM::translate(Translations
        ::MENU_COMMANDS));
    ui->groupBoxParameters_2->setTitle(RPM::translate(Translations::PARAMETERS));
    ui->groupBoxMapProperties->setTitle(RPM::translate(Translations
        ::MAP_PROPERTIES));
    ui->groupBoxCommonReactions->setTitle(RPM::translate(Translations
        ::COMMON_REACTIONS));
    ui->groupBoxCameraProperties->setTitle(RPM::translate(Translations
        ::CAMERA_PROPERTIES));
    ui->groupBoxCommonEquipments->setTitle(RPM::translate(Translations
        ::COMMON_EQUIPMENTS));
    ui->groupBoxCommonStatistics->setTitle(RPM::translate(Translations
        ::COMMON_STATISTICS));
    ui->groupBoxCommonBattleCommands->setTitle(RPM::translate(Translations
        ::COMMON_BATTLE_COMMANDS));
    ui->groupBoxGameNativeResolution->setTitle(RPM::translate(Translations
        ::GAME_NATIVE_RESOLUTION));
    ui->groupBoxSettingsConfiguration->setTitle(RPM::translate(Translations
        ::SETTINGS_CONFIGURATION));
    ui->groupBoxTitleScreenBackground->setTitle(RPM::translate(Translations
        ::BACKGROUND));
    ui->groupBoxFrames->setTitle(RPM::translate(Translations::FRAMES));
    ui->labelBattlersFrames->setText(RPM::translate(Translations::BATTLERS_FRAMES) + RPM::COLON);
    ui->labelBattlersRows->setText(RPM::translate(Translations::BATTLERS_ROWS) + RPM::COLON);
    ui->pushButtonEnterNameOptions->setText(RPM::translate(Translations
        ::ENTER_NAME_OPTIONS) + RPM::DOT_DOT_DOT);
    ui->labelFacesetScalingWidth->setText(RPM::translate(Translations
        ::FACESET_SCALING_WIDTH) + RPM::SPACE + RPM::PARENTHESIS_LEFT + RPM
        ::translate(Translations::IN_PX) + RPM::PARENTHESIS_RIGHT + RPM::COLON);
    ui->labelFacesetScalingHeight->setText(RPM::translate(Translations
        ::FACESET_SCALING_HEIGHT) + RPM::SPACE + RPM::PARENTHESIS_LEFT + RPM
        ::translate(Translations::IN_PX) + RPM::PARENTHESIS_RIGHT + RPM::COLON);
    ui->groupBoxItemsTypes->setTitle(RPM::translate(Translations::ITEMS_TYPES));
    ui->groupBoxInventoryFilters->setTitle(RPM::translate(Translations::INVENTORY_FILTERS));
    ui->groupBoxMainMenuCommands->setTitle(RPM::translate(Translations::MAIN_MENU_COMMANDS));
    ui->groupBoxHeroesStatistics->setTitle(RPM::translate(Translations::HEROES_STATISTICS_TO_DISPLAY));
    ui->labelAutotilesFrames->setText(RPM::translate(Translations::AUTOTILES_FRAMES) + RPM::COLON);
    ui->labelAutotilesFrameDuration->setText(RPM::translate(Translations::AUTOTILES_FRAME_DURATION) + RPM::COLON);
    ui->labelHeroesBattlersCenterOffset->setText(RPM::translate(Translations::HEROES_BATTLERS_CENTER_OFFSET) + RPM::COLON);
    ui->labelHeroesBattlersOffset->setText(RPM::translate(Translations::HEROES_BATTLERS_OFFSET) + RPM::COLON);
    ui->labelTroopsBattlersCenterOffset->setText(RPM::translate(Translations::TROOPS_BATTLERS_CENTER_OFFSET) + RPM::COLON);
    ui->labelTroopsBattlersOffset->setText(RPM::translate(Translations::TROOPS_BATTLERS_OFFSET) + RPM::COLON);
    ui->pushButtonDefaultDialogBoxOptions->setText(RPM::translate(Translations::SELECT) + RPM::DOT_DOT_DOT);
    ui->checkBoxAntialiasing->setText(RPM::translate(Translations::ANTIALIASING));
    ui->checkBoxMouseControls->setText(RPM::translate(Translations::MOUSE_CONTROLS));
    ui->groupBoxSkyBoxes->setTitle(RPM::translate(Translations::SKYBOXES));
    ui->groupBoxInitialParty->setTitle(RPM::translate(Translations::INITIAL_PARTY_MEMBERS));
    ui->groupBoxGameOverBackground->setTitle(RPM::translate(Translations::BACKGROUND));
    ui->radioButtonImageGameOver->setText(RPM::translate(Translations::IMAGE) + RPM::COLON);
    ui->radioButtonVideoGameOver->setText(RPM::translate(Translations::VIDEO) + RPM::COLON);
    ui->labelMusicGameOver->setText(RPM::translate(Translations::MUSIC) + RPM::COLON);
    ui->groupBoxMenuCommandsGameOver->setTitle(RPM::translate(Translations::MENU_COMMANDS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystems::on_spinBoxScreenWidth_valueChanged(int i) {
    RPM::get()->project()->gameDatas()->systemDatas()->setScreenWidth(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxScreenHeight_valueChanged(int i) {
    RPM::get()->project()->gameDatas()->systemDatas()->setScreenHeight(i);
}

// -------------------------------------------------------

void DialogSystems::on_comboBoxScreenWindow_currentIndexChanged(int index) {
    bool isScreenWindow = index == 0;

    RPM::get()->project()->gameDatas()->systemDatas()->setIsScreenWinow(
        isScreenWindow);
    ui->spinBoxScreenWidth->setEnabled(isScreenWindow);
    ui->spinBoxScreenHeight->setEnabled(isScreenWindow);
}

// -------------------------------------------------------

void DialogSystems::on_checkBoxAntialiasing_toggled(bool checked)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setAntialiasing(checked);
}

// -------------------------------------------------------

void DialogSystems::on_checkBoxMouseControls_toggled(bool checked)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setIsMouseControls(checked);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxSquareSize_valueChanged(int i) {
    RPM::get()->project()->gameDatas()->systemDatas()->setSquareSize(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxRayEditor_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setPortionRayEditor(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxRayIngame_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setPortionRayIngame(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxAnimationFrames_valueChanged(int i) {
    RPM::get()->project()->gameDatas()->systemDatas()->setFramesAnimation(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxBattlersFrames_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setBattlersFrames(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxBattlersColumns_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setBattlersColumns(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxAutotilesFrames_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setAutotilesFrames(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxAutotilesFrameDuration_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setAutotilesFrameDuration(i);
}

// -------------------------------------------------------

void DialogSystems::on_comboBoxBattleLevel_currentIndexChanged(int index) {
    if (index != -1) {
        SystemStatistic *statistic;

        statistic = reinterpret_cast<SystemStatistic *>(ui->comboBoxBattleLevel
            ->itemData(index).value<qintptr>());
        RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->setIdStatisticLevel(statistic->id());
    }
}

// -------------------------------------------------------

void DialogSystems::on_comboBoxBattleExp_currentIndexChanged(int index) {
    if (index != -1) {
        SystemStatistic *statistic;

        statistic = reinterpret_cast<SystemStatistic *>(ui->comboBoxBattleExp
            ->itemData(index).value<qintptr>());
        RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->setIdStatisticExp(statistic->id());
    }
}

// -------------------------------------------------------

void DialogSystems::on_pushButtonDefaultDialogBoxOptions_clicked() {
    EventCommand *command;

    command = RPM::get()->project()->gameDatas()->systemDatas()
        ->dialogBoxOptions();
    DialogCommandSetDialogBoxOptions dialog(command, nullptr, nullptr);
    if (dialog.exec() == QDialog::Accepted) {
        delete command;
        command = dialog.getCommand();
        RPM::get()->project()->gameDatas()->systemDatas()->setDialogBoxOptions(
            command);
    }
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxFacesetScalingWidth_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setFacesetScalingWidth(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxFacesetScalingHeight_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setFacesetScalingHeight(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxSaveSlots_valueChanged(int i)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setSaveSlots(i);
}

// -------------------------------------------------------

void DialogSystems::on_pushButtonEnterNameOptions_clicked()
{
    QList<QList<QString>> table = RPM::get()->project()->gameDatas()->systemDatas()
        ->enterNameTable();
    DialogEnterNameOptions dialog(table);
    if (dialog.exec() == QDialog::Accepted)
    {
        RPM::get()->project()->gameDatas()->systemDatas()->setEnterNameTable(dialog.table());
    }
}

// -------------------------------------------------------

void DialogSystems::on_statisticsUpdated(){
    updateStatisticsBase();
}

// -------------------------------------------------------

void DialogSystems::on_equipmentUpdated(){
    RPM::get()->project()->gameDatas()->battleSystemDatas()->updateEquipments();
}

// -------------------------------------------------------

void DialogSystems::on_radioButtonImage_toggled(bool checked) {
    ui->widgetPictureTitleBackground->setEnabled(checked);
    RPM::get()->project()->gameDatas()->titleScreenGameOverDatas()
        ->setIsTitleBackgroundImage(checked);
}

// -------------------------------------------------------

void DialogSystems::on_radioButtonVideo_toggled(bool checked) {
    ui->widgetVideoTitleBackground->setEnabled(checked);
    RPM::get()->project()->gameDatas()->titleScreenGameOverDatas()
        ->setIsTitleBackgroundImage(!checked);
}

// -------------------------------------------------------

void DialogSystems::on_radioButtonImageGameOver_toggled(bool checked)
{
    ui->widgetPictureGameOverBackground->setEnabled(checked);
    RPM::get()->project()->gameDatas()->titleScreenGameOverDatas()
        ->setIsGameOverBackgroundImage(checked);
}

// -------------------------------------------------------

void DialogSystems::on_radioButtonVideoGameOver_toggled(bool checked)
{
    ui->widgetVideoGameOverBackground->setEnabled(checked);
    RPM::get()->project()->gameDatas()->titleScreenGameOverDatas()
        ->setIsGameOverBackgroundImage(!checked);
}

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
    if (selected != nullptr) {
        updateCommonReactors((SystemCommonReaction*) selected->data()
                             .value<quintptr>());
    }
}

// -------------------------------------------------------

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
                RPM::get()->project()->gameDatas()->commonEventsDatas()
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

// -------------------------------------------------------

void DialogSystems::on_tabWidget_currentChanged(int index)
{
    RPM::get()->engineSettings()->setTabIndexSystems(index);
    RPM::get()->engineSettings()->write();
    switch (index) {
    case 5:
        RPM::get()->project()->setCurrentObject(nullptr);
        this->updateCommonReactors(reinterpret_cast<SystemCommonReaction *>(ui
            ->panelSuperListCommonReactors->list()->getSelected()->data().value<
            quintptr>()));
        break;
    case 6:
        RPM::get()->project()->setCurrentObject(reinterpret_cast<
            SystemCommonObject *>(ui->panelSuperListCommonObjects->list()
            ->getSelected()->data().value<quintptr>()));
        this->updateCommonObjects(reinterpret_cast<SystemCommonObject *>(ui
            ->panelSuperListCommonObjects->list()->getSelected()->data().value<
            quintptr>()));
        break;
    default:
        break;
    }
}
