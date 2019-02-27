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

#include "systemcommonskillitem.h"
#include "rpm.h"
#include "systemeffect.h"
#include "systemcost.h"

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
const QString SystemCommonSkillItem::JSON_PRICE = "p";
const QString SystemCommonSkillItem::JSON_COSTS = "cos";
const QString SystemCommonSkillItem::JSON_EFFECTS = "e";
const QString SystemCommonSkillItem::JSON_CARACTERISTICS = "car";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCommonSkillItem::SystemCommonSkillItem() :
    SystemCommonSkillItem(1, new LangsTranslation, -1, 1, false, true, new
    LangsTranslation, TargetKind::None, new PrimitiveValue(PrimitiveValueKind
    ::None), new PrimitiveValue(PrimitiveValueKind::None), AvailableKind::Never,
    new SystemPlaySong(-1, SongKind::Sound), new PrimitiveValue(
    PrimitiveValueKind::None), new PrimitiveValue(PrimitiveValueKind::None), new
    PrimitiveValue(0), new QStandardItemModel, new QStandardItemModel, new
    QStandardItemModel)
{
    m_modelCosts->appendRow(new QStandardItem(SuperListItem::beginningText));
    m_modelEffects->appendRow(new QStandardItem(SuperListItem::beginningText));
    m_modelCaracteristics->appendRow(new QStandardItem(SuperListItem::beginningText));
}

SystemCommonSkillItem::SystemCommonSkillItem(int i, LangsTranslation *names, int
    pictureID, int type, bool consumable, bool oneHand, LangsTranslation
    *description, TargetKind targetKind, PrimitiveValue *targetConditionFormula,
    PrimitiveValue *conditionFormula, AvailableKind availableKind,
    SystemPlaySong *sound, PrimitiveValue *animationUserID, PrimitiveValue
    *animationTargetID, PrimitiveValue *price, QStandardItemModel *modelCosts,
    QStandardItemModel*modelEffects, QStandardItemModel *modelCaracteristics) :
    SystemIcon(i, names, pictureID),
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
    m_price(price),
    m_modelCosts(modelCosts),
    m_modelEffects(modelEffects),
    m_modelCaracteristics(modelCaracteristics)
{
    m_modelCosts->setHorizontalHeaderLabels(QStringList({"Cost"}));
    m_modelEffects->setHorizontalHeaderLabels(QStringList({"Effect"}));
    m_modelCaracteristics->setHorizontalHeaderLabels(QStringList({"Caracteristic"}));
}

SystemCommonSkillItem::~SystemCommonSkillItem() {
    delete m_description;
    delete m_targetConditionFormula;
    delete m_conditionFormula;
    delete m_sound;
    delete m_animationUserID;
    delete m_animationTargetID;
    delete m_price;
    SuperListItem::deleteModel(m_modelCosts);
    SuperListItem::deleteModel(m_modelEffects);
    SuperListItem::deleteModel(m_modelCaracteristics);
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

LangsTranslation * SystemCommonSkillItem::description() const {
    return m_description;
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

PrimitiveValue * SystemCommonSkillItem::price() const {
    return m_price;
}

QStandardItemModel * SystemCommonSkillItem::modelCosts() const {
    return m_modelCosts;
}

QStandardItemModel * SystemCommonSkillItem::modelEffects() const {
    return m_modelEffects;
}

QStandardItemModel * SystemCommonSkillItem::modelCaracteristics() const {
    return m_modelCaracteristics;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemCommonSkillItem::read(const QJsonObject &json){
    SystemIcon::read(json);
    QJsonArray tab;
    QList<QStandardItem *> row;
    SystemEffect *effect;
    SystemCost *cost;
    int i, l;

    if (json.contains(JSON_TYPE)) {
        m_type = json[JSON_TYPE].toInt();
    }
    if (json.contains(JSON_CONSUMABLE)) {
        m_consumable = json[JSON_CONSUMABLE].toBool();
    }
    if (json.contains(JSON_ONE_HAND)) {
        m_oneHand = json[JSON_ONE_HAND].toBool();
    }
    if (json.contains(JSON_DESCRIPTION)) {
        m_description->read(json[JSON_DESCRIPTION].toObject());
    }
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
    }
    if (json.contains(JSON_ANIMATION_USER_ID)) {
        m_animationUserID->read(json[JSON_ANIMATION_USER_ID].toObject());
    }
    m_animationUserID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->animationsDatas()->model());
    if (json.contains(JSON_ANIMATION_TARGET_ID)) {
        m_animationTargetID->read(json[JSON_ANIMATION_TARGET_ID].toObject());
    }
    m_animationTargetID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->animationsDatas()->model());
    if (json.contains(JSON_PRICE)) {
        m_price->read(json[JSON_PRICE].toObject());
    }

    // Costs
    tab = json[JSON_COSTS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        cost = new SystemCost;
        cost->read(tab[i].toObject());
        row = cost->getModelRow();
        m_modelCosts->insertRow(i, row);
    }

    // Effects
    tab = json[JSON_EFFECTS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        effect = new SystemEffect;
        effect->read(tab[i].toObject());
        row = effect->getModelRow();
        m_modelEffects->insertRow(i, row);
    }

    // Caracteristics
    tab = json[JSON_CARACTERISTICS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        // TODO
    }
}

// -------------------------------------------------------

void SystemCommonSkillItem::write(QJsonObject &json) const{
    SystemIcon::write(json);
    QJsonObject obj;
    QJsonArray tab;
    SystemEffect *effect;
    SystemCost *cost;
    int i, l;

    if (m_type != 1) {
        json[JSON_TYPE] = m_type;
    }
    if (m_consumable) {
        json[JSON_CONSUMABLE] = m_consumable;
    }
    if (!m_oneHand) {
        json[JSON_ONE_HAND] = m_oneHand;
    }
    if (!m_description->isEmpty()) {
        obj = QJsonObject();
        m_description->write(obj);
        json[JSON_DESCRIPTION] = obj;
    }
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
    if (m_price->kind() != PrimitiveValueKind::Number || m_price->numberValue()
        != 0)
    {
        obj = QJsonObject();
        m_price->write(obj);
        json[JSON_PRICE] = obj;
    }

    // Costs
    tab = QJsonArray();
    for (i = 0, l = m_modelCosts->invisibleRootItem()->rowCount(); i < l - 1;
         i++)
    {
        obj = QJsonObject();
        cost = reinterpret_cast<SystemCost *>(m_modelCosts->item(i)->data()
            .value<quintptr>());
        cost->write(obj);
        tab.append(obj);
    }
    if (!tab.isEmpty()) {
        json[JSON_COSTS] = tab;
    }

    // Effects
    tab = QJsonArray();
    for (i = 0, l = m_modelEffects->invisibleRootItem()->rowCount(); i < l - 1;
         i++)
    {
        obj = QJsonObject();
        effect = reinterpret_cast<SystemEffect *>(m_modelEffects->item(i)
            ->data().value<quintptr>());
        effect->write(obj);
        tab.append(obj);
    }
    if (!tab.isEmpty()) {
        json[JSON_EFFECTS] = tab;
    }

    // Caracteristics
    tab = QJsonArray();
    for (i = 0, l = m_modelCaracteristics->invisibleRootItem()->rowCount(); i <
         l - 1; i++)
    {
        obj = QJsonObject();
        // TODO
        tab.append(obj);
    }
    if (!tab.isEmpty()) {
        json[JSON_CARACTERISTICS] = tab;
    }
}
