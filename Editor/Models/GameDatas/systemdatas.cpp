/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include "systemdatas.h"
#include "rpm.h"
#include "common.h"
#include "systemcurrency.h"
#include "systemcolor.h"
#include "systemwindowskin.h"
#include "systemcameraproperties.h"
#include "systemdetection.h"
#include "systemspeedfrequency.h"
#include "systemfontname.h"
#include "systemfontsize.h"
#include "systemskybox.h"
#include "systeminventoryfilter.h"
#include "systemmainmenucommand.h"
#include "systemselectstatistic.h"
#include "systeminitialpartymember.h"

const QString SystemDatas::JSON_PROJECT_NAME = "pn";
const QString SystemDatas::JSON_SCREEN_WIDTH = "sw";
const QString SystemDatas::JSON_SCREEN_HEIGHT = "sh";
const QString SystemDatas::JSON_IS_SCREEN_WINDOW = "isw";
const QString SystemDatas::JSON_IS_MOUSE_CONTROLS = "isMouseControls";
const QString SystemDatas::JSON_COLORS = "colors";
const QString SystemDatas::JSON_ITEMS_TYPES = "itemsTypes";
const QString SystemDatas::JSON_INVENTORY_FILTERS = "inventoryFilters";
const QString SystemDatas::JSON_MAIN_MENU_COMMANDS = "mainMenuCommands";
const QString SystemDatas::JSON_HEROES_STATISTICS = "heroesStatistics";
const QString SystemDatas::JSON_WINDOW_SKINS = "wskins";
const QString SystemDatas::JSON_CAMERA_PROPERTIES = "cp";
const QString SystemDatas::JSON_DETECTIONS = "d";
const QString SystemDatas::JSON_FONT_SIZES = "fs";
const QString SystemDatas::JSON_FONT_NAMES = "fn";
const QString SystemDatas::JSON_LAST_MAJOR_VERSION = "lmva";
const QString SystemDatas::JSON_LAST_MINOR_VERSION = "lmiv";
const QString SystemDatas::JSON_MOUNTAIN_COLLISION_HEIGHT = "mch";
const QString SystemDatas::JSON_MOUNTAIN_COLLISION_ANGLE = "mca";
const QString SystemDatas::JSON_CLIMBING_SPEED = "cs";
const QString SystemDatas::JSON_MOVE_CAMERA_ON_BLOCK_VIEW = "mcobv";
const QString SystemDatas::JSON_SPEED = "sf";
const QString SystemDatas::JSON_FREQUENCIES = "f";
const QString SystemDatas::JSON_SOUND_CURSOR = "scu";
const QString SystemDatas::JSON_SOUND_CONFIRMATION = "sco";
const QString SystemDatas::JSON_SOUND_CANCEL = "sca";
const QString SystemDatas::JSON_SOUND_IMPOSSIBLE = "si";
const QString SystemDatas::JSON_DIALOG_BOX_OPTIONS = "dbo";
const QString SystemDatas::JSON_FACESETS_SIZE = "facesetsSize";
const QString SystemDatas::JSON_FACESET_SCALING_WIDTH = "facesetScalingWidth";
const QString SystemDatas::JSON_FACESET_SCALING_HEIGHT = "facesetScalingHeight";
const QString SystemDatas::JSON_ICONS_SIZE = "iconsSize";
const QString SystemDatas::JSON_SKY_BOXES = "sb";
const QString SystemDatas::JSON_INITIAL_PARTY_MEMBERS = "initialPartyMembers";
const QString SystemDatas::JSON_ANTIALIASING = "aa";
const QString SystemDatas::JSON_MAP_FRAME_DURATION = "mfd";
const QString SystemDatas::JSON_BATTLERS_FRAMES = "battlersFrames";
const QString SystemDatas::JSON_BATTLERS_FRAME_DURATION = "bfd";
const QString SystemDatas::JSON_BATTLERS_FRAME_ATTACKING_DURATION = "bfad";
const QString SystemDatas::JSON_BATTLERS_COLUMNS = "battlersColumns";
const QString SystemDatas::JSON_PRICE_SOLD_ITEM = "priceSoldItem";
const QString SystemDatas::JSON_ENTER_NAME_TABLE = "enterNameTable";
const QString SystemDatas::JSON_AUTOTILES_FRAMES = "autotilesFrames";
const QString SystemDatas::JSON_AUTOTILES_FRAME_DURATION = "autotilesFrameDuration";
const QString SystemDatas::JSON_PORTION_RAY_ENGINE = "portionRayEngine";
const QString SystemDatas::JSON_PORTION_RAY_INGAME = "portionRayIngame";
const QString SystemDatas::JSON_SAVE_SLOTS = "saveSlots";
const QString SystemDatas::JSON_BACKUPS_ACTIVATED = "be";
const QString SystemDatas::JSON_BACKUPS_INTERVAL = "bi";
const QString SystemDatas::JSON_BACKUPS_MAX = "bm";
const bool SystemDatas::DEFAULT_ANTIALIASING = false;
const bool SystemDatas::DEFAULT_IS_MOUSE_CONTROLS = true;
const int SystemDatas::DEFAULT_MAP_FRAME_DURATION = 150;
const int SystemDatas::DEFAULT_BATTLERS_FRAMES = 4;
const QString SystemDatas::DEFAULT_BATTLERS_FRAME_DURATION = "Common.Mathf.random(250, 300)";
const QString SystemDatas::DEFAULT_BATTLERS_FRAME_ATTACKING_DURATION = "200";
const int SystemDatas::DEFAULT_BATTLERS_COLUMNS = 9;
const double SystemDatas::DEFAULT_PRICE_SOLD_ITEM = 50.0;
const int SystemDatas::DEFAULT_AUTOTILES_FRAMES = 4;
const int SystemDatas::DEFAULT_AUTOTILES_FRAME_DURATION = 150;
const int SystemDatas::DEFAULT_PORTION_RAY_ENGINE = 6;
const int SystemDatas::DEFAULT_PORTION_RAY_INGAME = 3;
const int SystemDatas::DEFAULT_FACESETS_SIZE =128;
const int SystemDatas::DEFAULT_FACESET_SCALING_WIDTH = 160;
const int SystemDatas::DEFAULT_FACESET_SCALING_HEIGHT = 160;
const int SystemDatas::DEFAULT_ICONS_SIZE = 16;
const int SystemDatas::DEFAULT_SAVE_SLOTS = 4;
const bool SystemDatas::DEFAULT_BACKUPS_ACTIVATED = true;
const bool SystemDatas::DEFAULT_MOVE_CAMERA_ON_BLOCK_VIEW = true;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemDatas::SystemDatas() :
    m_projectName(new SystemTranslatable(-1, RPM::translate(Translations::PROJECT_WITHOUT_NAME))),
    m_screenWidth(640),
    m_screenHeight(480),
    m_isScreenWindow(false),
    m_isMouseControls(DEFAULT_IS_MOUSE_CONTROLS),
    m_portionsRayEditor(DEFAULT_PORTION_RAY_ENGINE),
    m_portionsRayIngame(DEFAULT_PORTION_RAY_INGAME),
    m_squareSize(16),
    m_mountainCollisionHeight(new PrimitiveValue(4)),
    m_mountainCollisionAngle(new PrimitiveValue(45.0)),
    m_climbingSpeed(new PrimitiveValue(0.25)),
    m_moveCameraOnBlockView(new PrimitiveValue(DEFAULT_MOVE_CAMERA_ON_BLOCK_VIEW)),
    m_mapFrameDuration(new PrimitiveValue(DEFAULT_MAP_FRAME_DURATION)),
    m_priceSoldItem(new PrimitiveValue(DEFAULT_PRICE_SOLD_ITEM)),
    m_idMapHero(1),
    m_idObjectHero(1),
    m_framesAnimation(4),
    m_battlersFrames(DEFAULT_BATTLERS_FRAMES),
    m_battlersFrameDuration(DEFAULT_BATTLERS_FRAME_DURATION),
    m_battlersFrameAttackingDuration(DEFAULT_BATTLERS_FRAME_ATTACKING_DURATION),
    m_battlersColumns(DEFAULT_BATTLERS_COLUMNS),
    m_autotilesFrames(DEFAULT_AUTOTILES_FRAMES),
    m_autotilesFrameDuration(DEFAULT_AUTOTILES_FRAME_DURATION),
    m_showBB(false),
    m_showFPS(false),
    m_antialiasing(false),
    m_backupsActivated(DEFAULT_BACKUPS_ACTIVATED),
    m_backupsInterval(30),
    m_backupsMax(10),
    m_modelColors(new QStandardItemModel),
    m_modelCurrencies(new QStandardItemModel),
    m_modelItemsTypes(new QStandardItemModel),
    m_modelInventoryFilters(new QStandardItemModel),
    m_modelMainMenuCommands(new QStandardItemModel),
    m_modelHeroesStatistics(new QStandardItemModel),
    m_modelWindowSkins(new QStandardItemModel),
    m_modelCameraProperties(new QStandardItemModel),
    m_modelDetections(new QStandardItemModel),
    m_modelSpeed(new QStandardItemModel),
    m_modelFrequencies(new QStandardItemModel),
    m_modelFontSizes(new QStandardItemModel),
    m_modelFontNames(new QStandardItemModel),
    m_modelSkyBoxes(new QStandardItemModel),
    m_modelInitialPartyMembers(new QStandardItemModel),
    m_lastMajorVersion(1),
    m_lastMinorVersion(0),
    m_soundCursor(new SystemPlaySong(-1, SongKind::Sound)),
    m_soundConfirmation(new SystemPlaySong(-1, SongKind::Sound)),
    m_soundCancel(new SystemPlaySong(-1, SongKind::Sound)),
    m_soundImpossible(new SystemPlaySong(-1, SongKind::Sound)),
    m_dialogBoxOptions(new EventCommand(EventCommandKind::SetDialogBoxOptions)),
    m_facesetsSize(DEFAULT_FACESETS_SIZE),
    m_facesetScalingWidth(DEFAULT_FACESET_SCALING_WIDTH),
    m_facesetScalingHeight(DEFAULT_FACESET_SCALING_HEIGHT),
    m_iconsSize(DEFAULT_ICONS_SIZE),
    m_saveSlots(DEFAULT_SAVE_SLOTS)
{

}

