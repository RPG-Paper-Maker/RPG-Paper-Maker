/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "battlesystemdatas.h"
#include "systemtranslatable.h"
#include "systemweaponarmorkind.h"
#include "systemelement.h"
#include "systemstatistic.h"
#include "systembattlecommand.h"
#include "systembattlemap.h"
#include "rpm.h"
#include "common.h"

const QString BattleSystemDatas::JSON_FORMULA_IS_DEAD = "fisdead";
const QString BattleSystemDatas::JSON_FORMULA_CRIT = "fc";
const QString BattleSystemDatas::JSON_BATLLE_MUSIC = "bmusic";
const QString BattleSystemDatas::JSON_BATLLE_LEVELUP = "blevelup";
const QString BattleSystemDatas::JSON_BATLLE_VICTORY = "bvictory";
const QString BattleSystemDatas::jsonWeaponsKind = "weaponsKind";
const QString BattleSystemDatas::jsonArmorsKind = "armorsKind";
const QString BattleSystemDatas::jsonBattleMaps = "battleMaps";
const QString BattleSystemDatas::jsonElements = "elements";
const QString BattleSystemDatas::jsonCommonEquipment = "equipments";
const QString BattleSystemDatas::jsonCommonStatistics = "statistics";
const QString BattleSystemDatas::jsonCommonBattleCommand = "battleCommands";
const QString BattleSystemDatas::JSON_HEROES_BATTLERS_CENTER_OFFSET = "heroesBattlersCenterOffset";
const QString BattleSystemDatas::JSON_HEROES_BATTLERS_OFFSET = "heroesBattlersOffset";
const QString BattleSystemDatas::JSON_TROOPS_BATTLERS_CENTER_OFFSET = "troopsBattlersCenterOffset";
const QString BattleSystemDatas::JSON_TROOPS_BATTLERS_OFFSET = "troopsBattlersOffset";
const QString BattleSystemDatas::DEFAULT_HEROES_BATTLERS_CENTER_OFFSET = "new Core.Vector3(2 * Datas.Systems.SQUARE_SIZE, 0, -Datas.Systems.SQUARE_SIZE)";
const QString BattleSystemDatas::DEFAULT_HEROES_BATTLERS_OFFSET = "new Core.Vector3(i * Datas.Systems.SQUARE_SIZE / 2, 0, i * Datas.Systems.SQUARE_SIZE)";
const QString BattleSystemDatas::DEFAULT_TROOPS_BATTLERS_CENTER_OFFSET = "new Core.Vector3(-2 * Datas.Systems.SQUARE_SIZE, 0, -Datas.Systems.SQUARE_SIZE)";
const QString BattleSystemDatas::DEFAULT_TROOPS_BATTLERS_OFFSET = "new Core.Vector3(-i * Datas.Systems.SQUARE_SIZE * 3 / 4, 0, i * Datas.Systems.SQUARE_SIZE)";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

BattleSystemDatas::BattleSystemDatas() :
    m_formulaIsDead(new PrimitiveValue(QString())),
    m_formulaCrit(new PrimitiveValue(QString())),
    m_heroesBattlersCenterOffset(new PrimitiveValue(DEFAULT_HEROES_BATTLERS_CENTER_OFFSET)),
    m_heroesBattlersOffset(new PrimitiveValue(DEFAULT_HEROES_BATTLERS_OFFSET)),
    m_troopsBattlersCenterOffset(new PrimitiveValue(DEFAULT_TROOPS_BATTLERS_CENTER_OFFSET)),
    m_troopsBattlersOffset(new PrimitiveValue(DEFAULT_TROOPS_BATTLERS_OFFSET)),
    m_music(new SystemPlaySong(-1, SongKind::Music)),
    m_levelup(new SystemPlaySong(-1, SongKind::Sound)),
    m_victory(new SystemPlaySong(-1, SongKind::Music))
{
    m_modelCommonEquipment = new QStandardItemModel;
    m_modelWeaponsKind = new QStandardItemModel;
    m_modelArmorsKind = new QStandardItemModel;
    m_modelBattleMaps = new QStandardItemModel;
    m_modelElements = new QStandardItemModel;
    m_modelCommonStatistics = new QStandardItemModel;
    m_modelCommonBattleCommand = new QStandardItemModel;
}

