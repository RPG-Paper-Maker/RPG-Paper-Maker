/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcommonskillitem.h"
#include "rpm.h"
#include "systemeffect.h"
#include "systemcost.h"
#include "systemcharacteristic.h"

const QString SystemCommonSkillItem::JSON_TYPE = "t";
const QString SystemCommonSkillItem::JSON_CONSUMABLE = "con";
const QString SystemCommonSkillItem::JSON_ONE_HAND = "oh";
const QString SystemCommonSkillItem::JSON_DESCRIPTION = "d";
const QString SystemCommonSkillItem::JSON_TARGET_KIND = "tk";
const QString SystemCommonSkillItem::JSON_TARGET_CONDITION_FORMULA = "tcf";
const QString SystemCommonSkillItem::JSON_CONDITION_FORMULA = "cf";
const QString SystemCommonSkillItem::JSON_AVAILABLE_KIND = "ak";
const QString SystemCommonSkillItem::JSON_SOUND = "s";
const QString SystemCommonSkillItem::JSON_ANIMATION_USER_ID = "auid";
const QString SystemCommonSkillItem::JSON_ANIMATION_TARGET_ID = "atid";
const QString SystemCommonSkillItem::JSON_CAN_BE_SOLD = "canBeSold";
const QString SystemCommonSkillItem::JSON_BATTLE_MESSAGE = "battleMessage";
const QString SystemCommonSkillItem::JSON_PRICE = "p";
const QString SystemCommonSkillItem::JSON_COSTS = "cos";
const QString SystemCommonSkillItem::JSON_EFFECTS = "e";
const QString SystemCommonSkillItem::JSON_CHARACTERISTICS = "car";
const int SystemCommonSkillItem::DEFAULT_ID = 1;
const QString SystemCommonSkillItem::DEFAULT_NAME = "";
const int SystemCommonSkillItem::DEFAULT_PICTURE_ID = -1;
const int SystemCommonSkillItem::DEFAULT_TYPE = 1;
const bool SystemCommonSkillItem::DEFAULT_CONSUMABLE = false;
const bool SystemCommonSkillItem::DEFAULT_ONE_HAND = true;
const TargetKind SystemCommonSkillItem::DEFAULT_TARGET_KIND = TargetKind::None;
const AvailableKind SystemCommonSkillItem::DEFAULT_AVAILABLE_KIND = AvailableKind::Never;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCommonSkillItem::SystemCommonSkillItem(int i, QString name, int
    pictureID, int pictureIndexX, int pictureIndexY, int type, bool consumable,
    bool oneHand, SystemTranslatable *description, TargetKind targetKind,
    PrimitiveValue *targetConditionFormula, PrimitiveValue *conditionFormula,
    AvailableKind availableKind, SystemPlaySong *sound, PrimitiveValue
    *animationUserID, PrimitiveValue *animationTargetID, PrimitiveValue *canBeSold,
    SystemTranslatable *battleMessage, QStandardItemModel *modelPrice,
    QStandardItemModel *modelCosts, QStandardItemModel*modelEffects, QStandardItemModel
    *modelCharacteristics) :
    SystemIcon(i, name, pictureID, pictureIndexX, pictureIndexY),
    m_type(type),
    m_consumable(consumable),
    m_oneHand(oneHand),
    m_description(description),
    m_targetKind(targetKind),
    m_targetConditionFormula(targetConditionFormula),
    m_conditionFormula(conditionFormula),
    m_availableKind(availableKind),
    m_sound(sound),
    m_animationUserID(animationUserID),
    m_animationTargetID(animationTargetID),
    m_canBeSold(canBeSold),
    m_battleMessage(battleMessage),
    m_modelPrice(modelPrice),
    m_modelCosts(modelCosts),
    m_modelEffects(modelEffects),
    m_modelCharacteristics(modelCharacteristics)
{
    m_animationUserID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->animationsDatas()->model());
    m_animationTargetID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->animationsDatas()->model());
    this->initializeHeaders();
}

SystemCommonSkillItem::~SystemCommonSkillItem() {
    delete m_description;
    delete m_targetConditionFormula;
    delete m_conditionFormula;
    delete m_sound;
    delete m_animationUserID;
    delete m_animationTargetID;
    delete m_canBeSold;
    delete m_battleMessage;
    SuperListItem::deleteModel(m_modelPrice);
    SuperListItem::deleteModel(m_modelCosts);
    SuperListItem::deleteModel(m_modelEffects);
    SuperListItem::deleteModel(m_modelCharacteristics);
}

int SystemCommonSkillItem::type() const {
    return m_type;
}

void SystemCommonSkillItem::setType(int t) {
    m_type = t;
}

bool SystemCommonSkillItem::consumable() const {
    return m_consumable;
}

void SystemCommonSkillItem::setConsumable(bool b) {
    m_consumable = b;
}

bool SystemCommonSkillItem::oneHand() const {
    return m_oneHand;
}

