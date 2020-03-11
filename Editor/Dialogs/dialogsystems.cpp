/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
#include "systemspeedfrequency.h"
#include "systemfontsize.h"
#include "systemfontname.h"
#include "dialogcommandsetdialogboxoptions.h"

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

void DialogSystems::initializeSystem(GameDatas *gameDatas) {
    SystemDatas *systemDatas;

    ui->comboBoxScreenWindow->addItem(RPM::translate(Translations::WINDOW));
    ui->comboBoxScreenWindow->addItem(RPM::translate(Translations::FULL_SCREEN));

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

    // Values
    systemDatas = RPM::get()->project()->gameDatas()->systemDatas();
    ui->widgetGameName->initializeNamesTrans(systemDatas->projectName());
    ui->spinBoxScreenWidth->setValue(systemDatas->screenWidth());
    ui->spinBoxScreenHeight->setValue(systemDatas->screenHeight());
    ui->spinBoxScreenWidth->setEnabled(systemDatas->isScreenWindow());
    ui->spinBoxScreenHeight->setEnabled(systemDatas->isScreenWindow());
    ui->comboBoxScreenWindow->setCurrentIndex(systemDatas->isScreenWindow() ? 0
        : 1);
    ui->spinBoxSquareSize->setValue(systemDatas->squareSize());
    ui->widgetMountainCollisionHeight->initializeNumberAndUpdate(systemDatas
        ->mountainCollisionHeight());
    ui->widgetMountainCollisionAngle->initializeNumberAndUpdate(systemDatas
        ->mountainCollisionAngle(), false);
    ui->spinBoxAnimationFrames->setValue(systemDatas->framesAnimation());

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

    // Sounds
    ui->widgetChooseCursor->initialize(gameDatas->systemDatas()->soundCursor());
    ui->widgetChooseConfirmation->initialize(gameDatas->systemDatas()
        ->soundConfirmation());
    ui->widgetChooseCancel->initialize(gameDatas->systemDatas()->soundCancel());
    ui->widgetChooseImpossible->initialize(gameDatas->systemDatas()
        ->soundImpossible());
}

// -------------------------------------------------------

void DialogSystems::initializeBattleSystem(GameDatas *gameDatas){

    // Don't show edit name
    ui->panelSuperListCommonStatistics->showEditName(false);
    ui->panelSuperListElements->showEditName(false);
    ui->panelSuperListWeaponsKind->showEditName(false);
    ui->panelSuperListArmorsKind->showEditName(false);

    // Allow editions
    ui->panelSuperListCommonStatistics->list()->setCanEdit(true);
    ui->panelSuperListElements->list()->setCanEdit(true);
    ui->panelSuperListWeaponsKind->list()->setCanEdit(true);
    ui->panelSuperListArmorsKind->list()->setCanEdit(true);

    // Update ID
    ui->treeViewBattleMap->setUpdateId(true);
    ui->treeViewBattleMap->setCanBeEmpty(false);
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
    ui->panelSuperListCommonEquipments->list()->initializeModel(gameDatas
        ->battleSystemDatas()->modelCommonEquipment());
    ui->panelSuperListCommonEquipments->list()->initializeNewItemInstance(
        new SystemLang);
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

void DialogSystems::initializeTitleScreenGameOver(GameDatas *gameDatas) {
    if (!gameDatas->titleScreenGameOverDatas()->isBackgroundImage()) {
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
}

// -------------------------------------------------------

void DialogSystems::initializeMainMenu(GameDatas *gameDatas){
    ui->panelSuperListItemsTypes->list()->initializeModel(gameDatas
                                                          ->systemDatas()
                                                          ->modelItemsTypes());
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
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
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

void DialogSystems::on_spinBoxSquareSize_valueChanged(int i) {
    RPM::get()->project()->gameDatas()->systemDatas()->setSquareSize(i);
}

// -------------------------------------------------------

void DialogSystems::on_spinBoxAnimationFrames_valueChanged(int i) {
    RPM::get()->project()->gameDatas()->systemDatas()->setFramesAnimation(i);
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
        ->setIsBackgroundImage(checked);
}

// -------------------------------------------------------

void DialogSystems::on_radioButtonVideo_toggled(bool checked) {
    ui->widgetVideoTitleBackground->setEnabled(checked);
    RPM::get()->project()->gameDatas()->titleScreenGameOverDatas()
        ->setIsBackgroundImage(!checked);
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

void DialogSystems::on_tabWidget_currentChanged(int index) {
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