BattleSystemDatas::~BattleSystemDatas()
{
    delete m_formulaIsDead;
    delete m_formulaCrit;
    delete m_heroesBattlersCenterOffset;
    delete m_heroesBattlersOffset;
    delete m_troopsBattlersCenterOffset;
    delete m_troopsBattlersOffset;
    if (m_music != nullptr) {
        delete m_music;
    }
    if (m_levelup != nullptr) {
        delete m_levelup;
    }
    if (m_victory != nullptr) {
        delete m_victory;
    }
    SuperListItem::deleteModel(m_modelCommonEquipment);
    SuperListItem::deleteModel(m_modelWeaponsKind);
    SuperListItem::deleteModel(m_modelArmorsKind);
    SuperListItem::deleteModel(m_modelBattleMaps);
    SuperListItem::deleteModel(m_modelElements);
    SuperListItem::deleteModel(m_modelCommonStatistics);
    SuperListItem::deleteModel(m_modelCommonBattleCommand);
}

void BattleSystemDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_BATTLE_SYSTEM), *this);
}

int BattleSystemDatas::idStatisticLevel() const { return m_idStatisticLevel; }

int BattleSystemDatas::idStatisticExp() const { return m_idStatisticExp; }

void BattleSystemDatas::setIdStatisticLevel(int i) { m_idStatisticLevel = i; }

void BattleSystemDatas::setIdStatisticExp(int i) { m_idStatisticExp = i; }

PrimitiveValue * BattleSystemDatas::formulaIsDead() const {
    return m_formulaIsDead;
}

PrimitiveValue * BattleSystemDatas::formulaCrit() const {
    return m_formulaCrit;
}

PrimitiveValue * BattleSystemDatas::heroesBattlersCenterOffset() const
{
    return m_heroesBattlersCenterOffset;
}

PrimitiveValue * BattleSystemDatas::heroesBattlersOffset() const
{
    return m_heroesBattlersOffset;
}

PrimitiveValue * BattleSystemDatas::troopsBattlersCenterOffset() const
{
    return m_troopsBattlersCenterOffset;
}

PrimitiveValue * BattleSystemDatas::troopsBattlersOffset() const
{
    return m_troopsBattlersOffset;
}

SystemPlaySong * BattleSystemDatas::music() const {
    return m_music;
}

void BattleSystemDatas::setMusic(SystemPlaySong *song) {
    m_music = song;
}

SystemPlaySong * BattleSystemDatas::levelup() const {
    return m_levelup;
}

void BattleSystemDatas::setLevelup(SystemPlaySong *song) {
    m_levelup = song;
}

SystemPlaySong * BattleSystemDatas::victory() const {
    return m_victory;
}

void BattleSystemDatas::setVictory(SystemPlaySong *song) {
    m_victory = song;
}

QStandardItemModel* BattleSystemDatas::modelWeaponsKind() const {
    return m_modelWeaponsKind;
}

QStandardItemModel* BattleSystemDatas::modelArmorsKind() const {
    return m_modelArmorsKind;
}

QStandardItemModel* BattleSystemDatas::modelBattleMaps() const {
    return m_modelBattleMaps;
}

QStandardItemModel* BattleSystemDatas::modelElements() const {
    return m_modelElements;
}

QStandardItemModel* BattleSystemDatas:: modelCommonEquipment() const {
    return m_modelCommonEquipment;
}

QStandardItemModel* BattleSystemDatas::modelCommonStatistics() const {
    return m_modelCommonStatistics;
}

QStandardItemModel* BattleSystemDatas::modelCommonBattleCommand() const {
    return m_modelCommonBattleCommand;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void BattleSystemDatas::getSortedStatistics(QVector<SystemStatistic*> &fixes,
                                            QVector<SystemStatistic*> &bars)
const
{
    int l = m_modelCommonStatistics->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        SystemStatistic* statistic =
                (SystemStatistic*) m_modelCommonStatistics->item(i)->data()
                .value<quintptr>();
        if (statistic->isFix())
            fixes.append(statistic);
        else
            bars.append(statistic);
    }
}

// -------------------------------------------------------

void BattleSystemDatas::updateEquipments(){
    updateEquipmentsKind(m_modelWeaponsKind);
    updateEquipmentsKind(m_modelArmorsKind);
}

