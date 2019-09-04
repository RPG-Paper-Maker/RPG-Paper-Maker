/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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

const QString SystemDatas::JSON_PROJECT_NAME = "pn";
const QString SystemDatas::JSON_SCREEN_WIDTH = "sw";
const QString SystemDatas::JSON_SCREEN_HEIGHT = "sh";
const QString SystemDatas::JSON_IS_SCREEN_WINDOW = "isw";
const QString SystemDatas::JSON_COLORS = "colors";
const QString SystemDatas::JSON_WINDOW_SKINS = "wskins";
const QString SystemDatas::JSON_CAMERA_PROPERTIES = "cp";
const QString SystemDatas::JSON_DETECTIONS = "d";
const QString SystemDatas::JSON_LAST_MAJOR_VERSION = "lmva";
const QString SystemDatas::JSON_LAST_MINOR_VERSION = "lmiv";
const QString SystemDatas::JSON_MOUNTAIN_COLLISION_HEIGHT = "mch";
const QString SystemDatas::JSON_MOUNTAIN_COLLISION_ANGLE = "mca";
const QString SystemDatas::JSON_SPEED_FREQUENCIES = "sf";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemDatas::SystemDatas() :
    m_projectName(new LangsTranslation("Project without name")),
    m_mountainCollisionHeight(new PrimitiveValue(4)),
    m_mountainCollisionAngle(new PrimitiveValue(45.0)),
    m_idMapHero(1),
    m_idObjectHero(1),
    m_showBB(false),
    m_idWindowSkin(1),
    m_modelColors(new QStandardItemModel),
    m_modelCurrencies(new QStandardItemModel),
    m_modelItemsTypes(new QStandardItemModel),
    m_modelWindowSkins(new QStandardItemModel),
    m_modelCameraProperties(new QStandardItemModel),
    m_modelDetections(new QStandardItemModel),
    m_modelSpeedFrequencies(new QStandardItemModel),
    m_lastMajorVersion(1),
    m_lastMinorVersion(0)
{

}

