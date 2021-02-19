/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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

const QString SystemDatas::JSON_PROJECT_NAME = "pn";
const QString SystemDatas::JSON_SCREEN_WIDTH = "sw";
const QString SystemDatas::JSON_SCREEN_HEIGHT = "sh";
const QString SystemDatas::JSON_IS_SCREEN_WINDOW = "isw";
const QString SystemDatas::JSON_COLORS = "colors";
const QString SystemDatas::JSON_WINDOW_SKINS = "wskins";
const QString SystemDatas::JSON_CAMERA_PROPERTIES = "cp";
const QString SystemDatas::JSON_DETECTIONS = "d";
const QString SystemDatas::JSON_FONT_SIZES = "fs";
const QString SystemDatas::JSON_FONT_NAMES = "fn";
const QString SystemDatas::JSON_LAST_MAJOR_VERSION = "lmva";
const QString SystemDatas::JSON_LAST_MINOR_VERSION = "lmiv";
const QString SystemDatas::JSON_MOUNTAIN_COLLISION_HEIGHT = "mch";
const QString SystemDatas::JSON_MOUNTAIN_COLLISION_ANGLE = "mca";
const QString SystemDatas::JSON_SPEED = "sf";
const QString SystemDatas::JSON_FREQUENCIES = "f";
const QString SystemDatas::JSON_SOUND_CURSOR = "scu";
const QString SystemDatas::JSON_SOUND_CONFIRMATION = "sco";
const QString SystemDatas::JSON_SOUND_CANCEL = "sca";
const QString SystemDatas::JSON_SOUND_IMPOSSIBLE = "si";
const QString SystemDatas::JSON_DIALOG_BOX_OPTIONS = "dbo";
const QString SystemDatas::JSON_SKY_BOXES = "sb";
const QString SystemDatas::JSON_ANTIALIASING = "aa";
const QString SystemDatas::JSON_MAP_FRAME_DURATION = "mfd";
const QString SystemDatas::JSON_BATTLERS_FRAMES = "battlersFrames";
const QString SystemDatas::JSON_BATTLERS_COLUMNS = "battlersColumns";
const QString SystemDatas::JSON_PRICE_SOLD_ITEM = "priceSoldItem";
const QString SystemDatas::JSON_ENTER_NAME_TABLE = "enterNameTable";
const bool SystemDatas::DEFAULT_ANTIALIASING = false;
const int SystemDatas::DEFAULT_MAP_FRAME_DURATION = 150;
const int SystemDatas::DEFAULT_BATTLERS_FRAMES = 4;
const int SystemDatas::DEFAULT_BATTLERS_COLUMNS = 9;
const double SystemDatas::DEFAULT_PRICE_SOLD_ITEM = 50.0;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemDatas::SystemDatas() :
    m_projectName(new LangsTranslation(RPM::translate(Translations
        ::PROJECT_WITHOUT_NAME))),
    m_mountainCollisionHeight(new PrimitiveValue(4)),
    m_mountainCollisionAngle(new PrimitiveValue(45.0)),
    m_mapFrameDuration(new PrimitiveValue(DEFAULT_MAP_FRAME_DURATION)),
    m_priceSoldItem(new PrimitiveValue(DEFAULT_PRICE_SOLD_ITEM)),
    m_idMapHero(1),
    m_idObjectHero(1),
    m_battlersFrames(DEFAULT_BATTLERS_FRAMES),
    m_battlersColumns(DEFAULT_BATTLERS_COLUMNS),
    m_showBB(false),
    m_antialiasing(false),
    m_modelColors(new QStandardItemModel),
    m_modelCurrencies(new QStandardItemModel),
    m_modelItemsTypes(new QStandardItemModel),
    m_modelWindowSkins(new QStandardItemModel),
    m_modelCameraProperties(new QStandardItemModel),
    m_modelDetections(new QStandardItemModel),
    m_modelSpeed(new QStandardItemModel),
    m_modelFrequencies(new QStandardItemModel),
    m_modelFontSizes(new QStandardItemModel),
    m_modelFontNames(new QStandardItemModel),
    m_modelSkyBoxes(new QStandardItemModel),
    m_lastMajorVersion(1),
    m_lastMinorVersion(0),
    m_soundCursor(new SystemPlaySong(-1, SongKind::Sound)),
    m_soundConfirmation(new SystemPlaySong(-1, SongKind::Sound)),
    m_soundCancel(new SystemPlaySong(-1, SongKind::Sound)),
    m_soundImpossible(new SystemPlaySong(-1, SongKind::Sound)),
    m_dialogBoxOptions(new EventCommand(EventCommandKind::SetDialogBoxOptions))
{

}