SystemDatas::~SystemDatas()
{
    delete m_projectName;
    delete m_mountainCollisionHeight;
    delete m_mountainCollisionAngle;
    delete m_climbingSpeed;
    delete m_moveCameraOnBlockView;
    delete m_mapFrameDuration;
    delete m_priceSoldItem;
    SuperListItem::deleteModel(m_modelColors);
    SuperListItem::deleteModel(m_modelCurrencies);
    SuperListItem::deleteModel(m_modelItemsTypes);
    SuperListItem::deleteModel(m_modelInventoryFilters);
    SuperListItem::deleteModel(m_modelMainMenuCommands);
    SuperListItem::deleteModel(m_modelHeroesStatistics);
    SuperListItem::deleteModel(m_modelWindowSkins);
    SuperListItem::deleteModel(m_modelCameraProperties);
    SuperListItem::deleteModel(m_modelDetections);
    SuperListItem::deleteModel(m_modelSpeed);
    SuperListItem::deleteModel(m_modelFrequencies);
    SuperListItem::deleteModel(m_modelFontSizes);
    SuperListItem::deleteModel(m_modelFontNames);
    SuperListItem::deleteModel(m_modelSkyBoxes);
    SuperListItem::deleteModel(m_modelInitialPartyMembers);
    delete m_soundCursor;
    delete m_soundConfirmation;
    delete m_soundCancel;
    delete m_soundImpossible;
    delete m_dialogBoxOptions;
}

void SystemDatas::read(QString path) {
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SYSTEM), *this);
}

SystemTranslatable *SystemDatas::projectName() const {
    return m_projectName;
}

int SystemDatas::screenWidth() const {
    return m_screenWidth;
}

void SystemDatas::setScreenWidth(int w) {
    m_screenWidth = w;
}

int SystemDatas::screenHeight() const {
    return m_screenHeight;
}

void SystemDatas::setScreenHeight(int h) {
    m_screenHeight = h;
}

bool SystemDatas::isScreenWindow() const {
    return m_isScreenWindow;
}

void SystemDatas::setIsScreenWinow(bool b) {
    m_isScreenWindow = b;
}

bool SystemDatas::isMouseControls() const
{
    return m_isMouseControls;
}

void SystemDatas::setIsMouseControls(bool isMouseControls)
{
    m_isMouseControls = isMouseControls;
}

int SystemDatas::portionsRayEditor() const
{
    return m_portionsRayEditor;
}

void SystemDatas::setPortionRayEditor(int p)
{
    m_portionsRayEditor = p;
}

int SystemDatas::portionsRayIngame() const
{
    return m_portionsRayIngame;
}

void SystemDatas::setPortionRayIngame(int p)
{
    m_portionsRayIngame = p;
}

int SystemDatas::squareSize() const { return m_squareSize; }

void SystemDatas::setSquareSize(int i) { m_squareSize = i; }

PrimitiveValue * SystemDatas::mountainCollisionHeight() const {
    return m_mountainCollisionHeight;
}

PrimitiveValue * SystemDatas::mountainCollisionAngle() const {
    return m_mountainCollisionAngle;
}

PrimitiveValue * SystemDatas::climbingSpeed() const
{
    return m_climbingSpeed;
}

PrimitiveValue * SystemDatas::moveCameraOnBlockView() const
{
    return m_moveCameraOnBlockView;
}

PrimitiveValue * SystemDatas::mapFrameDuration() const
{
    return m_mapFrameDuration;
}

PrimitiveValue * SystemDatas::priceSoldItem() const {
    return m_priceSoldItem;
}

QList<QList<QString>> SystemDatas::enterNameTable() const
{
    return m_enterNameTable;
}

void SystemDatas::setEnterNameTable(QList<QList<QString>> enterNameTable)
{
    m_enterNameTable = enterNameTable;
}

int SystemDatas::idMapHero() const {
    return m_idMapHero;
}

void SystemDatas::setIdMapHero(int i) { m_idMapHero = i; }

int SystemDatas::idObjectHero() const {
    return m_idObjectHero;
}

void SystemDatas::setIdObjectHero(int i) { m_idObjectHero = i; }

QString SystemDatas::pathBR() const { return m_pathBR; }

void SystemDatas::setPathBR(QString p) { m_pathBR = p; }

int SystemDatas::framesAnimation() const { return m_framesAnimation; }

void SystemDatas::setFramesAnimation(int f) { m_framesAnimation = f; }

int SystemDatas::battlersFrames() const
{
    return m_battlersFrames;
}

void SystemDatas::setBattlersFrames(int battlersFrames)
{
    m_battlersFrames = battlersFrames;
}

QString SystemDatas::battlersFrameDuration() const
{
    return m_battlersFrameDuration;
}

void SystemDatas::setBattlersFrameDuration(QString battlersFrameDuration)
{
    m_battlersFrameDuration = battlersFrameDuration;
}

QString SystemDatas::battlersFrameAttackingDuration() const
{
    return m_battlersFrameAttackingDuration;
}

void SystemDatas::setBattlersFrameAttackingDuration(QString battlersFrameAttackingDuration)
{
    m_battlersFrameAttackingDuration = battlersFrameAttackingDuration;
}