// -------------------------------------------------------

void BattleSystemDatas::updateEquipmentsKind(QStandardItemModel* model){
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++){
        SystemWeaponArmorKind* kind =
                (SystemWeaponArmorKind*) model->item(i)->data()
                .value<quintptr>();
        kind->updateEquipment();
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefault(){
    setDefaultOptions();
    setDefaultCommonEquipment();
    setDefaultWeaponsKind();
    setDefaultArmorsKind();
    setDefaultBattleMaps();
    setDefaultElements();
    setDefaultCommonStatistics();
    setDefaultCommonBattleCommand();
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultOptions() {
    m_idStatisticLevel = 1;
    m_idStatisticExp = 2;

    // Formulas
    m_formulaIsDead->setMessageValue("u.hp === 0");
    m_formulaCrit->setMessageValue("damage * 2");

    // Musics
    m_music->setId(2);
    m_music->setIsStart(true);
    m_music->start()->setNumberDoubleValue(6.4);
    m_levelup->setId(4);
    m_victory->setId(2);
    m_victory->setIsStart(true);
    m_victory->start()->setNumberDoubleValue(6.4);
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultWeaponsKind() {
    SystemWeaponArmorKind* sysWeaponArmorKind;
    QStandardItem* item;
    QString names[] = {
        RPM::translate(Translations::SWORD),
        RPM::translate(Translations::AXE),
        RPM::translate(Translations::SPEAR),
        RPM::translate(Translations::TOME),
        RPM::translate(Translations::STAFF),
        RPM::translate(Translations::BOW),
        RPM::translate(Translations::FIREARM)
    };
    QList<bool> equipmentsAssigment =
            QList<bool>({true,true,false,false,false,false,false});
    int length = (sizeof(names)/sizeof(*names));

    for (int i = 0; i < length; i++){
        sysWeaponArmorKind = new SystemWeaponArmorKind(i + 1, names[i],
            equipmentsAssigment);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysWeaponArmorKind)));
        item->setText(sysWeaponArmorKind->toString());
        m_modelWeaponsKind->appendRow(item);
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultArmorsKind(){
    QString names[] = {
        RPM::translate(Translations::HELMET),
        RPM::translate(Translations::CAP),
        RPM::translate(Translations::MAIL),
        RPM::translate(Translations::VEST),
        RPM::translate(Translations::VAMBRACES),
        RPM::translate(Translations::GUARDS),
        RPM::translate(Translations::GREAVES),
        RPM::translate(Translations::LEGGINGS),
        RPM::translate(Translations::RING),
        RPM::translate(Translations::NECKLACE)
    };
    QList<bool> equipmentsAssigment[] = {
        QList<bool>({false,false,true,false,false,false,false}),
        QList<bool>({false,false,true,false,false,false,false}),
        QList<bool>({false,false,false,true,false,false,false}),
        QList<bool>({false,false,false,true,false,false,false}),
        QList<bool>({false,false,false,false,true,false,false}),
        QList<bool>({false,false,false,false,true,false,false}),
        QList<bool>({false,false,false,false,false,true,false}),
        QList<bool>({false,false,false,false,false,true,false}),
        QList<bool>({false,false,false,false,false,false,true}),
        QList<bool>({false,false,false,false,false,false,true})
    };
    int length = (sizeof(names)/sizeof(*names));
    for (int i = 0; i < length; i++)
    {
        m_modelArmorsKind->appendRow((new SystemWeaponArmorKind(i + 1, names[i],
            equipmentsAssigment[i]))->getModelRow());
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultBattleMaps(){
    SuperListItem::deleteModel(m_modelBattleMaps, false);
    SystemBattleMap* sysBattleMap = new SystemBattleMap(1, RPM::translate(
        Translations::DEFAULT), 2, Position3D(8, 0, 0, 7));
    m_modelBattleMaps->appendRow(sysBattleMap->getModelRow());
    QStandardItem *item = new QStandardItem;
    item->setText(SuperListItem::beginningText);
    m_modelBattleMaps->appendRow(item);
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultElements() {
    QString names[] = {
        RPM::translate(Translations::FIRE),
        RPM::translate(Translations::WATER),
        RPM::translate(Translations::PLANT)
    };
    int iconsX[] = { 9, 11, 10 };
    int iconsY[] = { 0, 0, 0 };
    QVector<double> efficiencies[] = {
        QVector<double>({ 1.0, 0.5, 2.0 }), // Fire
        QVector<double>({ 2.0, 1.0, 0.5 }), // Water
        QVector<double>({ 0.5, 2.0, 1.0 }) // Grass
    };
    SystemElement *sysElement;
    int length = (sizeof(names)/sizeof(*names));
    int i, j;
    // Create all the elements and add efficiencies
    for (i = 0; i < length; i++)
    {
        sysElement = new SystemElement(i + 1, names[i], 1, iconsX[i], iconsY[i]);
        for (j = 0; j < length; j++)
        {
            sysElement->addEfficiencyDouble(j + 1, efficiencies[i][j]);
        }
        m_modelElements->appendRow(sysElement->getModelRow());
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultCommonEquipment()
{
    int i = 1;
    SystemTranslatable *items[] = {
        new SystemTranslatable(i++, RPM::translate(Translations::LEFT_HAND)),
        new SystemTranslatable(i++, RPM::translate(Translations::RIGHT_HAND)),
        new SystemTranslatable(i++, RPM::translate(Translations::HEAD)),
        new SystemTranslatable(i++, RPM::translate(Translations::CHEST)),
        new SystemTranslatable(i++, RPM::translate(Translations::ARMS)),
        new SystemTranslatable(i++, RPM::translate(Translations::LEGS)),
        new SystemTranslatable(i++, RPM::translate(Translations::ACCESSORY))
    };
    int length = (sizeof(items)/sizeof(*items));
    for (i = 0; i < length; i++)
    {
        m_modelCommonEquipment->appendRow(items[i]->getModelRow());
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultCommonStatistics()
{
    int i = 1;
    SystemStatistic* items[] = {
        new SystemStatistic(i++, RPM::translate(Translations::LV), "lv", true),
        new SystemStatistic(i++, RPM::translate(Translations::EXP), "xp", false),
        new SystemStatistic(i++, RPM::translate(Translations::HP), "hp", false),
        new SystemStatistic(i++, RPM::translate(Translations::MP), "mp", false),
        new SystemStatistic(i++, RPM::translate(Translations::TP), "tp", false),
        new SystemStatistic(i++, RPM::translate(Translations::ATTACK), "atk", true),
        new SystemStatistic(i++, RPM::translate(Translations::MAGIC), "mag", true),
        new SystemStatistic(i++, RPM::translate(Translations::STRENGTH), "str", true),
        new SystemStatistic(i++, RPM::translate(Translations::INTELLIGENCE), "int", true),
        new SystemStatistic(i++, RPM::translate(Translations::P_DEFENSE), "pdef", true),
        new SystemStatistic(i++, RPM::translate(Translations::M_DEFENSE), "mdef", true),
        new SystemStatistic(i++, RPM::translate(Translations::AGILITY), "agi", true)
    };
    int length = (sizeof(items)/sizeof(*items));
    for (i = 0; i < length; i++)
    {
        m_modelCommonStatistics->appendRow(items[i]->getModelRow());
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultCommonBattleCommand()
{
    int i = 1;
    SystemBattleCommand* items[] = {
        new SystemBattleCommand(i++, RPM::translate(Translations::ATTACK), 1),
        new SystemBattleCommand(i++, RPM::translate(Translations::SKILL), 2),
        new SystemBattleCommand(i++, RPM::translate(Translations::ITEM), 3),
        new SystemBattleCommand(i++, RPM::translate(Translations::ESCAPE), 4),
        new SystemBattleCommand(i++, RPM::translate(Translations::END_TURN), 5),
    };

    int length = (sizeof(items)/sizeof(*items));
    for (i = 0; i < length; i++)
    {
        m_modelCommonBattleCommand->appendRow(items[i]->getModelRow());
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void BattleSystemDatas::read(const QJsonObject &json){
    QList<QStandardItem *> row;
    QStandardItem* item;
    QJsonObject obj;
    QJsonArray jsonList;
    SystemElement *sysElement;

    // Clear
    SuperListItem::deleteModel(m_modelBattleMaps, false);
    SuperListItem::deleteModel(m_modelCommonEquipment, false);
    SuperListItem::deleteModel(m_modelWeaponsKind, false);
    SuperListItem::deleteModel(m_modelArmorsKind, false);
    SuperListItem::deleteModel(m_modelElements, false);
    SuperListItem::deleteModel(m_modelCommonStatistics, false);
    SuperListItem::deleteModel(m_modelCommonBattleCommand, false);

    // Options
    m_idStatisticLevel = json["lv"].toInt();
    m_idStatisticExp = json["xp"].toInt();

    // Formulas
    if (json.contains(JSON_FORMULA_IS_DEAD)) {
        m_formulaIsDead->read(json[JSON_FORMULA_IS_DEAD].toObject());
    }
    if (json.contains(JSON_FORMULA_CRIT)) {
        m_formulaCrit->read(json[JSON_FORMULA_CRIT].toObject());
    }
    if (json.contains(JSON_HEROES_BATTLERS_CENTER_OFFSET))
    {
        m_heroesBattlersCenterOffset->read(json[JSON_HEROES_BATTLERS_CENTER_OFFSET].toObject());
    }
    if (json.contains(JSON_HEROES_BATTLERS_OFFSET))
    {
        m_heroesBattlersOffset->read(json[JSON_HEROES_BATTLERS_OFFSET].toObject());
    }
    if (json.contains(JSON_TROOPS_BATTLERS_CENTER_OFFSET))
    {
        m_troopsBattlersCenterOffset->read(json[JSON_TROOPS_BATTLERS_CENTER_OFFSET].toObject());
    }
    if (json.contains(JSON_TROOPS_BATTLERS_OFFSET))
    {
        m_troopsBattlersOffset->read(json[JSON_TROOPS_BATTLERS_OFFSET].toObject());
    }

    // Musics
    if (json.contains(JSON_BATLLE_MUSIC)) {
        m_music->read(json[JSON_BATLLE_MUSIC].toObject());
    }
    if (json.contains(JSON_BATLLE_LEVELUP)) {
        m_levelup->read(json[JSON_BATLLE_LEVELUP].toObject());
    }
    if (json.contains(JSON_BATLLE_VICTORY)) {
        m_victory->read(json[JSON_BATLLE_VICTORY].toObject());
    }

    // Battle maps
    SuperListItem::readTree(m_modelBattleMaps, new SystemBattleMap, json, jsonBattleMaps);

    // Equipments
    jsonList = json[jsonCommonEquipment].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemTranslatable* sysEquipment = new SystemTranslatable;
        sysEquipment->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysEquipment)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysEquipment->toString());
        m_modelCommonEquipment->appendRow(item);
    }

    // Weapons kind
    jsonList = json[jsonWeaponsKind].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemWeaponArmorKind* sysWeaponKind = new SystemWeaponArmorKind;
        sysWeaponKind->setIsWeapon(true);
        QJsonObject jsonKind = jsonList[i].toObject();
        sysWeaponKind->read(jsonKind);
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysWeaponKind)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysWeaponKind->toString());
        m_modelWeaponsKind->appendRow(item);
    }

    // Armors kind
    jsonList = json[jsonArmorsKind].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemWeaponArmorKind* sysArmorKind = new SystemWeaponArmorKind;
        sysArmorKind->setIsWeapon(false);
        QJsonObject jsonKind = jsonList[i].toObject();
        sysArmorKind->read(jsonKind);
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysArmorKind)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysArmorKind->toString());
        m_modelArmorsKind->appendRow(item);
    }

    // Elements
    jsonList = json[jsonElements].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        sysElement = new SystemElement;
        sysElement->read(jsonList[i].toObject());
        m_modelElements->appendRow(sysElement->getModelRow());
    }

    // Statistics
    jsonList = json[jsonCommonStatistics].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemStatistic* sysStatistic = new SystemStatistic;
        sysStatistic->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysStatistic)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysStatistic->toString());
        m_modelCommonStatistics->appendRow(item);
    }

    // Battle commands
    SuperListItem::readTree(m_modelCommonBattleCommand, new SystemBattleCommand,
        json, jsonCommonBattleCommand);
}