void SystemCommonSkillItem::setOneHand(bool b) {
    m_oneHand = b;
}

SystemTranslatable *SystemCommonSkillItem::description() const {
    return m_description;
}

void SystemCommonSkillItem::setDescription(QString description)
{
    m_description->setAllNames(description);
}

TargetKind SystemCommonSkillItem::targetKind() const {
    return m_targetKind;
}

void SystemCommonSkillItem::setTargetKind(TargetKind k) {
    m_targetKind = k;
}

PrimitiveValue * SystemCommonSkillItem::targetConditionFormula() const {
    return m_targetConditionFormula;
}

PrimitiveValue * SystemCommonSkillItem::conditionFormula() const {
    return m_conditionFormula;
}

AvailableKind SystemCommonSkillItem::availableKind() const {
    return m_availableKind;
}

void SystemCommonSkillItem::setAvailableKind(AvailableKind k) {
    m_availableKind = k;
}

SystemPlaySong * SystemCommonSkillItem::sound() const {
    return m_sound;
}

PrimitiveValue * SystemCommonSkillItem::animationUserID() const {
    return m_animationUserID;
}

PrimitiveValue * SystemCommonSkillItem::animationTargetID() const {
    return m_animationTargetID;
}

PrimitiveValue * SystemCommonSkillItem::canBeSold() const
{
    return m_canBeSold;
}

SystemTranslatable * SystemCommonSkillItem::battleMessage() const
{
    return m_battleMessage;
}

QStandardItemModel * SystemCommonSkillItem::modelPrice() const {
    return m_modelPrice;
}

QStandardItemModel * SystemCommonSkillItem::modelCosts() const {
    return m_modelCosts;
}

QStandardItemModel * SystemCommonSkillItem::modelEffects() const {
    return m_modelEffects;
}