int SystemDatas::battlersColumns() const
{
    return m_battlersColumns;
}

void SystemDatas::setBattlersColumns(int battlersColumns)
{
    m_battlersColumns = battlersColumns;
}

int SystemDatas::autotilesFrames() const
{
    return m_autotilesFrames;
}

void SystemDatas::setAutotilesFrames(int autotilesFrames)
{
    m_autotilesFrames = autotilesFrames;
}

int SystemDatas::autotilesFrameDuration() const
{
    return m_autotilesFrameDuration;
}

void SystemDatas::setAutotilesFrameDuration(int autotilesFrameDuration)
{
    m_autotilesFrameDuration = autotilesFrameDuration;
}

bool SystemDatas::showBB() const { return m_showBB; }

void SystemDatas::setShowBB(bool b) { m_showBB = b; }

bool SystemDatas::showFPS() const
{
    return m_showFPS;
}

void SystemDatas::setShowFPS(bool b)
{
    m_showFPS = b;
}

bool SystemDatas::antialiasing() const
{
    return m_antialiasing;
}

void SystemDatas::setAntialiasing(bool aa)
{
    m_antialiasing = aa;
}

bool SystemDatas::backupsActivated() const
{
    return m_backupsActivated;
}

void SystemDatas::setBackupsActivated(bool backupsActivated)
{
    m_backupsActivated = backupsActivated;
}

int SystemDatas::backupsInterval() const
{
    return m_backupsInterval;
}

void SystemDatas::setBackupsInterval(int backupsInterval)
{
    m_backupsInterval = backupsInterval;
}

int SystemDatas::backupsMax() const
{
    return m_backupsMax;
}

void SystemDatas::setBackupsMax(int backupsMax)
{
    m_backupsMax = backupsMax;
}

QStandardItemModel * SystemDatas::modelColors() const {
    return m_modelColors;
}

QStandardItemModel * SystemDatas::modelCurrencies() const {
    return m_modelCurrencies;
}

QStandardItemModel * SystemDatas::modelItemsTypes() const {
    return m_modelItemsTypes;
}

QStandardItemModel * SystemDatas::modelInventoryFilters() const
{
    return m_modelInventoryFilters;
}

QStandardItemModel * SystemDatas::modelMainMenuCommands() const
{
    return m_modelMainMenuCommands;
}

QStandardItemModel * SystemDatas::modelHeroesStatistics() const
{
    return m_modelHeroesStatistics;
}

QStandardItemModel * SystemDatas::modelWindowSkins() const {
    return m_modelWindowSkins;
}

QStandardItemModel * SystemDatas::modelcameraProperties() const {
    return m_modelCameraProperties;
}

QStandardItemModel * SystemDatas::modelDetections() const {
    return m_modelDetections;
}

QStandardItemModel * SystemDatas::modelSpeed() const {
    return m_modelSpeed;
}

QStandardItemModel * SystemDatas::modelFrequencies() const {
    return m_modelFrequencies;
}


QStandardItemModel * SystemDatas::modelFontSizes() const {
    return m_modelFontSizes;
}

QStandardItemModel * SystemDatas::modelFontNames() const {
    return m_modelFontNames;
}

QStandardItemModel * SystemDatas::modelSkyBoxes() const
{
    return m_modelSkyBoxes;
}

QStandardItemModel * SystemDatas::modelInitialPartyMembers() const
{
    return m_modelInitialPartyMembers;
}

int SystemDatas::lastMajorVersion() const {
    return m_lastMajorVersion;
}

void SystemDatas::setLastMajorVersion(int v) {
    m_lastMajorVersion = v;
}

int SystemDatas::lastMinorVersion() const {
    return m_lastMinorVersion;
}

void SystemDatas::setLastMinorVersion(int v) {
    m_lastMinorVersion = v;
}

SystemPlaySong * SystemDatas::soundCursor() const {
    return m_soundCursor;
}

SystemPlaySong * SystemDatas::soundConfirmation() const {
    return m_soundConfirmation;
}

SystemPlaySong * SystemDatas::soundCancel() const {
    return m_soundCancel;
}

SystemPlaySong * SystemDatas::soundImpossible() const {
    return m_soundImpossible;
}

EventCommand * SystemDatas::dialogBoxOptions() const {
    return m_dialogBoxOptions;
}

void SystemDatas::setDialogBoxOptions(EventCommand *command) {
    m_dialogBoxOptions = command;
}

int SystemDatas::facesetsSize() const
{
    return m_facesetsSize;
}

void SystemDatas::setFacesetsSize(int facesetSize)
{
    m_facesetsSize = facesetSize;
}

int SystemDatas::facesetScalingWidth() const
{
    return m_facesetScalingWidth;
}

void SystemDatas::setFacesetScalingWidth(int facesetScalingWidth)
{
    m_facesetScalingWidth = facesetScalingWidth;
}

int SystemDatas::facesetScalingHeight() const
{
    return m_facesetScalingHeight;
}

void SystemDatas::setFacesetScalingHeight(int facesetScalingHeight)
{
    m_facesetScalingHeight = facesetScalingHeight;
}

int SystemDatas::iconsSize() const
{
    return m_iconsSize;
}

void SystemDatas::setIconsSize(int iconsSize)
{
    m_iconsSize = iconsSize;
}

int SystemDatas::saveSlots() const
{
    return m_saveSlots;
}

