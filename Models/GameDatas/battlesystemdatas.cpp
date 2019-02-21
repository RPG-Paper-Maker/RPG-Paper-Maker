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

#include "battlesystemdatas.h"
#include "systemlang.h"
#include "systemweaponarmorkind.h"
#include "systemelement.h"
#include "systemstatistic.h"
#include "systembattlecommand.h"
#include "systembattlemap.h"
#include "rpm.h"
#include "common.h"

const QString BattleSystemDatas::JSON_FORMULA_IS_DEAD = "fisdead";
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

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

BattleSystemDatas::BattleSystemDatas() :
    m_formulaIsDead(new PrimitiveValue(QString())),
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
    RPM::readJSON(Common::pathCombine(path, RPM::pathBattleSystem), *this);
}

int BattleSystemDatas::idStatisticLevel() const { return m_idStatisticLevel; }

int BattleSystemDatas::idStatisticExp() const { return m_idStatisticExp; }

void BattleSystemDatas::setIdStatisticLevel(int i) { m_idStatisticLevel = i; }

void BattleSystemDatas::setIdStatisticExp(int i) { m_idStatisticExp = i; }

PrimitiveValue * BattleSystemDatas::formulaIsDead() const {
    return m_formulaIsDead;
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
    QString names[] = {"Sword", "Axe", "Spear", "Tome", "Staff", "Bow",
                       "Firearm"};
    QList<bool> equipmentsAssigment =
            QList<bool>({true,true,false,false,false,false,false});
    int length = (sizeof(names)/sizeof(*names));

    for (int i = 0; i < length; i++){
        sysWeaponArmorKind =
                new SystemWeaponArmorKind(i + 1,
                                          new LangsTranslation(names[i]),
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
    SystemWeaponArmorKind* sysWeaponArmorKind;
    QStandardItem* item;
    QString names[] = {"Helmet", "Cap", "Mail", "Vest", "Vambraces",
                       "Guards", "Greaves", "Leggings", "Ring", "Necklace"};
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

    for (int i = 0; i < length; i++){
        sysWeaponArmorKind =
                new SystemWeaponArmorKind(i+1,
                                          new LangsTranslation(names[i]),
                                          equipmentsAssigment[i]);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysWeaponArmorKind)));
        item->setText(sysWeaponArmorKind->toString());
        m_modelArmorsKind->appendRow(item);
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultBattleMaps(){
    SuperListItem::deleteModel(m_modelBattleMaps, false);
    SystemBattleMap* sysBattleMap = new SystemBattleMap(1, "Default", 2,
        Position3D(8, 0, 0, 7));
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sysBattleMap)));
    item->setText(sysBattleMap->toString());
    m_modelBattleMaps->appendRow(item);
    item = new QStandardItem;
    item->setText(SuperListItem::beginningText);
    m_modelBattleMaps->appendRow(item);
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultElements(){
    SystemElement* sysElement;
    QStandardItem* itemElement;
    QStandardItem* itemEfficiency;
    QStandardItem* item;
    SuperListItem* element;
    QList<QStandardItem*> row;
    QStandardItemModel* efficiency;
    QString names[] = {"Fire", "Water", "Grass"};
    QVector<int> efficiencies[] = {QVector<int>({100, 50, 200}), // Fire
                                   QVector<int>({200, 100, 50}), // Water
                                   QVector<int>({50, 200, 100})}; // Grass
    int length = (sizeof(names)/sizeof(*names));

    // First create all the elements
    for (int i = 0; i < length; i++){
        item = new QStandardItem();
        sysElement = new SystemElement(i+1, new LangsTranslation(names[i]));
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysElement)));
        item->setText(sysElement->toString());
        m_modelElements->appendRow(item);
    }

    // Fill the efficiencies
    for (int i = 0; i < length; i++){
        sysElement =
                (SystemElement*) SuperListItem::getById(m_modelElements
                                                        ->invisibleRootItem(),
                                                        i+1);
        efficiency = sysElement->efficiency();
        for (int j = 0; j < efficiencies[i].size(); j++){
            row = QList<QStandardItem*>();
            element = SuperListItem::getById(m_modelElements
                                             ->invisibleRootItem(), j+1);
            itemElement = new QStandardItem;
            itemElement->setData(QVariant::fromValue(
                                     reinterpret_cast<quintptr>(element)));
            itemElement->setText(element->toString());
            itemEfficiency = new QStandardItem;
            itemEfficiency->setData(QVariant::fromValue(efficiencies[i][j]));
            itemEfficiency->setText(QString::number(efficiencies[i][j]) + "%");
            row.append(itemElement);
            row.append(itemEfficiency);
            efficiency->appendRow(row);
        }
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultCommonEquipment(){
    int i = 1;
    SystemLang* items[] = {
        new SystemLang(i++, new LangsTranslation("Left hand")),
        new SystemLang(i++, new LangsTranslation("Right hand")),
        new SystemLang(i++, new LangsTranslation("Head")),
        new SystemLang(i++, new LangsTranslation("Chest")),
        new SystemLang(i++, new LangsTranslation("Arms")),
        new SystemLang(i++, new LangsTranslation("Legs")),
        new SystemLang(i++, new LangsTranslation("Accessory"))
    };
    int length = (sizeof(items)/sizeof(*items));
    QStandardItem* item;

    for (i = 0; i < length; i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(items[i])));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(items[i]->toString());
        m_modelCommonEquipment->appendRow(item);
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultCommonStatistics(){
    int i = 1;
    SystemStatistic* items[] = {
        new SystemStatistic(i++, new LangsTranslation("Lv."), "lv", true),
        new SystemStatistic(i++, new LangsTranslation("Exp."), "xp", false),
        new SystemStatistic(i++, new LangsTranslation("HP"), "hp", false),
        new SystemStatistic(i++, new LangsTranslation("MP"), "mp", false),
        new SystemStatistic(i++, new LangsTranslation("TP"), "tp", false),
        new SystemStatistic(i++, new LangsTranslation("Attack"), "atk", true),
        new SystemStatistic(i++, new LangsTranslation("Magic"), "mag", true),
        new SystemStatistic(i++, new LangsTranslation("Strength"), "str", true),
        new SystemStatistic(i++, new LangsTranslation("Intelligence"), "int",
        true),
        new SystemStatistic(i++, new LangsTranslation("P. Defense"), "pdef",
        true),
        new SystemStatistic(i++, new LangsTranslation("M. defense"), "mdef",
        true),
        new SystemStatistic(i++, new LangsTranslation("Agility"), "agi", true)
    };

    int length = (sizeof(items)/sizeof(*items));
    QStandardItem* item;

    for (i = 0; i < length; i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(items[i])));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(items[i]->toString());
        m_modelCommonStatistics->appendRow(item);
    }
}