QStandardItemModel * SystemCommonSkillItem::modelCharacteristics() const {
    return m_modelCharacteristics;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemCommonSkillItem::setNameDescription(QStandardItemModel *model, int index, QString name, QString description) {
    QStandardItem *item = model->item(index);
    SystemCommonSkillItem *skillItem = reinterpret_cast<SystemCommonSkillItem*>(
        item->data().value<quintptr>());
    skillItem->setName(name);
    skillItem->setDescription(description);
    item->setText(skillItem->toString());
}

void SystemCommonSkillItem::initializeHeaders() {
    m_modelPrice->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::PRICE)}));
    m_modelCosts->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::COST)}));
    m_modelEffects->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::EFFECT)}));
    m_modelCharacteristics->setHorizontalHeaderLabels(QStringList({RPM
        ::translate(Translations::CHARACTERISTIC)}));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemCommonSkillItem::createCopy() const {
    SystemCommonSkillItem* super = new SystemCommonSkillItem;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCommonSkillItem::setCopy(const SuperListItem &super) {
    const SystemCommonSkillItem *skillitem;

    SystemIcon::setCopy(super);

    skillitem = reinterpret_cast<const SystemCommonSkillItem *>(&super);

    m_type = skillitem->m_type;
    m_consumable = skillitem->m_consumable;
    m_oneHand = skillitem->m_oneHand;
    m_description->setCopy(*skillitem->m_description);
    m_targetKind = skillitem->m_targetKind;
    m_targetConditionFormula->setCopy(*skillitem->m_targetConditionFormula);
    m_conditionFormula->setCopy(*skillitem->m_conditionFormula);
    m_availableKind = skillitem->m_availableKind;
    m_sound->setCopy(*skillitem->m_sound);
    m_animationUserID->setCopy(*skillitem->m_animationUserID);
    m_animationTargetID->setCopy(*skillitem->m_animationTargetID);
    m_canBeSold->setCopy(*skillitem->m_canBeSold);
    m_battleMessage->setCopy(*skillitem->m_battleMessage);
    SuperListItem::deleteModel(m_modelPrice, false);
    SuperListItem::copy(m_modelPrice, skillitem->m_modelPrice);
    SuperListItem::deleteModel(m_modelCosts, false);
    SuperListItem::copy(m_modelCosts, skillitem->m_modelCosts);
    SuperListItem::deleteModel(m_modelEffects, false);
    SuperListItem::copy(m_modelEffects, skillitem->m_modelEffects);
    SuperListItem::deleteModel(m_modelCharacteristics, false);
    SuperListItem::copy(m_modelCharacteristics, skillitem->m_modelCharacteristics);
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemCommonSkillItem::read(const QJsonObject &json)
{
    SystemIcon::read(json);
    QJsonArray tab;
    QList<QStandardItem *> row;

    if (json.contains(JSON_TYPE)) {
        m_type = json[JSON_TYPE].toInt();
    }
    if (json.contains(JSON_CONSUMABLE)) {
        m_consumable = json[JSON_CONSUMABLE].toBool();
    }
    if (json.contains(JSON_ONE_HAND)) {
        m_oneHand = json[JSON_ONE_HAND].toBool();
    }
    m_description->read(json[JSON_DESCRIPTION].toObject());
    if (json.contains(JSON_TARGET_KIND)) {
        m_targetKind = static_cast<TargetKind>(json[JSON_TARGET_KIND].toInt());
    }
    if (json.contains(JSON_TARGET_CONDITION_FORMULA)) {
        m_targetConditionFormula->read(json[JSON_TARGET_CONDITION_FORMULA]
            .toObject());
    }
    if (json.contains(JSON_CONDITION_FORMULA)) {
        m_conditionFormula->read(json[JSON_CONDITION_FORMULA].toObject());
    }
    if (json.contains(JSON_AVAILABLE_KIND)) {
        m_availableKind = static_cast<AvailableKind>(json[JSON_AVAILABLE_KIND]
            .toInt());
    }
    if (json.contains(JSON_SOUND)) {
        m_sound->read(json[JSON_SOUND].toObject());
    } else {
        m_sound->updateName();
    }
    if (json.contains(JSON_ANIMATION_USER_ID)) {
        m_animationUserID->read(json[JSON_ANIMATION_USER_ID].toObject());
    }
    if (json.contains(JSON_ANIMATION_TARGET_ID)) {
        m_animationTargetID->read(json[JSON_ANIMATION_TARGET_ID].toObject());
    }
    if (json.contains(JSON_CAN_BE_SOLD)) {
        m_canBeSold->read(json[JSON_CAN_BE_SOLD].toObject());
    }
    m_battleMessage->read(json[JSON_BATTLE_MESSAGE].toObject());

    // Price
    SuperListItem::readTree(m_modelPrice, new SystemCost(DamagesKind::Currency,
        new PrimitiveValue(PrimitiveValueKind::DataBase, 1), new PrimitiveValue(
        PrimitiveValueKind::DataBase, 1), 1, new PrimitiveValue(QString("1"))),
        json, JSON_PRICE);

    // Costs
    SuperListItem::readTree(m_modelCosts, new SystemCost, json, JSON_COSTS);

    // Effects
    SuperListItem::readTree(m_modelEffects, new SystemEffect, json, JSON_EFFECTS);

    // Characteristics
    SuperListItem::readTree(m_modelCharacteristics, new SystemCharacteristic,
        json, JSON_CHARACTERISTICS);
}

// -------------------------------------------------------

void SystemCommonSkillItem::write(QJsonObject &json) const{
    SystemIcon::write(json);
    QJsonObject obj;
    QJsonArray tab;

    if (m_type != 1) {
        json[JSON_TYPE] = m_type;
    }
    if (m_consumable) {
        json[JSON_CONSUMABLE] = m_consumable;
    }
    if (!m_oneHand) {
        json[JSON_ONE_HAND] = m_oneHand;
    }
    obj = QJsonObject();
    m_description->write(obj);
    json[JSON_DESCRIPTION] = obj;
    if (m_targetKind != TargetKind::None) {
        json[JSON_TARGET_KIND] = static_cast<int>(m_targetKind);
    }
    if (m_targetConditionFormula->kind() != PrimitiveValueKind::None) {
        obj = QJsonObject();
        m_targetConditionFormula->write(obj);
        json[JSON_TARGET_CONDITION_FORMULA] = obj;
    }
    if (m_conditionFormula->kind() != PrimitiveValueKind::None) {
        obj = QJsonObject();
        m_conditionFormula->write(obj);
        json[JSON_CONDITION_FORMULA] = obj;
    }
    if (m_availableKind != AvailableKind::Never) {
        json[JSON_AVAILABLE_KIND] = static_cast<int>(m_availableKind);
    }
    if (!m_sound->isNone()) {
        obj = QJsonObject();
        m_sound->write(obj);
        json[JSON_SOUND] = obj;
    }
    if (m_animationUserID->kind() != PrimitiveValueKind::None) {
        obj = QJsonObject();
        m_animationUserID->write(obj);
        json[JSON_ANIMATION_USER_ID] = obj;
    }
    if (m_animationTargetID->kind() != PrimitiveValueKind::None) {
        obj = QJsonObject();
        m_animationTargetID->write(obj);
        json[JSON_ANIMATION_TARGET_ID] = obj;
    }
    if (!m_canBeSold->isDefaultSwitchValue())
    {
        obj = QJsonObject();
        m_canBeSold->write(obj);
        json[JSON_CAN_BE_SOLD] = obj;
    }
    obj = QJsonObject();
    m_battleMessage->write(obj);
    json[JSON_BATTLE_MESSAGE] = obj;

    // Price
    SuperListItem::writeTree(m_modelPrice, json, JSON_PRICE);

    // Costs
    SuperListItem::writeTree(m_modelCosts, json, JSON_COSTS);

    // Effects
    SuperListItem::writeTree(m_modelEffects, json, JSON_EFFECTS);

    // Characteristics
    SuperListItem::writeTree(m_modelCharacteristics, json, JSON_CHARACTERISTICS);
}