SystemDatas::~SystemDatas() {
    delete m_projectName;
    delete m_mountainCollisionHeight;
    delete m_mountainCollisionAngle;

    SuperListItem::deleteModel(m_modelColors);
    SuperListItem::deleteModel(m_modelCurrencies);
    SuperListItem::deleteModel(m_modelItemsTypes);
    SuperListItem::deleteModel(m_modelWindowSkins);
    SuperListItem::deleteModel(m_modelCameraProperties);
    SuperListItem::deleteModel(m_modelDetections);
    SuperListItem::deleteModel(m_modelSpeedFrequencies);
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

bool SystemDatas::showBB() const { return m_showBB; }

void SystemDatas::setShowBB(bool b) { m_showBB = b; }

int SystemDatas::idWindowSkin() const {
    return m_idWindowSkin;
}

void SystemDatas::setIdWindowSkin(int i) {
    m_idWindowSkin = i;
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

QStandardItemModel * SystemDatas::modelSpeedFrequencies() const {
    return m_modelSpeedFrequencies;
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
    m_idWindowSkin = 1;
    m_pathBR = Common::pathCombine(QDir::currentPath(), RPM::PATH_BR);

    this->setDefaultColors();
    this->setDefaultCurrencies();
    this->setDefaultItemsTypes();
    this->setDefaultWindowSkins();
    this->setDefaultCameraProperties();
    this->setDefaultDetections();
    this->setDefaultSpeedFrequencies();

    m_lastMajorVersion = 1;
    m_lastMinorVersion = 0;
}

// -------------------------------------------------------

void SystemDatas::setDefaultColors() {
    QStandardItem *item;
    SystemColor *color;
    QString namesColors[] = {"Black", "White", "BlueSky"};
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
    QString namesCurrencies[] = {"G", "XCoin"};
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
    QString namesItemsKind[] = {"ingredient", "key items"};
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
    SystemWindowSkin *sys = new SystemWindowSkin(1, "Default", 1, QRectF(0, 0, 8,
        8), QRectF(8, 0, 8, 8), QRectF(0, 8, 8, 8), QRectF(8, 8, 8, 8), QRectF(
        16, 8, 8, 2), QRectF(16, 10, 8, 2), QRectF(16, 0, 2, 8), QRectF(18, 0,
        2, 8), QRectF(0, 18, 72, 36), QRectF(0, 54, 72, 36), false, QRectF(88,
        0, 80, 16), QRectF(24, 0, 64, 18), QRectF(168, 0, 16, 22), QRectF(72, 22
        , 120, 18), QRectF(72, 40, 120, 18), QRectF(72, 58, 120, 18), QRectF(72,
        76, 38, 14));
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(sys->toString());
    m_modelWindowSkins->appendRow(item);
}

// -------------------------------------------------------

void SystemDatas::setDefaultCameraProperties() {
    QList<QStandardItem *> row;
    SystemCameraProperties *cameraProperties;

    cameraProperties = new SystemCameraProperties(1, "Outside");
    row = cameraProperties->getModelRow();
    m_modelCameraProperties->appendRow(row);
    cameraProperties = new SystemCameraProperties(2, "Battle", new
        PrimitiveValue(360.0), new PrimitiveValue(SystemCameraProperties
        ::DEFAULT_HORIZONTAL_ANGLE), new PrimitiveValue(60.0));
    row = cameraProperties->getModelRow();
    m_modelCameraProperties->appendRow(row);
}

// -------------------------------------------------------

void SystemDatas::setDefaultDetections() {
    QList<QStandardItem *> row;
    SystemDetection *detection;

    detection = new SystemDetection(1, "Front", 0, 0, 0, 1);
    detection->setDefault();
    row = detection->getModelRow();
    m_modelDetections->appendRow(row);
    detection = new SystemDetection(2, "Self", 0, 0, 0, 0);
    detection->setSelf();
    row = detection->getModelRow();
    m_modelDetections->appendRow(row);
}

// -------------------------------------------------------

void SystemDatas::setDefaultSpeedFrequencies() {
    QList<QStandardItem *> row;
    SystemSpeedFrequency *speedFrequency;

    speedFrequency = new SystemSpeedFrequency(1, "Normal", new PrimitiveValue(
        1.0));
    row = speedFrequency->getModelRow();
    m_modelSpeedFrequencies->appendRow(row);
    speedFrequency = new SystemSpeedFrequency(2, "Low", new PrimitiveValue(0.75));
    row = speedFrequency->getModelRow();
    m_modelSpeedFrequencies->appendRow(row);
    speedFrequency = new SystemSpeedFrequency(3, "Very low", new PrimitiveValue(
        0.5));
    row = speedFrequency->getModelRow();
    m_modelSpeedFrequencies->appendRow(row);
    speedFrequency = new SystemSpeedFrequency(4, "Fast", new PrimitiveValue(1.5));
    row = speedFrequency->getModelRow();
    m_modelSpeedFrequencies->appendRow(row);
    speedFrequency = new SystemSpeedFrequency(5, "Very fast", new PrimitiveValue
        (2.0));
    row = speedFrequency->getModelRow();
    m_modelSpeedFrequencies->appendRow(row);
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
    SuperListItem::deleteModel(m_modelSpeedFrequencies, false);

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
    m_idMapHero = json["idMapHero"].toInt();
    m_idObjectHero = json["idObjHero"].toInt();
    m_pathBR = json["pathBR"].toString();
    m_framesAnimation = json["frames"].toInt();
    m_showBB = json.contains("bb");
    m_idWindowSkin = json["wskin"].toInt();

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
    jsonList = json[JSON_SPEED_FREQUENCIES].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        SystemSpeedFrequency *speedFrequency = new SystemSpeedFrequency;
        speedFrequency->read(jsonList[i].toObject());
        row = speedFrequency->getModelRow();
        m_modelSpeedFrequencies->appendRow(row);
    }

    // Version
    m_lastMajorVersion = json[JSON_LAST_MAJOR_VERSION].toInt();
    m_lastMinorVersion = json[JSON_LAST_MINOR_VERSION].toInt();
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
    if (m_mountainCollisionHeight->numberValue() != 4) {
        obj = QJsonObject();
        m_mountainCollisionHeight->write(obj);
        json[JSON_MOUNTAIN_COLLISION_HEIGHT] = obj;
    }
    if (m_mountainCollisionAngle->numberDoubleValue() != 45.0) {
        obj = QJsonObject();
        m_mountainCollisionAngle->write(obj);
        json[JSON_MOUNTAIN_COLLISION_ANGLE] = obj;
    }
    json["idMapHero"] = m_idMapHero;
    json["idObjHero"] = m_idObjectHero;
    json["pathBR"] = m_pathBR;
    json["frames"] = m_framesAnimation;
    if (m_showBB)
        json["bb"] = m_showBB;
    json["wskin"] = m_idWindowSkin;

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
    l = m_modelSpeedFrequencies->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++) {
        QJsonObject jsonCommon;
        SystemSpeedFrequency *speedFrequency = reinterpret_cast<
            SystemSpeedFrequency *>(m_modelSpeedFrequencies->item(i)->data()
            .value<quintptr>());
        speedFrequency->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[JSON_SPEED_FREQUENCIES] = jsonArray;

    // Version
    json[JSON_LAST_MAJOR_VERSION] = m_lastMajorVersion;
    json[JSON_LAST_MINOR_VERSION] = m_lastMinorVersion;
}