// -------------------------------------------------------

void BattleSystemDatas::setDefaultCommonBattleCommand(){
    int i = 1;
    SystemBattleCommand* items[] = {
        new SystemBattleCommand(i++, new LangsTranslation("Attack"), 1),
        new SystemBattleCommand(i++, new LangsTranslation("Skill"), 2),
        new SystemBattleCommand(i++, new LangsTranslation("Item"), 3),
        new SystemBattleCommand(i++, new LangsTranslation("Escape"), 4)
    };

    int length = (sizeof(items)/sizeof(*items));
    QStandardItem* item;

    for (i = 0; i < length; i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(items[i])));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(items[i]->toString());
        m_modelCommonBattleCommand->appendRow(item);
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

    // Clear
    SuperListItem::deleteModel(m_modelCommonEquipment, false);
    SuperListItem::deleteModel(m_modelWeaponsKind, false);
    SuperListItem::deleteModel(m_modelArmorsKind, false);
    SuperListItem::deleteModel(m_modelBattleMaps, false);
    SuperListItem::deleteModel(m_modelElements, false);
    SuperListItem::deleteModel(m_modelCommonStatistics, false);
    SuperListItem::deleteModel(m_modelCommonBattleCommand, false);

    // Options
    m_idStatisticLevel = json["lv"].toInt();
    m_idStatisticExp = json["xp"].toInt();

    // Formulas
    obj = json[JSON_FORMULA_IS_DEAD].toObject();
    m_formulaIsDead->read(obj);

    // Musics
    m_music->read(json[JSON_BATLLE_MUSIC].toObject());
    m_levelup->read(json[JSON_BATLLE_LEVELUP].toObject());
    m_victory->read(json[JSON_BATLLE_VICTORY].toObject());

    // Battle maps
    jsonList = json[jsonBattleMaps].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemBattleMap* sysBattleMap = new SystemBattleMap;
        sysBattleMap->read(jsonList.at(i).toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(
            sysBattleMap)));
        item->setText(sysBattleMap->toString());
        m_modelBattleMaps->appendRow(item);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_modelBattleMaps->appendRow(item);

    // Equipments
    jsonList = json[jsonCommonEquipment].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemLang* sysEquipment = new SystemLang;
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
        item = new QStandardItem;
        SystemElement* sysElement = new SystemElement;
        sysElement->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysElement)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysElement->toString());
        m_modelElements->appendRow(item);
    }
    for (int i = 0; i < jsonList.size(); i++){
        SystemElement* sysElement = reinterpret_cast<SystemElement*>(
            m_modelElements->item(i)->data().value<quintptr>());
        sysElement->readEfficiency(m_modelElements, jsonList[i].toObject());
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
    jsonList = json[jsonCommonBattleCommand].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        SystemBattleCommand* sysBattleCommand = new SystemBattleCommand;
        sysBattleCommand->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysBattleCommand)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysBattleCommand->toString());
        m_modelCommonBattleCommand->appendRow(item);
    }
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
    jsonArray = QJsonArray();
    l = m_modelBattleMaps->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        QJsonObject jsonCommon;
        SystemBattleMap* sysBattleMap = reinterpret_cast<SystemBattleMap*>(
            m_modelBattleMaps->item(i)->data().value<quintptr>());
        sysBattleMap->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[jsonBattleMaps] = jsonArray;

    // Equipments
    jsonArray = QJsonArray();
    l = m_modelCommonEquipment->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemLang* sysEquipment = reinterpret_cast<SystemLang*>(
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
        SystemLang* sysWeaponKind = reinterpret_cast<SystemLang*>(
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
        SystemLang* sysArmorKind = reinterpret_cast<SystemLang*>(
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
    l = m_modelCommonBattleCommand->invisibleRootItem()->rowCount();
    jsonArray = QJsonArray();
    for (int i = 0; i < l; i++){
        QJsonObject jsonCommon;
        SystemBattleCommand* sysBattleCommand = reinterpret_cast
            <SystemBattleCommand*>(m_modelCommonBattleCommand->item(i)->data()
            .value<quintptr>());
        sysBattleCommand->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json[jsonCommonBattleCommand] = jsonArray;
}