void SystemDatas::setSaveSlots(int saveSlots)
{
    m_saveSlots = saveSlots;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemDatas::setDefault()
{
    m_pathBR = Common::pathCombine(QDir::currentPath(), RPM::PATH_BR);
}

// -------------------------------------------------------

void SystemDatas::setDefaultColors()
{
    QStandardItem *item;
    SystemColor *color;
    QString namesColors[] = {
        RPM::translate(Translations::BLACK),
        RPM::translate(Translations::WHITE),
        RPM::translate(Translations::BLUE_SKY)
    };
    int r[] = {0, 255, 199};
    int g[] = {0, 255, 224};
    int b[] = {0, 255, 221};
    int length = (sizeof(namesColors)/sizeof(*namesColors));

    for (int i = 0; i < length; i++) {
        item = new QStandardItem;
        color = new SystemColor(i + 1, namesColors[i], r[i], g[i], b[i], 255);
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(color)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(color->toString());
        m_modelColors->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemDatas::setDefaultCurrencies() {
    QStandardItem *item;
    SystemCurrency *currency;
    QString namesCurrencies[] = {
        RPM::translate(Translations::G),
        RPM::translate(Translations::XCOIN)
    };
    int iconsX[] = {15, 0};
    int iconsY[] = {0, 1};
    int length = (sizeof(namesCurrencies)/sizeof(*namesCurrencies));
    for (int i = 0; i < length; i++){
        item = new QStandardItem;
        currency = new SystemCurrency(i + 1, namesCurrencies[i], 1, iconsX[i], iconsY[i]);
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(currency)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(currency->toString());
        m_modelCurrencies->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemDatas::setDefaultItemsTypes() {
    SuperListItem::deleteModel(m_modelItemsTypes, false);
    m_modelItemsTypes->appendRow((new SystemTranslatable(1, RPM::translate(Translations
        ::INGREDIENT)))->getModelRow());
    m_modelItemsTypes->appendRow((new SystemTranslatable(2, RPM::translate(Translations
        ::KEY_ITEM)))->getModelRow());
}

// -------------------------------------------------------

void SystemDatas::setDefaultInventoryFilters()
{
    m_modelInventoryFilters->appendRow((new SystemInventoryFilter(1, RPM
        ::translate(Translations::ALL)))->getModelRow());
    m_modelInventoryFilters->appendRow((new SystemInventoryFilter(2, RPM
        ::translate(Translations::CONSUMABLES), InventoryFilterKind
        ::Consumables))->getModelRow());
    m_modelInventoryFilters->appendRow((new SystemInventoryFilter(3, RPM
        ::translate(Translations::INGREDIENTS), InventoryFilterKind::Custom))
        ->getModelRow());
    m_modelInventoryFilters->appendRow((new SystemInventoryFilter(4, RPM
        ::translate(Translations::KEY_ITEMS), InventoryFilterKind::Custom,
        new PrimitiveValue(PrimitiveValueKind::DataBase, 2)))->getModelRow());
    m_modelInventoryFilters->appendRow((new SystemInventoryFilter(5, RPM
        ::translate(Translations::WEAPONS), InventoryFilterKind::Weapons))
        ->getModelRow());
    m_modelInventoryFilters->appendRow((new SystemInventoryFilter(6, RPM
        ::translate(Translations::ARMORS), InventoryFilterKind::Armors))
        ->getModelRow());
}

// -------------------------------------------------------

void SystemDatas::setDefaultMainMenuCommands()
{
    m_modelMainMenuCommands->appendRow((new SystemMainMenuCommand(1, RPM
        ::translate(Translations::INVENTORY)))->getModelRow());
    m_modelMainMenuCommands->appendRow((new SystemMainMenuCommand(2, RPM
        ::translate(Translations::SKILLS), MainMenuCommandKind::Skills))
        ->getModelRow());
    m_modelMainMenuCommands->appendRow((new SystemMainMenuCommand(3, RPM
        ::translate(Translations::EQUIP), MainMenuCommandKind::Equip))
        ->getModelRow());
    m_modelMainMenuCommands->appendRow((new SystemMainMenuCommand(4, RPM
        ::translate(Translations::STATES), MainMenuCommandKind::States))
        ->getModelRow());
    m_modelMainMenuCommands->appendRow((new SystemMainMenuCommand(5, RPM
        ::translate(Translations::ORDER), MainMenuCommandKind::Order))
        ->getModelRow());
    m_modelMainMenuCommands->appendRow((new SystemMainMenuCommand(6, RPM
        ::translate(Translations::SAVE), MainMenuCommandKind::Save))
        ->getModelRow());
    m_modelMainMenuCommands->appendRow((new SystemMainMenuCommand(7, RPM
        ::translate(Translations::QUIT), MainMenuCommandKind::Quit))
        ->getModelRow());
}

// -------------------------------------------------------

void SystemDatas::setDefaultHeroesStatistics()
{
    m_modelHeroesStatistics->appendRow((new SystemSelectStatistic(1, "HP", new
        PrimitiveValue(PrimitiveValueKind::DataBase, 3)))->getModelRow());
    m_modelHeroesStatistics->appendRow((new SystemSelectStatistic(2, "MP", new
        PrimitiveValue(PrimitiveValueKind::DataBase, 4)))->getModelRow());
    m_modelHeroesStatistics->appendRow((new SystemSelectStatistic(3, "TP", new
        PrimitiveValue(PrimitiveValueKind::DataBase, 5)))->getModelRow());
}

// -------------------------------------------------------

void SystemDatas::setDefaultWindowSkins() {
    QStandardItem *item = new QStandardItem;
    SystemWindowSkin *sys = new SystemWindowSkin(1, RPM::translate(Translations
        ::DEFAULT), 1, QRectF(0, 0, 8, 8), QRectF(8, 0, 8, 8), QRectF(0, 8, 8,
        8), QRectF(8, 8, 8, 8), QRectF(16, 8, 8, 2), QRectF(16, 10, 8, 2),
        QRectF(16, 0, 2, 8), QRectF(18, 0, 2, 8), QRectF(0, 18, 72, 36), QRectF(
        0, 54, 72, 36), false, QRectF(88, 0, 80, 16), QRectF(24, 0, 64, 18),
        QRectF(168, 0, 16, 22), QRectF(72, 22, 120, 18), QRectF(72, 40, 120, 18)
        , QRectF(72, 58, 120, 18), QRectF(72, 76, 38, 14));
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(sys->toString());
    m_modelWindowSkins->appendRow(item);
}

// -------------------------------------------------------

void SystemDatas::setDefaultCameraProperties()
{
    m_modelCameraProperties->appendRow((new SystemCameraProperties(1, RPM
        ::translate(Translations::OUTSIDE)))->getModelRow());
    m_modelCameraProperties->appendRow((new SystemCameraProperties(2, RPM
        ::translate(Translations::BATTLE), new PrimitiveValue(360.0), new
        PrimitiveValue(SystemCameraProperties::DEFAULT_HORIZONTAL_ANGLE), new
        PrimitiveValue(60.0)))->getModelRow());
    m_modelCameraProperties->appendRow((new SystemCameraProperties(3, "FPS",
        new PrimitiveValue(0.5), new PrimitiveValue(SystemCameraProperties
        ::DEFAULT_HORIZONTAL_ANGLE), new PrimitiveValue(85.0), new PrimitiveValue(0),
        new PrimitiveValue(1), new PrimitiveValue(0)))->getModelRow());
}

// -------------------------------------------------------

void SystemDatas::setDefaultDetections() {
    QList<QStandardItem *> row;
    SystemDetection *detection;

    detection = new SystemDetection(1, RPM::translate(Translations::FRONT), 0, 0
        , 0, 1);
    detection->setFront();
    row = detection->getModelRow();
    m_modelDetections->appendRow(row);
    detection = new SystemDetection(2, RPM::translate(Translations::SELF), 0, 0,
        0, 0);
    detection->setSelf();
    row = detection->getModelRow();
    m_modelDetections->appendRow(row);
}

// -------------------------------------------------------

void SystemDatas::setDefaultSpeed() {
    QList<QStandardItem *> row;
    SystemSpeedFrequency *speedFrequency;

    speedFrequency = new SystemSpeedFrequency(1, RPM::translate(Translations
        ::NORMAL), new PrimitiveValue(1.0), true);
    row = speedFrequency->getModelRow();
    m_modelSpeed->appendRow(row);
    speedFrequency = new SystemSpeedFrequency(2, RPM::translate(Translations
        ::LOW), new PrimitiveValue(0.75), true);
    row = speedFrequency->getModelRow();
    m_modelSpeed->appendRow(row);
    speedFrequency = new SystemSpeedFrequency(3, RPM::translate(Translations
        ::VERY_LOW), new PrimitiveValue(0.5), true);
    row = speedFrequency->getModelRow();
    m_modelSpeed->appendRow(row);
    speedFrequency = new SystemSpeedFrequency(4, RPM::translate(Translations
        ::FAST), new PrimitiveValue(1.5), true);
    row = speedFrequency->getModelRow();
    m_modelSpeed->appendRow(row);
    speedFrequency = new SystemSpeedFrequency(5, RPM::translate(Translations
        ::VERY_FAST), new PrimitiveValue(2.0), true);
    row = speedFrequency->getModelRow();
    m_modelSpeed->appendRow(row);
}

// -------------------------------------------------------

void SystemDatas::setDefaultFrequencies() {
    QList<QStandardItem *> row;
    SystemSpeedFrequency *speedFrequency;

    speedFrequency = new SystemSpeedFrequency(1, RPM::translate(Translations
        ::INSTANTANEOUS), new PrimitiveValue(0.0), false);
    row = speedFrequency->getModelRow();
    m_modelFrequencies->appendRow(row);
}

// -------------------------------------------------------

void SystemDatas::setDefaultFontSizes() {
    QList<QStandardItem *> row;
    SystemFontSize *fontSize;

    fontSize = new SystemFontSize(1, RPM::translate(Translations::NORMAL), new
        PrimitiveValue(13));
    row = fontSize->getModelRow();
    m_modelFontSizes->appendRow(row);
    fontSize = new SystemFontSize(2, RPM::translate(Translations::SMALL), new
        PrimitiveValue(10));
    row = fontSize->getModelRow();
    m_modelFontSizes->appendRow(row);
    fontSize = new SystemFontSize(3, RPM::translate(Translations::VERY_SMALL),
        new PrimitiveValue(7));
    row = fontSize->getModelRow();
    m_modelFontSizes->appendRow(row);
    fontSize = new SystemFontSize(4, RPM::translate(Translations::BIG), new
        PrimitiveValue(16));
    row = fontSize->getModelRow();
    m_modelFontSizes->appendRow(row);
    fontSize = new SystemFontSize(5, RPM::translate(Translations::VERY_BIG), new
        PrimitiveValue(19));
    row = fontSize->getModelRow();
    m_modelFontSizes->appendRow(row);
}

// -------------------------------------------------------

void SystemDatas::setDefaultFontNames()
{
    m_modelFontNames->appendRow((new SystemFontName(1, "Default", false, new
        PrimitiveValue(SystemFontName::DEFAULT_FONT)))->getModelRow());
}

// -------------------------------------------------------

void SystemDatas::setDefaultSounds() {
    m_soundCursor->setId(3);
    m_soundCursor->volume()->setNumberValue(10);
    m_soundConfirmation->setId(2);
    m_soundConfirmation->volume()->setNumberValue(50);
    m_soundCancel->setId(1);
    m_soundCancel->volume()->setNumberValue(50);
    m_soundImpossible->setId(1);
    m_soundImpossible->volume()->setNumberValue(50);
}

// -------------------------------------------------------

void SystemDatas::setDefaultDialogBoxOptions() {
    QVector<QString> command({"1","7","1","1","12","10","1","12","320","1","12",
        "620","1","12","150","1","12","30","1","12","30","1","12","30","1","12",
        "30","1","1","1","12","0","1","12","0","1","0","1","7","2","1","7","1",
        "0","1","7","1","1","7","1"});
    m_dialogBoxOptions->setCommands(command);
    m_dialogBoxOptions->setKind(EventCommandKind::SetDialogBoxOptions);
}

// -------------------------------------------------------

void SystemDatas::setdefaultEnterNameOptions()
{
    m_enterNameTable = QList<QList<QString>>({
        QList<QString>({"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"}),
        QList<QString>({"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"}),
        QList<QString>({"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"}),
        QList<QString>({"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"}),
        QList<QString>({"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "^", "@", "|"}),
        QList<QString>({"?", "!", "#", "$", "%", "[", "]", "{", "}", "(", ")", "<", ">"}),
        QList<QString>({"&", "*", "+", "-", "/", "=", ":", ";", ".", "~", " ", " ", " "})
    });
}

// -------------------------------------------------------

void SystemDatas::setDefaultSkyBoxes()
{
    m_modelSkyBoxes->appendRow((new SystemSkyBox(1, RPM::translate(Translations
        ::SKY), 1, 2, 3, 4, 5, 6))->getModelRow());
}

// -------------------------------------------------------

void SystemDatas::setDefaultInitialPartyMembers()
{
    m_modelInitialPartyMembers->insertRow(0, (new SystemInitialPartyMember)->getModelRow());
}

// -------------------------------------------------------

void SystemDatas::setDefaultTranslations()
{
    SuperListItem::setModelItemName(m_modelColors, 0, RPM::translate(Translations::BLACK));
    SuperListItem::setModelItemName(m_modelColors, 1, RPM::translate(Translations::WHITE));
    SuperListItem::setModelItemName(m_modelColors, 2, RPM::translate(Translations::BLUE_SKY));
    SuperListItem::setModelItemName(m_modelCurrencies, 0, RPM::translate(Translations::G));
    SuperListItem::setModelItemName(m_modelCurrencies, 1, RPM::translate(Translations::XCOIN));
    SuperListItem::setModelItemName(m_modelItemsTypes, 0, RPM::translate(Translations::INGREDIENT));
    SuperListItem::setModelItemName(m_modelItemsTypes, 1, RPM::translate(Translations::KEY_ITEM));
    SuperListItem::setModelItemName(m_modelInventoryFilters, 0, RPM::translate(Translations::ALL));
    SuperListItem::setModelItemName(m_modelInventoryFilters, 1, RPM::translate(Translations::CONSUMABLES));
    SuperListItem::setModelItemName(m_modelInventoryFilters, 2, RPM::translate(Translations::INGREDIENTS));
    SuperListItem::setModelItemName(m_modelInventoryFilters, 3, RPM::translate(Translations::KEY_ITEMS));
    SuperListItem::setModelItemName(m_modelInventoryFilters, 4, RPM::translate(Translations::WEAPONS));
    SuperListItem::setModelItemName(m_modelInventoryFilters, 5, RPM::translate(Translations::ARMORS));
    SuperListItem::setModelItemName(m_modelMainMenuCommands, 0, RPM::translate(Translations::INVENTORY));
    SuperListItem::setModelItemName(m_modelMainMenuCommands, 1, RPM::translate(Translations::SKILLS));
    SuperListItem::setModelItemName(m_modelMainMenuCommands, 2, RPM::translate(Translations::EQUIP));
    SuperListItem::setModelItemName(m_modelMainMenuCommands, 3, RPM::translate(Translations::STATES));
    SuperListItem::setModelItemName(m_modelMainMenuCommands, 4, RPM::translate(Translations::ORDER));
    SuperListItem::setModelItemName(m_modelMainMenuCommands, 5, RPM::translate(Translations::SAVE));
    SuperListItem::setModelItemName(m_modelMainMenuCommands, 6, RPM::translate(Translations::QUIT));
    SuperListItem::setModelItemName(m_modelHeroesStatistics, 0, RPM::translate(Translations::HP));
    SuperListItem::setModelItemName(m_modelHeroesStatistics, 1, RPM::translate(Translations::MP));
    SuperListItem::setModelItemName(m_modelHeroesStatistics, 2, RPM::translate(Translations::TP));
    SuperListItem::setModelItemName(m_modelWindowSkins, 0, RPM::translate(Translations::BLUE));
    SuperListItem::setModelItemName(m_modelWindowSkins, 1, RPM::translate(Translations::GREEN));
    SuperListItem::setModelItemName(m_modelWindowSkins, 2, RPM::translate(Translations::RED));
    SuperListItem::setModelItemName(m_modelWindowSkins, 3, RPM::translate(Translations::BLACK));
    SuperListItem::setModelItemName(m_modelCameraProperties, 0, RPM::translate(Translations::OUTSIDE));
    SuperListItem::setModelItemName(m_modelCameraProperties, 1, RPM::translate(Translations::BATTLE));
    SuperListItem::setModelItemName(m_modelDetections, 0, RPM::translate(Translations::FRONT));
    SuperListItem::setModelItemName(m_modelDetections, 1, RPM::translate(Translations::SELF));
    SuperListItem::setModelItemName(m_modelSpeed, 0, RPM::translate(Translations::NORMAL));
    SuperListItem::setModelItemName(m_modelSpeed, 1, RPM::translate(Translations::LOW));
    SuperListItem::setModelItemName(m_modelSpeed, 2, RPM::translate(Translations::VERY_LOW));
    SuperListItem::setModelItemName(m_modelSpeed, 3, RPM::translate(Translations::FAST));
    SuperListItem::setModelItemName(m_modelSpeed, 4, RPM::translate(Translations::VERY_FAST));
    SuperListItem::setModelItemName(m_modelFrequencies, 0, RPM::translate(Translations::INSTANTANEOUS));
    SuperListItem::setModelItemName(m_modelFrequencies, 1, RPM::translate(Translations::EACH_SECOND));
    SuperListItem::setModelItemName(m_modelFontSizes, 0, RPM::translate(Translations::NORMAL));
    SuperListItem::setModelItemName(m_modelFontSizes, 1, RPM::translate(Translations::SMALL));
    SuperListItem::setModelItemName(m_modelFontSizes, 2, RPM::translate(Translations::VERY_SMALL));
    SuperListItem::setModelItemName(m_modelFontSizes, 3, RPM::translate(Translations::BIG));
    SuperListItem::setModelItemName(m_modelFontSizes, 4, RPM::translate(Translations::VERY_BIG));
    SuperListItem::setModelItemName(m_modelFontNames, 0, RPM::translate(Translations::DEFAULT));
    SuperListItem::setModelItemName(m_modelSkyBoxes, 0, RPM::translate(Translations::DAY));
    SuperListItem::setModelItemName(m_modelSkyBoxes, 1, RPM::translate(Translations::EVENING));
    SuperListItem::setModelItemName(m_modelSkyBoxes, 2, RPM::translate(Translations::NIGHT));

}

// -------------------------------------------------------

void SystemDatas::updateModelsToString()
{
    SuperListItem::updateModelToString(m_modelInitialPartyMembers);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemDatas::read(const QJsonObject &json){
    QJsonArray jsonList;
    QList<QStandardItem *> row;
    QStandardItem *item;

    // Clear
    SuperListItem::deleteModel(m_modelColors, false);
    SuperListItem::deleteModel(m_modelCurrencies, false);
    SuperListItem::deleteModel(m_modelItemsTypes, false);
    SuperListItem::deleteModel(m_modelInventoryFilters, false);
    SuperListItem::deleteModel(m_modelMainMenuCommands, false);
    SuperListItem::deleteModel(m_modelHeroesStatistics, false);
    SuperListItem::deleteModel(m_modelWindowSkins, false);
    SuperListItem::deleteModel(m_modelCameraProperties, false);
    SuperListItem::deleteModel(m_modelDetections, false);
    SuperListItem::deleteModel(m_modelSpeed, false);
    SuperListItem::deleteModel(m_modelFrequencies, false);
    SuperListItem::deleteModel(m_modelFontSizes, false);
    SuperListItem::deleteModel(m_modelFontNames, false);
    SuperListItem::deleteModel(m_modelSkyBoxes, false);
    SuperListItem::deleteModel(m_modelInitialPartyMembers, false);

    // Other options
    m_projectName->read(json[JSON_PROJECT_NAME].toObject());
    m_screenWidth = json[JSON_SCREEN_WIDTH].toInt();
    m_screenHeight = json[JSON_SCREEN_HEIGHT].toInt();
    m_isScreenWindow = json[JSON_IS_SCREEN_WINDOW].toBool();
    if (json.contains(JSON_IS_MOUSE_CONTROLS)) {
        m_isMouseControls = json[JSON_IS_MOUSE_CONTROLS].toBool();
    }
    if (json.contains(JSON_PORTION_RAY_ENGINE))
    {
        m_portionsRayEditor = json[JSON_PORTION_RAY_ENGINE].toInt();
    }
    if (json.contains(JSON_PORTION_RAY_INGAME))
    {
        m_portionsRayIngame = json[JSON_PORTION_RAY_INGAME].toInt();
    }
    m_squareSize = json["ss"].toInt();
    if (json.contains(JSON_MOUNTAIN_COLLISION_HEIGHT)) {
        m_mountainCollisionHeight->read(json[JSON_MOUNTAIN_COLLISION_HEIGHT].toObject());
    }
    if (json.contains(JSON_MOUNTAIN_COLLISION_ANGLE)) {
        m_mountainCollisionAngle->read(json[JSON_MOUNTAIN_COLLISION_ANGLE].toObject());
    }
    if (json.contains(JSON_CLIMBING_SPEED)) {
        m_climbingSpeed->read(json[JSON_CLIMBING_SPEED].toObject());
    }
    if (json.contains(JSON_MOVE_CAMERA_ON_BLOCK_VIEW)) {
        m_moveCameraOnBlockView->read(json[JSON_MOVE_CAMERA_ON_BLOCK_VIEW].toObject());
    }
    if (json.contains(JSON_MAP_FRAME_DURATION))
    {
        m_mapFrameDuration->read(json[JSON_MAP_FRAME_DURATION].toObject());
    }
    if (json.contains(JSON_PRICE_SOLD_ITEM))
    {
        m_priceSoldItem->read(json[JSON_PRICE_SOLD_ITEM].toObject());
    }
    m_idMapHero = json["idMapHero"].toInt();
    m_idObjectHero = json["idObjHero"].toInt();
    m_pathBR = json["pathBR"].toString();
    m_framesAnimation = json["frames"].toInt();
    if (json.contains(JSON_BATTLERS_FRAMES))
    {
        m_battlersFrames = json[JSON_BATTLERS_FRAMES].toInt();
    }
    if (json.contains(JSON_BATTLERS_FRAME_DURATION))
    {
        m_battlersFrameDuration = json[JSON_BATTLERS_FRAME_DURATION].toString();
    }
    if (json.contains(JSON_BATTLERS_FRAME_ATTACKING_DURATION))
    {
        m_battlersFrameAttackingDuration = json[JSON_BATTLERS_FRAME_ATTACKING_DURATION].toString();
    }
    if (json.contains(JSON_BATTLERS_COLUMNS))
    {
        m_battlersColumns = json[JSON_BATTLERS_COLUMNS].toInt();
    }
    if (json.contains(JSON_AUTOTILES_FRAMES))
    {
        m_autotilesFrames = json[JSON_AUTOTILES_FRAMES].toInt();
    }
    if (json.contains(JSON_AUTOTILES_FRAME_DURATION))
    {
        m_autotilesFrameDuration = json[JSON_AUTOTILES_FRAME_DURATION].toInt();
    }
    m_showBB = json.contains("bb");
    m_showFPS = json.contains("fps");
    if (json.contains(JSON_ANTIALIASING))
    {
        m_antialiasing = json[JSON_ANTIALIASING].toBool();
    }
    if (json.contains(JSON_BACKUPS_ACTIVATED))
    {
        m_backupsActivated = json[JSON_BACKUPS_ACTIVATED].toBool();
    }
    if (json.contains(JSON_BACKUPS_INTERVAL))
    {
        m_backupsInterval = json[JSON_BACKUPS_INTERVAL].toInt();
    }
    if (json.contains(JSON_BACKUPS_MAX))
    {
        m_backupsMax = json[JSON_BACKUPS_MAX].toInt();
    }

    // Colors
    jsonList = json[JSON_COLORS].toArray();
    for (int i = 0; i < jsonList.size(); i++) {
        item = new QStandardItem;
        SystemColor *sys = new SystemColor;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelColors->appendRow(item);
    }

    // Currencies
    jsonList = json["currencies"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemCurrency* sys = new SystemCurrency;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelCurrencies->appendRow(item);
    }

    // Menus
    SuperListItem::readList(m_modelItemsTypes, new SystemTranslatable, json, JSON_ITEMS_TYPES);
    SuperListItem::readList(m_modelInventoryFilters, new SystemInventoryFilter,
        json, JSON_INVENTORY_FILTERS);
    SuperListItem::readList(m_modelMainMenuCommands, new SystemMainMenuCommand,
        json, JSON_MAIN_MENU_COMMANDS);
    SuperListItem::readList(m_modelHeroesStatistics, new SystemSelectStatistic,
        json, JSON_HEROES_STATISTICS);

    // Window skins
    jsonList = json[JSON_WINDOW_SKINS].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemWindowSkin *sys = new SystemWindowSkin;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelWindowSkins->appendRow(item);
    }

    // Camera properties
    jsonList = json[JSON_CAMERA_PROPERTIES].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        SystemCameraProperties *cameraProperties = new SystemCameraProperties;
        cameraProperties->read(jsonList[i].toObject());
        row = cameraProperties->getModelRow();
        m_modelCameraProperties->appendRow(row);
    }

    // Detections
    jsonList = json[JSON_DETECTIONS].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        SystemDetection *detection = new SystemDetection;
        detection->read(jsonList[i].toObject());
        row = detection->getModelRow();
        m_modelDetections->appendRow(row);
    }

    // Speed frequencies
    jsonList = json[JSON_SPEED].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        SystemSpeedFrequency *speedFrequency = new SystemSpeedFrequency;
        speedFrequency->read(jsonList[i].toObject());
        row = speedFrequency->getModelRow();
        m_modelSpeed->appendRow(row);
    }
    jsonList = json[JSON_FREQUENCIES].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        SystemSpeedFrequency *speedFrequency = new SystemSpeedFrequency;
        speedFrequency->read(jsonList[i].toObject());
        row = speedFrequency->getModelRow();
        m_modelFrequencies->appendRow(row);
    }

    // Font size
    jsonList = json[JSON_FONT_SIZES].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        SystemFontSize *fontsize = new SystemFontSize;
        fontsize->read(jsonList[i].toObject());
        row = fontsize->getModelRow();
        m_modelFontSizes->appendRow(row);
    }

    // Font name
    jsonList = json[JSON_FONT_NAMES].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        SystemFontName *fontname = new SystemFontName;
        fontname->read(jsonList[i].toObject());
        row = fontname->getModelRow();
        m_modelFontNames->appendRow(row);
    }
    SuperListItem::readList(m_modelSkyBoxes, new SystemSkyBox, json,
        JSON_SKY_BOXES);
    SuperListItem::readTree(m_modelInitialPartyMembers, new
        SystemInitialPartyMember, json, JSON_INITIAL_PARTY_MEMBERS);

    // Version
    m_lastMajorVersion = json[JSON_LAST_MAJOR_VERSION].toInt();
    m_lastMinorVersion = json[JSON_LAST_MINOR_VERSION].toInt();

    // Sounds
    m_soundCursor->read(json[JSON_SOUND_CURSOR].toObject());
    m_soundConfirmation->read(json[JSON_SOUND_CONFIRMATION].toObject());
    m_soundCancel->read(json[JSON_SOUND_CANCEL].toObject());
    m_soundImpossible->read(json[JSON_SOUND_IMPOSSIBLE].toObject());

    // Dialog box options
    m_dialogBoxOptions->read(json[JSON_DIALOG_BOX_OPTIONS].toObject());

    // Faceset
    if (json.contains(JSON_FACESETS_SIZE))
    {
        m_facesetsSize = json[JSON_FACESETS_SIZE].toInt();
    }
    if (json.contains(JSON_FACESET_SCALING_WIDTH))
    {
        m_facesetScalingWidth = json[JSON_FACESET_SCALING_WIDTH].toInt();
    }
    if (json.contains(JSON_FACESET_SCALING_HEIGHT))
    {
        m_facesetScalingHeight = json[JSON_FACESET_SCALING_HEIGHT].toInt();
    }

    // Icons
    if (json.contains(JSON_ICONS_SIZE))
    {
        m_iconsSize = json[JSON_ICONS_SIZE].toInt();
    }

    // Enter name options
    jsonList = json[JSON_ENTER_NAME_TABLE].toArray();
    QList<QString> listEnterName;
    QJsonArray tab;
    m_enterNameTable.clear();
    for (int i = 0, l = jsonList.size(); i < l; i++)
    {
        listEnterName = QList<QString>();
        tab = jsonList.at(i).toArray();
        for (int j = 0, m = tab.size(); j < m; j++)
        {
            listEnterName.append(tab.at(j).toString());
        }
        m_enterNameTable.append(listEnterName);
    }

    // Save slots
    if (json.contains(JSON_SAVE_SLOTS))
    {
        m_saveSlots = json[JSON_SAVE_SLOTS].toInt();
    }
}

// -------------------------------------------------------

void SystemDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    QJsonObject obj;
    int l;

    // Other options
    m_projectName->write(obj);
    json[JSON_PROJECT_NAME] = obj;
    json[JSON_SCREEN_WIDTH] = m_screenWidth;
    json[JSON_SCREEN_HEIGHT] = m_screenHeight;
    json[JSON_IS_SCREEN_WINDOW] = m_isScreenWindow;
    if (m_isMouseControls != DEFAULT_IS_MOUSE_CONTROLS)
    {
        json[JSON_IS_MOUSE_CONTROLS] = m_isMouseControls;
    }
    if (m_portionsRayEditor != DEFAULT_PORTION_RAY_ENGINE)
    {
        json[JSON_PORTION_RAY_ENGINE] = m_portionsRayEditor;
    }
    if (m_portionsRayIngame != DEFAULT_PORTION_RAY_INGAME)
    {
        json[JSON_PORTION_RAY_INGAME] = m_portionsRayIngame;
    }
    json["ss"] = m_squareSize;
    if (m_mountainCollisionHeight->kind() != PrimitiveValueKind::Number ||
        m_mountainCollisionHeight->numberValue() != 4)
    {
        obj = QJsonObject();
        m_mountainCollisionHeight->write(obj);
        json[JSON_MOUNTAIN_COLLISION_HEIGHT] = obj;
    }
    if (m_mountainCollisionAngle->kind() != PrimitiveValueKind::NumberDouble ||
        m_mountainCollisionAngle->numberDoubleValue() != 45.0)
    {
        obj = QJsonObject();
        m_mountainCollisionAngle->write(obj);
        json[JSON_MOUNTAIN_COLLISION_ANGLE] = obj;
    }
    if (m_climbingSpeed->kind() != PrimitiveValueKind::NumberDouble ||
        m_climbingSpeed->numberDoubleValue() != 0.25)
    {
        obj = QJsonObject();
        m_climbingSpeed->write(obj);
        json[JSON_CLIMBING_SPEED] = obj;
    }
    if (m_moveCameraOnBlockView->kind() != PrimitiveValueKind::Switch ||
        m_moveCameraOnBlockView->switchValue() != DEFAULT_MOVE_CAMERA_ON_BLOCK_VIEW)
    {
        obj = QJsonObject();
        m_moveCameraOnBlockView->write(obj);
        json[JSON_MOVE_CAMERA_ON_BLOCK_VIEW] = obj;
    }
    if (m_mapFrameDuration->kind() != PrimitiveValueKind::Number ||
        m_mapFrameDuration->numberValue() != DEFAULT_MAP_FRAME_DURATION)
    {
        obj = QJsonObject();
        m_mapFrameDuration->write(obj);
        json[JSON_MAP_FRAME_DURATION] = obj;
    }
    if (m_priceSoldItem->kind() != PrimitiveValueKind::NumberDouble ||
        m_priceSoldItem->numberDoubleValue() != DEFAULT_PRICE_SOLD_ITEM) {
        obj = QJsonObject();
        m_priceSoldItem->write(obj);
        json[JSON_PRICE_SOLD_ITEM] = obj;
    }
    json["idMapHero"] = m_idMapHero;
    json["idObjHero"] = m_idObjectHero;
    json["pathBR"] = m_pathBR;
    json["frames"] = m_framesAnimation;
    if (m_battlersFrames != DEFAULT_BATTLERS_FRAMES)
    {
        json[JSON_BATTLERS_FRAMES] = m_battlersFrames;
    }
    if (m_battlersFrameDuration != DEFAULT_BATTLERS_FRAME_DURATION)
    {
        json[JSON_BATTLERS_FRAME_DURATION] = m_battlersFrameDuration;
    }
    if (m_battlersFrameAttackingDuration != DEFAULT_BATTLERS_FRAME_ATTACKING_DURATION)
    {
        json[JSON_BATTLERS_FRAME_ATTACKING_DURATION] = m_battlersFrameAttackingDuration;
    }
    if (m_battlersColumns != DEFAULT_BATTLERS_COLUMNS)
    {
        json[JSON_BATTLERS_COLUMNS] = m_battlersColumns;
    }
    if (m_autotilesFrames != DEFAULT_AUTOTILES_FRAMES)
    {
        json[JSON_AUTOTILES_FRAMES] = m_autotilesFrames;
    }
    if (m_autotilesFrameDuration != DEFAULT_AUTOTILES_FRAME_DURATION)
    {
        json[JSON_AUTOTILES_FRAME_DURATION] = m_autotilesFrameDuration;
    }
    if (m_showBB)
        json["bb"] = m_showBB;
    if (m_showFPS)
        json["fps"] = m_showFPS;
    if (m_antialiasing != DEFAULT_ANTIALIASING)
    {
        json[JSON_ANTIALIASING] = m_antialiasing;
    }
    if (m_backupsActivated != DEFAULT_BACKUPS_ACTIVATED)
    {
        json[JSON_BACKUPS_ACTIVATED] = m_backupsActivated;
    }
    if (m_backupsInterval != 30)
    {
        json[JSON_BACKUPS_INTERVAL] = m_backupsInterval;
    }
    if (m_backupsMax != 10)
    {
        json[JSON_BACKUPS_MAX] = m_backupsMax;
    }

    // Colors
    jsonArray = QJsonArray();
    l = m_modelColors->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemColor *sys = reinterpret_cast<SystemColor *>(m_modelColors
            ->item(i)->data().value<quintptr>());
        sys->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_COLORS] = jsonArray;

    // Currencies
    jsonArray = QJsonArray();
    l = m_modelCurrencies->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemCurrency* sys = ((SystemCurrency*)m_modelCurrencies->item(i)
                               ->data().value<quintptr>());
        sys->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["currencies"] = jsonArray;

    // Menus
    SuperListItem::writeList(m_modelItemsTypes, json, JSON_ITEMS_TYPES);
    SuperListItem::writeList(m_modelInventoryFilters, json, JSON_INVENTORY_FILTERS);
    SuperListItem::writeList(m_modelMainMenuCommands, json, JSON_MAIN_MENU_COMMANDS);
    SuperListItem::writeList(m_modelHeroesStatistics, json, JSON_HEROES_STATISTICS);

    // Window skins
    jsonArray = QJsonArray();
    l = m_modelWindowSkins->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemWindowSkin *sys = reinterpret_cast<SystemWindowSkin *>(
            m_modelWindowSkins->item(i)->data().value<quintptr>());
        sys->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_WINDOW_SKINS] = jsonArray;

    // Camera properties
    jsonArray = QJsonArray();
    l = m_modelCameraProperties->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemCameraProperties *cameraProperties = reinterpret_cast<
            SystemCameraProperties *>(m_modelCameraProperties->item(i)->data()
            .value<quintptr>());
        cameraProperties->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_CAMERA_PROPERTIES] = jsonArray;

    // Detections
    jsonArray = QJsonArray();
    l = m_modelDetections->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemDetection *detection = reinterpret_cast<SystemDetection *>(
            m_modelDetections->item(i)->data().value<quintptr>());
        detection->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_DETECTIONS] = jsonArray;

    // Speed frequencies
    jsonArray = QJsonArray();
    l = m_modelSpeed->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemSpeedFrequency *speedFrequency = reinterpret_cast<
            SystemSpeedFrequency *>(m_modelSpeed->item(i)->data()
            .value<quintptr>());
        speedFrequency->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_SPEED] = jsonArray;
    jsonArray = QJsonArray();
    l = m_modelFrequencies->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemSpeedFrequency *speedFrequency = reinterpret_cast<
            SystemSpeedFrequency *>(m_modelFrequencies->item(i)->data()
            .value<quintptr>());
        speedFrequency->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_FREQUENCIES] = jsonArray;

    // Font size
    jsonArray = QJsonArray();
    l = m_modelFontSizes->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemFontSize *fontsize = reinterpret_cast<SystemFontSize *>(
            m_modelFontSizes->item(i)->data().value<quintptr>());
        fontsize->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_FONT_SIZES] = jsonArray;

    // Font name
    jsonArray = QJsonArray();
    l = m_modelFontNames->invisibleRootItem()->rowCount();
    QString css, currenCSS;
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemFontName *fontname = reinterpret_cast<SystemFontName *>(
            m_modelFontNames->item(i)->data().value<quintptr>());
        currenCSS = fontname->getCSS();
        if (!currenCSS.isEmpty())
        {
            css += currenCSS;
        }
        fontname->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_FONT_NAMES] = jsonArray;
    QFile fileFont(Common::pathCombine(RPM::get()->project()
        ->pathCurrentProjectApp(), RPM::PATH_STYLE_FONT));
    fileFont.open(QIODevice::WriteOnly);
    fileFont.write(css.toUtf8());
    fileFont.close();

    SuperListItem::writeList(m_modelSkyBoxes, json, JSON_SKY_BOXES);
    SuperListItem::writeTree(m_modelInitialPartyMembers, json, JSON_INITIAL_PARTY_MEMBERS);

    // Version
    json[JSON_LAST_MAJOR_VERSION] = m_lastMajorVersion;
    json[JSON_LAST_MINOR_VERSION] = m_lastMinorVersion;

    // Sound
    obj = QJsonObject();
    m_soundCursor->write(obj);
    json[JSON_SOUND_CURSOR] = obj;
    obj = QJsonObject();
    m_soundConfirmation->write(obj);
    json[JSON_SOUND_CONFIRMATION] = obj;
    obj = QJsonObject();
    m_soundCancel->write(obj);
    json[JSON_SOUND_CANCEL] = obj;
    m_soundImpossible->write(obj);
    json[JSON_SOUND_IMPOSSIBLE] = obj;

    // Dialog box options
    obj = m_dialogBoxOptions->getJSON();
    json[JSON_DIALOG_BOX_OPTIONS] = obj;

    // Faceset
    if (m_facesetsSize != DEFAULT_FACESETS_SIZE)
    {
        json[JSON_FACESETS_SIZE] = m_facesetsSize;
    }
    if (m_facesetScalingWidth != DEFAULT_FACESET_SCALING_WIDTH)
    {
        json[JSON_FACESET_SCALING_WIDTH] = m_facesetScalingWidth;
    }
    if (m_facesetScalingHeight != DEFAULT_FACESET_SCALING_HEIGHT)
    {
        json[JSON_FACESET_SCALING_HEIGHT] = m_facesetScalingHeight;
    }

    // Icons
    if (m_iconsSize != DEFAULT_ICONS_SIZE)
    {
        json[JSON_ICONS_SIZE] = m_iconsSize;
    }

    // Enter name options
    jsonArray = QJsonArray();
    QList<QString> listEnterName;
    QJsonArray tab;
    for (int i = 0, l = m_enterNameTable.size(); i < l; i++)
    {
        listEnterName = m_enterNameTable.at(i);
        tab = QJsonArray();
        for (int j = 0, m = listEnterName.size(); j < m; j++)
        {
            tab.append(listEnterName.at(j));
        }
        jsonArray.append(tab);
    }
    json[JSON_ENTER_NAME_TABLE] = jsonArray;

    // Save slots
    if (m_saveSlots != DEFAULT_SAVE_SLOTS)
    {
        json[JSON_SAVE_SLOTS] = m_saveSlots;
    }
}