SystemDatas::~SystemDatas() {
    delete m_projectName;
    delete m_mountainCollisionHeight;
    delete m_mountainCollisionAngle;
    delete m_mapFrameDuration;
    delete m_priceSoldItem;

    SuperListItem::deleteModel(m_modelColors);
    SuperListItem::deleteModel(m_modelCurrencies);
    SuperListItem::deleteModel(m_modelItemsTypes);
    SuperListItem::deleteModel(m_modelWindowSkins);
    SuperListItem::deleteModel(m_modelCameraProperties);
    SuperListItem::deleteModel(m_modelDetections);
    SuperListItem::deleteModel(m_modelSpeed);
    SuperListItem::deleteModel(m_modelFrequencies);
    SuperListItem::deleteModel(m_modelFontSizes);
    SuperListItem::deleteModel(m_modelFontNames);
    SuperListItem::deleteModel(m_modelSkyBoxes);

    delete m_soundCursor;
    delete m_soundConfirmation;
    delete m_soundCancel;
    delete m_soundImpossible;
    delete m_dialogBoxOptions;
}

void SystemDatas::read(QString path) {
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SYSTEM), *this);
}

LangsTranslation * SystemDatas::projectName() const {
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

int SystemDatas::portionsRay() const { return m_portionsRay; }

void SystemDatas::setPortionRay(int p) { m_portionsRay = p; }

int SystemDatas::squareSize() const { return m_squareSize; }

void SystemDatas::setSquareSize(int i) { m_squareSize = i; }

PrimitiveValue * SystemDatas::mountainCollisionHeight() const {
    return m_mountainCollisionHeight;
}

PrimitiveValue * SystemDatas::mountainCollisionAngle() const {
    return m_mountainCollisionAngle;
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

int SystemDatas::battlersColumns() const
{
    return m_battlersColumns;
}

void SystemDatas::setBattlersColumns(int battlersColumns)
{
    m_battlersColumns = battlersColumns;
}

bool SystemDatas::showBB() const { return m_showBB; }

void SystemDatas::setShowBB(bool b) { m_showBB = b; }

bool SystemDatas::antialiasing() const
{
    return m_antialiasing;
}

void SystemDatas::setAntialiasing(bool aa)
{
    m_antialiasing = aa;
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

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemDatas::setDefault() {
    m_screenWidth = 640;
    m_screenHeight = 480;
    m_isScreenWindow = true;
    m_portionsRay = 6;
    m_squareSize = 16;
    m_framesAnimation = 4;
    m_pathBR = Common::pathCombine(QDir::currentPath(), RPM::PATH_BR);

    this->setDefaultColors();
    this->setDefaultCurrencies();
    this->setDefaultItemsTypes();
    this->setDefaultWindowSkins();
    this->setDefaultCameraProperties();
    this->setDefaultDetections();
    this->setDefaultSpeed();
    this->setDefaultFrequencies();
    this->setDefaultFontSizes();
    this->setDefaultFontNames();
    this->setDefaultSounds();
    this->setDefaultDialogBoxOptions();
    this->setdefaultEnterNameOptions();
    this->setDefaultSkyBoxes();

    m_lastMajorVersion = 1;
    m_lastMinorVersion = 0;
}

// -------------------------------------------------------

void SystemDatas::setDefaultColors() {
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
    int picCurrencies[] = {1, 2};
    int length = (sizeof(namesCurrencies)/sizeof(*namesCurrencies));
    for (int i = 0; i < length; i++){
        item = new QStandardItem;
        currency = new SystemCurrency(i + 1, new LangsTranslation(
            namesCurrencies[i]), picCurrencies[i]);
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(currency)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(currency->toString());
        m_modelCurrencies->appendRow(item);
    }
}

// -------------------------------------------------------

void SystemDatas::setDefaultItemsTypes() {
    QStandardItem *item;
    SuperListItem *sys;
    QString namesItemsKind[] = {
        RPM::translate(Translations::INGREDIENT),
        RPM::translate(Translations::KEY_ITEMS)
    };
    int length = (sizeof(namesItemsKind)/sizeof(*namesItemsKind));
    for (int i = 0; i < length; i++){
        item = new QStandardItem;
        sys = new SuperListItem(i+1, namesItemsKind[i]);
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelItemsTypes->appendRow(item);
    }
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

void SystemDatas::setDefaultCameraProperties() {
    QList<QStandardItem *> row;
    SystemCameraProperties *cameraProperties;

    cameraProperties = new SystemCameraProperties(1, RPM::translate(Translations
        ::OUTSIDE));
    row = cameraProperties->getModelRow();
    m_modelCameraProperties->appendRow(row);
    cameraProperties = new SystemCameraProperties(2, RPM::translate(Translations
        ::BATTLE), new PrimitiveValue(360.0), new PrimitiveValue(
        SystemCameraProperties::DEFAULT_HORIZONTAL_ANGLE), new PrimitiveValue(
        60.0));
    row = cameraProperties->getModelRow();
    m_modelCameraProperties->appendRow(row);
}

// -------------------------------------------------------

void SystemDatas::setDefaultDetections() {
    QList<QStandardItem *> row;
    SystemDetection *detection;

    detection = new SystemDetection(1, RPM::translate(Translations::FRONT), 0, 0
        , 0, 1);
    detection->setDefault();
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

void SystemDatas::setDefaultFontNames() {
    QList<QStandardItem *> row;
    SystemFontName *fontName;

    fontName = new SystemFontName(1, "sans-serif", new PrimitiveValue(
        PrimitiveValueKind::Message, "sans-serif"));
    row = fontName->getModelRow();
    m_modelFontNames->appendRow(row);
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
    SuperListItem::deleteModel(m_modelWindowSkins, false);
    SuperListItem::deleteModel(m_modelCameraProperties, false);
    SuperListItem::deleteModel(m_modelDetections, false);
    SuperListItem::deleteModel(m_modelSpeed, false);
    SuperListItem::deleteModel(m_modelFrequencies, false);
    SuperListItem::deleteModel(m_modelFontSizes, false);
    SuperListItem::deleteModel(m_modelFontNames, false);
    SuperListItem::deleteModel(m_modelSkyBoxes, false);

    // Other options
    m_projectName->read(json[JSON_PROJECT_NAME].toObject());
    m_screenWidth = json[JSON_SCREEN_WIDTH].toInt();
    m_screenHeight = json[JSON_SCREEN_HEIGHT].toInt();
    m_isScreenWindow = json[JSON_IS_SCREEN_WINDOW].toBool();
    m_portionsRay = json["pr"].toInt();
    m_squareSize = json["ss"].toInt();
    if (json.contains(JSON_MOUNTAIN_COLLISION_HEIGHT)) {
        m_mountainCollisionHeight->read(json[JSON_MOUNTAIN_COLLISION_HEIGHT]
            .toObject());
    }
    if (json.contains(JSON_MOUNTAIN_COLLISION_ANGLE)) {
        m_mountainCollisionAngle->read(json[JSON_MOUNTAIN_COLLISION_ANGLE]
            .toObject());
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
    if (json.contains(JSON_BATTLERS_COLUMNS))
    {
        m_battlersColumns = json[JSON_BATTLERS_COLUMNS].toInt();
    }
    m_showBB = json.contains("bb");
    if (json.contains(JSON_ANTIALIASING))
    {
        m_antialiasing = json[JSON_ANTIALIASING].toBool();
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

    // Items kind
    jsonList = json["itemsTypes"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SuperListItem* sys = new SuperListItem;
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_modelItemsTypes->appendRow(item);
    }

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
    json["pr"] = m_portionsRay;
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
    if (m_battlersColumns != DEFAULT_BATTLERS_COLUMNS)
    {
        json[JSON_BATTLERS_COLUMNS] = m_battlersColumns;
    }
    if (m_showBB)
        json["bb"] = m_showBB;
    if (m_antialiasing != DEFAULT_ANTIALIASING)
    {
        json[JSON_ANTIALIASING] = m_antialiasing;
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

    // Items kind
    jsonArray = QJsonArray();
    l = m_modelItemsTypes->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SuperListItem* sys = ((SuperListItem*)m_modelItemsTypes->item(i)
                              ->data().value<quintptr>());
        sys->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["itemsTypes"] = jsonArray;

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
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemFontName *fontname = reinterpret_cast<SystemFontName *>(
            m_modelFontNames->item(i)->data().value<quintptr>());
        fontname->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_FONT_NAMES] = jsonArray;
    SuperListItem::writeList(m_modelSkyBoxes, json, JSON_SKY_BOXES);

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
}