// -------------------------------------------------------

void BattleSystemDatas::write(QJsonObject &json) const{
    int l;
    QJsonArray jsonArray;
    QJsonObject obj;

    // Options
    json["lv"] = m_idStatisticLevel;
    json["xp"] = m_idStatisticExp;

    // Formulas
    obj = QJsonObject();
    m_formulaIsDead->write(obj);
    json[JSON_FORMULA_IS_DEAD] = obj;
    if (!m_formulaCrit->isDefaultMessageValue()) {
        obj = QJsonObject();
        m_formulaCrit->write(obj);
        json[JSON_FORMULA_CRIT] = obj;
    }
    if (m_heroesBattlersCenterOffset->kind() != PrimitiveValueKind::Message ||
        m_heroesBattlersCenterOffset->messageValue() != DEFAULT_HEROES_BATTLERS_CENTER_OFFSET)
    {
        obj = QJsonObject();
        m_heroesBattlersCenterOffset->write(obj);
        json[JSON_HEROES_BATTLERS_CENTER_OFFSET] = obj;
    }
    if (m_heroesBattlersOffset->kind() != PrimitiveValueKind::Message ||
        m_heroesBattlersOffset->messageValue() != DEFAULT_HEROES_BATTLERS_OFFSET)
    {
        obj = QJsonObject();
        m_heroesBattlersOffset->write(obj);
        json[JSON_HEROES_BATTLERS_OFFSET] = obj;
    }
    if (m_troopsBattlersCenterOffset->kind() != PrimitiveValueKind::Message ||
        m_troopsBattlersCenterOffset->messageValue() != DEFAULT_TROOPS_BATTLERS_CENTER_OFFSET)
    {
        obj = QJsonObject();
        m_troopsBattlersCenterOffset->write(obj);
        json[JSON_TROOPS_BATTLERS_CENTER_OFFSET] = obj;
    }
    if (m_troopsBattlersOffset->kind() != PrimitiveValueKind::Message ||
        m_troopsBattlersOffset->messageValue() != DEFAULT_TROOPS_BATTLERS_OFFSET)
    {
        obj = QJsonObject();
        m_troopsBattlersOffset->write(obj);
        json[JSON_TROOPS_BATTLERS_OFFSET] = obj;
    }

    // Musics
    obj = QJsonObject();
    m_music->write(obj);
    json[JSON_BATLLE_MUSIC] = obj;
    obj = QJsonObject();
    m_levelup->write(obj);
    json[JSON_BATLLE_LEVELUP] = obj;
    obj = QJsonObject();
    m_victory->write(obj);
    json[JSON_BATLLE_VICTORY] = obj;

    // Battle maps
    SuperListItem::writeTree(m_modelBattleMaps, json, jsonBattleMaps);

    // Equipments
    jsonArray = QJsonArray();
    l = m_modelCommonEquipment->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemTranslatable* sysEquipment = reinterpret_cast<SystemTranslatable*>(
            m_modelCommonEquipment->item(i)->data().value<quintptr>());
        sysEquipment->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[jsonCommonEquipment] = jsonArray;

    // Weapons kind
    jsonArray = QJsonArray();
    l = m_modelWeaponsKind->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemTranslatable* sysWeaponKind = reinterpret_cast<SystemTranslatable*>(
            m_modelWeaponsKind->item(i)->data().value<quintptr>());
        sysWeaponKind->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[jsonWeaponsKind] = jsonArray;

    // Armors kind
    jsonArray = QJsonArray();
    l = m_modelArmorsKind->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemTranslatable* sysArmorKind = reinterpret_cast<SystemTranslatable*>(
            m_modelArmorsKind->item(i)->data().value<quintptr>());
        sysArmorKind->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[jsonArmorsKind] = jsonArray;

    // Elements
    jsonArray = QJsonArray();
    l = m_modelElements->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemElement* sysElement = reinterpret_cast<SystemElement*>(
            m_modelElements->item(i)->data().value<quintptr>());
        sysElement->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[jsonElements] = jsonArray;

    // Statistics
    jsonArray = QJsonArray();
    l = m_modelCommonStatistics->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemStatistic* sysStatistics = reinterpret_cast<SystemStatistic*>(
            m_modelCommonStatistics->item(i)->data().value<quintptr>());
        sysStatistics->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[jsonCommonStatistics] = jsonArray;

    // Battle commands
    SuperListItem::writeTree(m_modelCommonBattleCommand, json,
        jsonCommonBattleCommand);
}
